
exports.seed = function(knex) {
  return knex('candidate').del()
    .then(function () {
      return knex('candidate').insert([
        { numero: 22, nome: 'Fernando PL', cor: 'blue' },
        { numero: 40, nome: 'Josimar da Serraria', cor: 'yellow' },
        { numero: 77, nome: 'Dra. Regina', cor: 'purple' },
        { numero: 27, nome: 'Dr. Haroldo', cor: 'orange' },
        { numero: 0, nome: 'Outros', cor: 'green' }
      ]);
    });
};
