import AuthForm from "@/components/AuthForm";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center size-full max-sm:px-6">
      <AuthForm type={"sign-in"} />
    </div>
  );
}
