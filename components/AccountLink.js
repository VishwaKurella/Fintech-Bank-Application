"use client";
import { createLinkToken, exchangePublicToken } from "@/lib/actions/userAction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function AccountLink({ userInfo, variant }) {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const getLinkToken = async () => {
      const data = await createLinkToken(userInfo);
      setToken(data?.linkToken);
    };
    getLinkToken();
  }, [userInfo]);

  const onSuccess = useCallback(
    async (public_token) => {
      await exchangePublicToken({ publicToken: public_token, user: userInfo });
      router.push("/");
    },
    [userInfo, router]
  );

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  return (
    <>
      {variant === "primary" ? (
        <button
          className="text-16 rounded-lg border border-[#0179FE] bg-[#0179FE] font-semibold text-white shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)] p-2 cursor-pointer"
          onClick={() => open()}
          disabled={!ready}
        >
          Connect Bank
        </button>
      ) : variant === "ghost" ? (
        <button
          onClick={() => open()}
          variant="ghost"
          className="flex cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start"
        >
          <Image
            src="/connect_bank.svg"
            alt="connect bank logo"
            width={24}
            height={24}
          />
          <p className="hiddenl text-[16px] font-semibold text-black-2 xl:block">
            Connect bank
          </p>
        </button>
      ) : (
        <button
          onClick={() => open()}
          className="flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg justify-center xl:justify-start hover:bg-gray-500/50 cursor-pointer"
        >
          <Image
            src="/connect_bank.svg"
            alt="connect bank logo"
            width={24}
            height={24}
          />
          <p className="text-[16px] font-semibold text-black">Connect bank</p>
        </button>
      )}
    </>
  );
}
