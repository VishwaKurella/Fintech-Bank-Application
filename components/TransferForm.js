"use client";
import { useState } from "react";
import { decryptId, formatAmount, formUrlQuery } from "./utils";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { getBank, getBankByAccountId } from "@/lib/actions/userAction";
import { createTransfer } from "@/lib/dowlla";
import { createTransaction } from "@/lib/actions/transactionAction";

export default function TransferForm({ accounts }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fromBank, setFromBank] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shareableId, setShareableId] = useState("");
  const [amount, setAmount] = useState(0.0); // Renamed ammount to amount
  const [error, setError] = useState(""); // State to handle error messages

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const receiverAccountId = decryptId(shareableId);
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      const senderBank = await getBank({ documentId: fromBank });
      if (!senderBank || !receiverBank) {
        setError("Unable to retrieve bank information. Please try again.");
        return;
      }

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: amount,
      };
      const transfer = await createTransfer(transferParams);
      if (transfer) {
        const transaction = {
          name: name,
          amount: amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: email,
        };
        const newTransaction = await createTransaction(transaction);
        if (newTransaction) {
          // Reset form states
          setFromBank(null);
          setName("");
          setEmail("");
          setShareableId("");
          setAmount(0); // Reset amount
          router.push("/"); // Redirect after successful transfer
        }
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false); // Set loading to false after the process is finished
    }
  };

  return (
    <form className="relative flex flex-col" onSubmit={handleSubmit}>
      <div className="border-t border-gray-200">
        <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 pb-6 pt-5">
          <div className="flex w-full max-w-[280px] flex-col gap-2">
            <h1 className="text-14 font-medium text-gray-700">
              Select Source Bank
            </h1>
            <p className="text-12 font-normal text-gray-600">
              Select the bank account you want to transfer funds from
            </p>
          </div>
          <div className="flex w-full flex-col justify-center">
            <BankDropdown accounts={accounts} setValue={setFromBank} />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 pb-6 pt-5">
          <div className="flex w-full max-w-[280px] flex-col gap-2">
            <h1 className="text-14 font-medium text-gray-700">
              Transfer Note (Optional)
            </h1>
            <p className="text-12 font-normal text-gray-600">
              Please provide any additional information or instructions related
              to the transfer
            </p>
          </div>
          <div className="flex w-full flex-col justify-center">
            <textarea
              className="text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 p-1 min-h-24"
              placeholder="Write a short note here"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 border-t border-gray-200 pb-5 pt-6">
        <h2 className="text-18 font-semibold text-gray-900">
          Bank account details
        </h2>
        <p className="text-16 font-normal text-gray-600">
          Enter the bank account details of the recipient
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 py-5">
          <div className="text-14 w-full max-w-[280px] font-medium text-gray-700">
            <h1 className="text-14 font-medium text-gray-700">
              Recipient&apos;s Email Address
            </h1>
          </div>
          <div className="flex w-full flex-col justify-center">
            <input
              placeholder="ex: johndoe@gmail.com"
              type="email"
              className="text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 p-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 py-5">
          <div className="text-14 w-full max-w-[280px] font-medium text-gray-700">
            <h1 className="text-14 font-medium text-gray-700">
              Receiver&apos;s Plaid Sharable Id
            </h1>
          </div>
          <div className="flex w-full flex-col justify-center">
            <input
              type="text"
              placeholder="Enter the public account number"
              className="text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 p-1"
              value={shareableId}
              onChange={(e) => setShareableId(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="flex w-full max-w-[850px] flex-col gap-3 md:flex-row lg:gap-8 py-5">
          <div className="text-14 w-full max-w-[280px] font-medium text-gray-700">
            <h1 className="text-14 font-medium text-gray-700">Amount</h1>
          </div>
          <div className="flex w-full flex-col justify-center">
            <input
              placeholder="ex: 5.00"
              className="text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full max-w-[850px] gap-3 border-gray-200 py-5">
        <button
          type="submit"
          className="!text-14 w-full !bg-gradient-to-tr !from-blue-600/80 !to-blue-500/80 !font-semibold !text-white !shadow-[0px 1px 2px 0px rgba(16, 24, 40, 0.05)] rounded-lg py-2"
        >
          {isLoading ? (
            <div className="flex space-x-2 justify-center items-center">
              <Image
                src="/spin_logo.svg"
                width={24}
                height={24}
                className="size-6 animate-spin"
                alt="loading"
              />
              <p>Sending...</p>
            </div>
          ) : (
            "Transfer Funds"
          )}
        </button>
      </div>
    </form>
  );
}

export const BankDropdown = ({ accounts = [], setValue }) => {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(accounts[0]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  };

  const handleSelect = (id) => {
    const account = accounts.find((account) => account.appwriteItemId === id);
    setSelected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });
    if (setValue) {
      setValue(id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex w-[300px] bg-white gap-3 md:w-full items-center p-2 outline outline-neutral-200 rounded justify-between"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen ? "true" : "false"}
      >
        <div className="flex space-x-2">
          <Image src="/card_logo.svg" width={20} height={20} alt="card logo" />
          <p className="line-clamp-1 w-full text-left">
            {selected.name || accounts[0]}
          </p>
        </div>
        <motion.div
          initial={{ rotate: -180 }}
          animate={{ rotate: isOpen ? 0 : -180 }}
          transition={{
            type: "keyframes",
            stiffness: 260,
            damping: 20,
          }}
        >
          <Image
            src="down_arrow_logo.svg"
            width={20}
            height={20}
            alt="down arrow logo"
          />
        </motion.div>
      </button>
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 w-[300px] bg-white md:w-full flex flex-col mt-1 rounded border z-10"
          role="listbox"
          aria-labelledby="bank-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "linear" }}
        >
          <button
            type="button"
            className="p-2 font-normal text-gray-500"
            onClick={() => {
              setSelected(null);
              setIsOpen(false);
            }}
            aria-selected={selected === null ? "true" : "false"}
          >
            <div className="flex flex-col items-start">
              Select a bank to display
            </div>
          </button>
          {accounts.map((account) => (
            <button
              type="button"
              key={account.id}
              className="cursor-pointer border-t p-2"
              onClick={() => {
                handleSelect(account.appwriteItemId);
              }}
              aria-selected={selected === account ? "true" : "false"}
            >
              <div className="flex flex-col items-start">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">
                  {formatAmount(account.currentBalance)}
                </p>
              </div>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
