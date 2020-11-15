
exports.up = (knex) => knex.schema.createTable('candidate', table => {
    table.integer('numero').primary();
    table.string('nome');
    table.string('cor').defaultTo('#000');
});

exports.down = function(knex) {
  
};
