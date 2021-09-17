exports.up = (knex) => knex.schema.createTable('section', table => {
    table.integer('num').primary();
    table.string('local');
    table.integer('eleitores');
    table.enu('zona', ['RURAL', 'URBANA']);
    table.boolean('totalizada').defaultTo(false);
});

exports.down = (knex) => knex.schema.dropTable('section');
