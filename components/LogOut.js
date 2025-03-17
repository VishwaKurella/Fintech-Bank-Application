import { logoutAccount } from "@/lib/actions/userAction";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LogOut({ userInfo, type = "desktop" }) {
  const router = useRouter();
  const handleLogOut = async () => {
    const logout = await logoutAccount();
    if (logout) {
      router.push("/sign-in");
    }
  };
  return (
    <div className="flex cursor-pointer items-center justify-between gap-2 py-6">
      <div
        className={`${
          type === "mobile"
            ? "flex size-10 items-center justify-center rounded-full bg-gray-200"
            : "flex size-10 items-center justify-center rounded-full bg-gray-200 max-xl:hidden"
        }`}
      >
        <p className="text-xl font-bold text-gray-700">
          {userInfo?.firstName[0]}
        </p>
      </div>
      <div
        className={`${
          type === "mobile"
            ? "flex flex-1 flex-col justify-center"
            : "flex flex-1 flex-col justify-center max-xl:hidden"
        }`}
      >
        <h1 className="text-14 truncate text-gray-700 font-semibold">
          {`${userInfo.firstName} ${userInfo.lastName}`}
        </h1>
        <p className="text-14 truncate font-normal text-gray-600">
          {userInfo?.email}
        </p>
      </div>
      <button
        className="relative size-5 max-xl:w-full max-xl:flex max-xl:justify-center max-xl:items-center cursor-pointer"
        onClick={handleLogOut}
      >
        <Image src="/logout_logo.svg" fill alt="logout logo" />
      </button>
    </div>
  );
}
