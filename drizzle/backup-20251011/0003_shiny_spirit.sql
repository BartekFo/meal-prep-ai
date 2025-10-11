ALTER TABLE "user" ADD COLUMN "date_of_birth" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "activity_level" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "current_weight" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "weight_goal" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dietary_preferences" text[];--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "disliked_ingredients" text[];