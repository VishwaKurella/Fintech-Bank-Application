"use server";
import Header from "@/components/Header.js";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { formatAmount } from "@/components/utils";
import { getAccount, getAccounts } from "@/lib/actions/bankAction";
import { getLoggedInUser } from "@/lib/actions/userAction";

export default async function Home({ searchParams }) {
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const userInfo = await getLoggedInUser();
  if (!userInfo || !userInfo.$id) {
    return;
  }
  const accounts = await getAccounts({ userId: userInfo.$id });
  if (!accounts) {
    return;
  }
  const appwriteItemId = id || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  const rowsPerPage = 10;
  const totalPages = Math.ceil(account.transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = account.transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="flex max-h-screen w-full flex-col gap-8 overflow-y-scroll bg-[#fcfcfd] p-8 xl:py-12">
      <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row">
        <Header
          title={"Transaction History"}
          subtext={"See your bank details and transactions."}
        />
      </div>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-lg bg-gradient-to-tr from-blue-600/80 to-blue-500/80 px-4 py-5 md:flex-row">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account.data.name}
            </h2>
            <p className="text-14 text-[#f5faff]">
              {account.data.officialName}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account.data.mask || 1234}</span>
            </p>
          </div>
          <div className="flex flex-col justify-between md:items-center gap-4 rounded-lg bg-blue-400/90 px-4 py-5 md:flex-row text-white">
            <p className="text-14 text-white">Current Balance</p>
            <p className="text-24 text-center font-bold text-white">
              {formatAmount(account.data.currentBalance)}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-6">
          <TransactionsTable transactions={currentTransactions} />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
