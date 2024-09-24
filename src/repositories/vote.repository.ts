import db from "../db/db";
import { votos } from "../db/schema";

export type SectionVotes = Record<number | "outros", number>;

export async function cleanAllVotes(): Promise<void> {
  await db.delete(votos);
  // TODO: Limpar seções totalizadas
}

export async function getVotesBySection(
  sectionNumber: number
): Promise<SectionVotes> {
  const votes = await db.query.votos.findMany({
    where: (votos, { eq }) => eq(votos.sectionNumber, sectionNumber),
  });

  const sectionVotes: SectionVotes = { outros: 0 };
  votes.forEach((v) => {
    sectionVotes[v.candidateNumber === 0 ? "outros" : v.candidateNumber] =
      v.amount;
  });
  return sectionVotes;
}

export async function vote(sectionNumber: number, sectionVotes: SectionVotes) {
  for (const candidate in sectionVotes) {
    const candidateNumber = candidate === "outros" ? 0 : +candidate;
    const payload = {
      sectionNumber,
      candidateNumber,
      amount: sectionVotes[candidate],
    };
    console.log({ payload });
    await db
      .insert(votos)
      .values(payload)
      .onConflictDoUpdate({
        target: [votos.candidateNumber, votos.sectionNumber],
        set: { amount: sectionVotes[candidate] },
      });
  }
  // TODO: Marcar seção como totalizada
}
