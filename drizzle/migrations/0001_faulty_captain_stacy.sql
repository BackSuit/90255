ALTER TABLE "businesses" ADD COLUMN "google_place_id" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_google_place_id_unique" UNIQUE("google_place_id");