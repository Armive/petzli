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
  PawPrint,
  User,
  Shield,
  Rabbit,
  MoveRight,
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

interface FormData {
  userType: UserType;
  username: string;
  email: string;
  password: string;
  petName?: string;
  petGender?: string;
  petAge?: string;
}

export default function SignUp() {
  const [userData, setUserData] = useState<FormData>({
    userType: null,
    username: "",
    email: "",
    password: "",
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Username availability checking
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (step === 3 && searchParams.has("success")) {
      setStep(4);
    }
  }, [searchParams, step]);

  useEffect(() => {
    const isValid = /^[a-zA-Z0-9_]{3,30}$/.test(username);
    if (!isValid || username.length < 3) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    // Simulate API call for username checking
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
      setIsAvailable(!unavailableUsernames.includes(username.toLowerCase()));
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const submitForm = (formData: FormData) => {
    setIsSubmitting(true);
    registerUserAction(formData as unknown as FormData)
      .then(() => {
        console.log("Form submitted successfully");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    const formData = new FormData(e.target as HTMLFormElement);

    // Update userData with form data
    const newData: FormData = { ...userData };
    for (const [key, value] of formData.entries()) {
      if (key in newData) {
        newData[key as keyof FormData] = value as keyof FormData;
      }
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
      submitFormData.append("username", newData.username);
      submitFormData.append("email", newData.email);
      submitFormData.append("password", newData.password);

      if (newData.userType === "pet-owner") {
        submitFormData.append("petName", newData.petName ?? "");
        submitFormData.append("petGender", newData.petGender ?? "");
        submitFormData.append("petAge", newData.petAge ?? "");
      }
      submitForm(submitFormData as unknown as FormData);
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
          userData.username.length >= 3 &&
          userData.username.length <= 30 &&
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-black p-4">
      <Cat className="w-16 h-16 mb-8 text-foreground" />
      <h1 className="text-4xl text-foreground font-bold text-center mb-8 max-w-[400px]">
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
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose how you&apos;d like to use our platform
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setUserData({ ...userData, userType: "pet-owner" })
                  }
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    userData.userType === "pet-owner"
                      ? "border-black bg-black/5 dark:border-white dark:bg-white/5"
                      : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-black rounded-full flex items-center justify-center">
                      <PawPrint className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
                        It&apos;s for my pet
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show off your pet&apos;s best moments
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setUserData({ ...userData, userType: "no-pet" })
                  }
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    userData.userType === "no-pet"
                      ? "border-black bg-black/5 dark:border-white dark:bg-white/5"
                      : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-black rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-foreground">
                        I love pets
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Explore pets and meet their humans
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <Button
                type="submit"
                disabled={!userData.userType}
                className="dark:text-black dark:bg-white hover:dark:bg-black hover:dark:text-white bg-black hover:bg-white hover:text-black disabled:opacity-50 gap-2"
              >
                Start
                <span>
                  <MoveRight />
                </span>
              </Button>
            </form>
          )}

          {/* Step 2: Account Information */}
          {step === 2 && (
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-foreground text-sm mb-2"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="Example: furry.pet@gmail.com"
                  className="w-full rounded-lg dark:text-white text-foreground "
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
                  className="block text-foreground text-sm mb-2"
                >
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Don't forget pas-sword"
                  name="password"
                  className="w-full border-border rounded dark:text-white text-foreground"
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
                  htmlFor="username"
                  className="block text-sm mb-2 dark:text-white"
                >
                  Your Username
                </label>
                <div className="relative flex flex-col">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\s/g, "");
                      setUsername(value);
                      setUserData({ ...userData, username: value });
                    }}
                    placeholder="Choose the furry little paw username"
                    className="w-full border-gray-300 rounded pr-10 text-foreground"
                    required
                    name="username"
                    autoComplete="off"
                    minLength={3}
                    maxLength={30}
                  />
                  {username.length > 0 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {isChecking ? (
                        <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin" />
                      ) : isAvailable ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {username.length > 0 && !isChecking && (
                  <p
                    className={`text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}
                  >
                    {isAvailable
                      ? "This username is available!"
                      : username.length >= 3
                        ? "This username is not available or invalid."
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
                className="dark:text-black dark:bg-white hover:dark:bg-black hover:dark:text-white bg-black hover:bg-white hover:text-black disabled:opacity-50"
              >
                Next Step
              </Button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {userData.userType === "pet-owner" ? (
                <>
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-medium text-foreground">
                      Tell us about your pet
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Help us create a profile for your furry friend
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="petName"
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Pet&apos;s Name
                    </label>
                    <Input
                      type="text"
                      placeholder="What's your pet's name?"
                      className="w-full border-gray-300 rounded text-foreground focus:outline-none"
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
                      className="block text-sm mb-2 dark:text-white text-foreground"
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
                      <SelectTrigger className="w-full h-[38px] px-3  border dark:border-white rounded-[4px] shadow-sm text-foreground placeholder:text-foreground text-[14px] focus:outline-none ">
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
                      className="block text-sm mb-2 dark:text-white"
                    >
                      Pet&apos;s Age
                    </label>
                    <Input
                      type="number"
                      placeholder="How old is your pet?"
                      className="w-full border-gray-300 rounded text-foreground focus-visible:outline-none"
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
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground mb-2">
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
                className="dark:text-black dark:bg-white hover:dark:bg-black hover:dark:text-white bg-black hover:bg-white hover:text-black disabled:opacity-50"
              >
                {isSubmitting ? "Creating Account..." : "Finish"}
              </Button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div>
              <CardHeader className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="flex justify-center flex-col items-center gap-4">
                <h2 className="text-xl font-medium text-foreground">
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
                <hr className="border-gray-300 my-6" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-sm text-gray-500">
                  or
                </span>
              </div>
              <form action={githubLogin}>
                <div className="relative">
                  <Button className="group relative w-full  bg-black hover:bg-black/90 text-white border-0 font-semibold transition-all duration-300 ease-out overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer">
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      <Github className="transition-all duration-300 scale-90 group-hover:scale-110 group-hover:rotate-6" />

                      <span>Continue with GitHub</span>
                    </div>
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                  </Button>
                  <Badge className="absolute -top-2 -right-2 bg-white text-black border border-black/20">
                    <Rabbit className="w-3 h-3 mr-1" />
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
          className="mt-8 text-foreground text-sm hover:underline"
        >
          Already have an account? Log in
        </Link>
      )}
    </div>
  );
}
