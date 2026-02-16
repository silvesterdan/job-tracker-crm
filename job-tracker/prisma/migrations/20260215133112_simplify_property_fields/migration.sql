/*
  Warnings:

  - You are about to drop the column `addressLine1` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `addressLine2` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Property` table. All the data in the column will be lost.
  - Added the required column `addressLine` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "addressLine1",
DROP COLUMN "addressLine2",
DROP COLUMN "postalCode",
DROP COLUMN "state",
ADD COLUMN     "addressLine" TEXT NOT NULL,
ADD COLUMN     "postcode" TEXT;
