/*
  Warnings:

  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `GroupChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupChatUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupChatToMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "GroupChatUser" DROP CONSTRAINT "GroupChatUser_groupChatId_fkey";

-- DropForeignKey
ALTER TABLE "GroupChatUser" DROP CONSTRAINT "GroupChatUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "PrivateChat" DROP CONSTRAINT "PrivateChat_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "PrivateChat" DROP CONSTRAINT "PrivateChat_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupChatToMessage" DROP CONSTRAINT "_GroupChatToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupChatToMessage" DROP CONSTRAINT "_GroupChatToMessage_B_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "userId",
ADD COLUMN     "senderId" TEXT NOT NULL;

-- DropTable
DROP TABLE "GroupChat";

-- DropTable
DROP TABLE "GroupChatUser";

-- DropTable
DROP TABLE "PrivateChat";

-- DropTable
DROP TABLE "_ChatToMessage";

-- DropTable
DROP TABLE "_GroupChatToMessage";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
