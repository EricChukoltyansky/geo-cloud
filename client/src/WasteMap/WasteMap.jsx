import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import "./WasteMap.css";

function WasteMap() {
  const mapRef = useRef();
  const popupRef = useRef();
  const [selectedSite, setSelectedSite] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Initialize map
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([35.2, 31.8]), // Center of Israel
        zoom: 8,
      }),
    });

    // Popup overlay
    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    initialMap.addOverlay(overlay);

    // Load from GeoServer WFS
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: "http://localhost:8600/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typeName=eric:cddl_e&outputFormat=application/json&srsName=EPSG:4326",
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: "#ff6b35" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      }),
    });

    initialMap.addLayer(vectorLayer);

    // Click handler
    initialMap.on("singleclick", (evt) => {
      const feature = initialMap.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );

      if (feature) {
        const props = feature.getProperties();
        setSelectedSite(props);
        overlay.setPosition(evt.coordinate);
      } else {
        setSelectedSite(null);
        overlay.setPosition(undefined);
      }
    });

    setMap(initialMap);

    return () => initialMap.setTarget(undefined);
  }, []);

  const closePopup = () => {
    setSelectedSite(null);
    if (map) {
      map.getOverlays().getArray()[0].setPosition(undefined);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      <div ref={popupRef} className="ol-popup">
        {selectedSite && (
          <>
            <a href="#" className="ol-popup-closer" onClick={closePopup}>
              ✖
            </a>
            <div className="popup-content">
              <h3>{selectedSite.site_name || "Unknown Site"}</h3>
              <p>
                <strong>District:</strong> {selectedSite.district || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {selectedSite.address || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {selectedSite.type || "N/A"}
              </p>
              {selectedSite.contact_person && (
                <p>
                  <strong>Contact:</strong> {selectedSite.contact_person}
                </p>
              )}
              {selectedSite.telephone && (
                <p>
                  <strong>Phone:</strong> {selectedSite.telephone}
                </p>
              )}
              {selectedSite.email && (
                <p>
                  <strong>Email:</strong> {selectedSite.email}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WasteMap;
