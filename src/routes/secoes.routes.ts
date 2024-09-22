import { Router } from "express";
import wss from "../sockets";
import * as Vote from "../models/vote.model";

const routes = Router();

routes.get("/", async (_, res) => {
  try {
    const sections = await Vote.getAllSections();
    return res.status(200).send(sections);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message:
        (err as Error).message || "Error while retrieving all the sections",
    });
  }
});

routes.get("/:numSecao", async (req, res) => {
  const { numSecao } = req.params;

  try {
    const section = await Vote.getSectionByNumber(+numSecao);
    return res.status(200).send({ success: true, data: section });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message:
        (err as Error).message ||
        "Error while retrieving section by its number.",
    });
  }
});

routes.patch("/:numSecao/votos", async (req, res) => {
  const { numSecao } = req.params;
  const { votos } = req.body;

  try {
    const voteSectionPayload = await Vote.registerVoteOnSection(
      +numSecao,
      votos
    );

    wss.broadcast({ type: "UPDATED_SECTION", payload: voteSectionPayload });
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ success: false });
  }
});

export default routes;
