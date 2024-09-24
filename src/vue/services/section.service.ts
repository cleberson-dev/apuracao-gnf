import sections from "../../data/sections";

export type Zone = "urbana" | "rural";

export type Section = {
  number: number;
  local: string;
  voters: number;
  zone: Zone;
};

export default class SectionService {
  static fetchAll(): Section[] {
    return sections.map((section) => ({
      number: section.numero,
      local: section.local,
      voters: section.eleitores,
      zone: section.zona as Zone,
    }));
  }
}
