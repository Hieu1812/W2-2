-- DropForeignKey
ALTER TABLE `review_crawl_meta` DROP FOREIGN KEY `review_crawl_meta_review_id_fkey`;

-- DropIndex
DROP INDEX `review_crawl_meta_review_id_fkey` ON `review_crawl_meta`;

-- CreateTable
CREATE TABLE `socialReviewCrawl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(255) NULL,
    `source_review_id` VARCHAR(255) NULL,
    `source_customer_id` VARCHAR(255) NULL,
    `score` INTEGER NULL,
    `type` VARCHAR(20) NULL,
    `content` TEXT NULL,
    `customer_name` VARCHAR(255) NULL,
    `customer_avatar` VARCHAR(255) NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `review_url` VARCHAR(255) NULL,
    `review_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approved` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `socialReviewCrawl_source_review_id_key`(`source_review_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `review_crawl_meta` ADD CONSTRAINT `review_crawl_meta_review_id_fkey` FOREIGN KEY (`review_id`) REFERENCES `socialReviewCrawl`(`source_review_id`) ON DELETE SET NULL ON UPDATE CASCADE;
