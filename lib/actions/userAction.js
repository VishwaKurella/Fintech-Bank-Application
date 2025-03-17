"use server";
import { createAdminClient, createSessionClient } from "../appwrite";
import { ID, Query } from "node-appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { plaidClient } from "../plaid";
import {
  addFundingSource,
  createDwollaCustomer,
  deleteDwollaCustomer,
} from "../dowlla";
import { encryptId, extractCustomerIdFromUrl } from "@/components/utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export async function trySignUp({ password, ...userInfo }) {
  const { email, firstName, lastName } = userInfo;
  let newUserAccount, dwollaCustomerId, databaseDocumentId;
  try {
    const { account, database } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    const dwollaCustomerUrl = await createDwollaCustomer({
      ...userInfo,
      type: "personal",
    });

    if (!dwollaCustomerUrl) throw new Error("Error creating Dwolla customer");
    const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
    const newUser = await database.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      ID.unique(),
      {
        ...userInfo,
        userId: newUserAccount.$id,
        dwollaCustomerId,
        dwollaCustomerUrl,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "appwrite-session",
      value: session.secret,
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });
    return JSON.parse(JSON.stringify({ ...newUser, success: true }));
  } catch (error) {
    try {
      const { account, database } = await createAdminClient();
      if (databaseDocumentId) {
        await database.deleteDocument(
          DATABASE_ID,
          USER_COLLECTION_ID,
          databaseDocumentId
        );
      }
      if (dwollaCustomerId) {
        await deleteDwollaCustomer(dwollaCustomerId);
      }
      if (newUserAccount) {
        await account.deleteIdentity(newUserAccount.$id);
      }
    } catch (cleanupError) {
      console.error(
        "Error cleaning up after failed sign-up:",
        cleanupError.message
      );
    }

    return {
      success: false,
      message:
        error.message ||
        "Unable to create an account at this moment. Please try again.",
    };
  }
}

export async function trySignIn({ userInfo }) {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(
      userInfo.email,
      userInfo.password
    );
    const cookieStore = await cookies();
    cookieStore.set({
      name: "appwrite-session",
      value: session.secret,
      path: "/",
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    });

    const user = await getUserInfo({ userId: session.userId });
    return JSON.parse(JSON.stringify({ ...user, success: true }));
  } catch (error) {
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred during login",
      })
    );
  }
}

export const getUserInfo = async ({ userId }) => {
  try {
    const { database } = await createAdminClient();

    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const USER_COLLECTION_ID = process.env.APPWRITE_USER_COLLECTION_ID;

    if (!DATABASE_ID || !USER_COLLECTION_ID) {
      throw new Error("Missing database or collection ID");
    }

    const user = await database.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
      Query.equal("userId", [userId]),
    ]);

    return JSON.parse(JSON.stringify(user.documents[0]));
  } catch (error) {
    console.log(error);
  }
};

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    const user = await getUserInfo({ userId: result.$id });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();
    const cookiesStore = await cookies();
    await account.deleteSession("current");
    cookiesStore.set("appwrite-session", "", { expires: new Date(0) });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const createLinkToken = async (userInfo) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: userInfo.$id,
      },
      client_name: `${userInfo.firstName} ${userInfo.lastName}`,
      products: process.env.PLAID_PRODUCTS.split(","),
      language: "en",
      country_codes: ["US"],
    };

    const response = await plaidClient.linkTokenCreate(tokenParams);
    return { linkToken: response.data.link_token };
  } catch (error) {
    console.error("Error creating link token:", error.response?.data || error);
    throw new Error("Failed to create link token");
  }
};

export const exchangePublicToken = async ({ publicToken, user }) => {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];

    const request = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla",
    };

    const processorTokenResponse = await plaidClient.processorTokenCreate(
      request
    );
    const processorToken = processorTokenResponse.data.processor_token;

    const fundingSourceUrl = await addFundingSource({
      dwollaCustomerId: user.dwollaCustomerId,
      processorToken,
      bankName: accountData.name,
    });

    if (!fundingSourceUrl) throw new Error("Funding source creation failed");

    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl,
      shareableId: encryptId(accountData.account_id),
    });

    revalidatePath("/");
    return { publicTokenExchange: "complete" };
  } catch (error) {
    console.error("An error occurred while exchanging token:", error);
  }
};

export async function createBankAccount({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}) {
  try {
    const { database } = await createAdminClient();
    const bankAccount = await database.createDocument(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    );
    return JSON.parse(JSON.stringify(bankAccount));
  } catch (error) {
    console.log(error);
  }
}

export const getBanks = async ({ userId }) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID,
      BANK_COLLECTION_ID,
      [Query.equal("userId", [userId])]
    );

    return JSON.parse(JSON.stringify(banks.documents));
  } catch (error) {
    console.log(error);
  }
};

export const getBank = async ({ documentId }) => {
  console.log(documentId);
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(DATABASE_ID, BANK_COLLECTION_ID, [
      Query.equal("$id", [documentId]),
    ]);
    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.log(error);
  }
};

export const getBankByAccountId = async ({ accountId }) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(DATABASE_ID, BANK_COLLECTION_ID, [
      Query.equal("accountId", [accountId]),
    ]);

    if (bank.total !== 1) return null;

    return JSON.parse(JSON.stringify(bank.documents[0]));
  } catch (error) {
    console.log(error);
  }
};
