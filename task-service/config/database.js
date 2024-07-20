const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_db', 'username', 'password', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
