-- CreateTable
CREATE TABLE `review_crawl_meta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `review_id` INTEGER NULL,
    `link` VARCHAR(191) NOT NULL,
    `type` INTEGER NOT NULL,
    `source_link` TEXT NOT NULL,
    `stored_file` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
