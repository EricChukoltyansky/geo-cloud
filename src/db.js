const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  port: process.env.POSTGIS_PORT || 5432,
  database: process.env.POSTGIS_DB,
  user: process.env.POSTGIS_USER,
  password: process.env.POSTGIS_PASS,
});

module.exports = pool;
