CREATE TABLE `listings` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`neighborhood` text NOT NULL,
	`sale_date` text NOT NULL,
	`created_at` integer NOT NULL
);
