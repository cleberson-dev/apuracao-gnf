import { Router } from "express";
import * as VoteRepository from "../repositories/vote.repository";
import type { SectionVotes } from "../repositories/vote.repository";
import wss from "../sockets";

const routes = Router();

// Get All Votes
routes.get("/", async (_, res) => {
  const votes = await VoteRepository.getAllVotes();
  return res.status(200).send(votes);
});

// Get Votes by Section
routes.get("/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  const sectionVotes = await VoteRepository.getVotesBySection(+sectionId);
  return res.status(200).send(sectionVotes);
});

// Insert/Update Votes by Section
routes.post("/:sectionId", async (req, res) => {
  const { sectionId } = req.params;
  const sectionVotes = req.body as SectionVotes;

  await VoteRepository.vote(+sectionId, sectionVotes);
  wss.broadcast({
    type: "UPDATED_SECTION",
    payload: {
      section: sectionId,
      votes: sectionVotes,
    },
  });
  return res.status(201).send(sectionVotes);
});

export default routes;
