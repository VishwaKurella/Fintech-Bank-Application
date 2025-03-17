"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import bank_logo from "@/public/bank_logo.svg";
import { IBM_Plex_Sans } from "next/font/google";
import cn from "classnames";
import LogOut from "./LogOut";
import AccountLink from "./AccountLink";

const ibm_plex_sans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
});

export const sidebarLinks = [
  {
    imgURL: "/home_logo.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/rupee_logo.svg",
    route: "/my-banks",
    label: "My Banks",
  },
  {
    imgURL: "/card_logo.svg",
    route: "/transaction-history",
    label: "Transaction History",
  },
  {
    imgURL: "/money_logo.svg",
    route: "/payment-transfer",
    label: "Transfer Funds",
  },
];

export default function Sidebar({ userInfo }) {
  const pathname = usePathname();
  return (
    <div className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between border-r border-gray-200 bg-white pt-8 text-white max-md:hidden sm:p-4 xl:p-6 2xl:w-[355px]">
      <div className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image
            width={34}
            height={34}
            src={bank_logo}
            alt="logo"
            className="size-6 xl:size-11 rounded-b-full border border-black"
          />
          <h1
            className={`2xl:text-26  text-[26px] font-thin text-black xl:hidden ${ibm_plex_sans.className}`}
          >
            VK
          </h1>
        </Link>
        {sidebarLinks.map((item) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                "flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start hover:bg-gray-500/50",
                { "bg-blue-600/80": isActive }
              )}
            >
              <div className="relative size-6">
                <Image
                  src={item.imgURL}
                  alt={item.label}
                  fill
                  className={`${isActive ? "brightness-[3] invert-0" : ""}`}
                />
              </div>
              <p
                className={`text-16 font-semibold text-black max-xl:hidden ${
                  isActive ? "!text-white" : ""
                }`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
        <AccountLink userInfo={userInfo} />
      </div>
      <LogOut userInfo={userInfo} />
    </div>
  );
}
