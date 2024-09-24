import db, { DbSection, DbVote } from "../db";

export type Zone = "urbana" | "rural";
export type SectionVotes = Record<number | "outros", number>;
export type RepositorySection = {
  number: number;
  voters: number;
  local: string;
  zone: Zone;
  closed?: boolean;
  votes: SectionVotes;
};

export async function getAllSections(): Promise<RepositorySection[]> {
  const rows = (await db("section")) as DbSection[];
  const sections: RepositorySection[] = [];

  for (const section of rows) {
    const sectionVotes = (await db("vote").where({
      numero_secao: section.num,
    })) as DbVote[];
    let votes: SectionVotes = {
      outros: 0,
    };
    sectionVotes.forEach((sv) => {
      const key = sv.numero_candidato != 0 ? sv.numero_candidato : "outros";
      votes[key] = sv.votos;
    });
    sections.push({
      number: section.num,
      local: section.local,
      voters: section.eleitores,
      zone: section.zona.toLowerCase() as Zone,
      closed: section.totalizada !== 0,
      votes,
    });
  }

  return sections;
}

export async function getSectionByNumber(
  sectionNum: number
): Promise<DbSection | undefined> {
  const [section] = (await db("section").where(
    "num",
    sectionNum
  )) as DbSection[];
  return section;
}
