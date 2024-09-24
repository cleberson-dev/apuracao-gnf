import { Router } from "express";
import * as VoteRepository from "../repositories/vote.repository";
import type { SectionVotes } from "../repositories/vote.repository";
import wss from "../sockets";

const routes = Router();

routes.get("/:sectionNumber", async (req, res) => {
  const { sectionNumber } = req.params;
  const sectionVotes = await VoteRepository.getVotesBySection(+sectionNumber);
  return res.status(200).send(sectionVotes);
});

routes.post("/:sectionNumber", async (req, res) => {
  const { sectionNumber } = req.params;
  const sectionVotes = req.body as SectionVotes;

  await VoteRepository.vote(+sectionNumber, sectionVotes);
  wss.broadcast({
    type: "UPDATED_SECTION",
    payload: {
      section: sectionNumber,
      votes: sectionVotes,
    },
  });
  return res.status(201).send(sectionVotes);
});

export default routes;
