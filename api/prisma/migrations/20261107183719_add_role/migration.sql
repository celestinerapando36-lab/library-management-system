-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATRON', 'LIBRARIAN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'PATRON';
