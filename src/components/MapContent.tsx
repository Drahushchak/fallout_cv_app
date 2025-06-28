import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';
import FalloutMap from './FalloutMap';

const MapContent: React.FC = () => {
  const { playMapSound } = useSoundEffects();

  return (
    <Content>
      <div className="crt-text p-4 h-full flex flex-col">
        <div className="flex-1">
          <FalloutMap />
        </div>

        {/* Additional location info at the bottom */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="crt-box p-3">
            <h4 className="text-sm terminal-value mb-2">LOCATION STATUS</h4>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_74.svg`}
                  alt="Radiation"
                  className="w-4 h-4 object-contain map-icon"
                />
                <span>RADIATION: MINIMAL</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_76.svg`}
                  alt="Temperature"
                  className="w-4 h-4 object-contain map-icon"
                />
                <span>TEMPERATURE: MODERATE</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_104.svg`}
                  alt="Signal"
                  className="w-4 h-4 object-contain map-icon"
                />
                <span>SIGNAL: STRONG</span>
              </div>
            </div>
          </div>

          <div className="crt-box p-3">
            <h4 className="text-sm terminal-value mb-2">AVAILABILITY</h4>
            <div className="text-xs space-y-1 crt-dim">
              <p>✓ Remote Work</p>
              <p>✓ Hybrid (2-3 days/week)</p>
              <p>✓ Relocation Possible</p>
            </div>
          </div>
        </div>

        {/* Interactive sound element */}
        <div className="mt-3 text-center">
                    <button
            className="crt-subtab text-xs"
            onClick={() => playMapSound()}
            onMouseEnter={() => playMapSound()}
          >
            ♪ PLAY MAP SOUND
          </button>
        </div>
      </div>
    </Content>
  );
};

export default MapContent;
