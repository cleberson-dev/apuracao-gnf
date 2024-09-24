import db from "../db/db";
import { closedSections, votes } from "../db/schema";

export type SectionVotes = Record<number | "outros", number>;

export async function cleanAllVotes(): Promise<void> {
  await db.delete(votes);
  await db.delete(closedSections);
}

export async function getVotesBySection(
  sectionNumber: number
): Promise<SectionVotes> {
  const results = await db.query.votes.findMany({
    where: (votes, { eq }) => eq(votes.sectionNumber, sectionNumber),
  });

  const sectionVotes: SectionVotes = { outros: 0 };
  results.forEach((vote) => {
    sectionVotes[vote.candidateNumber === 0 ? "outros" : vote.candidateNumber] =
      vote.amount;
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
    await db
      .insert(votes)
      .values(payload)
      .onConflictDoUpdate({
        target: [votes.candidateNumber, votes.sectionNumber],
        set: { amount: sectionVotes[candidate] },
      });
  }
  // TODO: Marcar seção como totalizada
  await db
    .insert(closedSections)
    .values({ sectionNumber, closed: 1 })
    .onConflictDoNothing();
}

export async function getAllClosedSections(): Promise<
  typeof closedSections.$inferSelect[]
> {
  const result = await db.select().from(closedSections);
  return result;
}

type AllVotes = {
  sectionNumber: number;
  votes: Record<number | "outros", number>;
}[];

export async function getAllVotes(): Promise<AllVotes> {
  const results = await db.select().from(votes);

  const allVotes: Record<number, Record<number | "outros", number>> = {};
  results.forEach((vote) => {
    if (!allVotes[vote.sectionNumber]) {
      allVotes[vote.sectionNumber] = { outros: 0 };
    }
    allVotes[vote.sectionNumber][vote.candidateNumber] = vote.amount;
  });

  return Object.entries(allVotes).map(([sectionNumber, votes]) => ({
    sectionNumber: +sectionNumber,
    votes,
  }));
}
