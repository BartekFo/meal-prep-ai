"use client";

import type React from "react";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface IImageUploadProps {
  value: File | undefined;
  onChange: (file?: File) => void;
}

export function ImageUpload({ value, onChange }: IImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true);

    console.log("file", file);

    onChange(file);
  };

  const handleRemove = () => {
    onChange(undefined);
    setError(null);
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  return (
    <div>
      {error && <div className="mb-2 text-destructive text-sm">{error}</div>}

      {value ? (
        <div className="relative">
          <Card>
            <CardContent className="p-0">
              {previewUrl && (
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
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <label
              htmlFor="image-upload"
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2"
            >
              <div className="rounded-full bg-muted p-2">
                <ImagePlus className="h-6 w-6" />
              </div>
              <span className="font-medium text-sm">
                {isUploading ? "Uploading..." : "Upload Image"}
              </span>
              <span className="text-muted-foreground text-xs">
                SVG, PNG, JPG or GIF (max. 2MB)
              </span>

              <input
                name="image"
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={isUploading}
              />
            </label>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
