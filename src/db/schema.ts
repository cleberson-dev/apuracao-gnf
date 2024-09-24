import { integer, primaryKey, sqliteTable } from "drizzle-orm/sqlite-core";

export const votos = sqliteTable(
  "votos",
  {
    sectionNumber: integer("numero_secao").notNull(),
    candidateNumber: integer("numero_candidato").notNull(),
    amount: integer("quantidade").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.sectionNumber, table.candidateNumber] }),
    };
  }
);
