-- Add requestNumber column with temporary nullable
ALTER TABLE "public"."requests" ADD COLUMN "request_number" TEXT;

-- Update existing requests with sequential numbers starting at 1001
DO $$
DECLARE
    req RECORD;
    counter INT := 1001;
BEGIN
    FOR req IN SELECT id FROM "public"."requests" ORDER BY created_at ASC
    LOOP
        UPDATE "public"."requests"
        SET "request_number" = 'REQ-' || counter
        WHERE id = req.id;
        counter := counter + 1;
    END LOOP;
END $$;

-- Make the column NOT NULL and UNIQUE
ALTER TABLE "public"."requests" ALTER COLUMN "request_number" SET NOT NULL;
ALTER TABLE "public"."requests" ADD CONSTRAINT "requests_request_number_key" UNIQUE ("request_number");
