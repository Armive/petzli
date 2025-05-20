import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/server";
import { CatIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const Login = () => {
  async function githubLogin() {
    "use server";
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (data.url) {
      redirect(data.url); // use the redirect API for your server framework
    }
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <CatIcon className="w-[50px] h-[50px]" />
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-center">
          Sniff around
          <br />
          your furry feed.
        </h1>
      </div>
      <form className="w-full max-w-[324px] space-y-4 ">
        <div>
          <label htmlFor="email" className="block text-sm mb-2">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Example: whiskers@meowmail.com"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your secret paw-sword"
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
      </form>
      <div className="w-full max-w-[324px] mt-4">
        <div className="relative">
          <hr className="border-gray-700 my-8" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-secondary-foreground">
            o
          </span>
        </div>
        <Button
          onClick={githubLogin}
          className="w-full bg-transparent hover:bg-secondary text-foreground font-bold py-3 px-4 rounded-full border border-gray-700 mb-4 gap-2"
        >
          Log in with Github
        </Button>
      </div>
    </div>
  );
};

export default Login;
