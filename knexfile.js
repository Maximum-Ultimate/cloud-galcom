module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'USRdbSamsungGalcom',
      password: 'n4UCql8kfaMMZeQoQ8No',
      database: 'dbSamsungGalcom'
    },
    migrations: {
      directory: './migrations'
    }
  }
};