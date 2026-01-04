require("dotenv").config();
const { Client } = require("pg");

const connectionString = `postgresql://admin:password@localhost:5432/govmap_gis`;

const client = new Client({ connectionString });

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
