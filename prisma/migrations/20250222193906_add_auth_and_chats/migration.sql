/*
  Warnings:

  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('MATH', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'HISTORY', 'COMPUTER_SCIENCE', 'LITERATURE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "second_name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "subjects" "SubjectType"[],
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_userId_chatId_key" ON "ChatUser"("userId", "chatId");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
