CREATE TABLE "agent_versions" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"agent_id" text NOT NULL,
	"version" integer NOT NULL,
	"instructions" text NOT NULL,
	"model" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "agents" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agents_status_check" CHECK ("agents"."status" in ('active', 'archived'))
);
--> statement-breakpoint
ALTER TABLE "agent_versions" ADD CONSTRAINT "agent_versions_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_versions" ADD CONSTRAINT "agent_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "agent_versions_agent_version_unique" ON "agent_versions" USING btree ("agent_id","version");--> statement-breakpoint
CREATE INDEX "agent_versions_agent_id_idx" ON "agent_versions" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "agents_workspace_id_idx" ON "agents" USING btree ("workspace_id");