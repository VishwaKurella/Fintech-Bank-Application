"use client";
export const transactionCategoryStyles = {
  "Food and Drink": {
    borderColor: "border-[#DD2590]", // pink-600
    backgroundColor: "bg-[#EE46BC]", // pink-500
    textColor: "text-[#C11574]", // pink-700
    chipBackgroundColor: "bg-inherit",
  },
  Payment: {
    borderColor: "border-[#039855]", // success-600
    backgroundColor: "bg-[#039855]", // success-600
    textColor: "text-[#027A48]", // success-700
    chipBackgroundColor: "bg-inherit",
  },
  "Bank Fees": {
    borderColor: "border-[#039855]", // success-600
    backgroundColor: "bg-[#039855]", // success-600
    textColor: "text-[#027A48]", // success-700
    chipBackgroundColor: "bg-inherit",
  },
  Transfer: {
    borderColor: "border-[#B91C1C]", // red-700
    backgroundColor: "bg-[#B91C1C]", // red-700
    textColor: "text-[#B91C1C]", // red-700
    chipBackgroundColor: "bg-inherit",
  },
  Processing: {
    borderColor: "border-[#EAECF0]", // gray-200
    backgroundColor: "bg-[#6B7280]", // gray-500
    textColor: "text-[#344054]", // gray-700
    chipBackgroundColor: "bg-[#EAECF0]", // gray-200
  },
  Success: {
    borderColor: "border-[#039855]", // success-600
    backgroundColor: "bg-[#039855]", // success-600
    textColor: "text-[#027A48]", // success-700
    chipBackgroundColor: "bg-[#ECFDF3]", // success-50
  },
  Travel: {
    borderColor: "border-[#175CD3]", // blue-700
    backgroundColor: "bg-[#2E90FA]", // blue-500
    textColor: "text-[#175CD3]", // blue-700
    chipBackgroundColor: "bg-[#ECFDF3]", // success-50
  },
  default: {
    borderColor: "",
    backgroundColor: "bg-[#2E90FA]",
    textColor: "text-[#175CD3]",
    chipBackgroundColor: "bg-inherit",
  },
};

import {
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "./utils";

const CategoryBadge = ({ category }) => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[category] || transactionCategoryStyles.default;
  return (
    <div
      className={`flex justify-center items-center truncate w-fit gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${borderColor} ${chipBackgroundColor}`}
    >
      <div className={`h-2 w-2 rounded-full ${backgroundColor}`} />
      <p className={`${textColor}`}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-md">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr className="border-b font-extrabold h-12">
            <th className="px-2 py-3">Transaction</th>
            <th className="px-2 py-3">Amount</th>
            <th className="px-2 py-3">Status</th>
            <th className="px-2 py-3">Date</th>
            <th className="px-2 py-3 max-md:hidden">Channel</th>
            <th className="px-2 py-3 max-md:hidden">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {transactions.map((t) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);
            const isDebit = t.type === "debit";

            return (
              <tr
                key={t.id}
                className={`${
                  isDebit || amount[0] === "-" ? "bg-red-50" : "bg-green-50"
                } hover:bg-gray-100 transition h-20`}
              >
                <td className="max-w-[250px] px-4 py-3 truncate font-semibold text-gray-800">
                  {removeSpecialCharacters(t.name)}
                </td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    isDebit || amount[0] === "-"
                      ? "text-[#f04438]"
                      : "text-[#039855]"
                  }`}
                >
                  {isDebit ? `-${amount}` : amount}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={status} />
                </td>
                <td className="px-4 py-3">
                  {formatDateTime(new Date(t.date)).dateTime}
                </td>
                <td className="px-4 py-3 capitalize max-md:hidden">
                  {t.paymentChannel}
                </td>
                <td className="px-4 py-3 max-md:hidden">
                  <CategoryBadge category={t.category} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
