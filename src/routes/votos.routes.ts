import { Router } from "express";
import * as VoteRepository from "../repositories/vote.repository";

const routes = Router();

routes.get("/", async (_, res) => {
  try {
    const votes = await VoteRepository.getAllVotes();
    return res.status(200).send(votes);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: (err as Error).message || "Error while retrieving all votes.",
    });
  }
});

routes.post("/", async (req, res) => {
  const { numSecao, numCandidato, votos } = req.body;

  try {
    const newVote = await VoteRepository.addVotes(
      numSecao,
      numCandidato,
      votos
    );
    return res.status(201).send({ success: true, data: newVote });
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      success: false,
      message: (err as Error).message || "Error while registering new votes.",
    });
  }
});

export default routes;
