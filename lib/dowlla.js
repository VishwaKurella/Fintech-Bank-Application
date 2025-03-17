"use server";
import { Client } from "dwolla-v2";

const getEnvironment = () => {
  const environment = process.env.DWOLLA_ENV;

  switch (environment) {
    case "sandbox":
      return "sandbox";
    case "production":
      return "production";
    default:
      console.error(`Invalid DWOLLA_ENV: ${environment}`);
      throw new Error(
        "Dwolla environment should either be set to `sandbox` or `production`"
      );
  }
};

const dwollaClient = new Client({
  environment: getEnvironment(),
  key: process.env.DWOLLA_KEY,
  secret: process.env.DWOLLA_SECRET,
});

export const createFundingSource = async (options) => {
  try {
    const res = await dwollaClient.post(
      `customers/${options.customerId}/funding-sources`,
      {
        name: options.fundingSourceName,
        plaidToken: options.plaidToken,
      }
    );
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Funding Source Failed: ", err);
    throw err;
  }
};

export const createOnDemandAuthorization = async () => {
  try {
    const onDemandAuthorization = await dwollaClient.post(
      "on-demand-authorizations"
    );
    return onDemandAuthorization.body._links;
  } catch (err) {
    console.error("Creating an On Demand Authorization Failed: ", err);
    throw err;
  }
};

export const createDwollaCustomer = async (newCustomer) => {
  try {
    const res = await dwollaClient.post("customers", newCustomer);
    return res.headers.get("location");
  } catch (err) {
    console.error("Creating a Dwolla Customer Failed: ", err);
    throw err;
  }
};

export const deleteDwollaCustomer = async (customerId) => {
  try {
    const res = await dwollaClient.post(`customers/${customerId}/deactivate`);

    if (res.status === 200 || res.status === 204) {
      console.log(`Successfully deactivated Dwolla customer: ${customerId}`);
      return true;
    } else {
      throw new Error(`Failed to deactivate Dwolla customer: ${customerId}`);
    }
  } catch (err) {
    console.error("Deleting a Dwolla Customer Failed: ", err);
    throw err;
  }
};

export const createTransfer = async ({
  sourceFundingSourceUrl,
  destinationFundingSourceUrl,
  amount,
}) => {
  try {
    const requestBody = {
      _links: {
        source: { href: sourceFundingSourceUrl },
        destination: { href: destinationFundingSourceUrl },
      },
      amount: { currency: "USD", value: amount },
    };
    const res = await dwollaClient.post("transfers", requestBody);
    return res.headers.get("location");
  } catch (err) {
    console.error("Transfer fund failed: ", err);
    throw err;
  }
};

export const addFundingSource = async ({
  dwollaCustomerId,
  processorToken,
  bankName,
}) => {
  try {
    const dwollaAuthLinks = await createOnDemandAuthorization();
    const fundingSourceOptions = {
      customerId: dwollaCustomerId,
      fundingSourceName: bankName,
      plaidToken: processorToken,
    };
    return await createFundingSource(fundingSourceOptions);
  } catch (err) {
    console.error("Adding funding source failed: ", err);
    throw err;
  }
};
