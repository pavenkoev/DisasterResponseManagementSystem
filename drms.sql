-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 28, 2024 at 01:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `drms`
--

-- --------------------------------------------------------

--
-- Table structure for table `incidents`
--

CREATE TABLE `incidents` (
  `id` int(11) NOT NULL,
  `location` point NOT NULL,
  `radius` decimal(10,0) NOT NULL,
  `incident_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `incidents`
--

INSERT INTO `incidents` (`id`, `location`, `radius`, `incident_type`) VALUES
(1, 0x000000000101000000713d0ad7a3c049400ad7a3703d0ab7bf, 2000, 1),
(2, 0x0000000001010000003d0ad7a370cd494052b81e85eb51c8bf, 3000, 2),
(3, 0x000000000101000000363ffed2a23e4740b77efacf9a8b5ec0, 1500, 2),
(4, 0x0000000001010000003be466b801b543408d7e349c329a5bc0, 40000, 15),
(25, 0x0000000001010000003735d07cce8f4440c0417bf5f1f457c0, 20000, 13),
(26, 0x0000000001010000006d003620422840405951836918f054c0, 1000, 2),
(27, 0x00000000010100000074d4d171354c41403d0b42791f5254c0, 1500, 3),
(28, 0x0000000001010000002dd159661130444038f7578ffb095fc0, 25000, 5),
(29, 0x000000000101000000a1bab9f8dbd04240bfb9bf7adc9f5dc0, 3000, 1),
(30, 0x000000000101000000b1f9b83654a043401c96067e54045ac0, 100000, 14),
(31, 0x000000000101000000f450db8651f845401f300f99f29752c0, 30000, 15),
(32, 0x000000000101000000e6eb32fca77b4a400f2a711de3bc5bc0, 2000, 7),
(33, 0x0000000001010000009fca694fc9534840c4d2c08f6aa253c0, 3500, 12),
(34, 0x000000000101000000d3bd4eeacb86354059c4b0c398bf63c0, 1000, 11),
(35, 0x0000000001010000001b9eeca8459e534001000000808b42c0, 5000, 2),
(36, 0x000000000101000000b2463d44a3ff4040202922c32a1359c0, 60000, 16),
(37, 0x00000000010100000009bf555320e846400100000040695ac0, 40000, 2),
(39, 0x0000000001010000001600a119b5c7394001000000e0e759c0, 30000, 11);

-- --------------------------------------------------------

--
-- Table structure for table `incident_resources`
--

CREATE TABLE `incident_resources` (
  `incident_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `incident_type`
--

CREATE TABLE `incident_type` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `color` varchar(256) NOT NULL,
  `icon` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `incident_type`
--

INSERT INTO `incident_type` (`id`, `name`, `color`, `icon`) VALUES
(1, 'Earthquake', '#b57f59', 'earthquake.png'),
(2, 'Fire', '#fb2e2e', 'fire.png'),
(3, 'Hurricane', '#808080', 'hurricane.png'),
(5, 'Flood', '#0000ff', 'flood.png'),
(7, 'Tornado', '#000000', 'tornado.png'),
(11, 'Volcanic Eruption', '#ffa500', 'volcano.png'),
(12, 'Land Slide', '#06402b', 'landslide.png'),
(13, 'Heat Wave', '#ffff00', 'heat_wave.png'),
(14, 'Nuclear Catastrophe', '#ffa500', 'nuclear.png'),
(15, 'Alien Invasion', '#32cd32', 'alien_invasion.png'),
(16, 'Biological Catastrophe', '#008000', 'biohazard.png');

-- --------------------------------------------------------

--
-- Table structure for table `incident_type_resources`
--

CREATE TABLE `incident_type_resources` (
  `incident_type` int(11) NOT NULL,
  `resource_type` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `incident_type_resources`
--

INSERT INTO `incident_type_resources` (`incident_type`, `resource_type`, `quantity`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `location` point NOT NULL,
  `resource_type` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `location`, `resource_type`, `quantity`) VALUES
(2, 0x000000000101000000e1163edf47e0464001000000a0905ac0, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `resource_type`
--

CREATE TABLE `resource_type` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `color` varchar(256) NOT NULL,
  `icon` varchar(256) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `resource_type`
--

INSERT INTO `resource_type` (`id`, `name`, `color`, `icon`, `description`) VALUES
(1, 'Hospital', '#ffffff\r\n', 'Icon', 'Medical and surgical treatment.'),
(2, 'Firefighters', '#ff0000', 'Icon', 'Trained to control fires, conduct rescues, and protect structures.'),
(4, 'Search and Rescue Team', '#ffff00', 'Icon', 'Equipped for locating and rescuing trapped individuals.'),
(5, 'Power Supply Resources', '#06402b', 'Icon', 'Maintain electricity and fuel for essential operations.'),
(8, 'Water Rescue Team', '#0000ff', 'Icon', 'For rescuing stranded individuals.'),
(11, 'Scientific Research and Analysis Team', '#00008b', 'Icon', 'Study alien technology and biology to better understand the threat and potentially adapt or counter it.'),
(12, 'Food and Water Distribution Center', '#008080', 'Icon', 'Supply affected individuals with food and clean drinking water.'),
(13, 'Emergency Shelter', '#add8e6', 'Icon', 'Provide temporary housing for individuals displaced by disasters.'),
(14, 'Biohazard and Containment Team', '#39ff14', 'Icon', 'Protect against potential alien pathogens or biological hazards that could threaten humans.'),
(15, 'Animal Rescue and Veterinary Service', '#06402b', 'Icon', 'Rescue and care for pets and livestock affected by disasters.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `incidents-incident-type-foreign` (`incident_type`);

--
-- Indexes for table `incident_resources`
--
ALTER TABLE `incident_resources`
  ADD PRIMARY KEY (`incident_id`,`resource_id`),
  ADD KEY `incident-resources-resource-id-foreign` (`resource_id`);

--
-- Indexes for table `incident_type`
--
ALTER TABLE `incident_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `incident_type_resources`
--
ALTER TABLE `incident_type_resources`
  ADD PRIMARY KEY (`incident_type`,`resource_type`),
  ADD KEY `incident-type-resources-resource-type-foreign` (`resource_type`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `resources-resource-type-foreign` (`resource_type`);

--
-- Indexes for table `resource_type`
--
ALTER TABLE `resource_type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `incidents`
--
ALTER TABLE `incidents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `incident_type`
--
ALTER TABLE `incident_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `resource_type`
--
ALTER TABLE `resource_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `incidents-incident-type-foreign` FOREIGN KEY (`incident_type`) REFERENCES `incident_type` (`id`);

--
-- Constraints for table `incident_resources`
--
ALTER TABLE `incident_resources`
  ADD CONSTRAINT `incident-resources-incident-id-foreign` FOREIGN KEY (`incident_id`) REFERENCES `incidents` (`id`),
  ADD CONSTRAINT `incident-resources-resource-id-foreign` FOREIGN KEY (`resource_id`) REFERENCES `resources` (`id`);

--
-- Constraints for table `incident_type_resources`
--
ALTER TABLE `incident_type_resources`
  ADD CONSTRAINT `incident-type-resources-incident-type-foreign` FOREIGN KEY (`incident_type`) REFERENCES `incident_type` (`id`),
  ADD CONSTRAINT `incident-type-resources-resource-type-foreign` FOREIGN KEY (`resource_type`) REFERENCES `resource_type` (`id`);

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources-resource-type-foreign` FOREIGN KEY (`resource_type`) REFERENCES `resource_type` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
