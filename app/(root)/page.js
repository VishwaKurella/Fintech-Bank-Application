import Header from "@/components/Header.js";
import RecentTransactions from "@/components/RecentTransactions";
import SideBarRight from "@/components/SideBarRight";
import TotalBalance from "@/components/TotalBalance";
import { getAccount, getAccounts } from "@/lib/actions/bankAction";
import { getLoggedInUser } from "@/lib/actions/userAction";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default async function Home({ searchParams }) {
  const { id, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const userInfo = await getLoggedInUser();
  const accounts = await getAccounts({ userId: userInfo.$id });
  if (!accounts) {
    return;
  }
  const appwriteItemId = id || accounts.data[0].appwriteItemId;
  const account = await getAccount({ appwriteItemId });
  return (
    <section
      className={`no-scrollbar flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll${roboto.className}`}
    >
      <div className="no-scrollbar flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
        <div className="flex flex-col justify-between gap-8">
          <Header
            type={"greeting"}
            title={"Hello"}
            subtext={
              "Access and manage you're accounts and transactions efficently"
            }
            user={userInfo.firstName}
          />
          <TotalBalance
            accounts={accounts.data}
            banks={accounts.totalBanks}
            balance={accounts.totalCurrentBalance}
          />
        </div>
        <RecentTransactions
          accounts={accounts.data}
          transactions={account.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <SideBarRight
        userInfo={userInfo}
        transactions={account.transactions}
        banks={accounts.data.slice(0, 2)}
      />
    </section>
  );
}
