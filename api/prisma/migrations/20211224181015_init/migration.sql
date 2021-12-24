/*
  Warnings:

  - You are about to drop the column `account_number` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `accountNumber` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "account_number",
ADD COLUMN     "accountNumber" TEXT NOT NULL;
