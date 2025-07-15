import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="flex justify-center w-full">

    <nav className="w-full px-6 py-8 flex items-center justify-between max-w-2xl ">
        <Link href="/">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-foreground flex h-10 w-10 items-center justify-center rounded-full">
                <Heart className="fill-background h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-white">
                <div className="h-1.5 w-1.5 rounded-full bg-black"></div>
              </div>
            </div>
            <span className="text-foreground text-2xl font-black tracking-tight">
              Petzli
            </span>
          </div>
        </Link>
        <Link href="/sign-in">
          <Button
            variant="outline"
            className="border-foreground text-foreground hover:bg-foreground hover:text-background border-2 bg-transparent px-6 font-semibold"
          >
            Login
          </Button>
        </Link>
    </nav>
    </header>
  );
};
