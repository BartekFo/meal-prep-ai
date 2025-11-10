CREATE TABLE `memory_history` (
	`id` text PRIMARY KEY NOT NULL,
	`memory_id` text NOT NULL,
	`previous_value` text,
	`new_value` text,
	`action` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`is_deleted` integer NOT NULL
);
