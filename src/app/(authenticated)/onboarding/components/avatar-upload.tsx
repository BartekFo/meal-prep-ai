"use client";

import type React from "react";

import { User, X } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // In a real app, this would upload to a storage service
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Simulate upload
    setIsUploading(true);

    // For demo purposes, we'll use a placeholder image
    setTimeout(() => {
      onChange(
        `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(file.name)}`,
      );
      setIsUploading(false);
    }, 1000);

    // In a real app, you would upload to a storage service
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={value || "/placeholder.svg"} alt="Avatar" />
        <AvatarFallback className="bg-primary/10">
          <User className="h-12 w-12 text-primary/50" />
        </AvatarFallback>
      </Avatar>

      {value && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="-right-2 -top-2 absolute h-6 w-6 rounded-full"
          onClick={handleRemove}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove avatar</span>
        </Button>
      )}

      <div className="mt-2">
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer font-medium text-primary text-sm hover:underline"
        >
          {value ? "Change avatar" : "Upload avatar"}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
