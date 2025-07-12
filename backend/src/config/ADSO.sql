-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 12-07-2025 a las 17:31:34
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ADSO`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amonestaciones`
--

CREATE TABLE `amonestaciones` (
  `id_amonestacion` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `id_delito` int(11) NOT NULL,
  `numero_amonestacion` int(11) NOT NULL,
  `monto_multa` decimal(10,2) NOT NULL,
  `horas_curso` int(11) DEFAULT 0,
  `dias_trabajo_civico` int(11) DEFAULT 0,
  `dias_carcel` int(11) DEFAULT 0,
  `fecha_emision` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_vencimiento` date DEFAULT NULL,
  `estado` enum('pendiente','pagada','cumplida','vencida') DEFAULT 'pendiente',
  `policia_emite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `tabla_afectada` varchar(50) NOT NULL,
  `operacion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `id_registro` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `datos_anteriores` varchar(1000) DEFAULT NULL,
  `datos_nuevos` varchar(1000) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudadanos`
--

CREATE TABLE `ciudadanos` (
  `id_ciudadano` int(11) NOT NULL,
  `codigo_universal` varchar(30) NOT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `planeta_origen` varchar(50) NOT NULL,
  `ciudad_origen` varchar(100) DEFAULT NULL,
  `direccion_actual` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `estado` enum('activo','fallecido','desaparecido') DEFAULT 'activo',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `registrado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudadanos`
--

INSERT INTO `ciudadanos` (`id_ciudadano`, `codigo_universal`, `qr_code`, `nombre`, `apellido`, `fecha_nacimiento`, `planeta_origen`, `ciudad_origen`, `direccion_actual`, `telefono`, `email`, `foto`, `estado`, `fecha_registro`, `registrado_por`) VALUES
(2, 'CC', 'ASKNAS', 'Kevin', 'ocampo', '2025-07-18', 'Tierra', 'cartafi', 'limonar1', '312312', 'kevin@gmail.com', 'url', 'activo', '2025-07-12 14:58:08', 1),
(11, 'CC1', 'ADSASDA', 'Iris', 'Ospina', '2025-07-10', 'Venus', 'tin', 'tan', '12312', 'iris@gmail.com', 'asda', 'activo', '2025-07-12 15:21:12', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_planeta` int(11) NOT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `delitos`
--

CREATE TABLE `delitos` (
  `id_delito` int(11) NOT NULL,
  `id_incidente` int(11) NOT NULL,
  `id_ciudadano` int(11) NOT NULL,
  `id_tipo_delito` int(11) NOT NULL,
  `descripcion_especifica` text DEFAULT NULL,
  `gravedad` enum('leve','grave','muy_grave') NOT NULL,
  `estado` enum('investigacion','procesado','cerrado') DEFAULT 'investigacion',
  `fecha_procesamiento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `procesado_por` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidentes`
--

CREATE TABLE `incidentes` (
  `id_incidente` int(11) NOT NULL,
  `numero_caso` varchar(50) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `planeta` varchar(50) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccion` text NOT NULL,
  `descripcion_general` text NOT NULL,
  `policia_reporta` int(11) NOT NULL,
  `estado` enum('abierto','en_proceso','cerrado') DEFAULT 'abierto',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planetas`
--

CREATE TABLE `planetas` (
  `id_planeta` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo_iso` varchar(10) DEFAULT NULL,
  `zona_horaria` varchar(50) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_delito`
--

CREATE TABLE `tipos_delito` (
  `id_tipo` int(11) NOT NULL,
  `codigo_penal` varchar(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` enum('mayor','menor') NOT NULL,
  `pena_minima_dias` int(11) DEFAULT 0,
  `pena_maxima_dias` int(11) DEFAULT NULL,
  `multa_minima` decimal(10,2) DEFAULT 0.00,
  `multa_maxima` decimal(10,2) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `codigo_empleado` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('administrador','general','policia','secretaria') NOT NULL,
  `planeta` varchar(50) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultimo_acceso` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `intentos_fallidos` int(11) DEFAULT 0,
  `bloqueado_hasta` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `codigo_empleado`, `nombre`, `apellido`, `email`, `password_hash`, `rol`, `planeta`, `ciudad`, `telefono`, `foto_perfil`, `activo`, `fecha_creacion`, `ultimo_acceso`, `intentos_fallidos`, `bloqueado_hasta`) VALUES
(1, 'EMP002', 'kevin', 'ocampo', 'kevin.ocampo@email.com', '$2b$11$dVh8YTBcBWmlLy6mVlQw6exvUxt8l7HEtRwH2Epvk3KuNkkd84ld6', 'general', 'Marte', 'cartago', '100000', 'foto_1010', 1, '2025-07-12 14:38:02', '0000-00-00 00:00:00', 0, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  ADD PRIMARY KEY (`id_amonestacion`),
  ADD KEY `id_ciudadano` (`id_ciudadano`),
  ADD KEY `id_delito` (`id_delito`),
  ADD KEY `policia_emite` (`policia_emite`);

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  ADD PRIMARY KEY (`id_ciudadano`),
  ADD UNIQUE KEY `codigo_universal` (`codigo_universal`),
  ADD UNIQUE KEY `qr_code` (`qr_code`),
  ADD KEY `registrado_por` (`registrado_por`);

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD KEY `id_planeta` (`id_planeta`);

--
-- Indices de la tabla `delitos`
--
ALTER TABLE `delitos`
  ADD PRIMARY KEY (`id_delito`),
  ADD KEY `id_incidente` (`id_incidente`),
  ADD KEY `id_ciudadano` (`id_ciudadano`),
  ADD KEY `id_tipo_delito` (`id_tipo_delito`),
  ADD KEY `procesado_por` (`procesado_por`);

--
-- Indices de la tabla `incidentes`
--
ALTER TABLE `incidentes`
  ADD PRIMARY KEY (`id_incidente`),
  ADD UNIQUE KEY `numero_caso` (`numero_caso`),
  ADD KEY `policia_reporta` (`policia_reporta`);

--
-- Indices de la tabla `planetas`
--
ALTER TABLE `planetas`
  ADD PRIMARY KEY (`id_planeta`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD UNIQUE KEY `codigo_iso` (`codigo_iso`);

--
-- Indices de la tabla `tipos_delito`
--
ALTER TABLE `tipos_delito`
  ADD PRIMARY KEY (`id_tipo`),
  ADD UNIQUE KEY `codigo_penal` (`codigo_penal`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `codigo_empleado` (`codigo_empleado`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  MODIFY `id_amonestacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  MODIFY `id_ciudadano` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `delitos`
--
ALTER TABLE `delitos`
  MODIFY `id_delito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `incidentes`
--
ALTER TABLE `incidentes`
  MODIFY `id_incidente` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planetas`
--
ALTER TABLE `planetas`
  MODIFY `id_planeta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_delito`
--
ALTER TABLE `tipos_delito`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amonestaciones`
--
ALTER TABLE `amonestaciones`
  ADD CONSTRAINT `amonestaciones_ibfk_1` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`),
  ADD CONSTRAINT `amonestaciones_ibfk_2` FOREIGN KEY (`id_delito`) REFERENCES `delitos` (`id_delito`),
  ADD CONSTRAINT `amonestaciones_ibfk_3` FOREIGN KEY (`policia_emite`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  ADD CONSTRAINT `ciudadanos_ibfk_1` FOREIGN KEY (`registrado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`id_planeta`) REFERENCES `planetas` (`id_planeta`);

--
-- Filtros para la tabla `delitos`
--
ALTER TABLE `delitos`
  ADD CONSTRAINT `delitos_ibfk_1` FOREIGN KEY (`id_incidente`) REFERENCES `incidentes` (`id_incidente`),
  ADD CONSTRAINT `delitos_ibfk_2` FOREIGN KEY (`id_ciudadano`) REFERENCES `ciudadanos` (`id_ciudadano`),
  ADD CONSTRAINT `delitos_ibfk_3` FOREIGN KEY (`id_tipo_delito`) REFERENCES `tipos_delito` (`id_tipo`),
  ADD CONSTRAINT `delitos_ibfk_4` FOREIGN KEY (`procesado_por`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `incidentes`
--
ALTER TABLE `incidentes`
  ADD CONSTRAINT `incidentes_ibfk_1` FOREIGN KEY (`policia_reporta`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
