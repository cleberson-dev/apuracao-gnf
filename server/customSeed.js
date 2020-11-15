
exports.seed = function(knex) {
  let sections = [];
  let candidates = [];
  let votes = [];
  return knex('vote').del()
    .then(() => knex('section'))
    .then(data => {
      sections = data;
      return knex('candidate');
    })
    .then(function (data) {
      candidates = data;

      sections.forEach(s => {
        candidates.forEach(c => {
          votes.push({ 
            numero_secao: s.num,
            numero_candidato: c.numero,
            votes: 0 
          });
        });
      })

      return knex('vote').insert(votes);
    });
};
