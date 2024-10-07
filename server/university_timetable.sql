-- Check if the database does not exist and create it
CREATE DATABASE IF NOT EXISTS university_timetable;


USE university_timetable;


-- Table structure for table `Users`
CREATE TABLE
  IF NOT EXISTS `Users` (
    `id` CHAR(36) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT FALSE,
    `accessToken` VARCHAR(1024),
    `tokenCreatedAt` DATETIME,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `description` VARCHAR(255),
    `avatar_path` VARCHAR(255),
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Cohorts`
CREATE TABLE
  IF NOT EXISTS `Cohorts` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Faculties`
CREATE TABLE
  IF NOT EXISTS `Faculties` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Venues`
CREATE TABLE
  IF NOT EXISTS `Venues` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `capacity` INT NOT NULL DEFAULT 100,
    `equipment_type` SET('computer', 'projector', 'workstation'),
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `blocked_timeslots` VARCHAR(255) DEFAULT '',
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Disciplines`
CREATE TABLE
  IF NOT EXISTS `Disciplines` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `facultyId` CHAR(36) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`facultyId`) REFERENCES `Faculties` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Staff`
CREATE TABLE
  IF NOT EXISTS `Staff` (
    `id` CHAR(36) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `disciplineId` CHAR(36) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`disciplineId`) REFERENCES `Disciplines` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Units`
CREATE TABLE
  IF NOT EXISTS `Units` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `unitCode` VARCHAR(50) NOT NULL UNIQUE,
    `credit` INT NOT NULL,
    `quota` INT NOT NULL DEFAULT 100,
    `disciplineId` CHAR(36) NOT NULL,
    `staffId` CHAR(36) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`disciplineId`) REFERENCES `Disciplines` (`id`),
    FOREIGN KEY (`staffId`) REFERENCES `Staff` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Unit_Sessions`, this does not link to Sessions table
CREATE TABLE
  IF NOT EXISTS `Unit_Sessions` (
    `id` CHAR(36) NOT NULL,
    `unit_id` CHAR(36) NOT NULL,
    `session_type` ENUM('lecture', 'tutorial', 'lab', 'workshop') NOT NULL,
    `equipment_type` SET('computer', 'projector', 'workstation'),
    `duration_hours` INT NOT NULL,
    `capacity` INT NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`unit_id`) REFERENCES `Units`(`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Table structure for table `Sessions`
CREATE TABLE
  IF NOT EXISTS `Sessions` (
    `id` CHAR(36) NOT NULL,
    `unitId` CHAR(36) NOT NULL,
    `unitsessionId` CHAR(36) NOT NULL,
    `type` ENUM ('lecture', 'tutorial', 'lab', 'workshop') NOT NULL,
    `capacity` INT NOT NULL DEFAULT 50,
    `enrolledCount` INT NOT NULL DEFAULT 0,
    `dayOfTheWeek` ENUM (
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday'
    ) NOT NULL,
    `startTime` TIME NOT NULL,
    `endTime` TIME NOT NULL,
    `staffId` CHAR(36),
    `venueId` CHAR(36) NOT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`unitId`) REFERENCES `Units` (`id`),
    FOREIGN KEY (`unitsessionId`) REFERENCES `Unit_Sessions` (`id`),
    FOREIGN KEY (`staffId`) REFERENCES `Staff` (`id`),
    FOREIGN KEY (`venueId`) REFERENCES `Venues` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;



-- Table structure for table `Clash_Free_Sets`
CREATE TABLE
  IF NOT EXISTS `Clash_Free_Sets` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `set` VARCHAR(255) NOT NULL,
    `ref_type` ENUM ('cohort', 'staff') NOT NULL,
    `cohortId` CHAR(36),
    `staffId` CHAR(36),
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cohortId`) REFERENCES `Cohorts` (`id`) ON DELETE
    SET
      NULL ON UPDATE CASCADE,
      FOREIGN KEY (`staffId`) REFERENCES `Staff` (`id`) ON DELETE
    SET
      NULL ON UPDATE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;


-- Set 5
-- Table structure for table `otp_attempts`
CREATE TABLE
  IF NOT EXISTS `otp_attempts` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `user_email` varchar(255) NOT NULL,
    `send_otp` varchar(255) DEFAULT NULL,
    `given_otp` varchar(255) DEFAULT NULL,
    `success` INT DEFAULT NULL,
    `status` varchar(255) DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;