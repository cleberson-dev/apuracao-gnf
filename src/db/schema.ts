import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const sections = sqliteTable("secoes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  number: integer("numero").notNull().unique(),
  local: text("local").notNull(),
  voters: integer("numero_eleitores").notNull(),
  zone: text("zona", { enum: ["rural", "urbana"] }).notNull(),
  closed: integer("totalizada").default(0),
});

export const votes = sqliteTable(
  "votos",
  {
    sectionId: integer("id_secao")
      .notNull()
      .references(() => sections.id, { onDelete: "cascade" }),
    candidateNumber: integer("numero_candidato").notNull(),
    amount: integer("quantidade").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.sectionId, table.candidateNumber] }),
    };
  }
);
