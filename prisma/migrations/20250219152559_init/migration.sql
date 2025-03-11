-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('BABY_SHOWER', 'HOUSEWARMING', 'WEDDING', 'BIRTHDAY', 'CORPORATE', 'CHRISTMAS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hostId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventGift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "purchaseLink" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "giftGiverId" TEXT,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventGift_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_hostId_id_key" ON "Event"("hostId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "EventGift_eventId_id_key" ON "EventGift"("eventId", "id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGift" ADD CONSTRAINT "EventGift_giftGiverId_fkey" FOREIGN KEY ("giftGiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGift" ADD CONSTRAINT "EventGift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
