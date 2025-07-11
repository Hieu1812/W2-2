/*
  Warnings:

  - A unique constraint covering the columns `[source_review_id]` on the table `socialReviewCrawl` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `review_crawl_meta` DROP FOREIGN KEY `review_crawl_meta_review_id_fkey`;

-- DropIndex
DROP INDEX `review_crawl_meta_review_id_fkey` ON `review_crawl_meta`;

-- AlterTable
ALTER TABLE `review_crawl_meta` MODIFY `review_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `socialReviewCrawl_source_review_id_key` ON `socialReviewCrawl`(`source_review_id`);

-- AddForeignKey
ALTER TABLE `review_crawl_meta` ADD CONSTRAINT `review_crawl_meta_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `socialReviewCrawl`(`source_review_id`) ON DELETE SET NULL ON UPDATE CASCADE;
