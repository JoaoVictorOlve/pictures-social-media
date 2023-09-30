const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  username: 'root'
});

module.exports = sequelize;