CREATE TABLE `votos` (
	`numero_secao` integer NOT NULL,
	`numero_candidato` integer NOT NULL,
	`quantidade` integer NOT NULL,
	PRIMARY KEY(`numero_secao`, `numero_candidato`)
);
