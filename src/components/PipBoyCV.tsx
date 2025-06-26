import React, { useState, useEffect } from 'react';
import type { TabType, ActiveSubTab, Quest, TemporaryEffect, Inventory } from '../types';
import { candidateData, special, perks, skills, inventory as initialInventory, quests as initialQuests } from '../data';
import { useSoundEffects } from '../hooks/useSoundEffects';

// Import components
import CRTStyles from './CRTStyles';
import StatContent from './StatContent';
import InvContent from './InvContent';
import DataContent from './DataContent';
import MapContent from './MapContent';
import RadioContent from './RadioContent';

const PipBoyCV: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('STAT');
  const [activeSubTab, setActiveSubTab] = useState<ActiveSubTab>({
    STAT: 'STATUS',
    INV: 'WEAPONS',
    DATA: 'QUESTS'
  });
  const [selectedPerk, setSelectedPerk] = useState<number | null>(null);
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [equippedItems, setEquippedItems] = useState<{[key: string]: boolean}>({});
  const [inventory, setInventory] = useState<Inventory>(initialInventory);
  const [temporaryEffects, setTemporaryEffects] = useState<TemporaryEffect[]>([]);

  // Initialize sound effects
  const {
    playTabSound,
    playSubTabSound,
    playHoverSound,
    playConfirmSound,
    playWearOffSound
  } = useSoundEffects();

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Temporary effects timer with automatic cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setTemporaryEffects(prevEffects => {
        const updatedEffects = prevEffects.map(effect => ({
          ...effect,
          duration: Math.max(0, effect.duration - 1)
        }));
        
        // Check for effects that just expired (went from 1 to 0)
        const expiredEffects = prevEffects.filter((prevEffect, index) => {
          const updatedEffect = updatedEffects[index];
          return prevEffect.duration === 1 && updatedEffect.duration === 0;
        });
        
        // Play wear-off sound for each expired effect
        if (expiredEffects.length > 0) {
          playWearOffSound();
        }
        
        // Remove expired effects (duration = 0)
        const activeEffects = updatedEffects.filter(effect => effect.duration > 0);
        
        // Effects are automatically removed when duration hits 0
        // This will trigger recalculation of all effects in the STATUS tab
        return activeEffects;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playWearOffSound]);

  // Handle quest tracking toggle
  const handleQuestToggle = (questIndex: number) => {
    setQuests(prevQuests => 
      prevQuests.map((quest, index) => 
        index === questIndex 
          ? { ...quest, tracked: !quest.tracked }
          : quest
      )
    );
  };

  // Handle AID item consumption
  const handleAidConsumption = (itemName: string, itemIndex: number) => {
    const aidItem = inventory.AID[itemIndex];
    if (!aidItem || aidItem.qty <= 0) return;

    // Remove existing effect of same item (no stacking)
    setTemporaryEffects(prevEffects => 
      prevEffects.filter(effect => effect.itemName !== itemName)
    );

    // Add new temporary effect
    if (aidItem.effects && aidItem.duration) {
      const newEffect: TemporaryEffect = {
        itemName: itemName,
        effects: aidItem.effects,
        duration: aidItem.duration,
        maxDuration: aidItem.duration
      };
      setTemporaryEffects(prevEffects => [...prevEffects, newEffect]);
    }

    // Reduce item quantity
    setInventory(prevInventory => ({
      ...prevInventory,
      AID: prevInventory.AID.map((item, index) => 
        index === itemIndex 
          ? { ...item, qty: Math.max(0, item.qty - 1) }
          : item
      )
    }));

    playConfirmSound();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'STAT':
        return (
          <StatContent
            activeSubTab={activeSubTab.STAT as any}
            candidateData={candidateData}
            special={special}
            perks={perks}
            skills={skills}
            selectedPerk={selectedPerk}
            setSelectedPerk={setSelectedPerk}
            equippedItems={equippedItems}
            inventory={inventory}
            temporaryEffects={temporaryEffects}
            quests={quests}
          />
        );
      case 'INV':
        return (
          <InvContent
            activeSubTab={activeSubTab.INV as any}
            inventory={inventory}
            equippedItems={equippedItems}
            setEquippedItems={setEquippedItems}
            onAidConsumption={handleAidConsumption}
          />
        );
      case 'DATA':
        return <DataContent quests={quests} onQuestToggle={handleQuestToggle} />;
      case 'MAP':
        return <MapContent />;
      case 'RADIO':
        return <RadioContent />;
      default:
        return null;
    }
  };

  const getSubTabs = () => {
    switch (activeTab) {
      case 'STAT':
        return ['STATUS', 'SPECIAL', 'PERKS', 'SKILLS'];
      case 'INV':
        return ['WEAPONS', 'APPAREL', 'AID', 'MISC', 'JUNK', 'MODS', 'AMMO'];
      case 'DATA':
        return ['QUESTS'];
      default:
        return [];
    }
  };

  return (
    <div className="h-screen w-screen bg-black font-mono relative overflow-hidden flex flex-col">
      <CRTStyles />
      
      {/* Scanline effect - positioned at top level for full viewport coverage */}
      <div className="scanline"></div>
      
      <div className="h-full crt-container flex-1 p-4 md:p-6 lg:p-8 relative flex items-center justify-center">
        {/* Noise overlay */}
        <div className="noise"></div>
        
        {/* Main screen */}
        <div className={`w-full max-w-7xl mx-auto relative z-20 flex flex-col h-full ${glitchEffect ? 'glitch' : ''}`}>
          <div className="h-full crt-border rounded-lg bg-black bg-opacity-90 flex-1 flex flex-col">
            {/* Main tabs */}
            <div className="flex flex-wrap justify-around gap-1 sm:gap-2 p-2 sm:p-3 md:p-5 border-b-2 border-green-500 flex-shrink-0">
              {['STAT', 'INV', 'DATA', 'MAP', 'RADIO'].map(tab => (
                <button 
                  key={tab} 
                  className={`crt-tab ${activeTab === tab ? 'active' : ''}`}
                  onMouseEnter={() => playHoverSound()}
                  onClick={() => {
                    if (activeTab !== tab) {
                      playTabSound();
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setActiveTab(tab as TabType);
                        setTimeout(() => setIsTransitioning(false), 150);
                      }, 150);
                    }
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sub tabs */}
            {getSubTabs().length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 px-2 sm:px-3 md:px-5 py-2 sm:py-3 md:py-4 border-b border-green-500 flex-shrink-0">
                {getSubTabs().map(subTab => (
                  <button 
                    key={subTab} 
                    className={`crt-subtab ${activeSubTab[activeTab as keyof ActiveSubTab] === subTab ? 'active' : ''}`}
                    onMouseEnter={() => playHoverSound()}
                    onClick={() => {
                      if (activeSubTab[activeTab as keyof ActiveSubTab] !== subTab) {
                        playSubTabSound();
                        setIsTransitioning(true);
                        setTimeout(() => {
                          setActiveSubTab({...activeSubTab, [activeTab]: subTab});
                          setTimeout(() => setIsTransitioning(false), 150);
                        }, 150);
                      }
                    }}
                  >
                    {subTab}
                  </button>
                ))}
              </div>
            )}

            {/* Content area */}
            <div className={`flex-1 overflow-auto transition-content ${isTransitioning ? 'transition-distortion' : ''}`}>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipBoyCV; 