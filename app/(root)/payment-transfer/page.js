import Header from "@/components/Header.js";
import TransferForm from "@/components/TransferForm";
import { getAccounts } from "@/lib/actions/bankAction";
import { getLoggedInUser } from "@/lib/actions/userAction";

export default async function Home() {
  const userInfo = await getLoggedInUser();
  if (!userInfo || !userInfo.$id) {
    return;
  }
  const accounts = await getAccounts({ userId: userInfo.$id });
  return (
    <div className="no-scrollbar flex flex-col overflow-y-scroll bg-[#fcfcfd] p-8 md:max-h-screen xl:py-12">
      <Header
        title={"Payment Transfer"}
        subtext={
          "Please provide any specific details or notes related to the payment transfer"
        }
      />
      <div className="size-full pt-5">
        <TransferForm accounts={accounts.data} />
      </div>
    </div>
  );
}
