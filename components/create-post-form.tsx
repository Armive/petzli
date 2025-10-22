"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { createPostAction } from "@/app/actions";
import clsx from "clsx";
import Link from "next/link";

export function CreatePostForm() {
  const [dragActive, setDragActive] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
    const files = e.dataTransfer.files;
    const lastFile = files[files.length - 1];
    if (!lastFile.type.startsWith("image/")) return;
    const url = URL.createObjectURL(lastFile);
    setFileUrl(url);
    setFile(lastFile);
  };
  useEffect(() => {
    console.log(success);
  }, [success]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <form
        className={clsx("grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]", {
          hidden: success,
        })}
        onSubmit={async (e) => {
          e.preventDefault();
          setDisabled(true);
          const formData = new FormData(e.currentTarget);
          if (file) {
            formData.append("file", file);
            const { success } = await createPostAction(formData);
            if (success) {
              setSuccess(true);
            } else {
              setSuccess(false);
            }
            setDisabled(false);
          }
        }}
      >
        {/* Left side - File upload */}
        <input
          type="file"
          className="hidden"
          id="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            const lastFile = files[files.length - 1];

            if (!lastFile.type.startsWith("image/")) return;
            setFile(lastFile);
            const url = URL.createObjectURL(lastFile);
            setFileUrl(url);
          }}
        />
        <label
          htmlFor="file"
          className={`relative cursor-pointer rounded-2xl border-2 p-8 text-center shadow-sm transition-all duration-200 hover:shadow-md ${
            dragActive
              ? "border-foreground bg-background scale-[1.03]"
              : "border-foreground bg-background"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex min-h-[320px] flex-col items-center justify-center space-y-5">
            {fileUrl ? (
              <Image
                src={fileUrl}
                alt="image"
                height={400}
                width={400}
                className="rounded-2xl"
              />
            ) : (
              <>
                <div className="bg-background border-foreground flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm">
                  <ArrowUp className="text-foreground h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-foreground text-base font-semibold">
                    Choose a file or drag and
                  </p>
                  <p className="text-foreground text-base font-semibold">
                    drop it here
                  </p>
                </div>
                <div className="text-foreground max-w-xs px-4 text-sm leading-relaxed font-medium">
                  It is recommended to use{" "}
                  <span className="text-foreground font-semibold">.jpg</span>{" "}
                  high-quality files under{" "}
                  <span className="text-foreground font-semibold">20 MB</span>{" "}
                  or <span className="text-foreground font-semibold">.mp4</span>{" "}
                  files under{" "}
                  <span className="text-foreground font-semibold">200 MB</span>.
                </div>
              </>
            )}
          </div>
        </label>

        {/* Right side - Form fields */}
        <div className="space-y-5 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Title
            </Label>
            <Input
              minLength={5}
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              name="title"
              placeholder="A cute dog in a birthday hat"
              className="hover:border-foreground border-border rounded-xl border-2 text-sm shadow-sm transition-all duration-200 focus:border-black focus:shadow-md"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-foreground text-sm font-semibold"
            >
              Description (optional)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              id="description"
              placeholder="This dog likes"
              name="description"
              className="hover:border-foreground border-border bg-background min-h-[100px] resize-none rounded-xl border-2 px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-black focus:shadow-md"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="place" className="text-sm font-semibold">
              Location (optional)
            </Label>
            <Input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              max={100}
              id="place"
              name="place"
              placeholder="Barcelona, Spain"
              className="hover:border-foreground border-border rounded-xl border-2 px-4 py-3 text-sm shadow-sm transition-all duration-200 focus:border-black focus:shadow-md"
            />
          </div>
          <Button className="cursor-pointer" disabled={disabled}>
            Create Post
          </Button>
        </div>
      </form>
      <div
        className={clsx(
          "from--900 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br via-black to-gray-400 px-4 text-white transition-all duration-500",
          { hidden: !success },
        )}
      >
        <div className="border-foreground bg-background transform rounded-2xl border p-8 text-center shadow-2xl backdrop-blur-lg transition-transform duration-300 hover:scale-[1.01]">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            🎉 Post created successfully!
          </h1>

          <p className="text-foreground mb-6">
            Your post has been created and is now live.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setSuccess(null);
                setFile(null);
                setFileUrl(null);
                setTitle("");
                setDescription("");
                setPlace("");
              }}
              className="bg-background hover:bg-foreground hover:text-background rounded-xl border border-white px-5 py-2 font-medium text-white shadow-md transition-transform hover:scale-105"
            >
              Create Another Post
            </button>

            <Link href="/" passHref>
              <button className="hover:bg-background hover:border-foreground hover:text-foreground text-background bg-foreground rounded-xl px-5 py-2 font-medium shadow-md transition-transform hover:scale-105 hover:border">
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
