-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CEO', 'DEV_DIRECTOR', 'BACKEND', 'FRONTEND', 'FULLSTACK');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('PRODUCT_FEATURE', 'CUSTOMIZATION', 'BUG', 'SUPPORT', 'INFRASTRUCTURE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('INTAKE', 'BACKLOG', 'IN_PROGRESS', 'REVIEW', 'DONE', 'REJECTED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MAWI', 'OMNILEADS', 'NEW_PRODUCT_1', 'NEW_PRODUCT_2', 'NEW_PRODUCT_3', 'INTERNAL');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OKRStatus" AS ENUM ('NOT_STARTED', 'ON_TRACK', 'AT_RISK', 'BEHIND', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DEVELOPMENT', 'SUNSET');

-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "ClientTier" AS ENUM ('BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('ACTIVE', 'CHURNED', 'AT_RISK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "avatar" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 40,
    "skills" TEXT[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "RequestType" NOT NULL,
    "priority" "Priority" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'INTAKE',
    "requested_by" TEXT NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimated_hours" DOUBLE PRECISION NOT NULL,
    "actual_hours" DOUBLE PRECISION,
    "product" "ProductType",
    "client" TEXT,
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "tags" TEXT[],
    "notes" TEXT,
    "custom_to_feature" BOOLEAN NOT NULL DEFAULT false,
    "repetition_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_activities" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "request_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "allocated_hours" DOUBLE PRECISION NOT NULL,
    "actual_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "okrs" (
    "id" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "status" "OKRStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "okrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_results" (
    "id" TEXT NOT NULL,
    "okr_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "key_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "active_clients" INTEGER NOT NULL DEFAULT 0,
    "mrr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "launched_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_items" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "quarter" TEXT NOT NULL,
    "status" "RoadmapStatus" NOT NULL DEFAULT 'PLANNED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_requests" (
    "roadmap_item_id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,

    CONSTRAINT "roadmap_requests_pkey" PRIMARY KEY ("roadmap_item_id","request_id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "products" TEXT[],
    "mrr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customizations_count" INTEGER NOT NULL DEFAULT 0,
    "last_custom_request" TIMESTAMP(3),
    "health_score" INTEGER NOT NULL DEFAULT 100,
    "tier" "ClientTier" NOT NULL DEFAULT 'BASIC',
    "status" "ClientStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_metrics" (
    "id" TEXT NOT NULL,
    "week_start" TIMESTAMP(3) NOT NULL,
    "product_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "custom_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bug_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "support_hours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "product_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "custom_percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "features_shipped" INTEGER NOT NULL DEFAULT 0,
    "customs_completed" INTEGER NOT NULL DEFAULT 0,
    "team_velocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weekly_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AssignedUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "requests_status_idx" ON "requests"("status");

-- CreateIndex
CREATE INDEX "requests_type_idx" ON "requests"("type");

-- CreateIndex
CREATE INDEX "requests_product_idx" ON "requests"("product");

-- CreateIndex
CREATE INDEX "request_activities_request_id_idx" ON "request_activities"("request_id");

-- CreateIndex
CREATE INDEX "comments_request_id_idx" ON "comments"("request_id");

-- CreateIndex
CREATE INDEX "assignments_user_id_idx" ON "assignments"("user_id");

-- CreateIndex
CREATE INDEX "assignments_week_start_idx" ON "assignments"("week_start");

-- CreateIndex
CREATE UNIQUE INDEX "assignments_user_id_request_id_week_start_key" ON "assignments"("user_id", "request_id", "week_start");

-- CreateIndex
CREATE INDEX "okrs_quarter_idx" ON "okrs"("quarter");

-- CreateIndex
CREATE INDEX "key_results_okr_id_idx" ON "key_results"("okr_id");

-- CreateIndex
CREATE INDEX "roadmap_items_product_id_idx" ON "roadmap_items"("product_id");

-- CreateIndex
CREATE INDEX "roadmap_items_quarter_idx" ON "roadmap_items"("quarter");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_metrics_week_start_key" ON "weekly_metrics"("week_start");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_AssignedUsers_AB_unique" ON "_AssignedUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_AssignedUsers_B_index" ON "_AssignedUsers"("B");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_activities" ADD CONSTRAINT "request_activities_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_activities" ADD CONSTRAINT "request_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "okrs" ADD CONSTRAINT "okrs_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_okr_id_fkey" FOREIGN KEY ("okr_id") REFERENCES "okrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_items" ADD CONSTRAINT "roadmap_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_requests" ADD CONSTRAINT "roadmap_requests_roadmap_item_id_fkey" FOREIGN KEY ("roadmap_item_id") REFERENCES "roadmap_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_requests" ADD CONSTRAINT "roadmap_requests_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedUsers" ADD CONSTRAINT "_AssignedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedUsers" ADD CONSTRAINT "_AssignedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
