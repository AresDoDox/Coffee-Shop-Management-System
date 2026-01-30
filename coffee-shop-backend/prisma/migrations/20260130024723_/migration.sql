/*
  Warnings:

  - You are about to alter the column `paymentMethod` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `VarChar(191)`.
  - You are about to alter the column `paymentStatus` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'QR',
    MODIFY `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'UNPAID';
