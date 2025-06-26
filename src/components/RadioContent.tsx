import React from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';

const RadioContent: React.FC = () => {
  const { playRadioSound, playHoverSound, playSelectSound } = useSoundEffects();
  
  const stations = [
    { freq: "101.5", name: "EMAIL FREQUENCY", info: "john.wanderer@vault-tec.com" },
    { freq: "103.7", name: "PHONE BEACON", info: "+1-555-PIPBOY" },
    { freq: "105.1", name: "LINKEDIN SIGNAL", info: "linkedin.com/in/johnwanderer" },
    { freq: "107.9", name: "GITHUB BROADCAST", info: "github.com/lonewanderer" },
    { freq: "109.3", name: "PORTFOLIO TRANSMITTER", info: "johnwanderer.dev" }
  ];

  return (
    <Content>
      <div className="crt-text p-6 max-w-2xl mx-auto">
      <div className="text-lg sm:text-2xl terminal-value text-center mb-8">COMMUNICATION CHANNELS</div>
      <div className="space-y-4">
        {stations.map((station, index) => (
          <div 
            key={index} 
            className="crt-box p-5 crt-hover cursor-pointer"
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playRadioSound(true);
              playSelectSound();
            }}
          >
            <div className="text-xl sm:text-3xl terminal-value mb-1">{station.freq}</div>
            <div className="terminal-label mb-1">{station.name}</div>
            <div className="text-sm crt-dim">{station.info}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 mt-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-10 bg-green-500 crt-signal" style={{animationDelay: `${i * 0.1}s`}}></div>
        ))}
      </div>
      </div>
    </Content>
  );
};

export default RadioContent; 