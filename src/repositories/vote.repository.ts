import { eq } from "drizzle-orm";
import db from "../db/db";
import { sections, votes } from "../db/schema";

export type SectionVotes = Record<number | "outros", number>;

export async function cleanAllVotes(): Promise<void> {
  await db.delete(votes);
  await db.update(sections).set({ closed: 0 }).all();
}

export async function getVotesBySection(
  sectionId: number
): Promise<SectionVotes> {
  const results = await db.query.votes.findMany({
    where: (votes, { eq }) => eq(votes.sectionId, sectionId),
  });

  const sectionVotes: SectionVotes = { outros: 0 };
  results.forEach((vote) => {
    sectionVotes[vote.candidateNumber === 0 ? "outros" : vote.candidateNumber] =
      vote.amount;
  });
  return sectionVotes;
}

export async function vote(sectionId: number, sectionVotes: SectionVotes) {
  for (const candidate in sectionVotes) {
    const candidateNumber = candidate === "outros" ? 0 : +candidate;
    const payload = {
      sectionId,
      candidateNumber,
      amount: sectionVotes[candidate],
    };
    await db
      .insert(votes)
      .values(payload)
      .onConflictDoUpdate({
        target: [votes.candidateNumber, votes.sectionId],
        set: { amount: sectionVotes[candidate] },
      });
  }
  // TODO: Marcar seção como totalizada
  await db
    .update(sections)
    .set({ closed: 1 })
    .where(eq(sections.id, sectionId));
}

type AllVotes = {
  sectionId: number;
  votes: Record<number | "outros", number>;
}[];

export async function getAllVotes(): Promise<AllVotes> {
  const results = await db.select().from(votes);

  const allVotes: Record<number, Record<number | "outros", number>> = {};
  results.forEach((vote) => {
    if (!allVotes[vote.sectionId]) {
      allVotes[vote.sectionId] = { outros: 0 };
    }
    allVotes[vote.sectionId][vote.candidateNumber] = vote.amount;
  });

  return Object.entries(allVotes).map(([sectionId, votes]) => ({
    sectionId: +sectionId,
    votes,
  }));
}
