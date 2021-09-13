import db from "../db";

export async function getAllSections() {
  const rows = await db("section");
  const sections = [];

  for (const section of rows) {
    let sectionVotes = await db("vote").where({ numero_secao: section.num });
    let votos = {};
    sectionVotes.forEach((sv) => {
      const key = sv.numero_candidato != 0 ? sv.numero_candidato : "outros";
      votos[key] = sv.votos;
    });
    sections.push({
      num: section.num,
      local: section.local,
      eleitores: section.eleitores,
      zona: section.zona.toLowerCase(),
      closed: section.totalizada === 0 ? false : true,
      votos,
    });
  }

  return sections;
}

export async function getSectionByNumber(sectionNum) {
  const section = await db("section").where("num", sectionNum);
  return section;
}
