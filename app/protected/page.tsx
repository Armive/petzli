import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase.from("posts").select(`
    *,
    profiles(
      user_name,
      avatar_url
    )
  `);

  return (
    <div>
      {posts?.map((post) => {
        const imageUrl = supabase.storage
          .from("posts")
          .getPublicUrl(post.image);
        console.log("imageUrl", imageUrl);
        return (
          <div
            className="flex min-h-screen items-center justify-center bg-black p-8"
            key={post.id}
          >
            {/* Instagram Post Container */}
            <div className="w-full max-w-[470px] bg-black">
              {/* Post Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-black">
                      {post.profiles.avatar_url ? (
                        <Image
                          src={post.profiles.avatar_url}
                          alt="User Avatar"
                          width={26}
                          height={26}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-[26px] w-[26px] rounded-full bg-linear-to-br from-orange-500 via-pink-500 to-purple-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {post.profiles.user_name}
                    </span>
                    <span className="text-sm text-zinc-500">• 1 sem</span>
                  </div>
                </div>
                <button className="text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="6" r="1.5" />
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="12" cy="18" r="1.5" />
                  </svg>
                </button>
              </div>

              {/* Post Image with Text Overlay */}
              <div className="relative aspect-square w-full bg-zinc-900">
                {/* Background Image */}
                <Image
                  src={imageUrl.data.publicUrl}
                  alt="Post Image"
                  fill
                  className="object-cover"
                />

                {/* Carousel Arrow */}
                <button className="absolute top-1/2 right-4 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg">
                  <svg
                    className="h-4 w-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Carousel Dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-4 py-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="transition-opacity hover:opacity-60">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button className="transition-opacity hover:opacity-60">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    <button className="transition-opacity hover:opacity-60">
                      <svg
                        className="h-7 w-7"
                        fill="none"
                        stroke="white"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                  <button className="transition-opacity hover:opacity-60">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Likes */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-white">
                    1.388 Me gusta
                  </span>
                </div>

                {/* Caption */}
                <div className="text-sm text-white">
                  <span className="font-semibold">your.username</span>{" "}
                  <span className="text-white">{post.title}</span>
                </div>

                {/* View Comments */}
                <button className="mt-2 text-sm text-zinc-500">
                  Ver los 24 comentarios
                </button>

                {/* Add Comment */}
                <div className="mt-3 flex items-center gap-3 border-t border-zinc-800 pt-3">
                  <div className="h-6 w-6 rounded-full bg-zinc-700" />
                  <input
                    type="text"
                    placeholder="Añade un comentario..."
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
