import Image from "next/image";

export const topCategoryStyles = {
  "Food and Drink": {
    bg: "bg-[#F5FAFF]",
    circleBg: "bg-[#D1E9FF]",
    text: {
      main: "text-[#194185]",
      count: "text-[#194185]",
    },
    progress: {
      bg: "bg-[#D1E9FF]",
      indicator: "bg-[#194185]",
    },
    icon: "/computer_logo.svg",
  },
  Travel: {
    bg: "bg-[#F6FEF9]",
    circleBg: "bg-[#D1FADF]",
    text: {
      main: "text-[#054F31]",
      count: "text-[#027A48]",
    },
    progress: {
      bg: "bg-[#D1FADF]",
      indicator: "bg-[#027A48]",
    },
    icon: "/coins_logo.svg",
  },
  default: {
    bg: "bg-[#FEF6FB]",
    circleBg: "bg-[#FCE7F6]",
    text: {
      main: "text-[#851651]",
      count: "text-[#C11574]",
    },
    progress: {
      bg: "bg-[#FCE7F6]",
      indicator: "bg-[#C11574]",
    },
    icon: "/bag_logo.svg",
  },
};

const Category = ({ category }) => {
  const {
    bg,
    circleBg,
    text: { main, count },
    progress: { bg: progressBg, indicator },
    icon,
  } = topCategoryStyles[category.name] || topCategoryStyles.default;

  return (
    <div className={`gap-[18px] flex p-4 rounded-xl ${bg}`}>
      <figure
        className={`flex justify-center items-center size-10 rounded-full ${circleBg}`}
      >
        <Image src={icon} width={20} height={20} alt={category.name} />
      </figure>
      <div className="flex w-full flex-1 flex-col gap-2">
        <div className="text-14 flex justify-between">
          <h2 className={`font-medium ${main}`}>{category.name}</h2>
          <h3 className={`font-normal ${count}`}>{category.count}</h3>
        </div>
        <ProgressBar
          category={category}
          progressBg={progressBg}
          indicator={indicator}
        />
      </div>
    </div>
  );
};

const ProgressBar = ({ category, progressBg, indicator }) => {
  return (
    <div className={`h-2 w-full ${progressBg} flex justify-start rounded`}>
      <div
        className={`h-2 ${indicator} rounded`}
        style={{
          width: `${(category.count / category.totalCount) * 100}%`,
          transition: "width 0.3s ease",
        }}
      ></div>
    </div>
  );
};

export default Category;
