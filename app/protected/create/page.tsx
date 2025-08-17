import { Card, CardContent } from "@/components/ui/card";
import CreatePostForm from "@/components/create-post-form";

export default function Page() {
  return (
    <main className="bg-background text-foreground-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        </header>

        <Card className="bg-background text-foreground border-none">
          <CardContent className="pt-6">
            <CreatePostForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
