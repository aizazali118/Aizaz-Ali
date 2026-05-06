-- ================================================================
-- Aizaz Ali Portfolio — MySQL Schema
-- Import this file via phpMyAdmin into: u628566155_aizazali017
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email`      VARCHAR(255) NOT NULL UNIQUE,
  `password`   VARCHAR(255) NOT NULL,
  `name`       VARCHAR(255) DEFAULT 'Admin',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(100) NOT NULL,
  `slug`       VARCHAR(100) NOT NULL UNIQUE,
  `color`      VARCHAR(20)  DEFAULT '#7cb26e',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`        VARCHAR(500) NOT NULL,
  `slug`         VARCHAR(500) NOT NULL UNIQUE,
  `excerpt`      TEXT,
  `content`      LONGTEXT,
  `cover_image`  VARCHAR(500),
  `cover_alt`    VARCHAR(500),
  `category_id`  INT UNSIGNED DEFAULT NULL,
  `status`       ENUM('draft','published') DEFAULT 'draft',
  `read_time`    VARCHAR(50),
  `meta_title`   VARCHAR(200),
  `meta_desc`    VARCHAR(300),
  `published_at` DATETIME DEFAULT NULL,
  `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Downloads (attached to posts)
CREATE TABLE IF NOT EXISTS `downloads` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `post_id`    INT UNSIGNED NOT NULL,
  `label`      VARCHAR(255) NOT NULL,
  `file_path`  VARCHAR(500) NOT NULL,
  `file_name`  VARCHAR(255),
  `file_size`  INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Portfolio items
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`       VARCHAR(255) NOT NULL,
  `category`    VARCHAR(100) NOT NULL DEFAULT 'WordPress',
  `image_url`   VARCHAR(500),
  `description` TEXT,
  `live_url`    VARCHAR(500),
  `tags`        JSON,
  `featured`    TINYINT(1) DEFAULT 0,
  `sort_order`  INT DEFAULT 0,
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Services list
CREATE TABLE IF NOT EXISTS `services_list` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title`        VARCHAR(255) NOT NULL,
  `tagline`      VARCHAR(255),
  `description`  TEXT,
  `features`     JSON,
  `icon_name`    VARCHAR(100) DEFAULT 'FaWordpress',
  `accent_color` VARCHAR(20)  DEFAULT '#7cb26e',
  `badge`        VARCHAR(100),
  `sort_order`   INT DEFAULT 0,
  `active`       TINYINT(1) DEFAULT 1,
  `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Testimonials
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `client_name`  VARCHAR(255) NOT NULL,
  `client_title` VARCHAR(255),
  `company`      VARCHAR(255),
  `avatar_url`   VARCHAR(500),
  `content`      TEXT NOT NULL,
  `rating`       INT DEFAULT 5,
  `featured`     TINYINT(1) DEFAULT 0,
  `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Default categories
INSERT IGNORE INTO `categories` (`name`, `slug`, `color`) VALUES
  ('WordPress',   'wordpress',   '#21759b'),
  ('Shopify',     'shopify',     '#96bf48'),
  ('React',       'react',       '#7cb26e'),
  ('Freelancing', 'freelancing', '#f97316');
