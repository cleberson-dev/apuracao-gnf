const xlsx = require("xlsx");
const jsonfile = require('jsonfile');

const secoes = [];
const planilha = xlsx.readFile("secoes.xlsx").Sheets.SECOES;
const quantidadeSecoes = 69;

for (let i = 2; i < 2 + quantidadeSecoes; i++) {
  const secao = {
    numero_secao: planilha["C" + i].v,
    local_votacao: planilha["A" + i].v,
    quantidade_eleitores: planilha["D" + i].v,
    zona: planilha["B" + i].v,
  };
  secoes.push(secao);
}

jsonfile.writeFile('./secoes.json', secoes);
