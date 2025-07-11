/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `ReviewCrawl` DROP FOREIGN KEY `ReviewCrawl_system_product_id_fkey`;

-- DropIndex
DROP INDEX `ReviewCrawl_system_product_id_fkey` ON `ReviewCrawl`;

-- AlterTable
ALTER TABLE `Product` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ReviewCrawl` MODIFY `system_product_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `ReviewCrawl` ADD CONSTRAINT `ReviewCrawl_system_product_id_fkey` FOREIGN KEY (`system_product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
