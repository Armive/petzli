import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CatIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center flex-col   gap-16  ">
      <section className="flex flex-col items-center gap-8 ">
        <CatIcon className="w-20 h-20 text-primary" />
        <h1 className="text-4xl sm:text-5xl font-bold text-center">
          Welcome to Petzli
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-xl">
          The social feed for pet lovers. Share your pet&apos;s adventures,
          connect with other owners, and discover a world of furry friends.
        </p>
        <div className="flex gap-4 ">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>
      <section className="flex flex-col items-center gap-6 ">
        <h2 className="text-2xl font-semibold">Why Petzli?</h2>
        <ul className="text-base text-muted-foreground flex flex-col gap-2">
          <li>🐾 Share photos and stories of your pets</li>
          <li>🐶 Connect with other pet owners</li>
          <li>🐱 Discover tips and tricks for pet care</li>
          <li>🦴 Safe, friendly, and fun community</li>
        </ul>
      </section>
    </div>
  );
}
