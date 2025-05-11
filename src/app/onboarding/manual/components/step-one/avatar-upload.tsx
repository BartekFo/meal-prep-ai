"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { User, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

interface AvatarUploadProps {
  value: File | undefined;
  onChange: (file?: File) => void;
  name: string;
}

export function AvatarUpload({ value, onChange, name }: AvatarUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (value instanceof File) {
      objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      setError(null);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [value]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File must be an image (e.g., PNG, JPG, GIF).");
      onChange(undefined);
      if (ref.current) ref.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      onChange(undefined);
      if (ref.current) ref.current.value = "";
      return;
    }

    onChange(file);
  };

  const handleRemoveImage = () => {
    onChange(undefined);
    if (ref.current) {
      ref.current.value = "";
    }
    setError(null);
  };

  return (
    <div className="flex flex-col items-center">
      {error && <div className="mb-2 text-destructive text-sm">{error}</div>}
      <div className="relative w-fit">
        <label
          htmlFor={name}
          className="group block cursor-pointer font-medium text-primary text-sm hover:underline"
        >
          <Avatar
            className={cn(
              "h-24 w-24 border-2 border-transparent transition-colors",
              "group-hover:border-primary/50",
              error && "border-destructive",
            )}
          >
            <AvatarImage src={previewUrl || undefined} alt="Avatar Preview" />
            <AvatarFallback className="bg-muted">
              <User className="h-12 w-12 text-muted-foreground/50" />
            </AvatarFallback>
          </Avatar>
          <span className="mt-2">
            {value ? "Change avatar" : "Upload avatar"}
          </span>
        </label>

        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="-right-2 -top-2 absolute h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            aria-label="Remove avatar"
          >
            <X className="h-3 w-3" />
          </Button>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
}
