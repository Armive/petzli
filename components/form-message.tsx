import { Info } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-2 text-sm">
      {"success" in message && (
        <div className="text-foreground px-4">{message.success}</div>
      )}
      {"error" in message && (
        <div className="text-md flex items-center gap-2 px-4 font-normal text-red-700/80">
          <Info />
          {message.error[0].toUpperCase() + message.error.slice(1)}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4">{message.message}</div>
      )}
    </div>
  );
}
