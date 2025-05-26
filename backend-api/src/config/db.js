const knex = require('knex');
const knexConfig = require('../config/knexfile');
const db = knex(knexConfig) // khoi tao knex voi cau hinh

module.exports = db