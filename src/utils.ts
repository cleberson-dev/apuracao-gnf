import xlsx from "xlsx";

type SectionData = {
  local: string;
  zona: string;
  numSecao: number;
  eleitores: number;
}[];

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
