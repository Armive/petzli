"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

// Form validation schemas
const petOwnerSchema = z.object({
  user_name: z
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
  user_name: z
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
  const user_name = formData.get("user_name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Basic validation
  if (!email || !password || !user_name || !userType) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "All required fields must be filled",
    );
  }

  // Prepare data object based on user type
  const userData: {
    user_name: string;
    email: string;
    password: string;
    userType: "no-pet" | "pet-owner";
    petName?: string;
    petGender?: string;
    petAge?: number;
  } = {
    user_name,
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
  } catch (validationError: unknown) {
    if (validationError instanceof z.ZodError) {
      const errorMessage = validationError.issues
        .map((e) => e.message)
        .join(", ");
      return encodedRedirect("error", "/sign-up", errorMessage);
    }
  }

  // Check if username already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("user_name")
    .eq("user_name", user_name)
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
        user_name,
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
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(60, "Email cannot exceed 60 characters")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot exceed 30 characters"),
});

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = signInSchema.safeParse({ email, password });
  if (!result.success) {
    return encodedRedirect("error", "/sign-in", "Password or email invalid");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(result.data);

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

const createPostSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional(),
  file: z
    .instanceof(File)
    .refine((f) => f.size > 0, "Please upload a file")
    .refine((f) => f.size < 5 * 1024 * 1024, "File size must be under 5MB")
    .refine((f) => f.type.startsWith("image/"), "File must be an image"),
});

export const createPostAction = async (
  formData: FormData,
): Promise<{ success: boolean; error?: unknown }> => {
  const supabase = await createClient();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString() || "";
  const location = formData.get("location")?.toString() || "";
  const file = formData.get("file") as File | null;

  const result = createPostSchema.safeParse({
    title,
    description,
    location,
    file,
  });
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const ext = file?.name.split(".").pop();
  const filePath = `images/${crypto.randomUUID()}.${ext}`;
  const { data: storage_data, error: storage_error } = await supabase.storage
    .from("posts")
    .upload(filePath, file!);

  if (storage_error) {
    return { success: false, error: storage_error };
  }
  const authUser = await supabase.auth.getUser();

  const { error } = await supabase.from("posts").insert({
    title: result.data.title,
    description: result.data.description,
    location: result.data.location,
    image: storage_data.id,
    author_id: authUser.data.user?.id,
  });
  const success = !error;
  return { success, error };
};
