import AuthForm from "@/components/AuthForm";

export default async function SignUp() {
  return (
    <div className="flex justify-center items-center size-full max-sm:px-6">
      <AuthForm type={"sign-up"} />
    </div>
  );
}
