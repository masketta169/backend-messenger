-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "second_name" DROP NOT NULL;
