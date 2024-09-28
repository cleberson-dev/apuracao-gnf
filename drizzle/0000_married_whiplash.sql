CREATE TABLE `secoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` integer NOT NULL,
	`local` text NOT NULL,
	`numero_eleitores` integer NOT NULL,
	`zona` text NOT NULL,
	`totalizada` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `votos` (
	`id_secao` integer NOT NULL,
	`numero_candidato` integer NOT NULL,
	`quantidade` integer NOT NULL,
	PRIMARY KEY(`id_secao`, `numero_candidato`),
	FOREIGN KEY (`id_secao`) REFERENCES `secoes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `secoes_numero_unique` ON `secoes` (`numero`);