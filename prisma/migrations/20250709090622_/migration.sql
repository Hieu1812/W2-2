/*
  Warnings:

  - A unique constraint covering the columns `[source_review_id]` on the table `ReviewCrawl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `review_crawl_meta` MODIFY `review_id` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ReviewCrawl_source_review_id_key` ON `ReviewCrawl`(`source_review_id`);

-- AddForeignKey
ALTER TABLE `review_crawl_meta` ADD CONSTRAINT `review_crawl_meta_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `ReviewCrawl`(`source_review_id`) ON DELETE SET NULL ON UPDATE CASCADE;
