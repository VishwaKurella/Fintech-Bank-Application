import qs from "query-string";
export function formatAmount(amount) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
  return formatter.format(amount);
}

export function extractCustomerIdFromUrl(url) {
  const parts = url.split("/");
  const customerId = parts[parts.length - 1];

  return customerId;
}

export function encryptId(id) {
  return btoa(id);
}

export function formUrlQuery({ params, key, value }) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const formatDateTime = (dateString) => {
  const dateTimeOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export const getTransactionStatus = (date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const removeSpecialCharacters = (value) => {
  return value.replace(/[^\w\s]/gi, "");
};

export function getAccountTypeColors(type) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-[#F5FAFF]",
        lightBg: "bg-[#D1E9FF]",
        title: "text-[#194185]",
        subText: "text-[#175CD3]",
      };

    case "credit":
      return {
        bg: "bg-[#F6FEF9]",
        lightBg: "bg-[#D1FADF]",
        title: "text-[#054F31]",
        subText: "text-[#027A48]",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export function decryptId(id) {
  return atob(id);
}

export function countTransactionCategories(transactions) {
  const categoryCounts = {};
  let totalCount = 0;
  transactions &&
    transactions.forEach((transaction) => {
      const category = transaction.category;
      if (categoryCounts.hasOwnProperty(category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
      totalCount++;
    });
  const aggregatedCategories = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}
