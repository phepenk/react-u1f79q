import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [homeLng, setHomeLng] = useState(-70.9);
  const [homeLat, setHomeLat] = useState(42.35);
  const [salesmanLng, setSalesmanLng] = useState(-70.9);
  const [salesmanLat, setSalesmanLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // wait for map to initialize
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [homeLng, homeLat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setSalesmanLng(map.current.getCenter().lng.toFixed(4));
      setSalesmanLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (!map.current) return;
    // Create a new marker
    const salesmanLocation = [salesmanLng, salesmanLat];
    const salesmanMarker = new mapboxgl.Marker()
      .setLngLat(salesmanLocation)
      .addTo(map);
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {salesmanLng} | Latitude: {salesmanLat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}
