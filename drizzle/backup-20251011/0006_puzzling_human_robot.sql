ALTER TABLE "user" ADD COLUMN "onboarding_status" text DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "onboarding_completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_onboarding_status_check" CHECK ("onboarding_status" IN ('not_started', 'step1_completed', 'completed'));