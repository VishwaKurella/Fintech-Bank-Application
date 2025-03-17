import BankCard from "@/components/BankCard";
import Header from "@/components/Header.js";
import { getAccounts } from "@/lib/actions/bankAction";
import { getLoggedInUser } from "@/lib/actions/userAction";

export default async function Home() {
  const userInfo = await getLoggedInUser();
  if (!userInfo) {
    return;
  }
  const accounts = await getAccounts({ userId: userInfo.$id });
  return (
    <div className="flex">
      <div className="flex h-screen max-h-screen w-full flex-col gap-8 bg-[#fcfcfd] p-8 xl:py-12">
        <Header
          title={"My Bank Accounts"}
          subtext={"Effortlessly manage your banking activities."}
        />
        <div className="space-y-4">
          <h2 className="text-18 font-semibold text-gray-900">Your Cards</h2>
          <div className="flex flex-wrap gap-6">
            {accounts &&
              accounts.data.map((account) => (
                <BankCard
                  key={account.id}
                  account={account}
                  userName={userInfo.firstName}
                  showBalance={true}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
