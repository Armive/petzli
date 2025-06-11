"use server";
import { redirect } from "next/navigation";

export async function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  console.log(
    `Redirecting to ${path} with type ${type} and message: ${message}`
  );

  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}
