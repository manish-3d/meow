-- Preserve the existing integer IDs as text so Auth.js can use them as string IDs.
-- Convert both sides of the existing posts/users foreign key before restoring it.
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "author_id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text USING "id"::text;
--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "author_id" SET DATA TYPE text USING "author_id"::text;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified" timestamp;
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"workspace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_members_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id"),
	CONSTRAINT "workspace_members_role_check" CHECK ("workspace_members"."role" in ('owner', 'admin', 'member'))
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"owner_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "workspace_members_user_id_idx" ON "workspace_members" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX "workspaces_owner_user_id_idx" ON "workspaces" USING btree ("owner_user_id");
