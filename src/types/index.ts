export interface CandidateData {
  name: string;
  age: number;
  gender: string;
  occupation: string;
  education: string;
  level: number;
  hp: number;
  ap: number;
  xp: string;
}

export interface SpecialAttribute {
  name: string;
  level: number;
  desc: string;
}

export interface Perk {
  name: string;
  icon?: string; // Legacy icon path (optional for backward compatibility)
  iconName?: string; // Icon name for the new Icon component system
  desc: string;
  details: string;
}

export interface Skill {
  name: string;
  level: number;
  years: number;
}

export interface InventoryEffect {
  name: string | null; // The internal effect name (e.g., "bug_detection") or null for flavor text
  value: number | null; // The numeric value or null for non-numeric effects
  display_name: string; // What to show to the user
}

export interface InventoryItem {
  name: string;
  qty: number;
  weight: number;
  value: number;
  action?: string;
  equipped?: boolean;
  description?: string;
  effects?: InventoryEffect[]; // Changed from string[] to InventoryEffect[]
  duration?: number; // Duration in seconds for AID items
  bodyPart?: string; // Body part for apparel items (head, torso, hands, feet, eyes, etc.)
}

export interface TemporaryEffect {
  itemName: string;
  effects: InventoryEffect[]; // Changed from string[] to InventoryEffect[]
  duration: number; // Remaining time in seconds
  maxDuration: number; // Original duration for percentage calculation
}

// New types for Map-based effects system
export interface EffectContribution {
  itemName: string;
  itemType: 'WEAPON' | 'APPAREL' | 'AID';
  value: number;
  isTemporary?: boolean;
  expiresAt?: number; // Timestamp when temporary effect expires
}

export interface ProcessedEffect {
  name: string;
  totalValue: number;
  contributors: EffectContribution[];
}

export interface EffectsMap {
  [effectName: string]: EffectContribution[];
}

export interface Inventory {
  WEAPONS: InventoryItem[];
  APPAREL: InventoryItem[];
  AID: InventoryItem[];
  MISC: InventoryItem[];
  JUNK: InventoryItem[];
  MODS: InventoryItem[];
  AMMO: InventoryItem[];
}

export interface Quest {
  name: string;
  status: string;
  company: string;
  period: string; // Supports formats like "2020-2023", "2020-01-2023-06", "2020-01-15-2023-06-30"
  description: string;
  achievements: string[];
  tracked?: boolean;
  coordinates?: [number, number]; // [latitude, longitude] for map display
}

export interface ActiveSubTab {
  STAT: StatSubTab;
  INV: InvSubTab;
  DATA: DataSubTab;
}

export type TabType = 'STAT' | 'INV' | 'DATA' | 'MAP' | 'RADIO';
export type StatSubTab = 'STATUS' | 'SPECIAL' | 'PERKS' | 'SKILLS';
export type InvSubTab = 'WEAPONS' | 'APPAREL' | 'AID' | 'MISC' | 'JUNK' | 'MODS' | 'AMMO';
export type DataSubTab = 'QUESTS';
