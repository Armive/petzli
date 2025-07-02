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
      className="flex w-full min-w-[324px] flex-col items-center justify-center space-y-4"
      action={signInAction}
    >
      <CatIcon className="h-[50px] w-[50px]" />
      <div className="mb-8 flex flex-col items-center">
        <h1 className="text-center text-3xl font-bold">
          Sniff around
          <br />
          your furry feed.
        </h1>
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm">
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
        <label htmlFor="email" className="mb-2 block text-sm">
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
        className="text-foreground block text-sm hover:underline"
      >
        Haven&apos;t created your account yet? Sign up
      </Link>
      <Button type="submit" className="w-full">
        Log in
      </Button>

      <FormMessage message={searchParams} />

      <div className="w-full max-w-[324px]">
        <div className="relative">
          <hr className="mb-8 border-white" />
          <span className="bg-background text-secondary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-4 text-sm">
            o
          </span>
        </div>
        <Button
          onClick={githubLogin}
          type="button"
          className="hover:bg-secondary text-foreground mb-4 w-full gap-2 rounded-full border border-white bg-transparent px-4 py-3 font-bold"
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
