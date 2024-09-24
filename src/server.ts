import express from "express";
import cors from "cors";
import path from "path";
import * as VoteRepository from "./repositories/vote.repository";
import votosRoutes from "./routes/votes.routes";

const ASSETS_DIR = path.resolve(__dirname, "static");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/static", express.static(ASSETS_DIR));

app.use("/votos", votosRoutes);

app.get("/limparVotos", async (_, res) => {
  try {
    await VoteRepository.cleanAllVotes();
    return res.status(200).send({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ success: false });
  }
});

app.get("*", (_, res) => {
  res.sendFile(ASSETS_DIR + "/index.html");
});

export default app;
