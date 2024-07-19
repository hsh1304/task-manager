const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
  },
  dueDate: {
    type: DataTypes.DATE,
  },
});

module.exports = Task;
