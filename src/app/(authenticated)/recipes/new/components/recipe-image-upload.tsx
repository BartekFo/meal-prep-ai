"use client";

import type React from "react";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface IImageUploadProps {
  value: File | undefined;
  onChange: (file?: File) => void;
  name: string;
}

export function RecipeImageUpload({
  value,
  onChange,
  name,
}: IImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  function clearPreviewUrl() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 2MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    onChange(file);
  };

  function handleRemoveImage() {
    onChange(undefined);
    if (ref.current) {
      ref.current.value = "";
    }
    clearPreviewUrl();
    setError(null);
  }

  return (
    <div>
      {error && <div className="mb-2 text-destructive text-sm">{error}</div>}

      <div className={cn("relative", !value && "hidden")}>
        <Card>
          <CardContent className="p-0">
            {value && previewUrl && (
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
            <div className="p-4 pt-10 text-center text-muted-foreground text-sm">
              {value?.name}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className={cn("border-dashed", value && "hidden")}>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <label
            htmlFor="image"
            className="flex w-full cursor-pointer flex-col items-center justify-center gap-2"
          >
            <div className="rounded-full bg-muted p-2">
              <ImagePlus className="h-6 w-6" />
            </div>
            <span className="text-muted-foreground text-xs">
              SVG, PNG, JPG (max. 2MB)
            </span>

            <input
              className="hidden"
              ref={ref}
              id={name}
              type="file"
              name={name}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
