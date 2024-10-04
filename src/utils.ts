import { access, readFile, writeFile, constants } from "fs/promises";
import { parse } from "csv-parse";
import xlsx from "xlsx";
import type { Section } from "./types";

export async function checkFileExists(filepath: string): Promise<boolean> {
  try {
    return !!access(filepath, constants.F_OK);
  } catch {
    return false;
  }
}

const CD_MUNICIPIO = "07668"; // GOVERNADOR NUNES FREIRE => 07668

// path: Relative to Project Dir
export const getSectionDataFromXLSX = async (
  path: string,
  startRow: number,
  endRow: number
): Promise<Section[] | undefined> => {
  if (!(await checkFileExists(path))) return undefined;

  const fileData = xlsx.readFile(path);
  const data: Section[] = [];

  Object.entries(fileData.Sheets[fileData.SheetNames[0]])
    .filter(([key]) => !["!margins", "!ref"].includes(key))
    .slice(0, -1)
    .forEach(async ([key, value]) => {
      const [index] = key.match(/\d+/) as [string];
      const [letter] = key.match(/[A-Z]+/) as [string];

      if (+index < startRow || +index > endRow) return;

      // It's 1-index and the first row is the header
      const normalIndex = +index - 4;
      data[normalIndex] = data[normalIndex] ?? {};

      const val = value.v;

      switch (letter.toUpperCase()) {
        case "A":
          data[normalIndex].number = `${val}`;
        case "B":
          data[normalIndex].local = val;
        case "E":
          data[normalIndex].zone = {
            "ZONA URBANA": "urbana",
            "ZONA RURAL": "rural",
          }[val as "ZONA URBANA" | "ZONA RURAL"];
        case "G":
          data[normalIndex].voters = val;
      }
    });

  console.info(
    "Novas seções salvas com sucesso: ",
    data.length,
    " novas seções"
  );

  return data;
};

export const getSectionDataFromCSV = (
  path: string,
  saveAsJSON?: boolean
): Promise<Section[]> => {
  const headers: Record<string, number> = {};
  const sections: Section[] = [];

  return new Promise((resolve) => {
    readFile(path).then((file) => {
      const records = parse(file, {
        delimiter: ";",
        bom: true,
        relax_quotes: true,
        encoding: "latin1",
      });

      records.on("error", (err) => {
        console.error(err);
      });

      records.on("close", async () => {
        if (saveAsJSON) {
          const outputFilename =
            path.split(".").slice(0, -1).join(".") + ".json";
          await writeFile(outputFilename, JSON.stringify(sections));
          console.log(`Read complete, saved as ${outputFilename}`);
        }
        resolve(sections);
      });

      records.on("data", (section: string[]) => {
        if (Object.keys(headers).length === 0) {
          section.forEach((col, idx) => (headers[col] = idx));
          return;
        }

        if (section[headers["CD_MUNICIPIO"]] === CD_MUNICIPIO) {
          const newSection: typeof sections[number] = {
            voters:
              +section[headers["QT_ELEITOR_ELEICAO_MUNICIPAL"]] ||
              +section[headers["QT_ELEITOR_SECAO"]],
            number: +section[headers["NR_SECAO"]],
            local: section[headers["NM_LOCAL_VOTACAO"]],
          };

          const NM_BAIRRO = section[headers["NM_BAIRRO"]];
          if (NM_BAIRRO.includes("ZONA URBANA")) {
            newSection.zone = "urbana";
          }
          if (NM_BAIRRO.includes("ZONA RURAL")) {
            newSection.zone = "rural";
          }

          sections.push(newSection);
        }
      });
      records.read();
      console.log(`Reading ${path}...`);
    });
  });
};

export const getCandidateDataFromCSV = async (path: string) => {
  const headers: Record<string, number> = {};
  const candidates: any[] = [];

  const file = await readFile(path);
  const records = parse(file, {
    delimiter: ";",
    bom: true,
    relax_quotes: true,
    encoding: "latin1",
  });

  records.on("error", (err) => {
    console.error(err);
  });

  records.on("close", async () => {
    const outputFilename = path.split(".").slice(0, -1).join(".") + ".json";
    await writeFile(outputFilename, JSON.stringify(candidates));
    console.log(`Read complete, saved as ${outputFilename}`);
  });

  records.on("data", (chunk: string[]) => {
    if (Object.keys(headers).length === 0) {
      chunk.forEach((col, idx) => (headers[col] = idx));
      return;
    }

    if (
      chunk[headers["SG_UE"]] === CD_MUNICIPIO &&
      chunk[headers["DS_CARGO"]] === "PREFEITO"
    ) {
      const newCandidate = {
        numero: +chunk[headers["NR_CANDIDATO"]],
        nome: chunk[headers["NM_URNA_CANDIDATO"]],
        codigo: chunk[headers["SQ_CANDIDATO"]],
        partido: chunk[headers["NM_PARTIDO"]],
      };

      candidates.push(newCandidate);
    }
  });
  records.read();
  console.log(`Reading ${path}...`);
};
