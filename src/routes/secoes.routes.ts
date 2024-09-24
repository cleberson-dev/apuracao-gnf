import { Router } from "express";
import wss from "../sockets";
import * as VoteRepository from "../repositories/vote.repository";
import * as SectionRepository from "../repositories/section.repository";
import { RepositorySection, Zone } from "../repositories/section.repository";

const routes = Router();

routes.get("/", async (_, res) => {
  try {
    const sections = await SectionRepository.getAllSections();
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
    const section = await SectionRepository.getSectionByNumber(+numSecao);
    if (!section) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).send({
      success: true, 
      data: { 
        number: section.num,
        local: section.local,
        voters: section.eleitores,
        zone: section.zona as Zone,
        closed: !!section.totalizada,
      } satisfies Omit<RepositorySection, "votes"> 
    });
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
    const section = await SectionRepository.getSectionByNumber(+numSecao);
    if (!section) {
      return res.status(404).send({
        success: false,
        message: `Seção de nº ${numSecao} não encontrada`,
      });
    }
    const voteSectionPayload = await VoteRepository.registerVoteOnSection(
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
