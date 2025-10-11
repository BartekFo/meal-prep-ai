ALTER TABLE "user" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dietary_type" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "allergies" text[];--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "disliked_foods" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferred_meal_types" text[];