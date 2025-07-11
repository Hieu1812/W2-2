/*
  Warnings:

  - You are about to alter the column `review_id` on the `review_crawl_meta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `review_crawl_meta` DROP FOREIGN KEY `review_crawl_meta_review_id_fkey`;

-- DropIndex
DROP INDEX `review_crawl_meta_review_id_fkey` ON `review_crawl_meta`;

-- DropIndex
DROP INDEX `socialReviewCrawl_source_review_id_key` ON `socialReviewCrawl`;

-- AlterTable
ALTER TABLE `review_crawl_meta` MODIFY `review_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `review_crawl_meta` ADD CONSTRAINT `review_crawl_meta_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `socialReviewCrawl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
