// Update with your config settings.

module.exports = {
<<<<<<< HEAD
=======

>>>>>>> master
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
<<<<<<< HEAD
      filename: './data/handy_app.db3'
    },
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
=======
      filename: './data/handy_app.db3',
    },
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
>>>>>>> master
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
<<<<<<< HEAD
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
=======
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
>>>>>>> master
  },
  testing: {
    client: 'sqlite3',
    connection: {
<<<<<<< HEAD
      filename: './data/testing.db3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }
=======
      filename: './data/testing.db3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './data/migrations',
    },
    seeds: {
      directory: './data/seeds',
    },
  },
>>>>>>> master
};
