import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ 
  bins = [], 
  routes = [], 
  center = [40.7128, -74.0060], 
  zoom = 13,
  onBinClick,
  onRouteClick 
}) => {
  const mapRef = useRef();

  const binIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const routeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render bins */}
        {bins.map((bin) => (
          <Marker
            key={bin._id}
            position={[bin.location.coordinates[1], bin.location.coordinates[0]]}
            icon={binIcon}
            eventHandlers={{
              click: () => onBinClick && onBinClick(bin),
            }}
          >
            <Popup>
              <div>
                <h3>Bin {bin.binId}</h3>
                <p>Status: {bin.status}</p>
                <p>Capacity: {bin.currentLevel}/{bin.capacity}</p>
                <p>Address: {bin.address.street}, {bin.address.city}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render route waypoints */}
        {routes.map((route) => (
          route.path.map((point, index) => (
            <Marker
              key={`${route._id}-${index}`}
              position={[point.lat, point.lng]}
              icon={routeIcon}
              eventHandlers={{
                click: () => onRouteClick && onRouteClick(route),
              }}
            >
              <Popup>
                <div>
                  <h3>{route.name}</h3>
                  <p>Point {index + 1}</p>
                  <p>Estimated Time: {route.estimatedTime} minutes</p>
                </div>
              </Popup>
            </Marker>
          ))
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
