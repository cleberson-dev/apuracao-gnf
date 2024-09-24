import db, { DbCandidate, DbSection, DbVote } from "../db";
import { RepositorySection, SectionVotes, Zone } from "./section.repository";

export async function registerVoteOnSection(
  sectionNum: number,
  votes: SectionVotes
) {
  for (const candidateNumber in votes) {
    await db("vote")
      .where({
        numero_candidato: candidateNumber === "outros" ? 0 : +candidateNumber,
        numero_secao: +sectionNum,
      })
      .update("votos", votes[candidateNumber]);
  }
  await db("section")
    .where("num", +sectionNum)
    .update("totalizada", true);
  const voteSection = await db("section")
    .where("num", +sectionNum)
    .first();
  const sectionVotes = await db("vote").where("numero_secao", sectionNum);

  let newVotes: SectionVotes = { outros: 0 };
  sectionVotes.forEach((sv) => {
    const key = sv.numero_candidato != 0 ? sv.numero_candidato : "outros";
    newVotes[key] = sv.votos;
  });

  const voteSectionPayload: RepositorySection = {
    number: voteSection.num,
    local: voteSection.local,
    voters: voteSection.eleitores,
    zone: voteSection.zona.toLowerCase() as Zone,
    closed: voteSection.totalizada !== 0,
    votes: newVotes,
  };

  return voteSectionPayload;
}

export async function getAllVotes(): Promise<DbVote[]> {
  const votes = await db("vote");
  return votes;
}

export async function cleanAllVotes(): Promise<void> {
  const votes: DbVote[] = [];
  await db("vote").del();

  const sections = (await db("section")) as DbSection[];
  const candidates = (await db("candidate")) as DbCandidate[];

  sections.forEach((s) => {
    candidates.forEach((c) => {
      votes.push({
        numero_secao: s.num,
        numero_candidato: c.numero,
        votos: 0,
      });
    });
  });
  await Promise.all(votes.map((v) => db("vote").insert(v)));
  await db("vote").update("votos", 0);
  await db("section").update("totalizada", false);
}

export async function addVotes(
  sectionNumber: number,
  candidateNumber: number,
  amount: number
) {
  const newVote = await db("vote").insert({
    numero_secao: sectionNumber,
    numero_candidato: candidateNumber,
    votos: amount || 0,
  });

  return newVote;
}
