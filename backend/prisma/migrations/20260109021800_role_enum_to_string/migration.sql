-- Migration: Convert role from ENUM to String (TEXT)
-- This migration preserves all existing data

-- Step 1: Create a new column for role as TEXT
ALTER TABLE "users" ADD COLUMN "role_new" TEXT;

-- Step 2: Copy all existing role values to the new column
UPDATE "users" SET "role_new" = role::text;

-- Step 3: Drop the old role column
ALTER TABLE "users" DROP COLUMN "role";

-- Step 4: Rename the new column to 'role'
ALTER TABLE "users" RENAME COLUMN "role_new" TO "role";

-- Step 5: Make the role column NOT NULL (since it was required before)
ALTER TABLE "users" ALTER COLUMN "role" SET NOT NULL;

-- Step 6: Drop the Role enum type (no longer needed)
DROP TYPE IF EXISTS "Role";

-- Note: The role values are now managed dynamically via system_config table
