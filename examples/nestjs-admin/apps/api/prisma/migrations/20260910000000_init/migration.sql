CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "access_requests" (
  "id" UUID NOT NULL,
  "requester_name" VARCHAR(120) NOT NULL,
  "requester_email" VARCHAR(254) NOT NULL,
  "system_name" VARCHAR(120) NOT NULL,
  "reason" VARCHAR(1000) NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
  "reviewer_note" VARCHAR(500),
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "access_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "access_requests_status_updated_at_idx" ON "access_requests"("status", "updated_at");
