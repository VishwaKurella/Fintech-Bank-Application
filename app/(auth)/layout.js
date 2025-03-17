import Image from "next/image";

export default function Layout({ children }) {
  return (
    <main className="flex min-h-screen justify-between w-full">
      {children}
      <div className="flex h-screen w-full sticky top-0 items-center justify-end bg-sky-1 max-lg:hidden">
        <div>
          <Image src="/sign-in_bg.svg" fill alt="background" />
        </div>
      </div>
    </main>
  );
}
