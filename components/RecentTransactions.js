import Link from "next/link";
import Tabs from "./Tabs";

export default function RecentTransactions({
  accounts,
  transactions = [],
  appwriteItemId,
  page = 1,
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-20 md:text-24 font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <Link
          href={`/transaction-history/?id=${appwriteItemId}`}
          className="text-14 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700"
        >
          View all
        </Link>
      </div>
      <Tabs
        accounts={accounts}
        transactions={transactions}
        appwriteItemId={appwriteItemId}
        page={page}
      />
    </div>
  );
}
