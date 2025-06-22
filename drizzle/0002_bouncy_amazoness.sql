DO $$ BEGIN
    CREATE TYPE "public"."meal_type" AS ENUM('breakfast', 'lunch', 'dinner', 'snack');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "meal_type" SET DATA TYPE meal_type;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "instructions" SET DATA TYPE text[];
