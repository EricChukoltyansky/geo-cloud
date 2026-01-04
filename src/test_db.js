require("dotenv").config({ path: "./.env" });
const { Client } = require("pg");

console.log("Database config:", {
  host: "localhost",
  port: process.env.POSTGIS_PORT,
  database: process.env.POSTGIS_DB,
  user: process.env.POSTGIS_USER,
  password: process.env.POSTGIS_PASS ? "***" : "MISSING",
});

const client = new Client({
  host: "localhost",
  port: 5432,
  database: "govmap_gis",
  user: "admin",
  password: process.env.POSTGIS_PASS,
});

console.log(
  "Attempting connection with password length:",
  client.connectionParameters.password?.length
);

client
  .connect()
  .then(() => {
    console.log("✅ Connected successfully!");
    return client.query("SELECT COUNT(*) FROM cddl_e");
  })
  .then((result) => {
    console.log("✅ Waste sites count:", result.rows[0].count);
    client.end();
  })
  .catch((err) => {
    console.error("❌ Connection failed:", err.message);
    client.end();
  });
