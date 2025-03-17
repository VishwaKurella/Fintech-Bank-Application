"use client";
import Link from "next/link";
import Image from "next/image";
import { IBM_Plex_Sans } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trySignUp, trySignIn } from "@/lib/actions/userAction";
import AccountLink from "./AccountLink";

const ibm_plex_sans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
});

export default function AuthForm({ type }) {
  const [user, setUser] = useState(null);
  return (
    <div className="flex min-h-screen w-full max-w-[420px] flex-col justify-center gap-5 py-10 md:gap-8">
      <div className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            width={34}
            height={34}
            src="/bank_logo.svg"
            alt="logo"
            className="size-6 xl:size-8 rounded-b-full border border-black"
          />
          <h1
            className={`text-26 font-thin text-black ${ibm_plex_sans.className}`}
          >
            VK
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user ? "Link Account" : type === "sign-in" ? "Sign-In" : "Sign-Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </div>
      {user ? (
        <div className="flex flex-col gap-4">
          <AccountLink userInfo={user} variant="primary" />
        </div>
      ) : type === "sign-in" ? (
        <SignInForm setUser={setUser} />
      ) : (
        <SignUpForm setUser={setUser} />
      )}
    </div>
  );
}

function SignInForm({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    setSubmit(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    setIsLoading(true);
    try {
      const response = await trySignIn({ userInfo: formData });
      if (response.success) {
        router.push("/");
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="relative flex flex-1 flex-col space-y-3"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="absolute z-10 bottom-full mb-2 w-full bg-red-500 text-white text-lg px-4 py-2 rounded-md shadow-lg animate-fade-in  text-center">
          Invalid Email or Password. Please try again.
        </div>
      )}
      <div className="flex flex-col items-start">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">Email</h1>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address (e.g., example@domain.com)"
        />
        <p
          className={`text-sm text-red-600/70 ${
            submit && !formData.email.includes("@") ? "visible" : "invisible"
          }`}
        >
          Invalid email
        </p>
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">Password</h1>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          minLength={8}
          maxLength={256}
          required
        />
        <p
          className={`text-sm text-red-600/70 ${
            submit && formData.password.length < 6 ? "visible" : "invisible"
          }`}
        >
          Password must be at least 8 characters
        </p>
      </div>
      <button
        type="submit"
        className="mt-2 p-2 bg-[#0179FE] text-white rounded-lg cursor-pointer font-bold border border-[#0179FE]"
        disabled={isLoading}
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
            <p>Loading...</p>
          </div>
        ) : (
          "Submit"
        )}
      </button>
      <h1 className="flex justify-center items-center text-gray-600 space-x-1">
        <p>Create an account now </p>
        <Link
          href="/sign-up"
          className="hover:text-blue-500 text-blue-600/80 hover:underline"
        >
          SignUp
        </Link>
      </h1>
    </form>
  );
}

function SignUpForm({ setUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    state: "",
    postalCode: "",
    dateOfBirth: "",
    ssn: "",
    email: "",
    password: "",
    city: "",
  });
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setSubmit(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    setIsLoading(true);

    try {
      const { password, ...userInfo } = formData;
      const newUser = await trySignUp({ password, ...userInfo });

      if (newUser.success) {
        setUser(newUser);
      } else {
        setError(true);
        const errorTimeout = setTimeout(() => setError(false), 5000);
        return () => clearTimeout(errorTimeout);
      }
    } catch (error) {
      setError(true);
      setTimeout(() => setError(false), 5000);
    } finally {
      setSubmit(false);
      setIsLoading(false);
    }
  };

  return (
    <form
      className="relative flex flex-1 flex-col space-y-3"
      onSubmit={handleSubmit}
    >
      {error && (
        <div className="absolute z-10 bottom-full mb-2 w-full bg-red-600 text-white text-lg px-6 py-3 rounded-lg shadow-md animate-fade-in transform transition-all duration-300 scale-100 text-center">
          Unable to create an account. Please try again later.
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-start">
          <h1 className="text-gray-600 font-semibold text-lg mb-2">
            First Name
          </h1>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="ex: John"
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            pattern="^[A-Za-z]+$"
            title="Only letters are allowed"
            required
          />
        </div>
        <div>
          <h1 className="text-gray-600 font-semibold text-lg mb-2">
            Last Name
          </h1>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="ex: Doe"
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            pattern="^[A-Za-z]+$"
            title="Only letters are allowed"
            required
          />
        </div>
      </div>
      <div className="flex flex-col justify-start">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">address</h1>
        <input
          type="text"
          name="address1"
          value={formData.address1}
          onChange={handleChange}
          placeholder="Enter your specific address"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          pattern=".{5,}"
          title="Address must be at least 5 characters long"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col items-start">
          <h1 className="text-gray-600 font-semibold text-lg mb-2">State</h1>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="ex: NY"
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            pattern="^[A-Z]{2}$"
            title="Please Enter the State initials ex: NY"
            required
          />
        </div>
        <div>
          <h1 className="text-gray-600 font-semibold text-lg mb-2">City</h1>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="ex: Bangalore"
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h1 className="text-gray-600 font-semibold text-lg mb-2">Pin Code</h1>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="ex: 12345"
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            pattern="\d{5}"
            required
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-gray-600 font-semibold text-lg mb-2">
            Date Of Birth
          </h1>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
            required
            max={new Date()
              .toISOString()
              .split("T")[0]
              .replace(/\d{4}/, (y) => y - 18)}
            title="You must be at least 18 years old."
          />
        </div>
      </div>
      <div className="flex flex-col justify-start">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">SSN</h1>
        <input
          type="text"
          name="ssn"
          value={formData.ssn}
          onChange={handleChange}
          placeholder="Last 4 digits, ex: 1234"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          pattern="\d{4}"
          title="Enter the last 4 digits of your SSN"
          required
        />
      </div>
      <div className="flex flex-col items-start">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">Email</h1>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          title="Please enter a valid email address (e.g., example@domain.com)"
        />
        <p
          className={`text-sm text-red-600/70 ${
            submit && !formData.email.includes("@") ? "visible" : "invisible"
          }`}
        >
          Invalid email address
        </p>
      </div>
      <div className="flex flex-col items-start -mt-3">
        <h1 className="text-gray-600 font-semibold text-lg mb-2">Password</h1>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="p-2 outline active:outline-cyan-500/80 rounded-lg w-full placeholder-gray-600"
          minLength={8}
          maxLength={256}
          required
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
          title="Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
        />
        <p
          className={`text-sm text-red-600/70 ${
            submit && formData.password.length < 6 ? "visible" : "invisible"
          }`}
        >
          Password must be at least 6 characters
        </p>
      </div>
      <button
        type="submit"
        className="mt-2 p-2 bg-[#0179FE] text-white rounded-lg cursor-pointer font-bold border border-[#0179FE]"
        disabled={isLoading}
        required
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
            <p>Loading...</p>
          </div>
        ) : (
          "Create Account"
        )}
      </button>
      <h1 className="flex justify-center items-center text-gray-600 space-x-1">
        <p>Already have an account</p>
        <Link
          href="/sign-in"
          className="hover:text-blue-500 text-blue-600/80 hover:underline"
        >
          SignIn
        </Link>
      </h1>
    </form>
  );
}
