import express from "express";
import cors from "cors";
import path from "path";
import * as VoteRepository from "./repositories/vote.repository";
import votosRoutes from "./routes/votes.routes";
import db from "./db/db";
import { sections } from "./db/schema";
import { eq } from "drizzle-orm";

const ASSETS_DIR = path.resolve(__dirname, "static");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/static", express.static(ASSETS_DIR));

app.use("/votos", votosRoutes);

app.get("/limpar-votos", async (_, res) => {
  try {
    await VoteRepository.cleanAllVotes();
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false });
  }
});

// Seções - All Sections
app.get("/secoes", async (_, res) => {
  const sections = await db.query.sections.findMany();
  return res.status(200).send(sections.map(section => ({...section, closed: !!section.closed})));
});

app.post("/secoes", async (req, res) => {
  const { body } = req;
  const newSection = {
    number: body.number,
    local: body.local,
    voters: body.voters,
    zone: body.zone,
  } satisfies typeof sections.$inferInsert;

  try {
    const [result] = await db.insert(sections).values(newSection).returning();
    return res.status(201).send({ ...result, closed: !!result.closed });
  } catch (e) {
    console.error('Something went wrong: ', e);
    return res.status(400).send({ message: (e as Error).message });
  }
});

app.patch("/secoes/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const updatedSection = {
    number: body.number,
    local: body.local,
    closed: body.closed,
    voters: body.voters,
    zone: body.zone,
  } satisfies Partial<Omit<typeof sections.$inferInsert, "id">>;
  try {
    const [result] = await db.update(sections).set(updatedSection).where(eq(sections.id, +id)).returning();
    return res.status(200).send(result);
  } catch (e) {
    console.error('Something went wrong', e);
    return res.status(400).send({ message: (e as Error).message });
  }
});

app.get("*", (_, res) => {
  res.sendFile(ASSETS_DIR + "/index.html");
});

export default app;
