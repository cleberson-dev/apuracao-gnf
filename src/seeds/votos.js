exports.seed = function (knex) {
  let sections;
  return knex("vote")
    .del()
    .then(() => knex("section"))
    .then((data) => {
      sections = data;
      return knex("candidate");
    })
    .then((candidates) => {
      const votes = [];
      sections.forEach((s) => {
        candidates.forEach((c) => {
          votes.push({
            numero_secao: s.num,
            numero_candidato: c.numero,
            votos: 0,
          });
        });
      });
      return Promise.all(votes.map((v) => knex("vote").insert(v)));
    })
    .then((res) => {
      console.log("Terminado", res.length);
    })
    .catch((err) => console.error(err));
};
