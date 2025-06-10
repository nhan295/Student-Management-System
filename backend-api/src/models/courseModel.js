const db = require("../config/db");

module.exports = {
  getAll: () => db("courses").select("*"),
};
