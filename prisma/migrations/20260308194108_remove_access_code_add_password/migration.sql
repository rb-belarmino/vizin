/*
  Warnings:

  - You are about to drop the column `accessCode` on the `Unit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[block,number]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Unit_accessCode_key";

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "accessCode";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Unit_block_number_key" ON "Unit"("block", "number");
