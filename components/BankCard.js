import { IBM_Plex_Serif } from "next/font/google";
import Link from "next/link";
import { formatAmount } from "./utils";
import Image from "next/image";
import Copy from "./Copy";

const ibm_plex_serif = IBM_Plex_Serif({
  weight: "400",
  subsets: ["latin"],
});

export default function BankCard({ account, userName, showBalance = false }) {
  return (
    <div className="flex flex-col">
      <Link
        href={`/transaction-history/?id=${account.appwriteItemId}`}
        className="relative flex h-[190px] w-full max-w-[325px] justify-between rounded-[20px] border border-white bg-gradient-to-tr from-blue-600/80 to-blue-500/80 shadow-[8px 10px 16px 0px rgba(0, 0, 0, 0.05)] backdrop-blur-[6xp]"
      >
        <div className="relative z-10 flex size-full max-w-[228px] flex-col justify-between rounded-l-[20px] bg-gradient-to-tr from-blue-500/80 to-blue-400 px-5 pb-4 pt-5">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {account.name || userName}
            </h1>
            <p className={`${ibm_plex_serif.className} font-black text-white`}>
              {formatAmount(account.currentBalance)}
            </p>
          </div>

          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">{userName}</h1>
              <h2 className="text-12 font-semibold text-white">** / **</h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●●{" "}
              <span className="text-16">{account?.mask || 1234}</span>
            </p>
          </article>
        </div>

        <div className="relative z-10 flex size-full flex-1 flex-col items-end justify-between rounded-r-[20px] bg-gradient-to-tr from-blue-600/80 to-blue-500 bg-cover bg-center bg-no-repeat py-5 pr-5">
          <Image
            src="/paypass_logo.svg"
            width={20}
            height={24}
            alt="paypass logo"
            className="size-12"
          />
          <Image
            src="/mastercard_logo.svg"
            width={45}
            height={32}
            alt="mastercard logo"
            className="ml-5 size-12"
          />
        </div>

        <Image
          src="/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 right-0"
        />
      </Link>
      {showBalance && <Copy title={account.sharaebleId} />}
    </div>
  );
}
// sharaebleId
