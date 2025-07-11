-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewCrawl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `system_product_id` INTEGER NULL,
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
    `updated_at` DATETIME(3) NOT NULL,
    `source_customer_avatar` TEXT NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ReviewCrawl` ADD CONSTRAINT `ReviewCrawl_system_product_id_fkey` FOREIGN KEY (`system_product_id`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
