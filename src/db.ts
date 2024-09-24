import knex from "knex";
import knexConfig from "../knexfile";

export type DbSection = {
  num: number;
  local: string;
  eleitores: number;
  zona: string;
  totalizada: 0 | 1;
};

export type DbCandidate = {
  numero: number;
  nome: string;
  cor: string;
  perfil: string;
};

export type DbVote = {
  numero_secao: number;
  numero_candidato: number;
  votos: number;
};

const db = knex(knexConfig.development);

export default db;
