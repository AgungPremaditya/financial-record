/*
  Warnings:

  - You are about to alter the column `value` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `initValue` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "value" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "initValue" SET DATA TYPE INTEGER;
