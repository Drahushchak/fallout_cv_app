import type { CandidateData, SpecialAttribute, Perk, Skill, Inventory, Quest } from '../types';

// Helper interface for date ranges
interface DateRange {
  start: Date;
  end: Date;
}

// Parse quest period string into start and end dates
function parsePeriod(period: string): DateRange {
  // Split by " to " to get start and end parts
  const parts = period.split(' to ');
  
  if (parts.length !== 2) {
    throw new Error(`Invalid period format: ${period}. Expected format: "start to end"`);
  }
  
  const startPart = parts[0].trim();
  const endPart = parts[1].trim();
  
  // Handle "Present" case
  if (endPart.toLowerCase() === 'present') {
    const start = parseDate(startPart.split('-'));
    return { start, end: new Date() };
  }
  
  // Parse start and end dates
  const start = parseDate(startPart.split('-'));
  const end = parseDate(endPart.split('-'));
  
  return { start, end };
}

// Parse date parts into a Date object
function parseDate(parts: string[]): Date {
  const year = parseInt(parts[0]);
  const month = parts.length > 1 ? parseInt(parts[1]) - 1 : 0; // JS months are 0-indexed
  const day = parts.length > 2 ? parseInt(parts[2]) : 1;
  
  return new Date(year, month, day);
}

// Merge overlapping date ranges
function mergeOverlappingRanges(ranges: DateRange[]): DateRange[] {
  if (ranges.length === 0) return [];
  
  // Sort ranges by start date
  const sorted = ranges.sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: DateRange[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];
    
    // If current range overlaps with the last merged range
    if (current.start <= lastMerged.end) {
      // Extend the end date if current range extends further
      lastMerged.end = new Date(Math.max(lastMerged.end.getTime(), current.end.getTime()));
    } else {
      // No overlap, add as new range
      merged.push(current);
    }
  }
  
  return merged;
}

// Calculate total milliseconds from merged date ranges
function calculateTotalExperience(ranges: DateRange[]): number {
  return ranges.reduce((total, range) => {
    return total + (range.end.getTime() - range.start.getTime());
  }, 0);
}

// Helper function to calculate years of experience from quests
function calculateExperienceFromQuests(quests: Quest[]): { level: number; currentProgress: number; xpDisplay: string } {
  // Parse all completed quest periods
  const completedRanges: DateRange[] = [];
  let inProgressQuest: Quest | undefined;
  let inProgressRange: DateRange | undefined;
  
  quests.forEach(quest => {
    const range = parsePeriod(quest.period);
    
    if (quest.status === 'COMPLETED') {
      completedRanges.push(range);
    } else if (quest.status === 'IN PROGRESS') {
      inProgressQuest = quest;
      inProgressRange = range;
    }
  });
  
  // Merge overlapping completed ranges
  const mergedCompletedRanges = mergeOverlappingRanges(completedRanges);
  
  // Calculate total completed experience in milliseconds
  const completedExperienceMs = calculateTotalExperience(mergedCompletedRanges);
  
  // Add in-progress experience if exists
  let totalExperienceMs = completedExperienceMs;
  let currentXPSeconds = 0;
  
  if (inProgressQuest && inProgressRange) {
    // Calculate experience from start of in-progress quest to now
    const now = new Date();
    const inProgressMs = now.getTime() - inProgressRange.start.getTime();
    totalExperienceMs += inProgressMs;
    
    // For XP display, show progress within the current year of the in-progress quest
    const currentYear = now.getFullYear();
    const startOfCurrentYear = new Date(currentYear, 0, 1);
    
    // If the in-progress quest started this year, show progress from quest start
    // Otherwise, show progress from start of current year
    const progressStart = inProgressRange.start.getFullYear() === currentYear 
      ? inProgressRange.start 
      : startOfCurrentYear;
    
    currentXPSeconds = Math.floor((now.getTime() - progressStart.getTime()) / 1000);
  } else {
    // No in-progress quest, show static progress based on completed experience
    const totalYears = totalExperienceMs / (365.25 * 24 * 60 * 60 * 1000); // Account for leap years
    const fractionalYear = totalYears % 1;
    const secondsInYear = 365 * 24 * 60 * 60;
    currentXPSeconds = Math.floor(fractionalYear * secondsInYear);
  }
  
  // Calculate level (years of experience)
  const level = Math.floor(totalExperienceMs / (365.25 * 24 * 60 * 60 * 1000)); // Account for leap years
  const secondsInYear = 365 * 24 * 60 * 60;
  
  const xpDisplay = `${currentXPSeconds.toLocaleString()}/${secondsInYear.toLocaleString()}`;
  
  return { level, currentProgress: currentXPSeconds, xpDisplay };
}

// Define quests first so we can use them to calculate candidateData
export const quests: Quest[] = [
  // IN PROGRESS quests first
  {
    name: "Mission: AI Integration",
    status: "IN PROGRESS",
    company: "Future Tech Corp",
    period: "2024-01-15 to Present", // Started January 15, 2024 (OVERLAPS with Cloud Migration by 2.5 months)
    description: "Leading implementation of AI-powered features and machine learning models", 
    achievements: ["Implemented GPT-4 integration", "Built custom ML pipeline", "Training junior developers"]
  },
  // COMPLETED quests sorted chronologically
  {
    name: "Junior Developer Bootcamp",
    status: "COMPLETED",
    company: "CodeAcademy Inc",
    period: "2017-06 to 2017-12", // June 2017 to December 2017 (6 months)
    description: "First professional development role, learned fundamentals",
    achievements: ["Built first production app", "Learned React basics", "Agile methodology introduction"]
  },
  {
    name: "Freelance Consulting",
    status: "COMPLETED",
    company: "Various Clients", 
    period: "2018-03 to 2018-09", // March 2018 to September 2018 (6 months) - GAP from Jan-Feb 2018
    description: "Provided technical consulting for multiple startups",
    achievements: ["5 successful project deliveries", "React/Node.js expertise", "Client relationship building"]
  },
  {
    name: "The Mobile Offensive",
    status: "COMPLETED", 
    company: "StartupXYZ",
    period: "2019 to 2021", // Year only: January 2019 to January 2021 (2 years) - GAP from Oct 2018-Dec 2018
    description: "Developed React Native app with 50k+ active users",
    achievements: ["4.8★ App Store rating", "GraphQL API design", "CI/CD pipeline setup"]
  },
  {
    name: "Operation: Real-time Dashboard", 
    status: "COMPLETED",
    company: "DataViz Solutions",
    period: "2021-04 to 2023-08", // April 2021 to August 2023 (2 years 4 months) - GAP from Jan-Mar 2021
    description: "Built real-time analytics platform processing 1M+ events/second",
    achievements: ["Implemented with Kafka & Redis", "Sub-100ms latency", "Grafana visualizations"]
  },
  {
    name: "The Cloud Migration",
    status: "COMPLETED",
    company: "Tech Corp Industries",
    period: "2022-06 to 2024-03", // June 2022 to March 2024 (OVERLAPS with DataViz by 1 year 2 months)
    description: "Led migration of legacy monolith to AWS microservices architecture",
    achievements: ["Reduced costs by 40%", "Improved uptime to 99.9%", "Trained team of 8"]
  }
];

// Calculate experience from quests
const experienceData = calculateExperienceFromQuests(quests);

export const candidateData: CandidateData = {
  name: "John Wanderer",
  age: 28,
  gender: "Male",
  occupation: "Full Stack Developer",
  education: "BS Computer Science - Vault-Tec University",
  level: experienceData.level, // Years of experience calculated from quests
  hp: 100,
  ap: 85,
  xp: experienceData.xpDisplay // Seconds format: current/total_in_year
};

export const special: SpecialAttribute[] = [
  { name: "Strategic thinking", level: 8, desc: "Ability to see the big picture and plan ahead" },
  { name: "Problem-solving", level: 9, desc: "Expert at debugging and finding solutions" },
  { name: "Empathy", level: 7, desc: "Understanding team needs and user perspectives" },
  { name: "Communication", level: 8, desc: "Clear technical and non-technical communication" },
  { name: "Innovation", level: 7, desc: "Creating novel solutions to complex problems" },
  { name: "Adaptability", level: 9, desc: "Quick learner, thrives in changing environments" },
  { name: "Leadership", level: 6, desc: "Leading projects and mentoring junior developers" }
];

const getIconPath = (path: string) => `${import.meta.env.BASE_URL}icons/${path}`;

export const perks: Perk[] = [
  { 
    name: "Redis Ranger", 
    icon: getIconPath("FO4SpecialIcons/icon_intelligence_1.svg"), 
    desc: "Master of in-memory data structures. +50% cache hit rate, -30% response time",
    details: "3 years managing Redis clusters, optimization expert"
  },
  { 
    name: "PostgreSQL Paladin", 
    icon: getIconPath("FO4DataPageIcons/icon_4.svg"), 
    desc: "Database guardian. Query optimization, complex joins, stored procedures",
    details: "5 years of PostgreSQL, including replication and performance tuning"
  },
  { 
    name: "Grafana Explorer", 
    icon: getIconPath("FO4StatsPageIcons/icon_100.svg"), 
    desc: "Visualization virtuoso. Creates dashboards that tell stories",
    details: "Built 20+ production dashboards, expert in metrics and alerting"
  },
  { 
    name: "GraphQL Gunslinger", 
    icon: getIconPath("FO4InvPageIcons/icon_122.svg"), 
    desc: "Quick-draw API designer. Efficient queries, perfect schemas",
    details: "Designed and implemented 5 GraphQL APIs from scratch"
  },
  { 
    name: "Docker Dweller", 
    icon: getIconPath("FO4PipboyMenuIcons/icon_14.svg"), 
    desc: "Container craftsman. Microservices architecture specialist",
    details: "Containerized 15+ applications, Kubernetes deployment experience"
  },
  { 
    name: "React Ronin", 
    icon: getIconPath("FO4SpecialIcons/icon_intelligence_3.svg"), 
    desc: "Component samurai. Hooks master, performance optimizer",
    details: "4 years building scalable React applications"
  }
];

export const skills: Skill[] = [
  { name: "JavaScript/TypeScript", level: 5, years: 5 },
  { name: "Python", level: 4, years: 4 },
  { name: "React/Next.js", level: 4, years: 4 },
  { name: "Node.js", level: 5, years: 5 },
  { name: "AWS/Cloud", level: 3, years: 3 },
  { name: "Git/Version Control", level: 5, years: 7 },
  { name: "Agile/Scrum", level: 4, years: 4 },
  { name: "System Design", level: 3, years: 3 }
];

export const inventory: Inventory = {
  WEAPONS: [
    { 
      name: "Keyboard of Fury", 
      qty: 1, 
      weight: 2.5, 
      value: 150,
      description: "A legendary mechanical keyboard with Cherry MX switches",
      effects: [
        { name: "typing_speed", value: 50, display_name: "+50% Typing Speed" },
        { name: "code_quality", value: 25, display_name: "+25% Code Quality" },
        { name: null, value: null, display_name: "Satisfying Click Sound" }
      ]
    },
    { 
      name: "Debugging Rifle", 
      qty: 1, 
      weight: 5.0, 
      value: 500,
      description: "High-precision tool for eliminating bugs from long range",
      effects: [
        { name: "bug_detection", value: 100, display_name: "+100% Bug Detection" },
        { name: "error_resolution", value: 75, display_name: "+75% Error Resolution" },
        { name: null, value: null, display_name: "Pierces through nested functions" }
      ]
    },
    { 
      name: "Code Review Sword", 
      qty: 1, 
      weight: 3.0, 
      value: 300,
      description: "Sharp blade for cutting through messy code and bad practices",
      effects: [
        { name: "code_quality", value: 60, display_name: "+60% Code Quality" },
        { name: "productivity", value: 40, display_name: "+40% Team Collaboration" },
        { name: null, value: null, display_name: "Critical Hit on Technical Debt" }
      ]
    }
  ],
  APPAREL: [
    { 
      name: "Developer Hoodie", 
      qty: 3, 
      weight: 1.0, 
      value: 50,
      description: "Comfortable hoodie providing warmth during long coding sessions",
      effects: [
        { name: "focus", value: 20, display_name: "+20% Focus" },
        { name: "comfort", value: 15, display_name: "+15% Comfort" },
        { name: null, value: null, display_name: "Reduces Social Interaction Anxiety" }
      ],
      bodyPart: "torso"
    },
    { 
      name: "Conference T-Shirt Collection", 
      qty: 12, 
      weight: 0.5, 
      value: 20,
      description: "Assorted tech conference shirts showcasing industry involvement",
      effects: [
        { name: "productivity", value: 10, display_name: "+10% Network Connections" },
        { name: "productivity", value: 5, display_name: "+5% Tech Credibility" },
        { name: null, value: null, display_name: "Conversation Starter" }
      ],
      bodyPart: "torso"
    },
    { 
      name: "Lucky Debugging Socks", 
      qty: 1, 
      weight: 0.1, 
      value: 100,
      description: "Mystical socks that seem to make bugs fix themselves",
      effects: [
        { name: "bug_fix_success", value: 30, display_name: "+30% Bug Fix Success Rate" },
        { name: "productivity", value: 20, display_name: "+20% Luck" },
        { name: null, value: null, display_name: "Prevents Deployment Disasters" }
      ],
      bodyPart: "feet"
    },
    { 
      name: "Noise-Canceling Headphones", 
      qty: 1, 
      weight: 0.8, 
      value: 200,
      description: "Premium headphones that block out distractions and enhance focus",
      effects: [
        { name: "focus", value: 40, display_name: "+40% Focus" },
        { name: "focus", value: 25, display_name: "+25% Concentration" },
        { name: null, value: null, display_name: "Blocks Office Noise" }
      ],
      bodyPart: "head"
    },
    { 
      name: "Ergonomic Coding Gloves", 
      qty: 2, 
      weight: 0.2, 
      value: 80,
      description: "Specialized gloves that reduce strain during long typing sessions",
      effects: [
        { name: "typing_comfort", value: 30, display_name: "+30% Typing Comfort" },
        { name: "typing_speed", value: 15, display_name: "+15% Typing Speed" },
        { name: null, value: null, display_name: "Prevents RSI" }
      ],
      bodyPart: "hands"
    },
    { 
      name: "Blue Light Blocking Glasses", 
      qty: 1, 
      weight: 0.1, 
      value: 150,
      description: "Protective eyewear that filters harmful blue light from screens",
      effects: [
        { name: "eye_comfort", value: 25, display_name: "+25% Eye Comfort" },
        { name: "focus", value: 20, display_name: "+20% Focus" },
        { name: null, value: null, display_name: "Reduces Eye Strain" }
      ],
      bodyPart: "eyes"
    }
  ],
  AID: [
    { 
      name: "Coffee (Black)", 
      qty: 99, 
      weight: 0.5, 
      value: 5,
      description: "Pure liquid focus. Essential for any coding session.",
      effects: [
        { name: "alertness", value: 50, display_name: "+50% Alertness" },
        { name: "productivity", value: 25, display_name: "+25% Productivity" },
        { name: null, value: null, display_name: "Prevents Sleep" }
      ],
      duration: 300 // 5 minutes
    },
    { 
      name: "Energy Drink", 
      qty: 24, 
      weight: 0.5, 
      value: 3,
      description: "High-caffeine boost for those all-night debugging sessions",
      effects: [
        { name: "energy", value: 75, display_name: "+75% Energy" },
        { name: "focus", value: 35, display_name: "+35% Focus" },
        { name: null, value: null, display_name: "Temporary Skill Boost" }
      ],
      duration: 600 // 10 minutes
    },
    { 
      name: "Focus Pills", 
      qty: 12, 
      weight: 0.1, 
      value: 15,
      description: "Pharmaceutical-grade concentration enhancement for complex problem solving.",
      effects: [
        { name: "focus", value: 100, display_name: "+100% Focus" },
        { name: "code_quality", value: 50, display_name: "+50% Code Quality" },
        { name: null, value: null, display_name: "Enhanced Problem Solving" }
      ],
      duration: 900 // 15 minutes
    },
    { 
      name: "Productivity Serum", 
      qty: 5, 
      weight: 0.3, 
      value: 50,
      description: "Experimental compound that dramatically boosts work efficiency.",
      effects: [
        { name: "productivity", value: 150, display_name: "+150% Productivity" },
        { name: "typing_speed", value: 75, display_name: "+75% Typing Speed" },
        { name: null, value: null, display_name: "Reduced Break Time" }
      ],
      duration: 1200 // 20 minutes
    },
    { 
      name: "Quick Caffeine Shot", 
      qty: 10, 
      weight: 0.1, 
      value: 2,
      description: "A rapid burst of energy that doesn't last long. Perfect for testing effects.",
      effects: [
        { name: "energy", value: 25, display_name: "+25% Energy" },
        { name: "alertness", value: 30, display_name: "+30% Alertness" },
        { name: null, value: null, display_name: "Short-lived Boost" }
      ],
      duration: 10 // 10 seconds - for testing
    }
  ],
  MISC: [
    { 
      name: "GitHub Contributions Graph", 
      qty: 1, 
      weight: 0, 
      value: 9999,
      description: "A visual representation of coding dedication and consistency",
      effects: [
        { name: null, value: null, display_name: "Shows Commitment" },
        { name: null, value: null, display_name: "Intimidates Recruiters" },
        { name: null, value: null, display_name: "Proves Work Ethic" }
      ]
    },
    { 
      name: "Stack Overflow Points", 
      qty: 2847, 
      weight: 0, 
      value: 1,
      description: "Accumulated wisdom points from helping fellow developers",
      effects: [
        { name: null, value: null, display_name: "Community Respect" },
        { name: null, value: null, display_name: "Problem Solving Credibility" },
        { name: null, value: null, display_name: "Karma" }
      ]
    },
    { 
      name: "Rubber Duck", 
      qty: 3, 
      weight: 0.2, 
      value: 10,
      description: "Silent debugging companion that listens without judgment",
      effects: [
        { name: null, value: null, display_name: "Improves Problem Solving" },
        { name: null, value: null, display_name: "Reduces Stress" },
        { name: null, value: null, display_name: "Never Interrupts" }
      ]
    },
    { 
      name: "[*] CV Document", 
      qty: 1, 
      weight: 0.1, 
      value: 1000, 
      action: "downloadCV",
      description: "Complete professional resume in downloadable format",
      effects: [
        { name: null, value: null, display_name: "Opens Career Opportunities" },
        { name: null, value: null, display_name: "Showcases Skills" },
        { name: null, value: null, display_name: "Impresses Recruiters" }
      ]
    }
  ],
  JUNK: [
    { name: "Deprecated Code", qty: 47, weight: 0.1, value: 0 },
    { name: "TODO Comments", qty: 183, weight: 0, value: -5 },
    { name: "Console.log Statements", qty: 999, weight: 0, value: 0 }
  ],
  MODS: [
    { name: "VSCode Extension Pack", qty: 1, weight: 0, value: 200 },
    { name: "Vim Keybindings", qty: 1, weight: 0, value: 500 },
    { name: "Dark Theme Collection", qty: 15, weight: 0, value: 50 }
  ],
  AMMO: [
    { name: "Unit Tests", qty: 500, weight: 0, value: 1 },
    { name: "Integration Tests", qty: 200, weight: 0, value: 2 },
    { name: "Git Commits", qty: 9999, weight: 0, value: 0.5 }
  ]
}; 