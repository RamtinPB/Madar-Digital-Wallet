-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('OWN_WALLET', 'P2P');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "description" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "transferType" "TransferType";
