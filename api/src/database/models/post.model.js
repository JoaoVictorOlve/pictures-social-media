const { Sequelize, Model } = require('sequelize'); // Import Model
const sequelize = require('../config/db');
const User = require('./user.model');

class Post extends Model {} // Extend Model

Post.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
      maxLength: 280
    },
    image: {
      type: Sequelize.STRING
    },
    status: {
        type: Sequelize.ENUM('active', 'deleted'), // Add the status enum field
        defaultValue: 'active' // Set a default value
      }  
  },
  {
    sequelize,
    modelName: 'Post', // Set the model name explicitly
    timestamps: false
  }
);

Post.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Post;
