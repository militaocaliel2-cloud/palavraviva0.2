CREATE TABLE `faith_journey` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`journeyDate` varchar(10) NOT NULL,
	`streak` int NOT NULL DEFAULT 0,
	`prayerDays` int NOT NULL DEFAULT 0,
	`completed` json NOT NULL,
	`reminderTime` varchar(5) NOT NULL DEFAULT '07:30',
	`reminderDays` json NOT NULL,
	`themePreference` enum('system','light','dark') NOT NULL DEFAULT 'system',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faith_journey_id` PRIMARY KEY(`id`)
);
