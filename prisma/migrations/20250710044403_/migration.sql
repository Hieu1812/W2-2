/*
  Warnings:

  - You are about to drop the `socialReviewCrawl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `review_crawl_meta` DROP FOREIGN KEY `review_crawl_meta_review_id_fkey`;

-- DropIndex
DROP INDEX `review_crawl_meta_review_id_fkey` ON `review_crawl_meta`;

-- DropTable
DROP TABLE `socialReviewCrawl`;

-- AddForeignKey
ALTER TABLE `review_crawl_meta` ADD CONSTRAINT `review_crawl_meta_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `ReviewCrawl`(`source_review_id`) ON DELETE SET NULL ON UPDATE CASCADE;
