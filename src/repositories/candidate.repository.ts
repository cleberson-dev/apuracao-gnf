import db, { DbCandidate } from "../db";

export async function getAllCandidates(): Promise<DbCandidate[]> {
  const candidates = (await db("candidate")) as DbCandidate[];
  return candidates;
}
