require("dotenv").config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.CONNECTION_STRING, {dialect: 'mysql'});
module.exports = sequelize;