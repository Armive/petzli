import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Camera,
  MessageCircle,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PetzliSocialLanding() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <div className="mx-auto max-w-7xl">
          {/* Main Hero */}
          <div className="space-y-12 py-20 text-center">
            <div className="space-y-8">
              {/* Badge */}
              <Badge className="bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">
                  WELCOME TO THE FUTURE OF PET SOCIAL
                </span>
              </Badge>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-foreground text-6xl leading-[0.85] font-black tracking-tighter md:text-8xl lg:text-9xl">
                  THE SOCIAL
                  <br />
                  NETWORK
                  <br />
                  <span className="relative inline-block">FOR PETS</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-foreground/70 mx-auto max-w-3xl text-xl leading-relaxed font-medium md:text-2xl">
                Where every paw print tells a story. Connect, share, and
                celebrate the unconditional love of pets.
              </p>
            </div>

            {/* CTA Section */}
            <div className="space-y-8">
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-foreground hover:bg-background hover:border-foreground hover:text-foreground text-background rounded-full border-2 border-transparent px-12 py-6 text-lg font-bold shadow-lg"
                  >
                    Join the Pack
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-foreground text-foreground hover:text-background hover:bg-foreground rounded-full border-2 bg-transparent px-12 py-6 text-lg font-bold duration-200"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="fill-foreground text-foreground h-4 w-4"
                      />
                    ))}
                  </div>
                  <span className="text-foreground font-semibold">
                    5.0 Rating
                  </span>
                </div>
                <div className="bg-foreground/20 h-4 w-px"></div>
                <div className="text-foreground font-semibold">
                  50K+ Happy Pet Parents
                </div>
                <div className="bg-foreground/20 h-4 w-px"></div>
                <div className="text-foreground font-semibold">
                  1M+ Pet Photos Shared
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative py-20">
            <div className="relative mx-auto max-w-4xl">
              {/* Main Image Container */}
              <div className="bg-foreground relative rounded-3xl p-2 shadow-2xl">
                <div className="bg-background rounded-2xl p-8">
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-black/5">
                    <Image
                      className="h-full w-full rounded-xl object-cover"
                      src="/dog1-ghibli.png"
                      alt="Pet social network interface"
                      height={400}
                      width={700}
                    />
                    {/* Overlay Elements */}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-8 -left-8 rotate-[-8deg] rounded-2xl border-2 border-black bg-white p-4 shadow-xl duration-300 hover:rotate-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">
                      Share Moments
                    </div>
                    <div className="text-xs text-black/60">
                      Capture memories
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 rotate-[8deg] rounded-2xl border-2 border-white bg-black p-4 text-white shadow-xl transition-transform duration-300 hover:rotate-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    <MessageCircle className="h-4 w-4 text-black" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Connect</div>
                    <div className="text-xs text-white/60">Find friends</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-2xl border-2 border-black bg-white p-4 shadow-xl transition-transform duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-black">
                      Community
                    </div>
                    <div className="text-xs text-black/60">Join the pack</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-20">
            <div className="mb-16 text-center">
              <h2 className="text-foreground mb-4 text-4xl font-black tracking-tight md:text-5xl">
                Everything Your Pet Needs
              </h2>
              <p className="text-foreground/70 mx-auto max-w-2xl text-xl">
                Built by pet lovers, for pet lovers. Every feature designed with
                your furry friend in mind.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="group hover:bg-foreground hover:text-background cursor-pointer space-y-6 rounded-3xl p-8 text-center transition-all duration-300">
                <div className="group-hover:bg-background bg-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300">
                  <Users className="group-hover:text-foreground text-background h-8 w-8 transition-colors duration-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">
                    Connect
                  </h3>
                  <p className="text-lg leading-relaxed opacity-70">
                    Find pet parents nearby and build meaningful friendships
                    through shared experiences.
                  </p>
                </div>
              </div>

              <div className="group hover:bg-foreground hover:text-background cursor-pointer space-y-6 rounded-3xl p-8 text-center transition-all duration-300">
                <div className="group-hover:bg-background bg-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300">
                  <Camera className="group-hover:text-foreground text-background h-8 w-8 transition-colors duration-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">Share</h3>
                  <p className="text-lg leading-relaxed opacity-70">
                    Document every precious moment and milestone in your
                    pet&apos;s incredible journey.
                  </p>
                </div>
              </div>

              <div className="group hover:bg-foreground hover:text-background cursor-pointer space-y-6 rounded-3xl p-8 text-center transition-all duration-300">
                <div className="group-hover:bg-background bg-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300">
                  <Heart className="group-hover:text-foreground text-background h-8 w-8 transition-colors duration-300" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight">Care</h3>
                  <p className="text-lg leading-relaxed opacity-70">
                    Get expert advice and emotional support from our loving pet
                    community.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="py-20 text-center">
            <div className="space-y-8">
              <h2 className="text-foreground text-4xl font-black tracking-tight md:text-6xl">
                Ready to Join?
              </h2>
              <p className="text-foreground/70 mx-auto max-w-2xl text-xl">
                Your pet&apos;s social life is about to get a whole lot better.
              </p>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="hover:bg-background bg-foreground text-background hover:border-foreground hover:text-foreground rounded-full border-4 px-16 py-8 text-xl font-bold shadow-xl transition-all duration-200 hover:shadow-2xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
