import React from 'react';

const CRTStyles: React.FC = () => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Monofonto&display=swap');
      
      * {
        font-family: 'Monofonto', monospace;
        image-rendering: pixelated;
        image-rendering: -moz-crisp-edges;
        image-rendering: crisp-edges;
      }
      
      /* CRT Monitor Effects */
      .crt-container {
        background: #000000;
        background-image: 
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(65, 255, 0, 0.03) 2px,
            rgba(65, 255, 0, 0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(65, 255, 0, 0.01) 2px,
            rgba(65, 255, 0, 0.01) 4px
          );
        position: relative;
      }
      
      .crt-container::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(
          ellipse at center,
          rgba(65, 255, 0, 0) 0%,
          rgba(0, 0, 0, 0.4) 100%
        );
        pointer-events: none;
        z-index: 1;
      }
      
      .crt-container::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(18, 16, 16, 0.1);
        opacity: 0;
        z-index: 2;
        pointer-events: none;
        animation: flicker 0.15s infinite;
      }
      
      @keyframes flicker {
        0% { opacity: 0.27861; }
        5% { opacity: 0.34769; }
        10% { opacity: 0.23604; }
        15% { opacity: 0.90626; }
        20% { opacity: 0.18128; }
        25% { opacity: 0.83891; }
        30% { opacity: 0.65583; }
        35% { opacity: 0.67807; }
        40% { opacity: 0.26559; }
        45% { opacity: 0.84693; }
        50% { opacity: 0.96019; }
        55% { opacity: 0.08594; }
        60% { opacity: 0.20313; }
        65% { opacity: 0.71988; }
        70% { opacity: 0.53455; }
        75% { opacity: 0.37288; }
        80% { opacity: 0.71428; }
        85% { opacity: 0.70419; }
        90% { opacity: 0.7003; }
        95% { opacity: 0.36108; }
        100% { opacity: 0.24387; }
      }
      
      /* Scanline */
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      .scanline {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100px;
        z-index: 9999;
        background: linear-gradient(
          0deg,
          transparent 0%,
          rgba(65, 255, 0, 0.2) 50%,
          transparent 100%
        );
        opacity: 0.1;
        animation: scanline 6s linear infinite;
        pointer-events: none;
      }
      
      /* Text effects */
      .crt-text {
        color: #41ff00;
        text-shadow: 
          0 0 1px #41ff00,
          0 0 2px #41ff00,
          0 0 3px #41ff00;
        opacity: 0.95;
      }
      
      .terminal-label {
        color: #41ff00;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
      }
      
      .terminal-value {
        color: #7fff00;
        text-shadow: 0 0 3px #7fff00;
      }
      
      .terminal-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      
      .crt-dim {
        opacity: 0.7;
        color: #41ff00;
      }
      
      /* Glitch effect */
      .glitch {
        animation: glitch 0.3s infinite;
      }
      
      @keyframes glitch {
        0%, 100% { 
          text-shadow: 
            0 0 2px #41ff00,
            0 0 4px #41ff00,
            0 0 6px #41ff00;
        }
        25% {
          text-shadow: 
            -1px 0 #ff0000,
            1px 0 #00ffff,
            0 0 2px #41ff00,
            0 0 4px #41ff00;
        }
        50% {
          text-shadow: 
            1px 0 #ff0000,
            -1px 0 #00ffff,
            0 0 2px #41ff00,
            0 0 4px #41ff00;
        }
      }
      
      /* UI Elements */
      .crt-border {
        border: 2px solid #41ff00;
        background: rgba(65, 255, 0, 0.05);
        box-shadow: 
          inset 0 0 20px rgba(65, 255, 0, 0.2),
          0 0 20px rgba(65, 255, 0, 0.3);
      }
      
      .crt-box {
        border: 2px solid #41ff00;
        background: rgba(65, 255, 0, 0.02);
        box-shadow: 
          inset 0 0 10px rgba(65, 255, 0, 0.1),
          0 0 8px rgba(65, 255, 0, 0.2);
        transition: none;
      }
      
      .crt-box:hover,
      .crt-box-active {
        background: rgba(65, 255, 0, 0.1);
        box-shadow: 
          inset 0 0 15px rgba(65, 255, 0, 0.2),
          0 0 12px rgba(65, 255, 0, 0.3);
      }
      
      .crt-bar {
        box-shadow: 
          inset 0 0 10px rgba(0, 0, 0, 0.5),
          0 0 20px currentColor;
      }
      
      .crt-pixel {
        border: 1px solid #41ff00;
        box-shadow: inset 0 0 5px rgba(65, 255, 0, 0.5);
      }
      
      .crt-divider {
        border-top: 2px solid #41ff00;
        margin: 1rem 0;
        box-shadow: 0 0 4px #41ff00;
      }
      
      .crt-badge {
        padding: 0.25rem 1rem;
        border: 2px solid #41ff00;
        background: rgba(65, 255, 0, 0.2);
        color: #41ff00;
        font-weight: bold;
        text-transform: uppercase;
        box-shadow: 
          inset 0 0 10px rgba(65, 255, 0, 0.3),
          0 0 20px rgba(65, 255, 0, 0.5);
      }
      
      .crt-row {
        border-bottom: 1px solid rgba(65, 255, 0, 0.2);
      }
      
      .crt-hover:hover {
        background: rgba(65, 255, 0, 0.1);
        padding-left: 1rem;
        cursor: pointer;
      }
      
      /* Animations */
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
      
      .crt-blink {
        animation: blink 1s infinite;
      }
      
      @keyframes signal-pulse {
        0%, 100% { 
          opacity: 0.2;
          box-shadow: 0 0 10px #41ff00;
        }
        50% { 
          opacity: 1;
          box-shadow: 0 0 30px #41ff00, 0 0 50px #41ff00;
        }
      }
      
      .crt-signal {
        animation: signal-pulse 1s infinite;
      }
      
      /* Tab styles */
      .crt-tab {
        border: 2px solid transparent;
        color: #41ff00;
        text-shadow: 0 0 3px #41ff00;
        transition: none;
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: 3px;
        padding: 0.75rem 1.5rem;
      }
      
      /* Mobile responsive tab styles */
      @media (max-width: 640px) {
        .crt-tab {
          padding: 0.4rem 0.8rem;
          letter-spacing: 1px;
          font-size: 0.85rem;
        }
      }
      
      .crt-tab:hover {
        border-color: #41ff00;
        background: rgba(65, 255, 0, 0.1);
        transform: scale(1.05);
      }
      
      .crt-tab.active {
        border-color: #41ff00;
        background: rgba(65, 255, 0, 0.2);
        box-shadow: 
          inset 0 0 10px rgba(65, 255, 0, 0.2),
          0 0 8px rgba(65, 255, 0, 0.3);
      }
      
      .crt-subtab {
        color: #41ff00;
        opacity: 0.6;
        text-transform: uppercase;
        letter-spacing: 2px;
        border-bottom: 2px solid transparent;
        padding: 0.5rem 1rem;
      }
      
      /* Mobile responsive subtab styles */
      @media (max-width: 640px) {
        .crt-subtab {
          padding: 0.3rem 0.6rem;
          letter-spacing: 1px;
          font-size: 0.8rem;
        }
      }
      
      .crt-subtab:hover {
        opacity: 1;
        text-shadow: 0 0 3px #41ff00;
      }
      
      .crt-subtab.active {
        opacity: 1;
        border-bottom-color: #41ff00;
        text-shadow: 0 0 3px #41ff00;
      }
      
      /* Custom Slim Green Scrollbar */
      .crt-scroll::-webkit-scrollbar {
        width: 8px;
        background: transparent;
      }
      
      .crt-scroll::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(65, 255, 0, 0.3);
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(65, 255, 0, 0.1);
      }
      
      .crt-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(
          180deg,
          #41ff00 0%,
          #7fff00 50%,
          #41ff00 100%
        );
        border-radius: 4px;
        border: 1px solid #41ff00;
        box-shadow: 
          0 0 8px rgba(65, 255, 0, 0.6),
          inset 0 0 3px rgba(127, 255, 0, 0.3);
        transition: all 0.2s ease;
      }
      
      .crt-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(
          180deg,
          #7fff00 0%,
          #41ff00 50%,
          #7fff00 100%
        );
        box-shadow: 
          0 0 12px rgba(65, 255, 0, 0.8),
          inset 0 0 5px rgba(127, 255, 0, 0.5);
        transform: scaleX(1.1);
      }
      
      .crt-scroll::-webkit-scrollbar-thumb:active {
        background: #7fff00;
        box-shadow: 
          0 0 15px rgba(127, 255, 0, 1),
          inset 0 0 8px rgba(65, 255, 0, 0.7);
      }
      
      .crt-scroll::-webkit-scrollbar-corner {
        background: transparent;
      }
      
      /* Firefox scrollbar */
      .crt-scroll {
        scrollbar-width: thin;
        scrollbar-color: #41ff00 rgba(0, 0, 0, 0.8);
      }
      
      /* Pixelated elements */
      .pixelated {
        filter: contrast(1.5) brightness(1.2);
        text-shadow: 
          2px 2px 0 #000,
          0 0 30px #41ff00,
          0 0 50px #41ff00;
      }
      
      /* Noise overlay */
      @keyframes noise {
        0%, 100% { background-position: 0 0; }
        10% { background-position: -5% -10%; }
        20% { background-position: -15% 5%; }
        30% { background-position: 7% -25%; }
        40% { background-position: 20% 25%; }
        50% { background-position: -25% 10%; }
        60% { background-position: 15% 5%; }
        70% { background-position: 0% 15%; }
        80% { background-position: 25% 35%; }
        90% { background-position: -10% 10%; }
      }
      
      .noise {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        opacity: 0.02;
        z-index: 1000;
        background: 
          repeating-radial-gradient(
            circle at 0 0,
            #000,
            #000 1px,
            transparent 1px,
            transparent 2px
          );
        animation: noise 0.2s infinite;
      }
      
      /* Tab transition distortion effects */
      .transition-content {
        transition: opacity 0.15s ease-in-out;
      }
      
      .transition-distortion {
        animation: screenDistortion 0.3s ease-in-out;
        opacity: 0.3;
      }
      
      @keyframes screenDistortion {
        0% {
          transform: scaleX(1) scaleY(1);
          filter: contrast(1) brightness(1);
          opacity: 1;
        }
        10% {
          transform: scaleX(1.003) scaleY(0.997);
          filter: contrast(1.5) brightness(0.3);
          opacity: 0.8;
        }
        20% {
          transform: scaleX(0.998) scaleY(1.002);
          filter: contrast(0.7) brightness(1.8);
          opacity: 0.9;
        }
        30% {
          transform: scaleX(1.001) scaleY(0.999);
          filter: contrast(2.2) brightness(0.1);
          opacity: 0.3;
        }
        40% {
          transform: scaleX(0.999) scaleY(1.001);
          filter: contrast(0.4) brightness(2.5);
          opacity: 0.6;
        }
        50% {
          transform: scaleX(1.002) scaleY(0.998);
          filter: contrast(3) brightness(0.05);
          opacity: 0.1;
        }
        60% {
          transform: scaleX(0.997) scaleY(1.003);
          filter: contrast(0.8) brightness(1.7);
          opacity: 0.4;
        }
        70% {
          transform: scaleX(1.001) scaleY(0.999);
          filter: contrast(1.8) brightness(0.4);
          opacity: 0.7;
        }
        80% {
          transform: scaleX(0.999) scaleY(1.001);
          filter: contrast(1.2) brightness(1.3);
          opacity: 0.8;
        }
        90% {
          transform: scaleX(1) scaleY(1);
          filter: contrast(1.1) brightness(0.9);
          opacity: 0.9;
        }
        100% {
          transform: scaleX(1) scaleY(1);
          filter: contrast(1) brightness(1);
          opacity: 1;
        }
      }
      
      /* Pip-Boy style screen wipe effect */
      @keyframes screenWipe {
        0% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          opacity: 1;
        }
        50% {
          clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
          opacity: 0.1;
          filter: blur(2px);
        }
        100% {
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
          opacity: 1;
        }
      }
      
      /* Enhanced transition effects - TV distortion bars */
      .transition-distortion::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            0deg,
            transparent 0px,
            rgba(65, 255, 0, 0.3) 2px,
            transparent 4px,
            transparent 20px
          );
        z-index: 1;
        pointer-events: none;
        animation: tvDistortionBars 0.3s ease-in-out;
      }
      
      .transition-distortion::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          repeating-linear-gradient(
            90deg,
            transparent 0px,
            rgba(65, 255, 0, 0.15) 1px,
            transparent 2px,
            transparent 6px
          );
        z-index: 2;
        pointer-events: none;
        animation: tvStaticLines 0.3s ease-in-out;
      }
      
      @keyframes tvDistortionBars {
        0% {
          opacity: 0;
          transform: translateY(100%);
        }
        20% {
          opacity: 0.8;
          transform: translateY(50%);
        }
        40% {
          opacity: 1;
          transform: translateY(0%);
        }
        60% {
          opacity: 0.7;
          transform: translateY(-30%);
        }
        80% {
          opacity: 0.4;
          transform: translateY(-60%);
        }
        100% {
          opacity: 0;
          transform: translateY(-100%);
        }
      }
      
      @keyframes tvStaticLines {
        0%, 100% {
          opacity: 0;
          transform: scaleX(1);
        }
        25% {
          opacity: 0.3;
          transform: scaleX(1.1);
        }
        50% {
          opacity: 0.6;
          transform: scaleX(0.9);
        }
        75% {
          opacity: 0.4;
          transform: scaleX(1.05);
        }
      }
      
      /* Icon styling */
      .perk-icon,
      .status-icon,
      .map-icon {
        filter: 
          brightness(0) 
          saturate(100%) 
          invert(78%) 
          sepia(84%) 
          saturate(5398%) 
          hue-rotate(80deg) 
          brightness(118%) 
          contrast(119%);
        transition: filter 0.2s ease;
      }
      
      .perk-icon:hover,
      .status-icon:hover,
      .map-icon:hover {
        filter: 
          brightness(0) 
          saturate(100%) 
          invert(78%) 
          sepia(84%) 
          saturate(5398%) 
          hue-rotate(80deg) 
          brightness(140%) 
          contrast(130%);
        text-shadow: 0 0 10px #41ff00;
      }
      
      .crt-box:hover .perk-icon,
      .crt-box-active .perk-icon {
        filter: 
          brightness(0) 
          saturate(100%) 
          invert(78%) 
          sepia(84%) 
          saturate(5398%) 
          hue-rotate(80deg) 
          brightness(135%) 
          contrast(125%)
          drop-shadow(0 0 8px #41ff00);
      }
    `}</style>
  );
};

export default CRTStyles; 