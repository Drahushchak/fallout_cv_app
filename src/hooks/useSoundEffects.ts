import { useEffect, useRef, useCallback } from 'react';

interface SoundMap {
  [key: string]: HTMLAudioElement;
}

export const useSoundEffects = () => {
  const soundsRef = useRef<SoundMap>({});
  const humRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sound effects
  useEffect(() => {
    const loadSound = (name: string, path: string, loop = false) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.loop = loop;
      audio.volume = 0.3; // Default volume
      soundsRef.current[name] = audio;
      return audio;
    };

    // Load main hum sound (background ambient)  
    const soundBasePath = '/audio/sound_effects';
    humRef.current = loadSound('hum', `${soundBasePath}/PipBoy/UI_PipBoy_Hum_LP.wav`, true);
    
    // Load UI interaction sounds
    loadSound('ok', `${soundBasePath}/PipBoy/UI_Pipboy_OK.wav`);
    loadSound('okPress', `${soundBasePath}/PipBoy/UI_Pipboy_OK_Press.wav`);
    loadSound('move1', `${soundBasePath}/PipBoy/Move/UI_PipBoy_Move_01.wav`);
    loadSound('move2', `${soundBasePath}/PipBoy/Move/UI_PipBoy_Move_02.wav`);
    loadSound('move3', `${soundBasePath}/PipBoy/Move/UI_PipBoy_Move_03.wav`);
    loadSound('up1', `${soundBasePath}/PipBoy/UpDown/UI_PipBoy_Up_01.wav`);
    loadSound('up2', `${soundBasePath}/PipBoy/UpDown/UI_PipBoy_Up_02.wav`);
    loadSound('down1', `${soundBasePath}/PipBoy/UpDown/UI_PipBoy_Down_01.wav`);
    loadSound('down2', `${soundBasePath}/PipBoy/UpDown/UI_PipBoy_Down_02.wav`);
    loadSound('favoriteOn', `${soundBasePath}/PipBoy/UI_PipBoy_Favorite_On.wav`);
    loadSound('favoriteOff', `${soundBasePath}/PipBoy/UI_PipBoy_Favorite_Off.wav`);
    loadSound('menuUp', `${soundBasePath}/PipBoy/UI_PipBoy_Favorite_Menu_Up_01.wav`);
    loadSound('menuDown', `${soundBasePath}/PipBoy/UI_PipBoy_Favorite_Menu_Down_01.wav`);
    loadSound('menuDpad', `${soundBasePath}/PipBoy/UI_PipBoy_Favorite_Menu_Dpad_01.wav`);
    loadSound('questActive', `${soundBasePath}/PipBoy/UI_PipBoy_Quest_Active_01.wav`);
    loadSound('questInactive', `${soundBasePath}/PipBoy/UI_PipBoy_Quest_Inactive_01.wav`);
    loadSound('mapRollover', `${soundBasePath}/PipBoy/UI_PipBoy_Map_Rollover_01.wav`);
    loadSound('mapZoom', `${soundBasePath}/PipBoy/UI_PipBoy_Map_Zoom_01.wav`);
    loadSound('lightOn', `${soundBasePath}/PipBoy/UI_PipBoy_LightOn.wav`);
    loadSound('lightOff', `${soundBasePath}/PipBoy/UI_PipBoy_LightOff.wav`);
    loadSound('radioOn', `${soundBasePath}/PipBoy/Radio/UI_Pipboy_Radio_On.wav`);
    loadSound('radioOff', `${soundBasePath}/PipBoy/Radio/UI_Pipboy_Radio_Off.wav`);
    
    // Load health/chem wear-off sound
    loadSound('chemsWearOff', `${soundBasePath}/Health/UI_Health_Chems_WearOff_Male_01.wav`);
    
    // Load IdleSpecialA sounds for equipping/unequipping
    loadSound('idleSpecialDown1', `${soundBasePath}/PipBoy/UI_PiipBoy_IdleSpecialA_Down_01.wav`);
    loadSound('idleSpecialDown2', `${soundBasePath}/PipBoy/UI_PiipBoy_IdleSpecialA_Down_02.wav`);
    loadSound('idleSpecialUp1', `${soundBasePath}/PipBoy/UI_PiipBoy_IdleSpecialA_Up_01.wav`);
    loadSound('idleSpecialUp2', `${soundBasePath}/PipBoy/UI_PiipBoy_IdleSpecialA_Up_02.wav`);
    
    // Start the background hum when component mounts
    const startHum = () => {
      if (humRef.current) {
        humRef.current.volume = 0.15; // Lower volume for background
        humRef.current.play().catch(console.warn);
      }
    };

    // Auto-play hum after a brief delay or on user interaction
    const timer = setTimeout(startHum, 1000);
    
    // Also try to start on first user interaction
    const handleFirstInteraction = () => {
      startHum();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      
      // Cleanup audio objects
      Object.values(soundsRef.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      if (humRef.current) {
        humRef.current.pause();
        humRef.current.src = '';
      }
    };
  }, []);

  // Play a specific sound effect
  const playSound = useCallback((soundName: string, volume = 0.3) => {
    const sound = soundsRef.current[soundName];
    if (sound) {
      sound.volume = volume;
      sound.currentTime = 0;
      sound.play().catch(console.warn);
    }
  }, []);

  // Play random sound from a group
  const playRandomSound = useCallback((soundGroup: string[], volume = 0.3) => {
    if (soundGroup.length > 0) {
      const randomSound = soundGroup[Math.floor(Math.random() * soundGroup.length)];
      playSound(randomSound, volume);
    }
  }, [playSound]);

  // Specific sound effect functions
  const playTabSound = useCallback(() => {
    playRandomSound(['ok', 'okPress'], 0.4);
  }, [playRandomSound]);

  const playSubTabSound = useCallback(() => {
    playRandomSound(['ok', 'okPress'], 0.3);
  }, [playRandomSound]);

  const playConfirmSound = useCallback(() => {
    playSound('ok', 0.4);
  }, [playSound]);

  const playSelectSound = useCallback(() => {
    playSound('okPress', 0.3);
  }, [playSound]);

  const playHoverSound = useCallback(() => {
    playSound('menuDpad', 0.2);
  }, [playSound]);

  const playMapSound = useCallback(() => {
    playSound('mapRollover', 0.3);
  }, [playSound]);

  const playRadioSound = useCallback((isOn: boolean) => {
    playSound(isOn ? 'radioOn' : 'radioOff', 0.4);
  }, [playSound]);

  const playQuestSound = useCallback((isActive: boolean) => {
    playSound(isActive ? 'questActive' : 'questInactive', 0.3);
  }, [playSound]);

  // Equipment sound effects using IdleSpecialA sounds
  const playEquipSound = useCallback(() => {
    playRandomSound(['idleSpecialDown1', 'idleSpecialDown2'], 0.4);
  }, [playRandomSound]);

  const playUnequipSound = useCallback(() => {
    playRandomSound(['idleSpecialUp1', 'idleSpecialUp2'], 0.4);
  }, [playRandomSound]);

  // Play wear-off sound for consumables
  const playWearOffSound = useCallback(() => {
    playSound('chemsWearOff', 0.5);
  }, [playSound]);

  // Control background hum
  const setHumVolume = useCallback((volume: number) => {
    if (humRef.current) {
      humRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const pauseHum = useCallback(() => {
    if (humRef.current) {
      humRef.current.pause();
    }
  }, []);

  const resumeHum = useCallback(() => {
    if (humRef.current) {
      humRef.current.play().catch(console.warn);
    }
  }, []);

  return {
    playSound,
    playRandomSound,
    playTabSound,
    playSubTabSound,
    playConfirmSound,
    playSelectSound,
    playHoverSound,
    playMapSound,
    playRadioSound,
    playQuestSound,
    playEquipSound,
    playUnequipSound,
    playWearOffSound,
    setHumVolume,
    pauseHum,
    resumeHum
  };
}; 