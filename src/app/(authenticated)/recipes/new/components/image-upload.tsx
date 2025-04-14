"use client";

import type React from "react";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploadProps {
	value: string;
	onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
	const [isUploading, setIsUploading] = useState(false);

	// TODO: Implement image upload
	const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		setIsUploading(true);

		setTimeout(() => {
			onChange(
				`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(file.name)}`,
			);
			setIsUploading(false);
		}, 1500);
	};

	const handleRemove = () => {
		onChange("");
	};

	return (
		<div>
			{value ? (
				<div className="relative">
					<Card>
						<CardContent className="p-0">
							<div className="relative aspect-video w-full overflow-hidden rounded-md">
								<Image
									src={value || "/placeholder.svg"}
									alt="Recipe image"
									fill
									className="object-cover"
								/>
							</div>
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
							className="flex cursor-pointer flex-col items-center justify-center gap-2"
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
