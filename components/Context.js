"use client";
import { getAccount, getAccounts } from "@/lib/actions/bankAction";
import { getLoggedInUser } from "@/lib/actions/userAction";
import { useRouter } from "next/navigation";
import { createContext, useState } from "react";

const myContext = createContext();

function MyContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState();
  const [accounts, setAccounts] = useState();
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const value = {
    userInfo,
    accounts,
    account,
    page,
  };
  const start = async () => {
    setLoading(true);
    const userInfo = await getLoggedInUser();
    if (!userInfo || !userInfo.$id) {
      router.push("/sign-in");
    }
    const accounts = await getAccounts({ userId: userInfo.$id });
    if (!accounts) {
      router.push("/sign-in");
    }
    const appwriteItemId = accounts.data[0].appwriteItemId;
    const account = await getAccount({ appwriteItemId });
    setUserInfo(userInfo);
    setAccounts(accounts);
    setAccount(account);
    setPage(page);
    setLoading(false);
  };
  start();
  console.log(account, accounts, userInfo);
  return (
    <myContext.Provider value={value}>
      <div className="relative">
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-screen z-50 bg-white bg-opacity-50 backdrop-blur-xl flex justify-center items-center">
            <div className="h-32 w-32 sm:h-40 sm:w-40">
              <Image
                src="/spin_logo.svg"
                fill
                alt="Loading spinner"
                className="animate-spin"
              />
            </div>
            <div className="text-black text-2xl sm:text-3xl font-semibold mt-4">
              Loading...
            </div>
          </div>
        )}
        {children}
      </div>
    </myContext.Provider>
  );
}

export { myContext, MyContextProvider };
