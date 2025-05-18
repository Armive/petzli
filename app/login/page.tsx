import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CatIcon } from "lucide-react";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="flex flex-col items-center mb-8">
        <CatIcon className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-center">
          Log in to see
          <br />
          furry animals.
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
            placeholder="Example: furry.pet@gmail.com"
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
        <Button className="w-full bg-transparent hover:bg-secondary text-foreground font-bold py-3 px-4 rounded-full border border-gray-700 mb-4 gap-2">
          Log in with Github
        </Button>
      </div>
    </div>
  );
};

export default Login;
