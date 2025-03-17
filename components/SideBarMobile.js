"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogOut from "./LogOut";

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

export default function SidebarMobile({ userInfo }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="">
      <button
        onClick={() => {
          setIsOpen((currentValue) => !currentValue);
        }}
        className="cursor-pointer hover:ring rounded-lg"
      >
        <Image
          src="/menu_logo.svg"
          width={34}
          height={34}
          className="size-8"
          alt="logo"
        />
      </button>
      <motion.div
        initial={{ x: 500 }}
        animate={{ x: isOpen ? 0 : 500 }}
        transition={{ type: "keyframes", stiffness: 100 }}
        className="fixed backdrop-blur-xl top-0 right-0 h-full w-1/2 bg-white p-5 flex flex-col gap-4 mt-16 rounded-l-xl shadow"
      >
        <div
          className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <div className="flex h-full flex-col pt-16 gap-6 text-white">
            {sidebarLinks.map((item) => {
              const isActive =
                pathname === item.route ||
                pathname.startsWith(`${item.route}/`);
              return (
                <Link
                  href={item.route}
                  key={item.label}
                  className={`
                flex gap-3 items-center p-4 rounded-lg w-full max-w-60" ${
                  isActive ? "bg-blue-600/80" : ""
                }`}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={`${isActive ? "brightness-[3] invert-0" : ""}`}
                  />
                  <p
                    className={`text-16 font-semibold text-black ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
      <LogOut userInfo={userInfo} />
    </div>
  );
}
