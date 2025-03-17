"use client";
import CountUp from "react-countup";

export default function Counter({ amount, duration }) {
  return (
    <CountUp
      end={amount}
      duration={duration}
      prefix="₹ "
      decimal="."
      decimals={2}
    />
  );
}
