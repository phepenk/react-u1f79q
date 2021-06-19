import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import Pin from './pin.js';
import CLIENTS from './clients.json';

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
const baseClient = mbxClient({ accessToken: MAPBOX_TOKEN });
const geocodingClient = mbxGeocoding(baseClient);

function initMarkers(places) {
  return places.map((o, index) => (
    <Marker key={o.address} longitude={o.lng} latitude={o.lat}>
      {index === 0 && <div>Home</div>}
      {index > 0 && <div>Client {index}</div>}
      <Pin size={20} onClick={() => this.setState({ selectedPin: o })} />
    </Marker>
  ));
}

export default function App(props) {
  const [homeCoord, setHomeCoord] = useState({
    address: '141 Dohertys Rd, Laverton North VIC 3026',
    lat: -37.8284827,
    lng: 144.7821916
  });
  const [salesmanCoord, setSalesmanCoord] = useState({
    lat: homeCoord.lat,
    lng: homeCoord.lng
  });

  const [viewport, setViewport] = useState({
    latitude: -37.8136,
    longitude: 144.9631,
    zoom: 10,
    bearing: 0,
    pitch: 50
  });
  const mapRef = useRef();
  const handleViewportChange = useCallback(
    newViewport => setViewport(newViewport),
    []
  );

  const handleGeocoderViewportChange = useCallback(newViewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    // console.log('> newViewport', newViewport);
    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides
    });
  }, []);

  const places = [homeCoord, ...CLIENTS];

  const onMapLoad = useCallback(evt => {
    // const map = evt.target;
    // map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
  }, []);

  const [interactionState, setInteractionState] = useState({});
  const [settings, setSettings] = useState({
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    minZoom: 0,
    maxZoom: 20,
    minPitch: 0,
    maxPitch: 85
  });

  const updateSettings = useCallback(
    (name, value) =>
      setSettings(s => ({
        ...s,
        [name]: value
      })),
    []
  );

  return (
    <div style={{ height: '100vh' }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onInteractionStateChange={s => setInteractionState({ ...s })}
        onLoad={onMapLoad}
      >
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
          marker={true}
        />
        {initMarkers(places)}
      </MapGL>
    </div>
  );
}
