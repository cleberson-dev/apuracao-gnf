import express from "express";
import cors from "cors";
import path from 'path';
import * as Vote from './models/vote.model';
import secoesRoutes from './routes/secoes.routes';

const ASSETS_DIR = path.resolve(__dirname, 'static');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/static', express.static(ASSETS_DIR));

app.get("/candidatos", async (_, res) => {
  try {
    const candidates = await Vote.getAllCandidates();
    return res.status(200).send({ candidates });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ sucess: false, message: err.message || 'Error while retrieving all candidates.' });
  }
});

app.use('/secoes', secoesRoutes);

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
