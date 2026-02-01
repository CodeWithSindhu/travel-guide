import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to update map view when center changes or places are updated
const MapUpdater = ({ center, places }) => {
  const map = useMap();
  
  useEffect(() => {
    if (places && places.length > 0) {
        // Create bounds from places to ensure all are visible
        const markers = places
            .filter(p => p.lat && p.lon)
            .map(p => [parseFloat(p.lat), parseFloat(p.lon)]);
        
        if (markers.length > 0) {
            const bounds = L.latLngBounds(markers);
            // Fit bounds with padding and max zoom limit (to avoid super zoom on single point)
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
            return; 
        }
    }
    
    // Fallback if no valid places or bounds
    if (center) {
      map.setView(center, 13);
    }
  }, [center, places, map]);
  return null;
};

// Helper to render markers and handle interaction
const MapMarkers = ({ places }) => {
  const map = useMap();

  return (
    <>
      {places.map((place, idx) => {
            if (!place.lat || !place.lon) return null;
            
            const position = [parseFloat(place.lat), parseFloat(place.lon)];

            const customIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `<div class="marker-pin-container" style="
                    background-image: url('${place.image}');
                "></div>`,
                iconSize: [48, 48],
                iconAnchor: [24, 24],
                popupAnchor: [0, -24]
            });

            return (
                <Marker 
                    key={idx} 
                    position={position}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => {
                            map.flyTo(position, 16, {
                                duration: 1.5,
                                easeLinearity: 0.25
                            });
                        },
                        mouseover: (e) => {
                            e.target.openPopup();
                        }
                    }}
                >
                    <Popup className="custom-popup" closeButton={false}>
                        <div className="w-[260px] overflow-hidden rounded-xl bg-white shadow-sm font-sans">
                            <div className="h-32 w-full relative">
                               <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                               <span className="absolute bottom-2 left-3 text-xs font-bold text-white uppercase tracking-wider text-shadow-sm">{place.descriptor}</span>
                            </div>
                            <div className="p-4 text-left">
                                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-3">{place.name}</h3>
                                
                                <div className="flex gap-2.5">
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-teal-600 !text-white visited:text-white hover:text-white text-xs font-bold py-2.5 rounded-lg text-center hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm tracking-wide"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Directions
                                    </a>
                                    <Link 
                                        to={place.link || `/attraction/${place.name.toLowerCase().replace(/ /g, '-')}`}
                                        className="flex-1 bg-white text-gray-900 border border-gray-200 text-xs font-bold py-2.5 rounded-lg text-center hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Details
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            )
        })}
    </>
  );
};

MapMarkers.propTypes = {
  places: PropTypes.array
};

const CityMap = ({ center, places, cityName }) => {
  const [mapReady, setMapReady] = useState(false);
  const position = center || [51.505, -0.09]; // Default to London

  // OpenTripMap API Key
  const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;

  return (
    <div className="h-full w-full max-w-full relative z-0 overflow-hidden rounded-[1.5rem]">
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: "100%", width: "100%", background: "#f3f4f6" }}
            whenCreated={() => setMapReady(true)}
        >
         {/* CartoDB Voyager Tiles (Premium Look) */}
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
         {/* OpenTripMap Layer (Optional - adds POIs) can be added as overlay */}
         
        {/* Update view when center changes */}
        <MapUpdater center={center} places={places} />

        <MapMarkers places={places} />
        </MapContainer>
      </div>
    </div>
  );
};

CityMap.propTypes = {
  center: PropTypes.array,
  places: PropTypes.array,
  cityName: PropTypes.string
};

export default CityMap;
