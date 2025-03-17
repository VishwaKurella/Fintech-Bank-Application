import smile_logo from "@/public/smile_logo.svg";
import Image from "next/image";

export default function Header({ type = "title", title, subtext, user }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-30 lg:text-30 font-semibold text-gray-900 flex items-center">
        Welcome <span className="text-gray-600/80 mx-1">{user}</span>
      </span>
      <span className="text-16 lg:text-14 font-normal text-gray-600">
        {subtext}
      </span>
    </div>
  );
}
