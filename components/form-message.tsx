import { Info } from "lucide-react";

export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm justify-center items-center ">
      {"success" in message && (
        <div className="text-foreground px-4">{message.success}</div>
      )}
      {"error" in message && (
        <div className="font-normal text-md px-4 text-red-700/80 flex  gap-2 items-center">
          <Info />
          {message.error[0].toUpperCase() + message.error.slice(1)}
        </div>
      )}
      {"message" in message && (
        <div className="text-foreground border-l-2 px-4 ">
          {message.message}
        </div>
      )}
    </div>
  );
}
