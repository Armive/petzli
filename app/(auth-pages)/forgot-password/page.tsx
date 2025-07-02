import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form
        className="text-foreground mx-auto flex w-full max-w-64 min-w-64 flex-1 flex-col gap-2 [&>input]:mb-6"
        action={forgotPasswordAction}
      >
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-secondary-foreground text-sm">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Button>Sent reset link</Button>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
