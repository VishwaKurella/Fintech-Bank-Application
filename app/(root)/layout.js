"use server";
import Sidebar from "@/components/Sidebar";
import SidebarMobile from "@/components/SideBarMobile";
import { getLoggedInUser } from "@/lib/actions/userAction";
import Image from "next/image";

export default async function Layout({ children }) {
  const userInfo = await getLoggedInUser();
  if (!userInfo) {
    router.push("/sign-in");
  }
  return (
    <main className="flex h-screen w-full">
      <Sidebar userInfo={userInfo} />
      <div className="flex size-full flex-col">
        <div className="flex h-16 items-center justify-between p-5 shadow-creditCard sm:p-8 md:hidden">
          <div className="flex flex-row items-center">
            <Image src="/bank_logo.svg" width={34} height={34} alt="logo" />
            <h1 className="text-3xl font-thin">VK</h1>
          </div>
          <div>
            <SidebarMobile userInfo={userInfo} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
