
exports.seed = function(knex) {
  return knex('candidate').del()
    .then(function () {
      return knex('candidate').insert([
        { numero: 22, nome: 'Fernando PL', cor: '#274696' },
        { numero: 40, nome: 'Josimar da Serraria', cor: '#FFB800' },
        { numero: 77, nome: 'Dra. Regina', cor: '#F37037' },
        { numero: 27, nome: 'Dr. Haroldo', cor: '#0065CB' },
        { numero: 0, nome: 'Outros', cor: '#2A9D8F' }
      ]);
    });
};
