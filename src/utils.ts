import { readFile, writeFile } from "fs/promises";
import { parse } from "csv-parse";
import xlsx from "xlsx";

type SectionData = {
  local: string;
  zona: string;
  numSecao: number;
  eleitores: number;
}[];

type Section = {
  eleitores: number;
  cod_secao: number;
  local: string;
  zona?: "URBANA" | "RURAL";
};

const CD_MUNICIPIO = "07668"; // GOVERNADOR NUNES FREIRE => 07668

// path: Relative to Project Dir
export const getSectionDataFromXLSX = async (path: string) => {
  const fileData = xlsx.readFile(path);
  const data: SectionData = [];

  Object.entries(fileData.Sheets[fileData.SheetNames[0]])
    .filter(([key]) => !["!margins", "!ref"].includes(key))
    .slice(0, -1)
    .forEach(([key, value]) => {
      const [index] = key.match(/\d+/) as [string];

      if (+index === 1) return;

      // It's 1-index and the first row is the header
      const normalIndex = +index - 2;
      data[normalIndex] = data[normalIndex] ?? {};

      const val = value.v;
      if (!data[normalIndex].local) {
        data[normalIndex].local = val;
        return;
      }

      if (!data[normalIndex].zona) {
        data[normalIndex].zona = val;
        return;
      }

      if (!data[normalIndex].numSecao) {
        data[normalIndex].numSecao = val;
        return;
      }

      if (!data[normalIndex].eleitores) {
        data[normalIndex].eleitores = val;
        return;
      }
    });

  return data;
};

export const getSectionDataFromCSV = async (path: string) => {
  const headers: Record<string, number> = {};
  const sections: Section[] = [];

  const file = await readFile(path);
  const records = parse(file, {
    delimiter: ";",
    bom: true,
    relax_quotes: true,
  });

  records.on("error", (err) => {
    console.error(err);
  });

  records.on("close", async () => {
    const outputFilename = path.split(".").slice(0, -1).join(".") + ".json";
    await writeFile(outputFilename, JSON.stringify(sections));
    console.log(`Read complete, saved as ${outputFilename}`);
  });

  records.on("data", (section: string[]) => {
    if (Object.keys(headers).length === 0) {
      section.forEach((col, idx) => (headers[col] = idx));
      return;
    }

    if (section[headers["CD_MUNICIPIO"]] === CD_MUNICIPIO) {
      const newSection: typeof sections[number] = {
        eleitores:
          +section[headers["QT_ELEITOR_ELEICAO_MUNICIPAL"]] ||
          +section[headers["QT_ELEITOR_SECAO"]],
        cod_secao: +section[headers["NR_SECAO"]],
        local: section[headers["NM_LOCAL_VOTACAO"]],
      };

      const NM_BAIRRO = section[headers["NM_BAIRRO"]];
      if (NM_BAIRRO.includes("ZONA URBANA")) {
        newSection.zona = "URBANA";
      }
      if (NM_BAIRRO.includes("ZONA RURAL")) {
        newSection.zona = "RURAL";
      }

      sections.push(newSection);
    }
  });
  records.read();
  console.log("Reading file...");
};