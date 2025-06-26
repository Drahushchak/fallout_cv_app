import React, { useState, useEffect } from 'react';
import type { CandidateData, SpecialAttribute, Perk, Skill, StatSubTab, Inventory, TemporaryEffect, Quest } from '../types';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { calculateAllEffects, getProcessedEffects, getLegacyStats } from '../utils/effectsCalculator';
import Content from './Content';

interface StatContentProps {
  activeSubTab: StatSubTab;
  candidateData: CandidateData;
  special: SpecialAttribute[];
  perks: Perk[];
  skills: Skill[];
  selectedPerk: number | null;
  setSelectedPerk: (index: number | null) => void;
  equippedItems: {[key: string]: boolean};
  inventory: Inventory;
  temporaryEffects: TemporaryEffect[];
  quests: Quest[];
}

const StatContent: React.FC<StatContentProps> = ({
  activeSubTab,
  candidateData,
  special,
  perks,
  skills,
  selectedPerk,
  setSelectedPerk,
  equippedItems,
  inventory,
  temporaryEffects,
  quests
}) => {
  const { playSelectSound, playHoverSound } = useSoundEffects();
  
  // State for real-time XP countdown
  const [currentXP, setCurrentXP] = useState(candidateData.xp);
  
  // State for Vault-Tec notice visibility
  const [showVaultTecNotice, setShowVaultTecNotice] = useState(true);
  
  // Helper function to calculate XP progression
  const calculateCurrentXP = () => {
    const inProgressQuest = quests.find(quest => quest.status === 'IN PROGRESS');
    
    if (!inProgressQuest) {
      return candidateData.xp; // No progression if no in-progress quest
    }
    
    // Parse the in-progress quest period to get start date
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Parse start date from quest period
      let questStartDate: Date;
      if (inProgressQuest.period.toLowerCase().includes('present')) {
        const startPart = inProgressQuest.period.split(' to ')[0].trim();
        const startParts = startPart.split('-');
        const year = parseInt(startParts[0]);
        const month = startParts.length > 1 ? parseInt(startParts[1]) - 1 : 0;
        const day = startParts.length > 2 ? parseInt(startParts[2]) : 1;
        questStartDate = new Date(year, month, day);
      } else {
        // Fallback
        questStartDate = new Date(currentYear, 0, 1);
      }
      
      // For XP display, show progress within the current year
      const startOfCurrentYear = new Date(currentYear, 0, 1);
      
      // If the quest started this year, show progress from quest start
      // Otherwise, show progress from start of current year
      const progressStart = questStartDate.getFullYear() === currentYear 
        ? questStartDate 
        : startOfCurrentYear;
      
      const secondsElapsed = Math.floor((now.getTime() - progressStart.getTime()) / 1000);
      const secondsInYear = 365 * 24 * 60 * 60;
      
      return `${secondsElapsed.toLocaleString()}/${secondsInYear.toLocaleString()}`;
    } catch (error) {
      console.error('Error calculating XP:', error);
      return candidateData.xp;
    }
  };
  
  // Check localStorage for Vault-Tec notice preference on mount
  useEffect(() => {
    const vaultTecNoticeClosed = localStorage.getItem('vaultTecNoticeClosed');
    if (vaultTecNoticeClosed === 'true') {
      setShowVaultTecNotice(false);
    }
  }, []);

  // Update XP every second if there's an in-progress quest
  useEffect(() => {
    const inProgressQuest = quests.find(quest => quest.status === 'IN PROGRESS');
    
    if (inProgressQuest) {
      const interval = setInterval(() => {
        setCurrentXP(calculateCurrentXP());
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setCurrentXP(candidateData.xp);
    }
  }, [quests, candidateData.xp]);

  // Handle closing the Vault-Tec notice
  const handleCloseVaultTecNotice = () => {
    setShowVaultTecNotice(false);
    localStorage.setItem('vaultTecNoticeClosed', 'true');
    playSelectSound();
  };

  // Calculate all effects using the new system
  const effectsMap = calculateAllEffects(inventory, equippedItems, temporaryEffects);
  const processedEffects = getProcessedEffects(effectsMap);
  const appliedStats = getLegacyStats(processedEffects);

  // Helper function to get effect display name
  const getEffectDisplayName = (effectName: string): string => {
    const displayNames: { [key: string]: string } = {
      typing_speed: 'Typing Speed',
      code_quality: 'Code Quality',
      bug_detection: 'Bug Detection',
      error_resolution: 'Error Resolution',
      bug_fix_success: 'Bug Fix Success',
      focus: 'Focus',
      comfort: 'Comfort',
      eye_comfort: 'Eye Comfort',
      typing_comfort: 'Typing Comfort',
      alertness: 'Alertness',
      productivity: 'Productivity',
      energy: 'Energy',
      hp: 'Health Points',
      ap: 'Action Points'
    };
    return displayNames[effectName] || effectName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderStatusTab = () => (
    <Content>
      <div className="crt-text p-6">
      {/* Vault-Tec Experience Tracking Notice */}
      {showVaultTecNotice && (
        <div className="mb-8 p-4 border border-green-500 border-opacity-40 bg-green-900 bg-opacity-20 relative">
          <button
            onClick={handleCloseVaultTecNotice}
            onMouseEnter={() => playHoverSound()}
            className="absolute top-2 right-2 text-green-400 hover:text-green-300 cursor-pointer text-lg leading-none"
            title="Close notice"
          >
            ×
          </button>
          <div className="text-center pr-6">
            <div className="text-green-400 terminal-label text-sm mb-2">⚠️ VAULT-TEC EXPERIENCE MONITORING SYSTEM ⚠️</div>
            <div className="text-xs crt-dim leading-relaxed">
              Your LEVEL represents total years of professional wasteland survival experience.
              Experience Points (XP) track real-time progress through active employment contracts.
              <br />
              <span className="text-green-400">※ XP accumulation only occurs during ACTIVE MISSIONS</span>
              <br />
              <em className="text-xs opacity-75">Employment periods automatically calculated by Pip-Boy's Career Assessment Module™</em>
            </div>
          </div>
        </div>
      )}
      {/* Top HUD Stats Bar */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8 mb-4 px-3 sm:px-4 py-3 sm:py-2 crt-border bg-black bg-opacity-60">
          {/* HP and AP - Side by side on mobile, outer positions on desktop */}
          <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-8 order-1 sm:order-none">
            {/* HP */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="terminal-label text-sm sm:text-lg">HP</span>
              <span className="terminal-value text-lg sm:text-xl font-bold">
                {candidateData.hp + appliedStats.hp}/100
                {appliedStats.hp > 0 && <span className="text-green-400 text-xs sm:text-sm ml-1 sm:ml-2">+{appliedStats.hp}</span>}
              </span>
            </div>
            
            {/* AP */}
            <div className="flex items-center gap-2 sm:gap-3 sm:hidden">
              <span className="terminal-label text-sm sm:text-lg">AP</span>
              <span className="terminal-value text-lg sm:text-xl font-bold">
                {candidateData.ap + appliedStats.ap}/100
                {appliedStats.ap > 0 && <span className="text-green-400 text-xs sm:text-sm ml-1 sm:ml-2">+{appliedStats.ap}</span>}
              </span>
            </div>
          </div>
          
          {/* Level with XP Progress - Full width on mobile */}
          <div className="flex-1 sm:flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 order-2 sm:order-none">
            <span className="terminal-label text-base sm:text-lg text-center sm:text-left">LEVEL {candidateData.level}</span>
                         <div className="flex-1 h-8 sm:h-6 min-h-[2rem] sm:min-h-[1.5rem] crt-border relative sm:max-w-md">
              <div 
                className="h-full min-h-[2rem] sm:min-h-[1.5rem] bg-green-500 crt-bar transition-all duration-1000"
                style={{
                  width: (() => {
                    const [current, total] = currentXP.split('/').map(x => parseInt(x.replace(/,/g, '')));
                    return `${Math.min((current / total) * 100, 100)}%`;
                  })()
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-black mix-blend-difference">
                  {currentXP}
                </span>
              </div>
            </div>
          </div>
          
          {/* AP - Hidden on mobile, shown on desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="terminal-label text-lg">AP</span>
                          <span className="terminal-value text-lg sm:text-xl font-bold">
              {candidateData.ap + appliedStats.ap}/100
              {appliedStats.ap > 0 && <span className="text-green-400 text-sm ml-2">+{appliedStats.ap}</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Character Details */}
      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center">
            {/* Head */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img 
                src={`${import.meta.env.BASE_URL}icons/FO4HealthConditionIcons/icon_condition_head_1.svg`} 
                alt="Character Head"
                className="w-full h-full object-contain status-icon"
              />
            </div>
            {/* Body */}
            <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center -mt-1.5 sm:-mt-2">
              <img 
                src={`${import.meta.env.BASE_URL}icons/FO4HealthConditionIcons/icon_condition_body_0.svg`} 
                alt="Character Body"
                className="w-full h-full object-contain status-icon"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="terminal-row">
            <span className="terminal-label">NAME:</span>
            <span className="terminal-value">{candidateData.name}</span>
          </div>
          <div className="crt-divider"></div>
          <div className="terminal-row">
            <span className="terminal-label">AGE:</span>
            <span className="terminal-value">{candidateData.age}</span>
          </div>
          <div className="terminal-row">
            <span className="terminal-label">GENDER:</span>
            <span className="terminal-value">{candidateData.gender}</span>
          </div>
          <div className="terminal-row">
            <span className="terminal-label">OCCUPATION:</span>
            <span className="terminal-value text-sm">{candidateData.occupation}</span>
          </div>
          <div className="terminal-row">
            <span className="terminal-label">EDUCATION:</span>
            <span className="terminal-value text-xs">{candidateData.education}</span>
          </div>
        </div>
      </div>

      {/* All Active Effects with Detailed Breakdown */}
      {processedEffects.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-green-500">
          <div className="terminal-label mb-6 text-center">ACTIVE EFFECTS</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {processedEffects.map((effect, index) => (
              <div key={index} className="crt-box p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="terminal-value text-lg">
                    {getEffectDisplayName(effect.name)}
                  </div>
                  <div className="terminal-value text-lg sm:text-xl font-bold text-green-400">
                    +{effect.totalValue}%
                  </div>
                </div>
                
                {/* Contributors breakdown */}
                <div className="space-y-2">
                  <div className="text-xs terminal-label mb-2">CONTRIBUTORS:</div>
                  {effect.contributors.map((contributor, contribIndex) => (
                    <div key={contribIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex items-center justify-center">
                          {contributor.itemType === 'WEAPON' && (
                            <img 
                              src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_104.svg`} 
                              alt="Weapon"
                              className="w-full h-full object-contain status-icon"
                            />
                          )}
                          {contributor.itemType === 'APPAREL' && (
                            <img 
                              src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_36.svg`} 
                              alt="Apparel"
                              className="w-full h-full object-contain status-icon"
                            />
                          )}
                          {contributor.itemType !== 'WEAPON' && contributor.itemType !== 'APPAREL' && (
                            <img 
                              src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_20.svg`} 
                              alt="Temporary"
                              className="w-full h-full object-contain status-icon"
                            />
                          )}
                        </div>
                        <span className="crt-dim">
                          {contributor.itemName}
                          {contributor.isTemporary && (
                            <span className="terminal-label ml-1">(TEMP)</span>
                          )}
                        </span>
                      </div>
                      <span className="terminal-value">+{contributor.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_104.svg`} 
                  alt="Weapon"
                  className="w-full h-full object-contain status-icon"
                />
              </div>
              <span className="crt-dim">Weapons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_36.svg`} 
                  alt="Apparel"
                  className="w-full h-full object-contain status-icon"
                />
              </div>
              <span className="crt-dim">Apparel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <img 
                  src={`${import.meta.env.BASE_URL}icons/FO4InvPageIcons/icon_20.svg`} 
                  alt="Temporary"
                  className="w-full h-full object-contain status-icon"
                />
              </div>
              <span className="crt-dim">Temporary</span>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Effects from AID Items */}
      {temporaryEffects.length > 0 && (
        <div className="mt-8 pt-6 border-t-2 border-green-500">
          <div className="terminal-label mb-4 text-center">TEMPORARY EFFECTS STATUS</div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {temporaryEffects.map((effect, index) => (
              <div key={index} className="crt-box">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="terminal-value mb-1">{effect.itemName}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {effect.effects.map((eff, effIndex) => (
                        <div key={effIndex} className="text-sm crt-dim">
                          • {eff.display_name}
                        </div>
                      ))}
                    </div>
                  </div>
                                      <div className="ml-4 text-center">
                      <div className="text-sm crt-dim mb-1">TIME LEFT</div>
                      <div className="terminal-value">
                        {Math.floor(effect.duration / 60)}:{(effect.duration % 60).toString().padStart(2, '0')}
                      </div>
                      <div className="w-16 h-2 crt-border mt-2 relative">
                        <div 
                          className="h-full bg-green-500 crt-bar transition-all duration-1000"
                          style={{width: `${(effect.duration / effect.maxDuration) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </Content>
  );

  const renderSpecialTab = () => (
    <Content>
      <div className="crt-text p-6 max-w-2xl mx-auto space-y-6">
      {special.map((attr, index) => (
        <div key={index} className="space-y-1">
          <div className="terminal-label">{attr.name.toUpperCase()}</div>
          <div className="h-6 crt-border relative">
            <div 
              className="h-full crt-bar bg-green-500 transition-none"
              style={{width: `${attr.level * 10}%`}}
            ></div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm crt-dim">{attr.desc}</span>
            <span className="terminal-value">{attr.level}</span>
          </div>
        </div>
      ))}
      </div>
    </Content>
  );

  const renderPerksTab = () => (
    <Content>
      <div className="crt-text p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {perks.map((perk, index) => (
          <div 
            key={index} 
            className={`crt-box cursor-pointer p-6 flex flex-col items-center text-center min-h-[200px] justify-center ${selectedPerk === index ? 'crt-box-active' : ''}`}
            onMouseEnter={() => playHoverSound()}
            onClick={() => {
              playSelectSound();
              setSelectedPerk(selectedPerk === index ? null : index);
            }}
          >
            <div className="w-20 h-20 mb-4 flex items-center justify-center">
              <img 
                src={perk.icon} 
                alt={perk.name}
                className="w-full h-full object-contain perk-icon"
              />
            </div>
            <div className="terminal-label text-sm font-bold mb-2 leading-tight">
              {perk.name}
            </div>
            <div className="text-xs crt-dim leading-relaxed">
              {perk.desc.split('.')[0]}.
            </div>
          </div>
        ))}
      </div>
      {selectedPerk !== null && (
        <div className="crt-box p-8 mt-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
                <img 
                  src={perks[selectedPerk].icon} 
                  alt={perks[selectedPerk].name}
                  className="w-full h-full object-contain perk-icon"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl terminal-value mb-3 font-bold">{perks[selectedPerk].name}</h3>
                <p className="crt-dim mb-4 text-base leading-relaxed">{perks[selectedPerk].desc}</p>
                <div className="terminal-label text-sm mb-2">EXPERIENCE:</div>
                <p className="text-sm leading-relaxed">{perks[selectedPerk].details}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </Content>
  );

  const renderSkillsTab = () => (
    <Content>
      <div className="crt-text p-6 max-w-2xl mx-auto space-y-5">
      {skills.map((skill, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className="terminal-label">{skill.name}</span>
            <span className="text-sm crt-dim">{skill.years} YEARS</span>
          </div>
          <div className="h-8 crt-border relative">
            <div 
              className="h-full bg-green-500 crt-bar relative transition-none"
              style={{width: `${skill.level * 20}%`}}
            >
              <div className="absolute inset-0 flex justify-around items-center px-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 crt-pixel ${i < skill.level ? 'bg-black' : 'bg-gray-800'}`}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </Content>
  );

  switch (activeSubTab) {
    case 'STATUS':
      return renderStatusTab();
    case 'SPECIAL':
      return renderSpecialTab();
    case 'PERKS':
      return renderPerksTab();
    case 'SKILLS':
      return renderSkillsTab();
    default:
      return null;
  }
};

export default StatContent; 