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

export async function registerVoteOnSection(sectionNum, votes) {
  for (const numCandidato in votes) {
    await db("vote").where({
      numero_candidato: Number(numCandidato),
      numero_secao: Number(sectionNum)
    }).update("votos", votos[numCandidato]);
  }
  await db("section").where("num", Number(sectionNum)).update("totalizada", true);
  const voteSection = await db("section").where("num", Number(sectionNum)).first();
  const sectionVotes = await db("vote").where("numero_secao", sectionNum);
  
  let novosVotos = {};
  sectionVotes.forEach((sv) => {
    const key = sv.numero_candidato != 0 ? sv.numero_candidato : "outros";
    novosVotos[key] = sv.votos;
  });
  
  const voteSectionPayload = {
    num: voteSection.num,
    local: voteSection.local,
    eleitores: voteSection.eleitores,
    zona: voteSection.zona.toLowerCase(),
    closed: voteSection.totalizada === 0 ? false : true,
    votos: novosVotos,
  };
  return voteSectionPayload;
}

export async function getAllVotes() {
  const votes = await db("vote");
  return votes;
}
