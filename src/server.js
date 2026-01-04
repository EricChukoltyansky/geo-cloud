const express = require("express");
const cors = require("cors");
const pool = require("./db");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// GeoJSON endpoint
app.get("/api/waste-sites", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        jsonb_build_object(
          'type', 'FeatureCollection',
          'features', jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(geom)::jsonb,
              'properties', jsonb_build_object(
                'site_name', site_name,
                'district', district,
                'address', address,
                'type', type,
                'contact_person', contact_person,
                'telephone', telephone,
                'email', email
              )
            )
          )
        ) as geojson
      FROM cddl_e
    `);

    res.json(result.rows[0].geojson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

