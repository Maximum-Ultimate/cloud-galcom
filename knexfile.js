module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db_samsungGalcom'
    },
    migrations: {
      directory: './migrations'
    }
  }
};