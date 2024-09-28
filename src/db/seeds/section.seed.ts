import db from "../db";
import { sections } from "../schema";
import { Zone } from "../../vue/services/section.service";
import { getSectionDataFromCSV } from "../../utils";

async function main() {
  const data = await getSectionDataFromCSV("locais.csv");
  console.log("Saving data into database...");
  await db.delete(sections);
  await db.insert(sections).values(
    data.map((row) => ({
      local: row.local,
      number: row.number,
      voters: row.voters,
      zone: (row.zone as Zone) ?? "rural",
    }))
  );
  console.log("Data seeded into database ✅");
}

main();
