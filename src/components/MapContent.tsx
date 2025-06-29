import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';
import FalloutMap from './FalloutMap';
import Icon from './Icon';
import type { Quest } from '../types';

interface MapContentProps {
  quests: Quest[];
}

const MapContent: React.FC<MapContentProps> = ({ quests }) => {
  const { playMapSound } = useSoundEffects();

  return (
    <Content>
      <div className="crt-text p-4 h-full flex flex-col">
        <div className="flex-1">
          <FalloutMap quests={quests} />
        </div>

        {/* Additional location info at the bottom */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="crt-box p-3">
            <h4 className="text-sm terminal-value mb-2">LOCATION STATUS</h4>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Icon
                  name="stat-radiation-minimal"
                  size={16}
                  className="object-contain map-icon"
                  alt="Radiation"
                />
                <span>RADIATION: MINIMAL</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name="stat-temperature"
                  size={16}
                  className="object-contain map-icon"
                  alt="Temperature"
                />
                <span>TEMPERATURE: MODERATE</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name="stat-signal"
                  size={16}
                  className="object-contain map-icon"
                  alt="Signal"
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
