import { Router } from "express";
import * as Vote from "./models/vote.model";

const routes = Router();

routes.get("/", async (_, res) => {
  try {
    const candidates = await Vote.getAllCandidates();
    return res.status(200).send({ candidates });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .send({
        sucess: false,
        message: err.message || "Error while retrieving all candidates.",
      });
  }
});

export default routes;
