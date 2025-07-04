"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

// Form validation schemas
const petOwnerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(60, "Email cannot exceed 60 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot exceed 30 characters"),
  petName: z.string().min(1, "Pet name is required"),
  petGender: z.enum(["male", "female"]),
  petAge: z.coerce
    .number()
    .positive("Age must be a positive number")
    .max(40, "Pet age cannot exceed 40 years")
    .min(0, "Pet age cannot be negative"),
  userType: z.literal("pet-owner"),
});

const nonPetOwnerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(60, "Email cannot exceed 60 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot exceed 30 characters"),
  userType: z.literal("no-pet"),
});

const registrationSchema = z.discriminatedUnion("userType", [
  petOwnerSchema,
  nonPetOwnerSchema,
]);

export const registerUserAction = async (formData: FormData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  // Extract form data
  const userType = formData.get("userType")?.toString() as
    | "pet-owner"
    | "no-pet";
  const username = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Basic validation
  if (!email || !password || !username || !userType) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All required fields must be filled",
    );
  }

  // Prepare data object based on user type
  const userData: {
    username: string;
    email: string;
    password: string;
    userType: "no-pet" | "pet-owner";
    petName?: string;
    petGender?: string;
    petAge?: number;
  } = {
    username,
    email,
    password,
    userType,
  };

  // Add pet data if user is a pet owner
  if (userType === "pet-owner") {
    const petName = formData.get("petName")?.toString();
    const petGender = formData.get("petGender")?.toString();
    const petAge = formData.get("petAge")?.toString();

    if (!petName || !petGender || !petAge) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "All pet information is required",
      );
    }

    userData.petName = petName;
    userData.petGender = petGender;
    userData.petAge = Number.parseInt(petAge);
  }

  // Validate data with Zod
  try {
    registrationSchema.parse(userData);
  } catch (validationError) {
    if (validationError instanceof z.ZodError) {
      const errorMessage = validationError.errors
        .map((e) => e.message)
        .join(", ");
      return encodedRedirect("error", "/sign-up", errorMessage);
    }
  }

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (existingUser) {
    return encodedRedirect("error", "/sign-up", "Username already exists");
  }

  // Create auth user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username,
        user_type: userType,
        pet_name: userData.petName,
        pet_age: userData.petAge,
        pet_gender: userData.petGender,
      },
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  // If pet owner, create pet profile

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const githubLogin = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });
  if (data.url) {
    redirect(data.url);
  }
};
