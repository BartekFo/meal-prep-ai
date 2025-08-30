ALTER TABLE "recipes" ADD COLUMN "image_data" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "image_type" varchar(50);--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "image_size" integer;