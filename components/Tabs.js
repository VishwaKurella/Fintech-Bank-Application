"use client";
import { useState } from "react";
import { BankTabItem } from "./bankTabItem";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

export default function Tabs({ accounts, transactions, page, appwriteItemId }) {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const [tab, setTab] = useState(appwriteItemId);
  return (
    <div className="w-full">
      <div className="custom-scrollbar mb-8 flex w-full flex-nowrap justify-center space-x-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="cursor-pointer"
            onClick={() => setTab(account.appwriteItemId)}
          >
            <BankTabItem
              account={account}
              appwriteItemId={tab}
              name={account.name}
            />
          </div>
        ))}
      </div>

      {accounts.map((account) =>
        tab === account.appwriteItemId ? (
          <div key={account.id} className="space-y-4">
            <BankInfo account={account} appwriteItemId={tab} type="full" />
            <TransactionsTable transactions={currentTransactions} />
            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
