import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSoundEffects } from '../hooks/useSoundEffects';
import type { Quest } from '../types';
import { getIconUrl } from './Icon';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Boston coordinates (matching the original MapContent)
const BOSTON_COORDS: [number, number] = [42.3601, -71.0589];

// Component to handle map events
const MapEventHandler: React.FC = () => {
  const [lastZoom, setLastZoom] = useState<number | null>(null);
  const { playSound } = useSoundEffects();
  const zoomIntervalRef = useRef<number | null>(null);
  const zoomTimeoutRef = useRef<number | null>(null);

  const map = useMapEvents({
    zoomstart: () => {
      // Initialize zoom level when zooming starts
      if (lastZoom === null) {
        setLastZoom(map.getZoom());
      }

      // Clear any existing intervals
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }

      // Start playing the zoom sound immediately
      playSound('mapZoom', 0.4);

      // Set up interval to repeat the sound every 100ms
      zoomIntervalRef.current = setInterval(() => {
        playSound('mapZoom', 0.4);
      }, 75);

      // Stop the repeating sound after 0.5 seconds
      zoomTimeoutRef.current = setTimeout(() => {
        if (zoomIntervalRef.current) {
          clearInterval(zoomIntervalRef.current);
          zoomIntervalRef.current = null;
        }
      }, 500);
    },
    zoomend: () => {
      const currentZoom = map.getZoom();
      setLastZoom(currentZoom);

      // Stop the repeating sound when zoom ends
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
        zoomIntervalRef.current = null;
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
        zoomTimeoutRef.current = null;
      }
    }
  });

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (zoomIntervalRef.current) {
        clearInterval(zoomIntervalRef.current);
      }
      if (zoomTimeoutRef.current) {
        clearTimeout(zoomTimeoutRef.current);
      }
    };
  }, []);

  return null;
};

const FalloutMap: React.FC<{ quests: Quest[] }> = ({ quests }) => {
  const { playConfirmSound } = useSoundEffects();

  useEffect(() => {
    // Add custom CSS for green monochrome styling
    const style = document.createElement('style');
    style.textContent = `
                              .fallout-map {
        filter:
          invert(1)
          sepia(100%)
          hue-rotate(80deg)
          saturate(1.8)
          brightness(1.1)
          contrast(1.4);
        border: 2px solid #41ff00;
        border-radius: 8px;
        box-shadow:
          0 0 10px rgba(65, 255, 0, 0.3),
          inset 0 0 20px rgba(65, 255, 0, 0.1);
        background: #000;
      }

      .fallout-map .leaflet-container {
        background: #000;
        font-family: 'Monofonto', monospace;
      }

      .fallout-map .leaflet-control-zoom {
        border: 1px solid #41ff00 !important;
        background: rgba(0, 0, 0, 0.8) !important;
        border-radius: 4px !important;
      }

      .fallout-map .leaflet-control-zoom a {
        background: rgba(0, 20, 0, 0.9) !important;
        color: #41ff00 !important;
        border: 1px solid #41ff00 !important;
        text-shadow: 0 0 3px #41ff00 !important;
        font-weight: bold;
        transition: all 0.2s ease;
      }

      .fallout-map .leaflet-control-zoom a:hover {
        background: rgba(65, 255, 0, 0.2) !important;
        box-shadow: 0 0 5px #41ff00 !important;
      }

            .fallout-map .leaflet-popup-content-wrapper {
        background: rgba(235, 235, 235, 0.95) !important;
        border: 2px solid #41ff00 !important;
        border-radius: 4px !important;
        box-shadow:
          0 0 15px rgba(65, 255, 0, 0.6) !important,
          inset 0 0 10px rgba(65, 255, 0, 0.1) !important;
        font-family: 'Monofonto', monospace !important;
        backdrop-filter: blur(2px);
      }

      .fallout-map .leaflet-popup-content {
        margin: 12px !important;
        font-size: 12px !important;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: rgba(235, 235, 235, 0.9) !important;
        color: #41ff00 !important;
        text-shadow: 0 0 3px #41ff00 !important;
        padding: 8px !important;
        border-radius: 2px !important;
      }

      .fallout-map .leaflet-popup-content * {
        color: #0c2f00 !important;
        text-shadow: 0 0 2px #41ff00 !important;
        background: transparent !important;
      }

      .fallout-map .leaflet-popup-tip {
        background: rgba(235, 235, 235, 0.95) !important;
        border: 2px solid #41ff00 !important;
        box-shadow: 0 0 5px rgba(65, 255, 0, 0.4) !important;
      }

      .fallout-map .leaflet-popup-close-button {
        color: #41ff00 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        text-shadow: 0 0 3px #41ff00 !important;
      }

      .fallout-map .leaflet-popup-close-button:hover {
        background: rgba(65, 255, 0, 0.2) !important;
      }

      .fallout-map .leaflet-marker-icon {
        filter:
          invert(1)
          sepia(100%)
          hue-rotate(80deg)
          saturate(1.8)
          brightness(1.1)
          contrast(1.4);
      }

      /* Attribution styling */
      .fallout-map .leaflet-control-attribution {
        background: rgba(0, 20, 0, 0.8) !important;
        color: #41ff00 !important;
        border: 1px solid #41ff00 !important;
        border-radius: 4px !important;
        font-family: 'Monofonto', monospace !important;
        font-size: 10px !important;
      }

      .fallout-map .leaflet-control-attribution a {
        color: #7fff00 !important;
        text-shadow: 0 0 2px #7fff00 !important;
      }

      /* Tile layer green filter overlay */
      .fallout-map::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 2px;
        background: linear-gradient(
          45deg,
          rgba(65, 255, 0, 0.15),
          rgba(30, 120, 0, 0.1)
        );
        mix-blend-mode: color;
        pointer-events: none;
        z-index: 1000;
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
      }, []);

  // Custom icon for the current position marker
  const falloutIcon = new L.Icon({
    iconUrl: getIconUrl('marker-player'),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Custom icon for quest markers
  const questIcon = new L.Icon({
    iconUrl: getIconUrl('quest-main'),
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });

  // Handle marker click sound
  const handleMarkerClick = () => {
    playConfirmSound();
  };

  // Get tracked quests with coordinates
  const trackedQuests = quests.filter(quest => quest.tracked && quest.coordinates);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-lg sm:text-2xl terminal-value mb-4 text-center">
        TACTICAL MAP - BOSTON COMMONWEALTH
      </div>

      <div className="flex-1 relative min-h-[400px]">
        <MapContainer
          center={BOSTON_COORDS}
          zoom={13}
          className="fallout-map w-full h-full"
          zoomControl={true}
          attributionControl={true}
        >
          <MapEventHandler />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Current position marker */}
          <Marker position={BOSTON_COORDS} icon={falloutIcon} eventHandlers={{ click: handleMarkerClick }}>
            <Popup>
              <div className="text-center">
                <div className="font-bold mb-1">CURRENT POSITION</div>
                <div className="text-xs mb-2">BOSTON COMMONWEALTH</div>
                <div className="text-xs">
                  LAT: {BOSTON_COORDS[0]}°N<br/>
                  LON: {BOSTON_COORDS[1]}°W
                </div>
                <div className="mt-2 text-xs">
                  <div>RAD: MINIMAL</div>
                  <div>TEMP: MODERATE</div>
                  <div>SIGNAL: STRONG</div>
                </div>
              </div>
            </Popup>
          </Marker>

          {/* Quest markers for tracked quests */}
          {trackedQuests.map((quest, index) => (
            <Marker
              key={index}
              position={quest.coordinates!}
              icon={questIcon}
              eventHandlers={{ click: handleMarkerClick }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-bold mb-1">ACTIVE MISSION</div>
                  <div className="text-sm mb-2 font-bold">{quest.name}</div>
                  <div className="text-xs mb-2">{quest.company}</div>
                  <div className="text-xs mb-2 crt-dim">{quest.period}</div>
                  <div className="text-xs mb-2">{quest.description}</div>
                  <div className="mt-2 text-xs">
                    <div className="font-bold mb-1">OBJECTIVES:</div>
                    {quest.achievements.slice(0, 2).map((achievement, i) => (
                      <div key={i} className="text-xs">• {achievement}</div>
                    ))}
                    {quest.achievements.length > 2 && (
                      <div className="text-xs">• ...and {quest.achievements.length - 2} more</div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 text-center">
        <div className="crt-box p-3 inline-block">
          <div className="text-sm terminal-value mb-2">MAP CONTROLS</div>
          <div className="text-xs crt-dim">
            Use mouse wheel or +/- buttons to zoom<br/>
            Click and drag to navigate<br/>
            Click marker for location details
            {trackedQuests.length > 0 && (
              <>
                <br/>
                <span className="text-green-400">★ {trackedQuests.length} tracked quest{trackedQuests.length !== 1 ? 's' : ''} visible</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FalloutMap;
