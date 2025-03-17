import Counter from "./Counter";
import DoughnutChart from "./DoughnutChart.js";

export default function TotalBalance({ accounts = [], banks, balance }) {
  return (
    <div className="flex w-full items-center gap-4 rounded-xl border border-gray-200 p-4 shadow sm:gap-6 sm:p-6">
      <div className="flex size-full max-w-[100px] items-center sm:max-w-[120px]">
        <DoughnutChart accounts={accounts} />
      </div>
      <div className="flex flex-col gap-6 items-start">
        <h2 className="text-18 font-semibold p-2 text-gray-900">
          Bank Accounts: {banks}
        </h2>
        <div className="flex flex-col p-2 items-start">
          <p className="text-14 font-medium text-gray-600">Total Balance</p>
          <p className="text-24 lg:text-30 flex-1 font-semibold text-gray-900 flex items-center justify-center gap-2">
            <Counter amount={balance} duration={2} />
          </p>
        </div>
      </div>
    </div>
  );
}
