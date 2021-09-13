import express from "express";
import cors from "cors";
import path from 'path';
import db from "./db";
import wss from "./sockets";
import * as Vote from './models/vote.model';

const ASSETS_DIR = path.resolve(__dirname, 'static');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/static', express.static(ASSETS_DIR));

app.get("/candidatos", async (req, res) => {
  const candidates = await db("candidate");

  res.status(200);
  return res.send(candidates);
});

app.get("/secoes", async (_, res) => {
  try {
    const sections = await Vote.getAllSections();
    return res.status(200).send(sections);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message || 'Error while retrieving all the sections' });
  }
});

app.get("/secoes/:numSecao", async (req, res) => {
  const { numSecao } = req.params;

  try {
    const section = await Vote.getSectionByNumber(numSecao);
    return res.status(200).send({ success: true, data: section });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message || "Error while retrieving section by its number." });
  }
});

app.patch("/secoes/:numSecao/votos", async (req, res) => {
  const { numSecao } = req.params;
  const { votos } = req.body;

  try {
    const voteSectionPayload = await Vote.registerVoteOnSection(numSecao, votos);
    
    wss.broadcast({ type: "UPDATED_SECTION", payload: voteSectionPayload });
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ success: false });
  }
});

app.get("/votos", async (_, res) => {
  try {
    const votes = await Vote.getAllVotes();
    return res.status(200).send(votes);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message || 'Error while retrieving all votes.' })
  }
});

app.post("/votos", async (req, res) => {
  const { numSecao, numCandidato, votos } = req.body;
  
  try {
    const newVote = await Vote.createVotes({ numSecao, numCandidato, votos });
    return res.status(201).send({ success: true, data: newVote });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ success: false, message: err.message || 'Error while registering new votes.' });
  }
});

app.get("/limparVotos", async (_, res) => {
  try {
    await Vote.cleanAllVotes();
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false });
  }
});

app.get('*', (_, res) => {
  res.sendFile(ASSETS_DIR + '/index.html');
});

export default app;
