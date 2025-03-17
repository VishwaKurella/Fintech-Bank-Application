"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";

import { getTransactionsByBankId } from "./transactionAction";
import { getBank, getBanks } from "./userAction";

export const getAccounts = async ({ userId }) => {
  try {
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank) => {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id,
        });

        const account = {
          id: accountData.account_id,
          availableBalance: accountData.balances.available,
          currentBalance: accountData.balances.current,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask,
          type: accountData.type,
          subtype: accountData.subtype,
          appwriteItemId: bank.$id,
          sharaebleId: bank.shareableId,
        };

        return account;
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return JSON.parse(
      JSON.stringify({ data: accounts, totalBanks, totalCurrentBalance })
    );
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getAccount = async ({ appwriteItemId }) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId });

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });

    const accountData = accountsResponse.data.accounts[0];
    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData) => ({
        id: transferData.$id,
        name: transferData.name,
        amount: transferData.amount,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id,
    });

    const transactions = await getTransactions({
      accessToken: bank.accessToken,
    });
    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available,
      currentBalance: accountData.balances.current,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask,
      type: accountData.type,
      subtype: accountData.subtype,
      appwriteItemId: bank.$id,
    };

    const allTransactions = [...transactions, ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return JSON.parse(
      JSON.stringify({
        data: account,
        transactions: allTransactions,
      })
    );
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

export const getInstitution = async ({ institutionId }) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"],
    });

    const intitution = institutionResponse.data.institution;

    return JSON.parse(JSON.stringify(intitution));
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getTransactions = async ({ accessToken }) => {
  let hasMore = true;
  let transactions = [];
  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
      });

      const data = response.data;

      transactions = response.data.added.map((transaction) => ({
        id: transaction.transaction_id,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        type: transaction.payment_channel,
        accountId: transaction.account_id,
        amount: transaction.amount,
        pending: transaction.pending,
        category: transaction.category ? transaction.category[0] : "",
        date: transaction.date,
        image: transaction.logo_url,
      }));

      hasMore = data.has_more;
    }

    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};
