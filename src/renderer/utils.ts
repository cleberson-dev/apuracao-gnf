import type { Candidate } from "../types";

export const sortCandidates = (candidates: Candidate[], sections: any[]) => {
  return candidates.sort((a, b) => {
    const votesA = sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votes[a.number], 0);
    const votesB = sections
      .filter((s) => !!s.closed)
      .reduce((prev, acc) => prev + acc.votes[b.number], 0);

    return votesB - votesA;
  });
};

export const formatNumbers = (num: number) =>
  Intl.NumberFormat("pt-BR").format(num);

export const IS_DEV = !!(import.meta as any).env.DEV;
