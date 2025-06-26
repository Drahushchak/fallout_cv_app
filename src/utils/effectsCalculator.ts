import type { Inventory, TemporaryEffect, EffectsMap, EffectContribution, ProcessedEffect } from '../types';

// Calculate all effects from equipped items and temporary effects
export function calculateAllEffects(
  inventory: Inventory,
  equippedItems: { [key: string]: boolean },
  temporaryEffects: TemporaryEffect[]
): EffectsMap {
  const effectsMap: EffectsMap = {};
  
  // Helper function to add effect contribution
  const addEffectContribution = (
    effectName: string,
    contribution: EffectContribution
  ) => {
    if (!effectsMap[effectName]) {
      effectsMap[effectName] = [];
    }
    effectsMap[effectName].push(contribution);
  };
  
  // Process equipped weapons
  inventory.WEAPONS?.forEach((item, index) => {
    const itemKey = `WEAPONS-${index}`;
    if (equippedItems[itemKey] && item.effects) {
      item.effects.forEach(effect => {
        // Only process effects that have a name and value
        if (effect.name && effect.value !== null) {
          addEffectContribution(effect.name, {
            itemName: item.name,
            itemType: 'WEAPON',
            value: effect.value,
            isTemporary: false
          });
        }
      });
    }
  });
  
  // Process equipped apparel
  inventory.APPAREL?.forEach((item, index) => {
    const itemKey = `APPAREL-${index}`;
    if (equippedItems[itemKey] && item.effects) {
      item.effects.forEach(effect => {
        // Only process effects that have a name and value
        if (effect.name && effect.value !== null) {
          addEffectContribution(effect.name, {
            itemName: item.name,
            itemType: 'APPAREL',
            value: effect.value,
            isTemporary: false
          });
        }
      });
    }
  });
  
  // Process temporary effects from AID items
  const currentTime = Date.now();
  temporaryEffects.forEach(tempEffect => {
    const expiresAt = currentTime + (tempEffect.duration * 1000);
    
    tempEffect.effects.forEach(effect => {
      // Only process effects that have a name and value
      if (effect.name && effect.value !== null) {
        addEffectContribution(effect.name, {
          itemName: tempEffect.itemName,
          itemType: 'AID',
          value: effect.value,
          isTemporary: true,
          expiresAt
        });
      }
    });
  });
  
  return effectsMap;
}

// Get processed effects with totals
export function getProcessedEffects(effectsMap: EffectsMap): ProcessedEffect[] {
  const currentTime = Date.now();
  
  return Object.entries(effectsMap).map(([effectName, contributions]) => {
    // Filter out expired temporary effects
    const activeContributions = contributions.filter(contrib => {
      if (contrib.isTemporary && contrib.expiresAt) {
        return contrib.expiresAt > currentTime;
      }
      return true;
    });
    
    // Calculate total value
    const totalValue = activeContributions.reduce((sum, contrib) => sum + contrib.value, 0);
    
    return {
      name: effectName,
      totalValue,
      contributors: activeContributions
    };
  }).filter(effect => effect.totalValue > 0); // Only return effects with positive values
}

// Get legacy stats object for backward compatibility
export function getLegacyStats(processedEffects: ProcessedEffect[]): {
  hp: number;
  ap: number;
  typing_speed: number;
  code_quality: number;
  bug_detection: number;
  focus: number;
  comfort: number;
  alertness: number;
  productivity: number;
  energy: number;
  error_resolution: number;
  bug_fix_success: number;
  typing_comfort: number;
  eye_comfort: number;
} {
  const stats = {
    hp: 0,
    ap: 0,
    typing_speed: 0,
    code_quality: 0,
    bug_detection: 0,
    focus: 0,
    comfort: 0,
    alertness: 0,
    productivity: 0,
    energy: 0,
    error_resolution: 0,
    bug_fix_success: 0,
    typing_comfort: 0,
    eye_comfort: 0
  };
  
  processedEffects.forEach(effect => {
    if (effect.name in stats) {
      stats[effect.name as keyof typeof stats] = effect.totalValue;
    }
  });
  
  return stats;
}

// Clean up expired effects from the map
export function cleanupExpiredEffects(effectsMap: EffectsMap): EffectsMap {
  const currentTime = Date.now();
  const cleanedMap: EffectsMap = {};
  
  Object.entries(effectsMap).forEach(([effectName, contributions]) => {
    const activeContributions = contributions.filter(contrib => {
      if (contrib.isTemporary && contrib.expiresAt) {
        return contrib.expiresAt > currentTime;
      }
      return true;
    });
    
    if (activeContributions.length > 0) {
      cleanedMap[effectName] = activeContributions;
    }
  });
  
  return cleanedMap;
} 