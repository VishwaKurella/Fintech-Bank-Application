"use server";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";

const cormorant_garamond = Cormorant_Garamond({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
});
export default async function NotFound() {
  return (
    <div
      className={`notFound w-full h-screen flex flex-col justify-center items-center`}
    >
      <span className={`text-8xl text-white ${cormorant_garamond.className}`}>
        Page Not Found
      </span>
      <Link
        href="/"
        className="p-2 outline outline-black hover:outline-white bg-white hover:bg-gray-500/60 text-black hover:text-white rounded-xl shadow text-3xl"
      >
        Back Home
      </Link>
    </div>
  );
}
