import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';

const MapContent: React.FC = () => {
  const { playMapSound } = useSoundEffects();
  
  return (
    <Content>
      <div className="crt-text p-6 max-w-2xl mx-auto text-center">
      <div className="text-lg sm:text-2xl terminal-value mb-8">CURRENT LOCATION</div>
      <div 
        className="w-24 h-24 mb-6 crt-blink cursor-pointer flex items-center justify-center mx-auto"
        onClick={() => playMapSound()}
      >
        <img 
          src={`${import.meta.env.BASE_URL}icons/FO4MapMarkers/icon_3.svg`} 
          alt="Current Location"
          className="w-full h-full object-contain map-icon"
        />
      </div>
      <h3 className="text-base sm:text-xl terminal-value mb-2">BOSTON COMMONWEALTH</h3>
      <p className="mb-4 crt-dim">United States • East Coast</p>
      <div className="inline-block crt-box p-4 mb-6 font-mono">
        LAT: 42.3601° N<br/>
        LON: 71.0589° W
      </div>
      <div className="space-y-3 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <img 
              src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_74.svg`} 
              alt="Radiation"
              className="w-full h-full object-contain map-icon"
            />
          </div>
          <span>RADIATION: MINIMAL</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <img 
              src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_76.svg`} 
              alt="Temperature"
              className="w-full h-full object-contain map-icon"
            />
          </div>
          <span>TEMPERATURE: MODERATE</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 flex items-center justify-center">
            <img 
              src={`${import.meta.env.BASE_URL}icons/FO4StatsPageIcons/icon_104.svg`} 
              alt="Signal"
              className="w-full h-full object-contain map-icon"
            />
          </div>
          <span>SIGNAL: STRONG</span>
        </div>
      </div>
      <div className="crt-divider py-6">
        <h4 className="text-base sm:text-lg terminal-value mb-3">AVAILABILITY</h4>
        <p>✓ Remote Work</p>
        <p>✓ Hybrid (2-3 days/week)</p>
        <p>✓ Relocation Possible</p>
      </div>
      </div>
    </Content>
  );
};

export default MapContent; 