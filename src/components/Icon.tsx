import React from 'react';

// Icon mapping interface
interface IconMapping {
  [key: string]: string;
}

// Map markers for different locations and objectives
const mapMarkerIcons: IconMapping = {
  // Location markers
  'location-signal': 'icon_3.svg',
  'location-vault': 'icon_8.svg',
  'location-vault-unknown': 'icon_9.svg',
  'location-boat': 'icon_11.svg',
  'location-boat-unknown': 'icon_12.svg',
  'location-ruined-tall-building': 'icon_14.svg',
  'location-ruined-tall-building-unknown': 'icon_15.svg',
  'location-ruined-housing-building': 'icon_17.svg',
  'location-ruined-housing-building-unknown': 'icon_18.svg',
  'location-housing-building': 'icon_20.svg',
  'location-housing-building-unknown': 'icon_21.svg',
  'location-synth': 'icon_23.svg',
  'location-synth-unknown': 'icon_24.svg',
  'location-park-lake': 'icon_26.svg',
  'location-park-lake-unknown': 'icon_27.svg',
  'location-u-boat': 'icon_29.svg',
  'location-u-boat-unknown': 'icon_30.svg',
  'location-sea-boat': 'icon_32.svg',
  'location-sea-boat-unknown': 'icon_33.svg',
  'location-water-pump': 'icon_35.svg',
  'location-water-pump-unknown': 'icon_36.svg',
  'location-camp-site': 'icon_38.svg',
  'location-camp-site-unknown': 'icon_39.svg',
  'location-temple': 'icon_41.svg',
  'location-temple-unknown': 'icon_42.svg',
  'location-church': 'icon_44.svg',
  'location-church-unknown': 'icon_45.svg',
  'location-satellite-dish': 'icon_47.svg',
  'location-satellite-dish-unknown': 'icon_48.svg',
  'location-memorial': 'icon_50.svg',
  'location-memorial-unknown': 'icon_51.svg',
  'location-witch': 'icon_53.svg',
  'location-witch-unknown': 'icon_54.svg',
  'location-rr': 'icon_56.svg',
  'location-rr-unknown': 'icon_57.svg',
  'location-lamp': 'icon_59.svg',
  'location-lamp-unknown': 'icon_60.svg',
  'location-radio-tower': 'icon_62.svg',
  'location-radio-tower-unknown': 'icon_63.svg',
  'location-radiation-zone': 'icon_65.svg',
  'location-radiation-zone-unknown': 'icon_66.svg',
  'location-door-quest-marker': 'icon_68.svg',
  'location-up-arrow': 'icon_69.svg',
  'location-down-arrow': 'icon_70.svg',
  'location-active-quest-marker': 'icon_73.svg',
  'location-mine': 'icon_76.svg',
  'location-mine-unknown': 'icon_77.svg',
  'location-zeppelin': 'icon_79.svg',
  'location-zeppelin-unknown': 'icon_80.svg',
  'location-power-armor-helmet': 'icon_82.svg',
  'location-lake': 'icon_85.svg',
  'location-lake-unknown': 'icon_86.svg',
  'location-police-station': 'icon_88.svg',
  'location-police-station-unknown': 'icon_89.svg',
  'location-quest-marker': 'icon_91.svg',


  // Special markers
  'marker-player': 'icon_94.svg',
  'marker-companion': 'icon_66.svg',
  'marker-enemy': 'icon_68.svg',
  'marker-neutral': 'icon_69.svg',
  'marker-friendly': 'icon_70.svg',
  'marker-danger': 'icon_73.svg',
  'marker-safe': 'icon_76.svg',
  'marker-radiation': 'icon_77.svg',
  'marker-loot': 'icon_79.svg',
  'marker-weapon': 'icon_80.svg',
  'marker-armor': 'icon_82.svg',
  'marker-food': 'icon_85.svg',
  'marker-medicine': 'icon_86.svg',
  'marker-ammo': 'icon_88.svg',
  'marker-scrap': 'icon_89.svg',
};

// SPECIAL system icons (Strength, Perception, Endurance, Charisma, Intelligence, Agility, Luck)
const specialIcons: IconMapping = {
  // Strength
  'strength-1': 'icon_strength_1.svg',
  'strength-2': 'icon_strength_2.svg',
  'strength-3': 'icon_strength_3.svg',
  'strength-4': 'icon_strength_4.svg',
  'strength-5': 'icon_strength_5.svg',
  'strength-6': 'icon_strength_6.svg',

  // Perception
  'perception-1': 'icon_perception_1.svg',
  'perception-2': 'icon_perception_2.svg',
  'perception-3': 'icon_perception_3.svg',
  'perception-4': 'icon_perception_4.svg',
  'perception-5': 'icon_perception_5.svg',
  'perception-6': 'icon_perception_6.svg',
  'perception-7': 'icon_perception_7.svg',

  // Endurance
  'endurance-1': 'icon_endurance_1.svg',
  'endurance-2': 'icon_endurance_2.svg',
  'endurance-3': 'icon_endurance_3.svg',
  'endurance-4': 'icon_endurance_4.svg',

  // Charisma
  'charisma-1': 'icon_charisma_1.svg',
  'charisma-2': 'icon_charisma_2.svg',
  'charisma-3': 'icon_charisma_3.svg',
  'charisma-4': 'icon_charisma_4.svg',
  'charisma-5': 'icon_charisma_5.svg',
  'charisma-6': 'icon_charisma_6.svg',

  // Intelligence
  'intelligence-1': 'icon_intelligence_1.svg',
  'intelligence-2': 'icon_intelligence_2.svg',
  'intelligence-3': 'icon_intelligence_3.svg',
  'intelligence-4': 'icon_intelligence_4.svg',
  'intelligence-5': 'icon_intelligence_5.svg',
  'intelligence-6': 'icon_intelligence_6.svg',
  'intelligence-7': 'icon_intelligence_7.svg',
  'intelligence-8': 'icon_intelligence_8.svg',
  'intelligence-9': 'icon_intelligence_9.svg',
  'intelligence-10': 'icon_intelligence_10.svg',
  'intelligence-11': 'icon_intelligence_11.svg',
  'intelligence-12': 'icon_intelligence_12.svg',
  'intelligence-13': 'icon_intelligence_13.svg',
  'intelligence-14': 'icon_intelligence_14.svg',

  // Agility
  'agility-1': 'icon_agility_1.svg',
  'agility-2': 'icon_agility_2.svg',
  'agility-3': 'icon_agility_3.svg',
  'agility-4': 'icon_agility_4.svg',

  // Luck
  'luck-1': 'icon_luck_1.svg',
  'luck-2': 'icon_luck_2.svg',
  'luck-3': 'icon_luck_3.svg',
  'luck-4': 'icon_luck_4.svg',
  'luck-5': 'icon_luck_5.svg',
  'luck-7': 'icon_luck_7.svg',
  'luck-8': 'icon_luck_8.svg',
  'luck-9': 'icon_luck_9.svg',
  'luck-10': 'icon_luck_10.svg',
  'luck-11': 'icon_luck_11.svg',
  'luck-12': 'icon_luck_12.svg',
  'luck-13': 'icon_luck_13.svg',

  // Name clips
  'nameclip-1': 'icon_nameclip_1.svg',
  'nameclip-2': 'icon_nameclip_2.svg',
  'nameclip-3': 'icon_nameclip_3.svg',
  'nameclip-4': 'icon_nameclip_4.svg',
  'nameclip-5': 'icon_nameclip_5.svg',
  'nameclip-6': 'icon_nameclip_6.svg',
  'nameclip-7': 'icon_nameclip_7.svg',
  'nameclip-8': 'icon_nameclip_8.svg',
  'nameclip-9': 'icon_nameclip_9.svg',
  'nameclip-10': 'icon_nameclip_10.svg',
  'nameclip-11': 'icon_nameclip_11.svg',
  'nameclip-12': 'icon_nameclip_12.svg',
  'nameclip-13': 'icon_nameclip_13.svg',
  'nameclip-14': 'icon_nameclip_14.svg',
};

// Health and condition icons
const healthIcons: IconMapping = {
  'body-healthy': 'icon_condition_body_0.svg',
  'body-light-damage': 'icon_condition_body_1.svg',
  'body-moderate-damage': 'icon_condition_body_2.svg',
  'body-heavy-damage': 'icon_condition_body_3.svg',
  'body-critical': 'icon_condition_body_4.svg',
  'body-radiation-1': 'icon_condition_body_5.svg',
  'body-radiation-2': 'icon_condition_body_6.svg',
  'body-radiation-3': 'icon_condition_body_7.svg',
  'body-radiation-4': 'icon_condition_body_8.svg',
  'body-radiation-5': 'icon_condition_body_9.svg',
  'body-poisoned': 'icon_condition_body_10.svg',
  'body-diseased': 'icon_condition_body_11.svg',
  'body-addicted': 'icon_condition_body_12.svg',
  'body-starving': 'icon_condition_body_13.svg',
  'body-dehydrated': 'icon_condition_body_14.svg',
  'body-exhausted': 'icon_condition_body_15.svg',
  'body-crippled': 'icon_condition_body_16.svg',

  'head-healthy': 'icon_condition_head_1.svg',
  'head-light-damage': 'icon_condition_head_3.svg',
  'head-moderate-damage': 'icon_condition_head_5.svg',
  'head-heavy-damage': 'icon_condition_head_7.svg',
  'head-critical': 'icon_condition_head_9.svg',
  'head-concussed': 'icon_condition_head_11.svg',
  'head-crippled': 'icon_condition_head_13.svg',
};

// Inventory and item icons
const inventoryIcons: IconMapping = {
  // Weapons
  'weapon-pistol': 'icon_100.svg',
  'weapon-rifle': 'icon_102.svg',
  'weapon-shotgun': 'icon_104.svg',
  'weapon-automatic': 'icon_106.svg',
  'weapon-heavy': 'icon_108.svg',
  'weapon-melee': 'icon_110.svg',
  'weapon-explosive': 'icon_112.svg',
  'weapon-energy': 'icon_114.svg',
  'weapon-alien': 'icon_116.svg',
  'weapon-legendary': 'icon_118.svg',

  // Armor
  'armor-helmet': 'icon_120.svg',
  'armor-chest': 'icon_122.svg',
  'armor-arms': 'icon_124.svg',
  'armor-legs': 'icon_126.svg',
  'armor-outfit': 'icon_128.svg',
  'armor-power': 'icon_130.svg',
  'armor-special': 'icon_132.svg',

  // Items
  'item-aid': 'icon_134.svg',
  'item-food': 'icon_136.svg',
  'item-drink': 'icon_138.svg',
  'item-chem': 'icon_140.svg',
  'item-book': 'icon_142.svg',
  'item-holotape': 'icon_144.svg',
  'item-key': 'icon_146.svg',
  'item-note': 'icon_148.svg',
  'item-misc': 'icon_150.svg',
  'item-junk': 'icon_152.svg',
  'item-component': 'icon_154.svg',
  'item-mod': 'icon_156.svg',
  'item-ammo': 'icon_158.svg',
  'item-currency': 'icon_160.svg',
  'item-quest': 'icon_162.svg',
  'item-unique': 'icon_164.svg',
  'item-rare': 'icon_166.svg',
  'item-legendary-item': 'icon_168.svg',

  // Containers
  'container-safe': 'icon_170.svg',
  'container-toolbox': 'icon_172.svg',
  'container-footlocker': 'icon_174.svg',
  'container-desk': 'icon_176.svg',
  'container-cabinet': 'icon_178.svg',
  'container-cooler': 'icon_180.svg',
  'container-barrel': 'icon_183.svg',

  // Crafting
  'craft-cooking': 'icon_197.svg',
  'craft-chemistry': 'icon_198.svg',
  'craft-armor-bench': 'icon_206.svg',
  'craft-weapon-bench': 'icon_20.svg',
  'craft-power-armor': 'icon_22.svg',

  // Resources
  'resource-scrap': 'icon_25.svg',
  'resource-steel': 'icon_34.svg',
  'resource-wood': 'icon_36.svg',
  'resource-concrete': 'icon_38.svg',
  'resource-plastic': 'icon_40.svg',
  'resource-rubber': 'icon_42.svg',
  'resource-cloth': 'icon_44.svg',
  'resource-leather': 'icon_46.svg',
  'resource-glass': 'icon_57.svg',
  'resource-ceramic': 'icon_62.svg',
  'resource-electronics': 'icon_67.svg',
  'resource-nuclear': 'icon_69.svg',
  'resource-acid': 'icon_79.svg',
  'resource-adhesive': 'icon_82.svg',
  'resource-aluminum': 'icon_84.svg',
  'resource-copper': 'icon_86.svg',
  'resource-crystal': 'icon_88.svg',
  'resource-fiber-optics': 'icon_90.svg',
  'resource-gears': 'icon_92.svg',
  'resource-oil': 'icon_94.svg',
  'resource-screws': 'icon_96.svg',
  'resource-springs': 'icon_98.svg',

  // Special items
  'special-fusion-core': 'icon_225.svg',
  'special-holotape-game': 'icon_227.svg',
  'special-bobblehead': 'icon_230.svg',
  'special-magazine': 'icon_233.svg',
  'special-serum': 'icon_236.svg',
  'special-artifact': 'icon_239.svg',
  'special-blueprint': 'icon_242.svg',
  'special-schematic': 'icon_245.svg',
  'special-prototype': 'icon_248.svg',
  'special-experimental': 'icon_251.svg',
  'special-classified': 'icon_253.svg',
};

// Pip-Boy menu icons
const pipboyIcons: IconMapping = {
  'menu-stats': 'icon_14.svg',
  'menu-inventory': 'icon_16.svg',
  'menu-data': 'icon_18.svg',
  'menu-map': 'icon_20.svg',
  'menu-radio': 'icon_22.svg',
  'menu-settings': 'icon_24.svg',
  'menu-help': 'icon_26.svg',
  'menu-back': 'icon_31.svg',
  'menu-forward': 'icon_33.svg',
  'menu-select': 'icon_42.svg',
  'menu-cancel': 'icon_5.svg',
  'menu-confirm': 'icon_6.svg',
  'menu-options': 'icon_7.svg',
  'menu-favorites': 'icon_52.svg',
  'menu-recent': 'icon_54.svg',
  'menu-search': 'icon_67.svg',
  'menu-filter': 'icon_69.svg',
};

// Data page icons
const dataIcons: IconMapping = {
  'data-admin': 'icon_4.svg',
  'data-holotape': 'icon_15.svg',
  'data-terminal': 'icon_16.svg',
  'data-note': 'icon_20.svg',
  'data-quest': 'icon_21.svg',
  'data-log': 'icon_22.svg',
  'data-message': 'icon_23.svg',
  'data-record': 'icon_24.svg',
  'data-file': 'icon_25.svg',
  'data-database': 'icon_26.svg',
  'data-archive': 'icon_27.svg',
  'data-backup': 'icon_28.svg',
  'data-encrypted': 'icon_29.svg',
  'data-classified': 'icon_30.svg',
  'data-personal': 'icon_31.svg',
  'data-military': 'icon_32.svg',
  'data-scientific': 'icon_33.svg',
  'data-medical': 'icon_34.svg',
  'data-corporate': 'icon_35.svg',
};

// Stats page icons
const statsIcons: IconMapping = {
  'stat-level': 'icon_100.svg',
  'stat-experience': 'icon_102.svg',
  'stat-health': 'icon_104.svg',
  'stat-action-points': 'icon_106.svg',
  'stat-radiation': 'icon_108.svg',
  'stat-carry-weight': 'icon_110.svg',
  'stat-damage-resistance': 'icon_112.svg',
  'stat-energy-resistance': 'icon_114.svg',
  'stat-poison-resistance': 'icon_116.svg',
  'stat-rad-resistance': 'icon_118.svg',
  'stat-melee-damage': 'icon_120.svg',
  'stat-ranged-damage': 'icon_122.svg',
  'stat-accuracy': 'icon_124.svg',
  'stat-critical-chance': 'icon_126.svg',
  'stat-critical-damage': 'icon_128.svg',
  'stat-sneak-attack': 'icon_130.svg',
  'stat-movement-speed': 'icon_132.svg',
  'stat-jump-height': 'icon_134.svg',
  'stat-fall-damage': 'icon_136.svg',
  'stat-addiction-chance': 'icon_138.svg',

  // Additional stats icons used in MapContent
  'stat-radiation-minimal': 'icon_74.svg',
  'stat-temperature': 'icon_76.svg',
  'stat-signal': 'icon_104.svg',
};

// Combine all icon mappings
const allIcons: IconMapping = {
  ...mapMarkerIcons,
  ...specialIcons,
  ...healthIcons,
  ...inventoryIcons,
  ...pipboyIcons,
  ...dataIcons,
  ...statsIcons,
};

// Icon categories for easier organization
export const iconCategories = {
  mapMarkers: Object.keys(mapMarkerIcons),
  special: Object.keys(specialIcons),
  health: Object.keys(healthIcons),
  inventory: Object.keys(inventoryIcons),
  pipboy: Object.keys(pipboyIcons),
  data: Object.keys(dataIcons),
  stats: Object.keys(statsIcons),
};

// Get the appropriate icon folder based on the icon name
const getIconFolder = (iconName: string): string => {
  if (iconCategories.mapMarkers.includes(iconName)) return 'FO4MapMarkers';
  if (iconCategories.special.includes(iconName)) return 'FO4SpecialIcons';
  if (iconCategories.health.includes(iconName)) return 'FO4HealthConditionIcons';
  if (iconCategories.inventory.includes(iconName)) return 'FO4InvPageIcons';
  if (iconCategories.pipboy.includes(iconName)) return 'FO4PipboyMenuIcons';
  if (iconCategories.data.includes(iconName)) return 'FO4DataPageIcons';
  if (iconCategories.stats.includes(iconName)) return 'FO4StatsPageIcons';
  return 'FO4MapMarkers'; // Default fallback
};

// Icon component props
interface IconProps {
  name: string;
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  alt?: string;
}

// Main Icon component
const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  style = {},
  onClick,
  alt
}) => {
  const iconFile = allIcons[name];

  if (!iconFile) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(allIcons));
    return null;
  }

  const folder = getIconFolder(name);
  const iconPath = `${import.meta.env.BASE_URL}icons/${folder}/${iconFile}`;

  const iconStyle: React.CSSProperties = {
    width: typeof size === 'number' ? `${size}px` : size,
    height: typeof size === 'number' ? `${size}px` : size,
    ...style,
  };

  return (
    <img
      src={iconPath}
      alt={alt || `${name} icon`}
      className={`fallout-icon ${className}`}
      style={iconStyle}
      onClick={onClick}
    />
  );
};

// Helper function to get all available icon names
export const getAvailableIcons = (): string[] => {
  return Object.keys(allIcons).sort();
};

// Helper function to get icons by category
export const getIconsByCategory = (category: keyof typeof iconCategories): string[] => {
  return iconCategories[category] || [];
};

// Helper function to search for icons by name pattern
export const searchIcons = (pattern: string): string[] => {
  const regex = new RegExp(pattern, 'i');
  return Object.keys(allIcons).filter(name => regex.test(name));
};

// Helper function to get icon URL for external use (e.g., Leaflet markers)
export const getIconUrl = (iconName: string): string => {
  const iconFile = allIcons[iconName];

  if (!iconFile) {
    console.warn(`Icon "${iconName}" not found. Using fallback icon.`);
    return `${import.meta.env.BASE_URL}icons/FO4MapMarkers/icon_94.svg`;
  }

  const folder = getIconFolder(iconName);
  return `${import.meta.env.BASE_URL}icons/${folder}/${iconFile}`;
};

export default Icon;
