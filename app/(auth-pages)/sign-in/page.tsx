import { githubLogin, signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatIcon, GithubIcon } from "lucide-react";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form
      className="w-full min-w-[324px] space-y-4 flex flex-col  justify-center items-center"
      action={signInAction}
    >
      <CatIcon className="w-[50px] h-[50px]" />
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center">
          Sniff around
          <br />
          your furry feed.
        </h1>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm mb-2">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Example: whiskers@meowmail.com"
          className="min-w-[324px]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm mb-2">
          Password
        </label>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Enter your secret paw-sword"
          className="min-w-[324px]"
        />
      </div>
      <Link
        href="/signup"
        className="block text-foreground  text-sm hover:underline"
      >
        Haven&apos;t created your account yet? Sign up
      </Link>
      <Button type="submit" className="w-full">
        Log in
      </Button>

      <FormMessage message={searchParams} />

      <div className="w-full max-w-[324px] ">
        <div className="relative">
          <hr className="border-white mb-8" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-secondary-foreground">
            o
          </span>
        </div>
        <Button
          onClick={githubLogin}
          type="button"
          className="w-full bg-transparent hover:bg-secondary text-foreground font-bold py-3 px-4 rounded-full border border-white mb-4 gap-2"
        >
          <span>
            <GithubIcon />
          </span>
          Log in with Github
        </Button>
      </div>
    </form>
  );
}
