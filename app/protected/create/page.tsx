import { CardContent } from "@/components/ui/card";
import { CreatePostForm } from "@/components/create-post-form";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CardContent className="pt-6">
        <CreatePostForm />
      </CardContent>
    </div>
  );
}
