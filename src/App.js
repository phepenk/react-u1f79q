import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import 'mapbox-gl-draw/dist/mapbox-gl-draw.css';
import React, { useState, useRef, useCallback, useMemo } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';
const baseClient = mbxClient({ accessToken: MAPBOX_TOKEN });
const geocodingClient = mbxGeocoding(baseClient);

const skyLayer = {
  id: 'sky',
  type: 'sky',
  paint: {
    'sky-type': 'atmosphere',
    'sky-atmosphere-sun': [0.0, 0.0],
    'sky-atmosphere-sun-intensity': 15
  }
};

function initMarkers(places) {
  return places.map((o, index) => (
    <Marker key={o.address} longitude={o.lng} latitude={o.lat}>
      {index === 0 && <div>Home</div>}
      {index > 0 && <div>Client {index}</div>}
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
  // const [zoom, setZoom] = useState(8);

  // useEffect(() => {
  //   if (map.current) return; // wait for map to initialize
  //   map.current = new mapboxgl.Map({
  //     container: mapContainer.current,
  //     style: 'mapbox://styles/mapbox/streets-v11',
  //     center: [homeLng, homeLat],
  //     zoom: zoom
  //   });
  // });

  // useEffect(() => {
  //   if (!map.current) return; // wait for map to initialize
  //   map.current.on('move', () => {
  //     setSalesmanLng(map.current.getCenter().lng.toFixed(4));
  //     setSalesmanLat(map.current.getCenter().lat.toFixed(4));
  //     setZoom(map.current.getZoom().toFixed(2));
  //   });
  // });

  // useEffect(() => {
  //   if (!map.current) return;
  //   // Create a new marker
  //   const salesmanLocation = [salesmanLng, salesmanLat];
  //   const salesmanMarker = new mapboxgl.Marker()
  //     .setLngLat(salesmanLocation)
  //     .addTo(map);
  // });

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

  const clients = [
    {
      address: 'Pipe Road Cafe, 23 Pipe Rd, Laverton North VIC 3026',
      lat: -37.821371,
      lng: 144.8123303
    },
    {
      address: '90 The Avenue, Sunshine West VIC 3020',
      lat: -37.7986085,
      lng: 144.7972616
    },
    {
      address: '128 Hopkins St, Footscray VIC 3011',
      lat: -37.7997227,
      lng: 144.89855
    },
    {
      address: '151-153 Furlong Rd, St Albans VIC 3021',
      lat: -37.7609435,
      lng: 144.813343
    },
    {
      address: '21-25 Panamax Rd, Ravenhall VIC 3023',
      lat: -37.7619244,
      lng: 144.7450634
    },
    {
      address: '71-73 Koala Cres, Westmeadows VIC 3049',
      lat: -37.6766534,
      lng: 144.8743493
    },
    {
      address: '165-167 Southern Rd, Heidelberg West VIC 3081',
      lat: -37.7417723,
      lng: 145.0389304
    },
    {
      address: '550 Doncaster Rd, Doncaster VIC 3108',
      lat: -37.788449,
      lng: 145.117333
    },
    {
      address: '12-18 Yarra St, South Melbourne VIC 3025',
      lat: -37.8311829,
      lng: 144.9585691
    },
    {
      address: '2C Blackwood Dr, Wonga Park VIC 3115',
      lat: -37.741011,
      lng: 145.2698233
    }
  ];
  const places = [homeCoord, ...clients];

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
