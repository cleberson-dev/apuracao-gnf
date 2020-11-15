// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: "./database.sqlite3"
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: "./database.sqlite3"
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    useNullAsDefault: true
  }
};
