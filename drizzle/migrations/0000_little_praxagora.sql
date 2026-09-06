CREATE TABLE "business_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"address" text,
	"city" text DEFAULT 'Huntington Park' NOT NULL,
	"state" text DEFAULT 'CA' NOT NULL,
	"zip" text DEFAULT '90255' NOT NULL,
	"phone" text,
	"website" text,
	"hours" jsonb,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"cover_image" text,
	"logo" text,
	"gallery" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"claimed_by" uuid,
	"submitted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "businesses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"full_name" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "real_estate_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"address" text NOT NULL,
	"city" text DEFAULT 'Huntington Park' NOT NULL,
	"state" text DEFAULT 'CA' NOT NULL,
	"zip" text DEFAULT '90255' NOT NULL,
	"price" integer,
	"property_type" text NOT NULL,
	"bedrooms" integer,
	"bathrooms" numeric(3, 1),
	"sqft" integer,
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"description" text,
	"main_image" text,
	"gallery" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"external_url" text,
	"source" text,
	"affiliate_source" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "real_estate_listings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "business_claims" ADD CONSTRAINT "business_claims_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_claims" ADD CONSTRAINT "business_claims_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_claimed_by_profiles_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_submitted_by_profiles_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "real_estate_listings" ADD CONSTRAINT "real_estate_listings_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;