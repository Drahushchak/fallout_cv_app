import React, { useState } from 'react';
import type { Inventory, InvSubTab, InventoryItem } from '../types';
import { candidateData, skills, perks, quests } from '../data';
import { useSoundEffects } from '../hooks/useSoundEffects';
import Content from './Content';

interface InvContentProps {
  activeSubTab: InvSubTab;
  inventory: Inventory;
  equippedItems: {[key: string]: boolean};
  setEquippedItems: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
  onAidConsumption?: (itemName: string, itemIndex: number) => void;
}

const InvContent: React.FC<InvContentProps> = ({ activeSubTab, inventory, equippedItems, setEquippedItems, onAidConsumption }) => {
  const { playSelectSound, playHoverSound, playEquipSound, playUnequipSound, playAidSound } = useSoundEffects();
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const handleDownloadCV = () => {
    // Create a simple text CV
    const cvContent = `
${candidateData.name} - ${candidateData.occupation}
==============================================

CONTACT
-------
Email: john.wanderer@vault-tec.com
Phone: +1-555-PIPBOY
Location: Boston Commonwealth
LinkedIn: linkedin.com/in/johnwanderer
GitHub: github.com/lonewanderer

EXPERIENCE (Level ${candidateData.level})
----------
${quests.map(q => `
${q.company} | ${q.period}
${q.name}
${q.description}
${q.achievements.map(a => `• ${a}`).join('\n')}
`).join('\n')}

SKILLS
------
${skills.map(s => `${s.name}: ${'★'.repeat(s.level)}${'☆'.repeat(5-s.level)} (${s.years} years)`).join('\n')}

TECHNOLOGIES
------------
${perks.map(p => `• ${p.name}: ${p.details}`).join('\n')}

EDUCATION
---------
${candidateData.education}
    `;

    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'John_Wanderer_CV.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLongPressStart = (item: InventoryItem) => {
    const timer = window.setTimeout(() => {
      setIsLongPress(true);
      setSelectedItem(item);
      playHoverSound();
    }, 500); // 500ms for long press

    setLongPressTimer(timer);
    setIsLongPress(false);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleItemClick = (item: InventoryItem, index: number) => {
    // Don't perform action if it was a long press
    if (isLongPress) {
      setIsLongPress(false);
      return;
    }

    // Always show details when an action is performed
    setSelectedItem(item);

    if (item.action === 'downloadCV') {
      playSelectSound();
      handleDownloadCV();
      return;
    }

    // Handle AID item consumption
    if (activeSubTab === 'AID' && onAidConsumption && item.qty > 0) {
      playAidSound();
      onAidConsumption(item.name, index);
      return;
    }

    // Handle equipping for WEAPONS and APPAREL
    if (activeSubTab === 'WEAPONS' || activeSubTab === 'APPAREL') {
      const itemKey = `${activeSubTab}-${index}`;
      const wasEquipped = equippedItems[itemKey] || false;

      // Play appropriate sound based on equipping or unequipping
      if (wasEquipped) {
        playUnequipSound();
      } else {
        playEquipSound();
      }

      if (activeSubTab === 'WEAPONS') {
        // For weapons: only one can be equipped at a time
        setEquippedItems(prev => {
          const newEquipped = { ...prev };

          // If equipping this weapon, unequip all other weapons first
          if (!prev[itemKey]) {
            // Find and unequip all other weapons
            Object.keys(prev).forEach(key => {
              if (key.startsWith('WEAPONS-') && key !== itemKey) {
                newEquipped[key] = false;
              }
            });
          }

          // Toggle the current weapon
          newEquipped[itemKey] = !prev[itemKey];
          return newEquipped;
        });
      } else if (activeSubTab === 'APPAREL') {
        // For apparel: check body parts
        setEquippedItems(prev => {
          const newEquipped = { ...prev };

          // If equipping this apparel item, check for body part conflicts
          if (!prev[itemKey] && item.bodyPart) {
            // Find and unequip any apparel covering the same body part
            Object.keys(prev).forEach(key => {
              if (key.startsWith('APPAREL-') && key !== itemKey && prev[key]) {
                const apparelIndex = parseInt(key.split('-')[1]);
                const apparelItem = inventory.APPAREL[apparelIndex];
                if (apparelItem && apparelItem.bodyPart === item.bodyPart) {
                  newEquipped[key] = false;
                }
              }
            });
          }

          // Toggle the current apparel item
          newEquipped[itemKey] = !prev[itemKey];
          return newEquipped;
        });
      }
    } else {
      // For other categories, use the default select sound
      playSelectSound();
    }
  };

  const isEquippable = (category: InvSubTab) => {
    return category === 'WEAPONS' || category === 'APPAREL';
  };

  const isEquipped = (index: number) => {
    const itemKey = `${activeSubTab}-${index}`;
    return equippedItems[itemKey] || false;
  };

  const items = inventory[activeSubTab] || [];
  const filteredItems = items.filter(item => item.qty > 0);

  // Use selectedItem on mobile, hoveredItem on desktop
  const displayedItem = selectedItem || hoveredItem;

  return (
    <Content>
      <div className="crt-text p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Items List */}
        <div className="lg:col-span-8 order-1 lg:order-1">
          {/* Mobile-friendly header */}
          <div className="hidden sm:grid grid-cols-[24px_1fr_80px_80px_80px] gap-4 py-2 crt-divider terminal-label">
            <span></span>
            <span>ITEM</span>
            <span className="text-center">QTY</span>
            <span className="text-center">WT</span>
            <span className="text-center">VAL</span>
          </div>

          {/* Mobile header */}
          <div className="sm:hidden pb-2 crt-divider terminal-label text-center">
            INVENTORY ITEMS
          </div>

          <div className="max-h-96 lg:max-h-96 overflow-y-auto crt-scroll">
            {filteredItems.map((item) => {
              // Find the original index in the unfiltered array for proper handling
              const originalIndex = items.findIndex(originalItem => originalItem === item);
              return (
                <div key={originalIndex}>
                  {/* Mobile Layout */}
                  <div
                    className={`
                      sm:hidden cursor-pointer crt-hover transition-all crt-border mb-2 p-3
                      ${isEquipped(originalIndex) ? 'crt-box-active' : ''}
                      ${selectedItem === item ? 'bg-green-500 bg-opacity-10' : ''}
                    `}
                    onClick={() => handleItemClick(item, originalIndex)}
                    onTouchStart={() => handleLongPressStart(item)}
                    onTouchEnd={handleLongPressEnd}
                    onTouchCancel={handleLongPressEnd}
                    onMouseDown={() => handleLongPressStart(item)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isEquippable(activeSubTab) && isEquipped(originalIndex) && (
                          <span className="w-3 h-3 bg-green-500 block rounded-full"></span>
                        )}
                        <span className="terminal-value font-bold break-words">{item.name}</span>
                      </div>
                      <span className="terminal-label text-xs">QTY: {item.qty}</span>
                    </div>
                    <div className="flex justify-between text-sm crt-dim">
                      <span>Weight: {item.weight}</span>
                      <span>Value: {item.value}</span>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div
                    className={`
                      hidden sm:grid grid-cols-[24px_1fr_80px_80px_80px] gap-4 py-3 crt-row cursor-pointer crt-hover transition-all
                      ${isEquipped(originalIndex) ? 'crt-box-active' : ''}
                      ${hoveredItem === item ? 'bg-green-500 bg-opacity-10' : ''}
                    `}
                    onClick={() => handleItemClick(item, originalIndex)}
                    onMouseEnter={() => {
                      playHoverSound();
                      setHoveredItem(item);
                    }}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <span className="flex justify-center items-center">
                      {isEquippable(activeSubTab) && isEquipped(originalIndex) && (
                        <span className="w-2 h-2 bg-green-500 block"></span>
                      )}
                    </span>
                    <span className="break-words">{item.name}</span>
                    <span className="text-center">{item.qty}</span>
                    <span className="text-center">{item.weight}</span>
                    <span className="text-center">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Item Details Panel */}
        <div className="lg:col-span-4 order-2 lg:order-2">
          <div className="crt-box p-3 sm:p-4 min-h-[200px] lg:h-96 lg:sticky lg:top-0">
            <div className="terminal-label mb-3">ITEM DETAILS</div>
            {displayedItem ? (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="terminal-value text-base sm:text-lg mb-2 break-words">{displayedItem.name}</div>
                  <div className="text-sm space-y-1">
                    <div>QTY: <span className="terminal-value">{displayedItem.qty}</span></div>
                    <div>WEIGHT: <span className="terminal-value">{displayedItem.weight}</span></div>
                    <div>VALUE: <span className="terminal-value">{displayedItem.value}</span></div>
                    {displayedItem.bodyPart && (
                      <div>BODY PART: <span className="terminal-value text-orange-400">{displayedItem.bodyPart.toUpperCase()}</span></div>
                    )}
                  </div>
                </div>

                {displayedItem.description && (
                  <div>
                    <div className="terminal-label text-sm mb-2">DESCRIPTION:</div>
                    <div className="crt-dim text-sm break-words leading-relaxed">
                      {displayedItem.description}
                    </div>
                  </div>
                )}

                {displayedItem.effects && displayedItem.effects.length > 0 && (
                  <div>
                    <div className="terminal-label text-sm mb-2">EFFECTS:</div>
                    <div className="space-y-1">
                      {displayedItem.effects.map((effect, effectIndex) => (
                        <div key={effectIndex} className="text-sm terminal-value break-words">
                          • {effect.display_name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEquippable(activeSubTab) && (
                  <div className="pt-3 border-t border-green-500 border-opacity-30">
                    <div className="text-sm crt-dim break-words">
                      <span className="hidden sm:inline">Click to {displayedItem && items.findIndex(item => item === displayedItem) !== -1 && isEquipped(items.findIndex(item => item === displayedItem)) ? 'unequip' : 'equip'} this item</span>
                      <span className="sm:hidden">Tap to {displayedItem && items.findIndex(item => item === displayedItem) !== -1 && isEquipped(items.findIndex(item => item === displayedItem)) ? 'unequip' : 'equip'} • Hold to view details</span>
                    </div>
                  </div>
                )}

                {activeSubTab === 'AID' && displayedItem.effects && (
                  <div className="pt-3 border-t border-orange-500 border-opacity-30">
                    <div className="text-sm text-orange-300 break-words">
                      <span className="hidden sm:inline">Click to consume this item and apply temporary effects</span>
                      <span className="sm:hidden">Tap to consume • Hold to view details</span>
                      {displayedItem.duration && (
                        <div className="text-xs mt-1">Duration: {Math.floor(displayedItem.duration / 60)}:{(displayedItem.duration % 60).toString().padStart(2, '0')}</div>
                      )}
                    </div>
                  </div>
                )}

                {displayedItem.action && (
                  <div className="pt-3 border-t border-green-500 border-opacity-30">
                    <div className="text-sm crt-dim break-words">
                      <span className="hidden sm:inline">Click to use this item</span>
                      <span className="sm:hidden">Tap to use • Hold to view details</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center crt-dim text-sm mt-8">
                <span className="hidden sm:inline">Hover over an item to see details</span>
                <span className="sm:hidden">Hold an item to see details</span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </Content>
  );
};

export default InvContent;
