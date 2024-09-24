import { Router } from "express";
import * as CandidateRepository from "../repositories/candidate.repository";

const routes = Router();

routes.get("/", async (_, res) => {
  try {
    const candidates = await CandidateRepository.getAllCandidates();
    return res.status(200).send(candidates);
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      success: false,
      message:
        (err as Error).message || "Error while retrieving all candidates.",
    });
  }
});

export default routes;
