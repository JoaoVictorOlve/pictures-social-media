const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('active', 'deleted'), // Add the status enum field
    defaultValue: 'active' // Set a default value
  },
});

module.exports = User;