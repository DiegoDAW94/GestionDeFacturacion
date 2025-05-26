-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2025 a las 03:46:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfg`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `nif` varchar(50) DEFAULT NULL,
  `fiscal_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `province` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`id`, `name`, `nif`, `fiscal_address`, `city`, `postal_code`, `province`, `email`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 'Cliente 1', '1235467c', 'C/Estambrera 15', 'Logroño', '26006', 'A Coruña', 'cliente1@email.com', 2, '2025-05-21 16:45:15', '2025-05-21 16:45:15'),
(2, 'Cliente 2', '123546712c', 'Calle Lugo', 'Logroño', '26007', 'La Rioja', 'cliente2@email.com', 2, '2025-05-21 16:45:33', '2025-05-25 23:18:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `legal_name` varchar(255) DEFAULT NULL,
  `cif` varchar(50) DEFAULT NULL,
  `fiscal_address` text DEFAULT NULL,
  `social_address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `invoice_prefix` varchar(10) DEFAULT NULL,
  `owner_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `name`, `legal_name`, `cif`, `fiscal_address`, `social_address`, `city`, `postal_code`, `province`, `email`, `telefono`, `invoice_prefix`, `owner_id`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'Admin', '12312425', 'admin', 'admin', 'admin', '12345', 'admin', 'admin@email.com', '12345678', 'ADMIN', 1, '2025-05-21 16:41:20', '2025-05-21 16:41:20'),
(2, 'Company 1', 'Company 1', '160863994X', 'C/Lugo, 4', 'C/Lugo, 4', 'Logroño', '26007', 'La Rioja', 'company1@email.com', '600878443', 'FACT', 2, '2025-05-21 16:43:32', '2025-05-25 23:18:12'),
(7, 'testcomp1', 'testcomp1', '160863994asdX', 'C/Lugo, 4', 'C/Lugo, 4', 'Logroño', '26007', 'Please select', 'testcomp@email.com', '600878443', 'test', 3, '2025-05-21 21:41:04', '2025-05-21 21:41:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invoices`
--

CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `client_id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `operation_date` date DEFAULT NULL,
  `custom_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`custom_items`)),
  `base_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `invoices`
--

INSERT INTO `invoices` (`id`, `company_id`, `user_id`, `client_id`, `number`, `date`, `operation_date`, `custom_items`, `base_amount`, `tax_amount`, `total`, `created_at`, `updated_at`) VALUES
(7, 2, 1, 1, 'FACT-1', '2025-05-25', '2025-05-25', '[{\"description\":\"Servicio personalizado\",\"quantity\":2,\"unit_price\":2}]', 342.15, 71.85, 414.00, '2025-05-25 14:08:33', '2025-05-25 20:27:16'),
(11, 2, 2, 2, 'FACT-2', '2025-05-26', '2025-05-26', '[]', 264.46, 55.54, 320.00, '2025-05-25 22:32:16', '2025-05-25 23:01:42'),
(13, 2, 2, 1, 'FACT-3', '2025-05-26', '2025-05-26', '[]', 173.55, 36.45, 210.00, '2025-05-25 23:17:26', '2025-05-25 23:17:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `item_id`, `name`, `description`, `price`, `quantity`, `created_at`, `updated_at`) VALUES
(13, 7, 2, 'producto 2', 'producto 2 descripcion', 20.00, 20, '2025-05-25 20:27:16', '2025-05-25 20:27:16'),
(14, 7, 1, 'producto 1', 'producto 1 descripcion', 10.00, 1, '2025-05-25 20:27:16', '2025-05-25 20:27:16'),
(16, 11, 4, 'servicio 2update', 'servicio 2 descripcion', 40.00, 8, '2025-05-25 23:01:42', '2025-05-25 23:01:42'),
(19, 13, 3, 'servicio 1', 'servicio 1 descripcion', 30.00, 7, '2025-05-25 23:17:26', '2025-05-25 23:17:26');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invoice_taxes`
--

CREATE TABLE `invoice_taxes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `tax_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `invoice_taxes`
--

INSERT INTO `invoice_taxes` (`id`, `invoice_id`, `tax_id`, `amount`, `created_at`, `updated_at`) VALUES
(6, 7, 1, 0.00, NULL, NULL),
(10, 11, 1, 0.00, NULL, NULL),
(12, 13, 1, 0.00, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `items`
--

CREATE TABLE `items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `items`
--

INSERT INTO `items` (`id`, `company_id`, `name`, `description`, `price`, `created_at`, `updated_at`) VALUES
(1, 2, 'producto 1', 'producto 1 descripcion', 10.00, '2025-05-21 16:43:58', '2025-05-21 16:44:55'),
(2, 2, 'producto 2', 'producto 2 descripcion', 20.00, '2025-05-21 16:44:11', '2025-05-21 16:44:11'),
(3, 2, 'servicio 1', 'servicio 1 descripcion', 30.00, '2025-05-21 16:44:24', '2025-05-21 16:44:24'),
(4, 2, 'servicio 2update', 'servicio 2 descripcion', 40.00, '2025-05-21 16:44:42', '2025-05-25 19:42:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_10_000000_create_users_table', 1),
(2, '2014_10_11_000000_create_companies_table', 1),
(3, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(4, '2019_08_19_000000_create_failed_jobs_table', 1),
(5, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(6, '2025_04_14_115040_create_roles_table', 1),
(7, '2025_04_14_115131_create_user_roles_table', 1),
(8, '2025_04_14_115211_create_clients_table', 1),
(9, '2025_04_14_115250_create_invoices_table', 1),
(10, '2025_04_27_180019_create_taxes_table', 1),
(11, '2025_04_27_180023_create_invoice_taxes_table', 1),
(12, '2025_04_27_181004_create_items_table', 1),
(13, '2025_04_27_181011_create_invoice_items_table', 1),
(15, '2025_05_25_161340_create_printed_invoices_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 1, 'auth_token', 'ceeaa4efbf456fa87b1245d2ffff776857d34f88727fa903ecefd1adcdb211d9', '[\"*\"]', '2025-05-21 16:42:11', NULL, '2025-05-21 16:39:25', '2025-05-21 16:42:11'),
(2, 'App\\Models\\User', 2, 'auth_token', '5ba2b98d94f57e32e8007028323f80b39facac7519ee90989a02d2ab827debcf', '[\"*\"]', '2025-05-21 19:55:52', NULL, '2025-05-21 16:42:47', '2025-05-21 19:55:52'),
(3, 'App\\Models\\User', 2, 'auth_token', '50a1f1b831340a606e5e897f3cd5f18dc49da380b29e6a2edd4c9b096e0ced5a', '[\"*\"]', '2025-05-21 21:02:06', NULL, '2025-05-21 19:56:06', '2025-05-21 21:02:06'),
(4, 'App\\Models\\User', 3, 'auth_token', 'bfb78cdc9de3e5acc6ba239a0e87233835cd061d59449c1f42810f76158c0c31', '[\"*\"]', '2025-05-21 21:40:19', NULL, '2025-05-21 21:06:59', '2025-05-21 21:40:19'),
(5, 'App\\Models\\User', 3, 'auth_token', '38fbbfed08ba8e1283a7e983bd9bc111038e10a2fcdfc3e124d8d8e15df4e992', '[\"*\"]', '2025-05-21 21:44:48', NULL, '2025-05-21 21:40:27', '2025-05-21 21:44:48'),
(6, 'App\\Models\\User', 3, 'auth_token', 'debf235222de00e5a327e323d06747f41885dcd14b765d9670a06476c7e2c04a', '[\"*\"]', '2025-05-21 21:48:30', NULL, '2025-05-21 21:45:01', '2025-05-21 21:48:30'),
(7, 'App\\Models\\User', 3, 'auth_token', '19e4d8aaf972d998963938c238a1a4addadde4a8bcd98dcf670a757d0be5984f', '[\"*\"]', '2025-05-21 21:52:50', NULL, '2025-05-21 21:52:23', '2025-05-21 21:52:50'),
(8, 'App\\Models\\User', 3, 'auth_token', '0d602f769bfde6eee6a8a66981833482efb8a1c617853ca94080bc5326898adb', '[\"*\"]', '2025-05-21 21:55:41', NULL, '2025-05-21 21:55:40', '2025-05-21 21:55:41'),
(9, 'App\\Models\\User', 3, 'auth_token', 'f958fc769d11c3ff4483c717c72fdab6e7dda65b722d15c7051a48ff34a17af8', '[\"*\"]', '2025-05-24 17:36:42', NULL, '2025-05-21 21:59:21', '2025-05-24 17:36:42'),
(10, 'App\\Models\\User', 5, 'auth_token', '6198be56a106d77b0f9d3b2f7be4cb3be5fb0d59704e30e613d5f788d10c0f99', '[\"*\"]', '2025-05-24 17:45:13', NULL, '2025-05-24 17:41:33', '2025-05-24 17:45:13'),
(11, 'App\\Models\\User', 4, 'auth_token', '63bc1c9466f40a2a22e2b9c9edace464e6c78fe3b2979340b5907b5924b03c6f', '[\"*\"]', '2025-05-24 18:29:42', NULL, '2025-05-24 17:53:02', '2025-05-24 18:29:42'),
(12, 'App\\Models\\User', 2, 'auth_token', '8e1eb1dc1e90f9d23c50f91fbeebb34173d3f999d5250ff2e8a99dcf76b5c641', '[\"*\"]', '2025-05-25 14:02:08', NULL, '2025-05-24 18:29:52', '2025-05-25 14:02:08'),
(13, 'App\\Models\\User', 2, 'auth_token', 'd84460609f86561dd437b3639c6a12c0626f110ed1c2937d739142e81d7eddd1', '[\"*\"]', '2025-05-25 16:25:24', NULL, '2025-05-25 14:02:55', '2025-05-25 16:25:24'),
(14, 'App\\Models\\User', 2, 'auth_token', '1afd23a06b9a7f107546e536584ab587a2956ffb4105803b0478c29d1425c099', '[\"*\"]', '2025-05-25 16:33:48', NULL, '2025-05-25 16:31:42', '2025-05-25 16:33:48'),
(15, 'App\\Models\\User', 2, 'auth_token', '2a8a5dc2b963da0ac46c9a69feeb72dfdcf681a640a726a9f2615abfe6434348', '[\"*\"]', '2025-05-25 16:41:35', NULL, '2025-05-25 16:34:11', '2025-05-25 16:41:35'),
(16, 'App\\Models\\User', 7, 'auth_token', '6eec33b5e0be2c7446efec61bf5c4d409f5a364520a9062e39221eef87827f14', '[\"*\"]', '2025-05-25 16:47:06', NULL, '2025-05-25 16:46:19', '2025-05-25 16:47:06'),
(17, 'App\\Models\\User', 4, 'auth_token', '3a16a5072a5d537c7c71b8c4239f2c6c782748763e61c1bf52f11217d2e2f65c', '[\"*\"]', '2025-05-25 16:47:24', NULL, '2025-05-25 16:47:19', '2025-05-25 16:47:24'),
(18, 'App\\Models\\User', 8, 'auth_token', '6d121464021098ba24d40fd5de811f5b9746fe316135eb2ad3d95282de0e9afb', '[\"*\"]', '2025-05-25 17:19:38', NULL, '2025-05-25 16:48:04', '2025-05-25 17:19:38'),
(19, 'App\\Models\\User', 1, 'auth_token', 'a63a951e803d70d0a1bddbd50996539cc1e0637473a5447dc6c3e15f3c6261c3', '[\"*\"]', '2025-05-25 17:20:36', NULL, '2025-05-25 17:19:46', '2025-05-25 17:20:36'),
(20, 'App\\Models\\User', 1, 'auth_token', 'b1901e8511304e70c09e86d823b524273c8d940bb2202a89e2d5d3b0dc20c149', '[\"*\"]', '2025-05-25 17:20:45', NULL, '2025-05-25 17:20:44', '2025-05-25 17:20:45'),
(21, 'App\\Models\\User', 1, 'auth_token', '711197a7280ffbf17d2604a8781c8adce1ca01b56a2d75193b61f5e3fe3c0d65', '[\"*\"]', '2025-05-25 17:22:44', NULL, '2025-05-25 17:22:44', '2025-05-25 17:22:44'),
(22, 'App\\Models\\User', 1, 'auth_token', '0c17b422823de39a6873ed3af2ce2021ab3a9ff7e6a47c8a0d3ba6bf9ebd5861', '[\"*\"]', '2025-05-25 17:26:44', NULL, '2025-05-25 17:26:12', '2025-05-25 17:26:44'),
(23, 'App\\Models\\User', 1, 'auth_token', 'dde721acffda0219574f84939b8c1147d2a8c1cec23844af55ecbf838354737f', '[\"*\"]', '2025-05-25 20:59:06', NULL, '2025-05-25 17:36:50', '2025-05-25 20:59:06'),
(24, 'App\\Models\\User', 2, 'auth_token', 'c379735de919d34dbc3933b9297d0b684fd6824d68a2f54feca2f67124d1888a', '[\"*\"]', '2025-05-25 22:25:28', NULL, '2025-05-25 21:05:13', '2025-05-25 22:25:28'),
(25, 'App\\Models\\User', 2, 'auth_token', '27c405663ef33dc38a8c6b0129432bc7db66f21396b204ec78e8f9a2c9b7a9ba', '[\"*\"]', '2025-05-25 23:19:04', NULL, '2025-05-25 22:26:10', '2025-05-25 23:19:04'),
(26, 'App\\Models\\User', 1, 'auth_token', '027163d3773e3d5ac89bf8417016c7f0165f03d6c1c2999288e7e45569d4f31b', '[\"*\"]', '2025-05-25 23:22:03', NULL, '2025-05-25 23:20:02', '2025-05-25 23:22:03'),
(27, 'App\\Models\\User', 2, 'auth_token', 'aba8439e0750e8c440df3b787f955493caee018ec56e0c94f34c5d5ee29dcb1f', '[\"*\"]', '2025-05-25 23:30:33', NULL, '2025-05-25 23:22:39', '2025-05-25 23:30:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `printed_invoices`
--

CREATE TABLE `printed_invoices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(30) DEFAULT NULL,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` varchar(50) DEFAULT NULL,
  `printed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `printed_invoices`
--

INSERT INTO `printed_invoices` (`id`, `number`, `invoice_id`, `batch_id`, `printed_at`, `created_at`, `updated_at`) VALUES
(33, 'FACT-4', 7, 'batch_6833beed182df4.45964547', '2025-05-25 23:07:57', '2025-05-25 23:07:57', '2025-05-25 23:07:57'),
(34, 'FACT-5', 11, 'batch_6833beed182df4.45964547', '2025-05-25 23:07:57', '2025-05-25 23:07:57', '2025-05-25 23:07:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', NULL, NULL),
(2, 'Gerente', NULL, NULL),
(3, 'Trabajador', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `taxes`
--

CREATE TABLE `taxes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `percentage` decimal(5,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `taxes`
--

INSERT INTO `taxes` (`id`, `name`, `percentage`, `created_at`, `updated_at`) VALUES
(1, 'IVA', 21.00, NULL, NULL),
(2, 'IVA Reducido', 10.00, NULL, NULL),
(3, 'IGIC', 7.00, NULL, NULL),
(4, 'IGIC Reducido', 3.00, NULL, NULL),
(5, 'Tipo Cero', 0.00, NULL, '2025-05-25 20:51:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@email.com', '$2y$12$J5gyzWBmVM4.CJQnYr4jeelva.VIpfw7Dq82m0v.hvx9DXj7f8VzG', '2025-05-21 16:39:18', '2025-05-21 16:39:18'),
(2, 'Diego', 'diego@email.com', '$2y$12$fhwKyD7ggG2R1ibsJDCMYup3.jKpRN7lFeBc.p/Q0HI9gLw1b9zKK', '2025-05-21 16:42:36', '2025-05-21 16:42:36'),
(3, 'test', 'test@email.com', '$2y$12$bADKr8xIUT/z5KpwpNeji.O6YBspu7pH2mxY31SXfnIKSKRaNeY1S', '2025-05-21 21:06:49', '2025-05-21 21:06:49'),
(4, 'Trabajador', 'trabajador@email.com', '$2y$12$gSs8/mB//Rhke0OXNji6FOfZKGPSBE/F/EpcGC0iTMASxdTZL7j5m', '2025-05-24 17:36:43', '2025-05-24 17:36:43'),
(5, 'FuriaLatina1', 'jota@email.com', '$2y$12$1gPbL99m73rJKTdq5bWggOELx9Rk9wB7rCOT8M6iDGSeIP8if9Y.K', '2025-05-24 17:41:26', '2025-05-25 20:38:14'),
(6, 'trabajadejota', 'trabajador2@email.com', '$2y$12$lnectkG4cavMVjNQiUm4sO/Vxb.r8CK1/oMY6Fo5Waly9cvr4.Y4q', '2025-05-24 17:43:06', '2025-05-24 17:43:06'),
(7, 'sincompania', 'sincompania@email.com', '$2y$12$AF2iRMPT9Bn/ZYhPZGhVHOMUebEa2fvXlFZwBlvJJAo.wUqU.wLq6', '2025-05-25 16:46:13', '2025-05-25 16:46:13');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `company_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-05-21 16:41:20', '2025-05-21 16:41:20'),
(2, 2, 2, '2025-05-21 16:43:32', '2025-05-21 16:43:32'),
(3, 2, 7, '2025-05-21 21:41:04', '2025-05-21 21:41:04'),
(4, 3, 7, '2025-05-24 17:36:43', '2025-05-24 17:36:43');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clients_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `companies_owner_id_foreign` (`owner_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoices_company_id_foreign` (`company_id`),
  ADD KEY `invoices_user_id_foreign` (`user_id`),
  ADD KEY `invoices_client_id_foreign` (`client_id`);

--
-- Indices de la tabla `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_items_item_id_foreign` (`item_id`);

--
-- Indices de la tabla `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_taxes_invoice_id_foreign` (`invoice_id`),
  ADD KEY `invoice_taxes_tax_id_foreign` (`tax_id`);

--
-- Indices de la tabla `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `items_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `printed_invoices`
--
ALTER TABLE `printed_invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `printed_invoices_invoice_id_foreign` (`invoice_id`),
  ADD KEY `printed_invoices_batch_id_index` (`batch_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `taxes`
--
ALTER TABLE `taxes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`,`company_id`),
  ADD KEY `user_roles_role_id_foreign` (`role_id`),
  ADD KEY `user_roles_company_id_foreign` (`company_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `printed_invoices`
--
ALTER TABLE `printed_invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clients`
--
ALTER TABLE `clients`
  ADD CONSTRAINT `clients_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_items_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`);

--
-- Filtros para la tabla `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  ADD CONSTRAINT `invoice_taxes_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `invoice_taxes_tax_id_foreign` FOREIGN KEY (`tax_id`) REFERENCES `taxes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `printed_invoices`
--
ALTER TABLE `printed_invoices`
  ADD CONSTRAINT `printed_invoices_invoice_id_foreign` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
