import data from "../../../locais.json";
import db from "../db";
import { sections } from "../schema";
import { Zone } from "../../vue/services/section.service";

async function main() {
  await db.delete(sections);
  await db.insert(sections).values(
    data.map((row) => ({
      local: row.local,
      number: row.number,
      voters: row.voters,
      zone: (row.zone as Zone) ?? "rural",
    }))
  );
}

main();
