-- CreateTable
CREATE TABLE "UserMessageDelivery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessageDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMessageRead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserMessageRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserMessageDelivery_userId_messageId_key" ON "UserMessageDelivery"("userId", "messageId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessageRead_userId_messageId_key" ON "UserMessageRead"("userId", "messageId");

-- AddForeignKey
ALTER TABLE "UserMessageDelivery" ADD CONSTRAINT "UserMessageDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessageDelivery" ADD CONSTRAINT "UserMessageDelivery_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessageRead" ADD CONSTRAINT "UserMessageRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessageRead" ADD CONSTRAINT "UserMessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
