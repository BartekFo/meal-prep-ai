ALTER TABLE "user" ALTER COLUMN "allergies" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "dietary_preferences";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "disliked_ingredients";