exports.up = (knex) => knex.schema.createTable('vote', table => {
    table.integer('numero_secao').references('num').inTable('section');
    table.string('numero_candidato').references('numero').inTable('candidate');
    table.integer('votos');

    table.primary(['numero_secao', 'numero_candidato']);
});

exports.down = (knex) => knex.schema.dropTable('vote');
