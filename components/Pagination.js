"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "./utils";

export const Pagination = ({ page, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type) => {
    const pageNumber = type === "prev" ? page - 1 : page + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: pageNumber.toString(),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-between gap-3">
      <button
        className="flex items-center px-3 py-2 text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded-md"
        onClick={() => handleNavigation("prev")}
        disabled={Number(page) <= 1}
      >
        <Image
          src="/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="mr-2"
        />
        Prev
      </button>
      <p className="text-14 flex items-center px-2">
        {page} / {totalPages}
      </p>
      <button
        className="flex items-center px-3 py-2 text-gray-700 disabled:opacity-50 hover:bg-gray-100 rounded-md"
        onClick={() => handleNavigation("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
        <Image
          src="/arrow-left.svg"
          alt="arrow"
          width={20}
          height={20}
          className="ml-2 -scale-x-100"
        />
      </button>
    </div>
  );
};
