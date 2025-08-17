"use client";

import type * as React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { ImagePlus, MapPin, Loader2, Heading, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PostPreview = {
  title: string;
  location: string;
  imageUrl: string;
  imageName: string;
};

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<PostPreview | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const resetPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
  }, [previewUrl]);

  const handleFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) {
        toast("Unsupported file", {
          description: "Please upload an image file.",
        });
        return;
      }
      setFile(f);
      resetPreview();
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    },
    [resetPreview],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const useMyLocation = async () => {
    if (!("geolocation" in navigator)) {
      toast("Geolocation not available", {
        description: "Your browser does not support geolocation.",
      });
      return;
    }

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      setLocation(`${lat}, ${lng}`);
      toast("Location added", {
        description: `Using current coordinates: ${lat}, ${lng}`,
      });
    } catch {
      toast("Unable to get location", {
        description: "Please allow location access or enter it manually.",
      });
    }
  };

  const validate = (): string[] => {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Title is required.");
    if (!location.trim()) errors.push("Location is required.");
    if (!file) errors.push("An image is required.");
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(null);
    const errors = validate();
    if (errors.length) {
      toast("Please fix the following errors", {
        description: errors.join(" "),
      });
      return;
    }

    setSubmitting(true);
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 800));
    setSubmitting(false);

    setSubmitted({
      title: title.trim(),
      location: location.trim(),
      imageUrl: previewUrl,
      imageName: file ? file.name : "image",
    });

    toast("Post created", {
      description: "This demo shows your submission below.",
    });
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="space-y-6"
        aria-describedby="form-status"
      >
        <div className="grid gap-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="text-foreground flex items-center gap-2"
            >
              <Heading className="h-4 w-4" aria-hidden="true" />
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A crisp, descriptive title"
              maxLength={120}
              aria-required="true"
            />
            <p className="text-xs text-neutral-500">{`${title.length}/120`}</p>
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Location
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Place, or coordinates"
                aria-required="true"
              />
              <Button type="button" onClick={useMyLocation}>
                Use my location
              </Button>
            </div>
            <p className="text-xs text-neutral-500">
              Tip: You can paste coordinates like {"'37.7749, -122.4194'"}.
            </p>
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Image
            </Label>

            <input
              ref={inputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={onInputChange}
              className="hidden"
              aria-required="true"
            />

            <label
              htmlFor="image"
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition",
                "bg-background hover:bg-foreground hover:text-background border-neutral-800",
                dragActive && "bg-foreground border-neutral-300",
              )}
              aria-label="Upload image by clicking or dragging a file here"
            >
              <div className="text-foreground-300 flex items-center gap-2">
                <Upload className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">Click to upload</span>
                <span className="text-foreground">{" or drag & drop"}</span>
              </div>
              <p className="text-foreground mt-1 text-xs">PNG, JPG, or GIF</p>
              {file && (
                <p className="text-foreground-400 mt-2 text-xs">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </label>

            {/* Live Preview (Black and White) */}
            {previewUrl ? (
              <div className="mt-3 overflow-hidden rounded-md border border-neutral-800">
                <Image
                  src={previewUrl || "/placeholder.svg"}
                  alt="Selected image preview in black and white"
                  className="max-h-[320px] w-full object-cover grayscale"
                  crossOrigin="anonymous"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" disabled={submitting} aria-live="polite">
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Posting...
              </span>
            ) : (
              "Create post"
            )}
          </Button>
        </div>
        <span id="form-status" className="sr-only">
          {submitting ? "Submitting your post" : "Form ready"}
        </span>
      </form>

      {/* Submission Preview */}
      {submitted && (
        <Card className="border-neutral-800 bg-neutral-900 text-neutral-50">
          <CardHeader>
            <CardTitle className="text-xl">Preview</CardTitle>
            <CardDescription className="text-neutral-400">
              This is a local preview of your post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-hidden rounded-md border border-neutral-800">
              <Image
                src={submitted.imageUrl || "/placeholder.svg"}
                alt={`Preview of ${submitted.imageName}`}
                className="max-h-[420px] w-full object-cover grayscale"
                crossOrigin="anonymous"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm tracking-wider text-neutral-400 uppercase">
                  Title
                </p>
                <p className="font-medium">{submitted.title}</p>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm tracking-wider text-neutral-400 uppercase">
                  Location
                </p>
                <p className="font-medium">{submitted.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
