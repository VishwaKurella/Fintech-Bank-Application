import Image from "next/image";
import Link from "next/link";
import BankCard from "./BankCard";
import { countTransactionCategories } from "./utils";
import Category from "./Category";

export default function SideBarRight({
  userInfo,
  transactions = [],
  banks = [],
}) {
  const categories = countTransactionCategories(transactions);
  return (
    <div className="!no-scrollbar !hidden !h-screen !max-h-screen !flex-col !border-l !border-gray-200 xl:!flex w-[355px] xl:!overflow-y-scroll">
      <div className="flex flex-col pb-8">
        <div className="h-[120px] w-full profile-background bg-cover bg-no-repeat" />
        <div className="relative flex px-6 max-xl:justify-center">
          <div className="flex items-center justify-center absolute -top-8 size-24 rounded-full bg-gray-100 border-8 border-white p-2 shadow shadow-black/40">
            <span className="text-5xl font-thin text-blue-600">
              {userInfo.firstName[0]}
              {userInfo.lastName[0]}
            </span>
          </div>
          <div className="flex flex-col pt-24">
            <h1 className="text-24 font-semibold  text-yellow-600/80">
              {`${userInfo.firstName} ${userInfo.lastName}`}
            </h1>
            <p className="text-16 font-normal text-gray-600">
              {userInfo.email}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-8 px-6 py-8">
        <div className="flex w-full justify-between">
          <h2 className="text-18 font-semibold text-gray-900">My Banks</h2>
          <Link href="/" className="flex gap-2">
            <Image
              src="/plus_logo.svg"
              width={20}
              height={20}
              alt="plus logo"
            />
            <h2 className="text-14 font-semibold text-gray-600 hover:underline underline-offset-2">
              Add Bank
            </h2>
          </Link>
        </div>
        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col justify-center items-center gap-5">
            {banks[0] && (
              <div className="relative z-10">
                <BankCard
                  key={banks[0].$id}
                  account={banks[0]}
                  userName={`${userInfo.firstName} ${userInfo.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
            {banks[1] && (
              <div className="absolute left-8 top-8 z-0">
                <BankCard
                  key={banks[1].$id}
                  account={banks[1]}
                  userName={`${userInfo.firstName} ${userInfo.lastName}`}
                  showBalance={false}
                />
              </div>
            )}
          </div>
        )}
        <div className="mt-10 flex flex-col gap-6">
          <h2 className="text-18 font-semibold text-gray-900">
            Top Categories
          </h2>
          <div className="space-y-5">
            {categories.map((categorie, index) => (
              <Category key={index} category={categorie} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
