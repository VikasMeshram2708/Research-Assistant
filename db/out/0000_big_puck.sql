CREATE TYPE "public"."user_roles" AS ENUM('MEMBER', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(500) NOT NULL,
	"password" varchar(1000) NOT NULL,
	"role" "user_roles" DEFAULT 'MEMBER',
	"lastLogin" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAT" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
