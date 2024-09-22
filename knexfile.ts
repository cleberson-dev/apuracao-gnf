// Update with your config settings.

export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
  production: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite3",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    useNullAsDefault: true,
  },
};
