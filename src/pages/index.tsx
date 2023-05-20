import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { TodoBox } from "~/components/todo/TodoBox";
import React from "react";
import { SelectPageWrapper } from "~/components/chat/SelectPageWrapper";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TodoGPT</title>
        <meta name="description" content="Smartest Todo app on the market" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            The worlds smartest{" "}
            <span className="text-[hsl(280,100%,70%)]">Todo</span> App
          </h1>
          <div className="flex h-full w-full flex-col gap-5 md:h-128 md:flex-row-reverse">
            <TodoBox />
            <SelectPageWrapper />
          </div>
          <div className="flex items-center">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
