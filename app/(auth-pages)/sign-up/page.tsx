"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Cat,
  ArrowLeft,
  Github,
  CheckCircle,
  XCircle,
  User,
  Rabbit,
  PawPrint,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { registerUserAction } from "@/app/actions";
import { githubLogin } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type UserType = "pet-owner" | "no-pet" | null;

interface UserFormData {
  userType: UserType;
  user_name: string;
  email: string;
  password: string;
  petName?: string;
  petGender?: string;
  petAge?: string;
}

export default function SignUp() {
  const [userData, setUserData] = useState<UserFormData>({
    userType: null,
    user_name: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Username availability checking
  const [user_name, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (step === 3 && searchParams.has("success")) {
      setStep(4);
    }
  }, [searchParams, step]);

  useEffect(() => {
    const isValid = /^[a-zA-Z0-9_]{3,30}$/.test(user_name);
    if (!isValid || user_name.length < 3) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    // Simulate API call for user_name checking
    const timeoutId = setTimeout(() => {
      // Mock availability check - in real app, this would be an API call
      const unavailableUsernames = [
        "admin",
        "test",
        "user",
        "pet",
        "cat",
        "dog",
      ];
      setIsAvailable(!unavailableUsernames.includes(user_name.toLowerCase()));
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [user_name]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const submitForm = (formData: FormData) => {
    setIsSubmitting(true);
    registerUserAction(formData)
      .then(() => {
        console.log("Form submitted successfully");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  // Fix for "Argument of type 'FormData' is not assignable to parameter of type 'FormData'"
  // This happens if there are multiple global FormData definitions (e.g., Node.js vs browser).
  // To ensure the FormData instance is compatible, cast it as any.
  // Alternatively, you can update the registerUserAction signature to accept 'any' or 'unknown'.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(e.target as HTMLFormElement);

    // Update userData with form data
    const newData: UserFormData = { ...userData };
    if (step === 1) {
      newData.userType = formData.get("userType") as UserType;
    } else if (step === 2) {
      newData.user_name = formData.get("user_name") as string;
      newData.email = formData.get("email") as string;
      newData.password = formData.get("password") as string;
    } else if (step === 3 && userData.userType === "pet-owner") {
      newData.petName = formData.get("petName") as string;
      newData.petGender = formData.get("petGender") as string;
      newData.petAge = formData.get("petAge") as string;
    }

    if (step < 2 || (step === 2 && userData.userType === "no-pet")) {
      handleNext();
    } else if (step === 2 && userData.userType === "pet-owner") {
      handleNext();
    } else {
      // Final submission
      setIsSubmitting(true);

      const submitFormData = new FormData();
      submitFormData.append("userType", newData.userType!);
      submitFormData.append("user_name", newData.user_name);
      submitFormData.append("email", newData.email);
      submitFormData.append("password", newData.password);

      if (newData.userType === "pet-owner") {
        submitFormData.append("petName", newData.petName ?? "");
        submitFormData.append("petGender", newData.petGender ?? "");
        submitFormData.append("petAge", newData.petAge ?? "");
      }
      submitForm(submitFormData);
    }
  };

  const canProceedFromStep = (): boolean => {
    switch (step) {
      case 1:
        return userData.userType !== null;
      case 2:
        return (
          userData.email.includes("@") &&
          userData.email.length >= 1 &&
          userData.email.length <= 60 &&
          userData.password.length >= 8 &&
          userData.password.length <= 30 &&
          userData.user_name.length >= 3 &&
          userData.user_name.length <= 30 &&
          isAvailable === true
        );
      case 3:
        return (
          userData.userType === "no-pet" ||
          ((userData.petName ?? "").length > 0 &&
            Number(userData.petAge) >= 0 &&
            (userData.petGender ?? "").length > 0)
        );
      default:
        return true;
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center text-black">
      <Cat className="text-foreground mb-8 h-16 w-16" />
      <h1 className="text-foreground mb-8 max-w-[400px] text-center text-4xl font-bold">
        Sign up to see furry animals.
      </h1>

      {/* Alert Messages */}

      <div className="w-full max-w-[400px] space-y-4">
        {step < 4 && step > 1 && (
          <Button
            onClick={handleBack}
            className="dark:text-foreground"
            variant="link"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}

        <div className="space-y-4">
          {/* Step 1: User Type Selection */}
          {step === 1 && (
            <>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose how you&apos;d like to use our platform
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-300 bg-gradient-to-bl from-violet-600 to-pink-800 p-[2px] transition-all">
                    <button
                      type="button"
                      onClick={() =>
                        setUserData({ ...userData, userType: "pet-owner" })
                      }
                      className={`bg-background w-full cursor-pointer rounded-lg p-4 transition-all duration-200 ${userData.userType === "pet-owner" ? "bg-gray-800/50" : ""}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e0e0] shadow-[20px_20px_60px_#000,-20px_-20px_60px_#000]">
                          <PawPrint className="h-5 w-5 text-black" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-foreground font-medium">
                            I have a pet
                          </h3>
                          <p
                            className={`text-sm ${userData.userType === "pet-owner" ? "text-gray-200" : "text-gray-600"} dark:text-gray-400`}
                          >
                            Share your pet&apos;s moments
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="rounded-lg bg-gray-300 bg-gradient-to-bl from-violet-600 to-pink-800 p-[2px] transition-all duration-300">
                    <button
                      type="button"
                      onClick={() =>
                        setUserData({ ...userData, userType: "no-pet" })
                      }
                      className={`bg-background w-full cursor-pointer rounded-lg p-4 transition-all duration-200 ${userData.userType === "no-pet" ? "bg-gray-800/50" : ""}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e0e0e0] shadow-[20px_20px_60px_#000,-20px_-20px_60px_#000]">
                          <User className="h-5 w-5 text-black" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-foreground font-medium">
                            I&apos;m a pet lover
                          </h3>
                          <p
                            className={`text-sm ${userData.userType === "no-pet" ? "text-gray-200" : "text-gray-600"} dark:text-gray-400`}
                          >
                            Connect with pets and owners
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!userData.userType}
                  className="bg-black hover:bg-white hover:text-black disabled:opacity-50 dark:bg-white dark:text-black hover:dark:bg-black hover:dark:text-white"
                >
                  Next Step
                </Button>
              </form>
            </>
          )}

          {/* Step 2: Account Information */}
          {step === 2 && (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="text-foreground mb-2 block text-sm"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Example: furry.pet@gmail.com"
                  className="text-foreground w-full rounded-sm border-black outline-none focus-visible:outline-none dark:border-white dark:text-white"
                  required
                  name="email"
                  minLength={1}
                  maxLength={60}
                  defaultValue={userData.email}
                  autoComplete="off"
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-foreground mb-2 block text-sm"
                >
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Don't forget pas-sword"
                  name="password"
                  className="text-foreground w-full rounded-sm border-black outline-none focus-visible:outline-none dark:border-white dark:text-white"
                  required
                  minLength={8}
                  maxLength={30}
                  defaultValue={userData.password}
                  autoComplete="off"
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="user_name"
                  className="mb-2 block text-sm dark:text-white"
                >
                  Your Username
                </label>
                <div className="relative flex flex-col">
                  <Input
                    type="text"
                    value={user_name}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      setUsername(value);
                      setUserData({ ...userData, user_name: value });
                    }}
                    placeholder="Choose the furry little paw user_name"
                    className="text-foreground w-full rounded-sm border-black pr-10 dark:border-white"
                    required
                    name="user_name"
                    autoComplete="off"
                    minLength={3}
                    maxLength={30}
                  />
                  {user_name.length > 0 && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {isChecking ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-blue-500" />
                      ) : isAvailable ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {user_name.length > 0 && !isChecking && (
                  <p
                    className={`text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}
                  >
                    {isAvailable
                      ? "This user_name is available!"
                      : user_name.length >= 3
                        ? "This user_name is not available or invalid."
                        : "Username must be at least 3 characters."}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3-30 characters, use A-Z, 0-9, or _ only.
                </p>
              </div>

              <Button
                disabled={!canProceedFromStep()}
                type="submit"
                className="bg-black hover:bg-white hover:text-black disabled:opacity-50 dark:bg-white dark:text-black hover:dark:bg-black hover:dark:text-white"
              >
                Next Step
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {userData.userType === "pet-owner" ? (
                <>
                  <div className="mb-4 text-center">
                    <h2 className="text-foreground text-lg font-medium">
                      Tell us about your pet
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help us create a profile for your furry friend
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="petName"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Pet&apos;s Name
                    </label>
                    <Input
                      type="text"
                      placeholder="What's your pet's name?"
                      className="text-foreground w-full rounded border-black focus:outline-none dark:border-white"
                      required
                      name="petName"
                      defaultValue={userData.petName}
                      minLength={3}
                      maxLength={60}
                      autoComplete="off"
                      onChange={(e) =>
                        setUserData({ ...userData, petName: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="petGender"
                      className="text-foreground mb-2 block text-sm dark:text-white"
                    >
                      Pet&apos;s Gender
                    </label>
                    <Select
                      name="petGender"
                      defaultValue={userData.petGender}
                      onValueChange={(v) => {
                        setUserData({ ...userData, petGender: v });
                      }}
                      required
                    >
                      <SelectTrigger className="text-foreground placeholder:text-foreground h-[38px] w-full rounded-[4px] border border-black bg-white px-3 text-[14px] shadow-sm focus:outline-none dark:border-white">
                        <SelectValue placeholder="Choose your pet's gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="dark:text-white">
                          Male
                        </SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="petAge"
                      className="mb-2 block text-sm dark:text-white"
                    >
                      Pet&apos;s Age
                    </label>
                    <Input
                      type="number"
                      placeholder="How old is your pet?"
                      className="text-foreground w-full rounded border-black focus-visible:outline-none dark:border-white"
                      required
                      name="petAge"
                      min={0}
                      max={40}
                      defaultValue={userData.petAge}
                      autoComplete="off"
                      onChange={(e) =>
                        setUserData({ ...userData, petAge: e.target.value })
                      }
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter age in years
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-foreground mb-2 text-lg font-medium">
                    Ready to join!
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You&apos;re all set to start connecting with pets and their
                    owners.
                  </p>
                </div>
              )}

              <Button
                disabled={!canProceedFromStep() || isSubmitting}
                type="submit"
                className="bg-black hover:bg-white hover:text-black disabled:opacity-50 dark:bg-white dark:text-black hover:dark:bg-black hover:dark:text-white"
              >
                {isSubmitting ? "Creating Account..." : "Finish"}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div>
              <CardHeader className="mb-4 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <h2 className="text-foreground text-xl font-medium">
                  Account Created!
                </h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  We have sent an account verification email to{" "}
                  <span className="font-bold">{userData.email}</span>
                </p>
              </CardContent>
            </div>
          )}

          {/* GitHub OAuth - only on first step */}
          {step === 1 && (
            <>
              <div className="relative">
                <hr className="my-6 border-gray-300" />
                <span className="bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform px-2 text-sm text-gray-500">
                  or
                </span>
              </div>
              <form action={githubLogin}>
                <div className="relative">
                  <Button className="group relative w-full cursor-pointer overflow-hidden border-0 bg-black font-semibold text-white shadow-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-black/90 hover:shadow-2xl">
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <Github className="scale-90 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />

                      <span>Continue with GitHub</span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </Button>
                  <Badge className="absolute -top-2 -right-2 border border-black/20 bg-white text-black">
                    <Rabbit className="mr-1 h-3 w-3" />
                    Faster
                  </Badge>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {step < 4 && (
        <Link
          href="/sign-in"
          className="text-foreground mt-8 text-sm hover:underline"
        >
          Already have an account? Log in
        </Link>
      )}
    </div>
  );
}
