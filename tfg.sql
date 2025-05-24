-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-05-2025 a las 02:08:29
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
(2, 'cliente 2', '123546712c', 'Calle Lugo', 'Logroño', '26007', 'La Rioja', 'cliente2@email.com', 2, '2025-05-21 16:45:33', '2025-05-21 16:45:33'),
(3, 'clientetest', '12354627c', 'C/Lugo, 4', 'Logroño', '26007', 'A Coruña', 'clientetest@email.com', 7, '2025-05-21 21:41:29', '2025-05-21 21:41:29');

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
(2, 'Company 1', 'Company 1', '160863994X', 'C/Lugo, 4', 'C/Lugo, 4', 'Logroño', '26007', 'La Rioja', 'company1@email.com', '600878443', 'FACT', 2, '2025-05-21 16:43:32', '2025-05-21 16:43:32'),
(3, 'Company 2', 'Company 2', '12353425z', 'C/Lugo, 4', 'C/Lugo, 4', 'Logroño', '26007', 'Please select', 'compania2@email.com', '600878443', 'INV', 2, '2025-05-21 20:26:30', '2025-05-21 20:26:30'),
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
(2, 2, 2, 1, 'F-1747853485', '2025-05-21', '2025-05-21', '[{\"description\":\"producto personalizado\",\"quantity\":1,\"unit_price\":50}]', 82.64, 17.36, 100.00, '2025-05-21 16:51:25', '2025-05-21 16:51:25'),
(3, 2, 2, 2, 'F-1747853566', '2025-05-21', '2025-05-21', '[{\"description\":\"PERSONALIZADO ITEM\",\"quantity\":1,\"unit_price\":10}]', 90.91, 19.09, 110.00, '2025-05-21 16:52:46', '2025-05-21 16:52:46'),
(5, 2, 2, 1, 'F-1747865485', '2025-05-22', '2025-05-22', '[]', 16.53, 3.47, 20.00, '2025-05-21 20:11:25', '2025-05-21 20:11:25'),
(6, 7, 3, 3, 'F-1747871997', '2025-05-22', '2025-05-22', '[]', 10.91, 1.09, 12.00, '2025-05-21 21:59:57', '2025-05-21 21:59:57');

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
(1, 2, 1, 'producto 1', 'producto 1 descripcion', 10.00, 1, '2025-05-21 16:51:25', '2025-05-21 16:51:25'),
(2, 2, 2, 'producto 2', 'producto 2 descripcion', 20.00, 2, '2025-05-21 16:51:25', '2025-05-21 16:51:25'),
(3, 3, 4, 'servicio 2', 'servicio 2 descripcion', 40.00, 1, '2025-05-21 16:52:46', '2025-05-21 16:52:46'),
(4, 3, 3, 'servicio 1', 'servicio 1 descripcion', 30.00, 2, '2025-05-21 16:52:46', '2025-05-21 16:52:46'),
(6, 5, 2, 'producto 2', 'producto 2 descripcion', 20.00, 1, '2025-05-21 20:11:25', '2025-05-21 20:11:25'),
(7, 6, 5, 'testitem', '123', 12.00, 1, '2025-05-21 21:59:57', '2025-05-21 21:59:57');

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
(1, 2, 1, 0.00, NULL, NULL),
(2, 3, 1, 0.00, NULL, NULL),
(4, 5, 1, 0.00, NULL, NULL),
(5, 6, 2, 0.00, NULL, NULL);

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
(4, 2, 'servicio 2', 'servicio 2 descripcion', 40.00, '2025-05-21 16:44:42', '2025-05-21 16:44:42'),
(5, 7, 'testitem', '123', 12.00, '2025-05-21 21:41:49', '2025-05-21 21:41:49');

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
(13, '2025_04_27_181011_create_invoice_items_table', 1);

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
(9, 'App\\Models\\User', 3, 'auth_token', 'f958fc769d11c3ff4483c717c72fdab6e7dda65b722d15c7051a48ff34a17af8', '[\"*\"]', '2025-05-21 22:04:33', NULL, '2025-05-21 21:59:21', '2025-05-21 22:04:33');

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
(5, 'Tipo Cero', 0.00, NULL, NULL);

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
(3, 'test', 'test@email.com', '$2y$12$bADKr8xIUT/z5KpwpNeji.O6YBspu7pH2mxY31SXfnIKSKRaNeY1S', '2025-05-21 21:06:49', '2025-05-21 21:06:49');

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
(2, 2, 3, '2025-05-21 20:26:30', '2025-05-21 20:26:30'),
(3, 2, 7, '2025-05-21 21:41:04', '2025-05-21 21:41:04');

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `invoice_taxes`
--
ALTER TABLE `invoice_taxes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `taxes`
--
ALTER TABLE `taxes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
