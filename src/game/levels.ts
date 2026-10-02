import { WorldConfig, LevelConfig, LevelObjective, CrystalColor, ObstacleType } from '../types/game';

export const WORLDS_CONFIG: WorldConfig[] = [
  {
    id: 1,
    name: 'Crystal Valley',
    subtitle: 'Where magical prisms awaken',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    ambientColor: '#10b981',
    accentColor: '#34d399',
    description: 'A serene valley of luminescent geodes and pure magical energy.',
    levelRange: [1, 3],
    unlockedAtStars: 0,
    icon: 'Sparkles'
  },
  {
    id: 2,
    name: 'Mystic Forest',
    subtitle: 'Enchanted flora & frost crystals',
    bgGradient: 'from-teal-950 via-slate-900 to-emerald-950',
    ambientColor: '#059669',
    accentColor: '#10b981',
    description: 'An ancient canopy where frozen crystals test your tactical vision.',
    levelRange: [4, 6],
    unlockedAtStars: 6,
    icon: 'Trees'
  },
  {
    id: 3,
    name: 'Ocean Ruins',
    subtitle: 'Sunken shrines & deep sapphire',
    bgGradient: 'from-blue-950 via-slate-900 to-cyan-950',
    ambientColor: '#0284c7',
    accentColor: '#38bdf8',
    description: 'Submerged ruins protected by thick glacier sheets and water gems.',
    levelRange: [7, 9],
    unlockedAtStars: 14,
    icon: 'Waves'
  },
  {
    id: 4,
    name: 'Ember Mountains',
    subtitle: 'Volcanic heat & blazing rubies',
    bgGradient: 'from-red-950 via-slate-900 to-amber-950',
    ambientColor: '#dc2626',
    accentColor: '#f87171',
    description: 'Molten crags where volcanic stone obstacles demand Nova Bomb power.',
    levelRange: [10, 12],
    unlockedAtStars: 22,
    icon: 'Flame'
  },
  {
    id: 5,
    name: 'Sky Kingdom',
    subtitle: 'Floating citadels & caged runes',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    ambientColor: '#6366f1',
    accentColor: '#818cf8',
    description: 'Soaring spires where crystal cages hold elemental gems captive.',
    levelRange: [13, 15],
    unlockedAtStars: 30,
    icon: 'Cloud'
  },
  {
    id: 6,
    name: 'Ancient Temple',
    subtitle: 'Sacred trials of the Archons',
    bgGradient: 'from-amber-950 via-slate-900 to-stone-950',
    ambientColor: '#d97706',
    accentColor: '#fbbf24',
    description: 'Perilous sanctuaries combining stone barriers, frost, and golden cages.',
    levelRange: [16, 18],
    unlockedAtStars: 38,
    icon: 'Castle'
  },
  {
    id: 7,
    name: 'Lunar Realm',
    subtitle: 'Moonlit diamond starlight',
    bgGradient: 'from-violet-950 via-slate-900 to-fuchsia-950',
    ambientColor: '#c084fc',
    accentColor: '#e879f9',
    description: 'A celestial dimension of pure starlight where precision is paramount.',
    levelRange: [19, 21],
    unlockedAtStars: 46,
    icon: 'Moon'
  },
  {
    id: 8,
    name: 'Cyber Crystal City',
    subtitle: 'Apex of neon crystal mastery',
    bgGradient: 'from-fuchsia-950 via-slate-900 to-cyan-950',
    ambientColor: '#ec4899',
    accentColor: '#06b6d4',
    description: 'The pinnacle futuristic metropolis powered by Astral Super Prisms.',
    levelRange: [22, 24],
    unlockedAtStars: 54,
    icon: 'Zap'
  }
];

export const HANDCRAFTED_LEVELS: LevelConfig[] = [
  // World 1: Crystal Valley
  {
    id: 1,
    worldId: 1,
    title: 'The Valley Gate',
    rows: 8,
    cols: 8,
    moves: 22,
    objectives: [
      { type: 'score', target: 2000, current: 0, description: 'Reach 2,000 points' }
    ],
    starScores: [1500, 2500, 4000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz'],
    rewardCoins: 150,
    rewardGems: 10,
    rewardXp: 50
  },
  {
    id: 2,
    worldId: 1,
    title: 'Prismatic Awakening',
    rows: 8,
    cols: 8,
    moves: 24,
    objectives: [
      { type: 'collect_gems', gemColor: 'ruby', target: 15, current: 0, description: 'Collect 15 Ruby Crystals' },
      { type: 'score', target: 3000, current: 0, description: 'Reach 3,000 points' }
    ],
    starScores: [2500, 4000, 6000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    rewardCoins: 200,
    rewardGems: 15,
    rewardXp: 75
  },
  {
    id: 3,
    worldId: 1,
    title: 'Valley Convergence',
    rows: 8,
    cols: 8,
    moves: 25,
    objectives: [
      { type: 'collect_gems', gemColor: 'emerald', target: 18, current: 0, description: 'Collect 18 Emeralds' },
      { type: 'collect_gems', gemColor: 'sapphire', target: 18, current: 0, description: 'Collect 18 Sapphires' }
    ],
    starScores: [3500, 5500, 8000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    rewardCoins: 250,
    rewardGems: 20,
    rewardXp: 100
  },

  // World 2: Mystic Forest (Introduces Frost / Ice)
  {
    id: 4,
    worldId: 2,
    title: 'Frostbloom Glade',
    rows: 8,
    cols: 8,
    moves: 24,
    objectives: [
      { type: 'clear_ice', target: 8, current: 0, description: 'Shatter 8 Frost Blocks' },
      { type: 'score', target: 4000, current: 0, description: 'Score 4,000 points' }
    ],
    initialObstacles: [
      { row: 3, col: 2, type: 'ice_1' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 3, col: 5, type: 'ice_1' },
      { row: 4, col: 2, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' },
      { row: 4, col: 5, type: 'ice_1' }
    ],
    starScores: [3000, 5000, 8000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    rewardCoins: 250,
    rewardGems: 20,
    rewardXp: 110
  },
  {
    id: 5,
    worldId: 2,
    title: 'Whispering Willow',
    rows: 8,
    cols: 8,
    moves: 26,
    objectives: [
      { type: 'clear_ice', target: 12, current: 0, description: 'Shatter 12 Frost Blocks' },
      { type: 'collect_gems', gemColor: 'amethyst', target: 20, current: 0, description: 'Collect 20 Amethysts' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'ice_1' },
      { row: 2, col: 5, type: 'ice_1' },
      { row: 3, col: 2, type: 'ice_1' },
      { row: 3, col: 5, type: 'ice_1' },
      { row: 4, col: 2, type: 'ice_1' },
      { row: 4, col: 5, type: 'ice_1' },
      { row: 5, col: 2, type: 'ice_1' },
      { row: 5, col: 5, type: 'ice_1' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' }
    ],
    starScores: [4000, 6500, 10000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    rewardCoins: 300,
    rewardGems: 25,
    rewardXp: 130
  },
  {
    id: 6,
    worldId: 2,
    title: 'Ancient Sylvan Heart',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'clear_ice', target: 16, current: 0, description: 'Shatter 16 Frost Blocks' },
      { type: 'score', target: 6000, current: 0, description: 'Score 6,000 points' }
    ],
    initialObstacles: [
      { row: 1, col: 1, type: 'ice_2' },
      { row: 1, col: 6, type: 'ice_2' },
      { row: 6, col: 1, type: 'ice_2' },
      { row: 6, col: 6, type: 'ice_2' },
      { row: 2, col: 2, type: 'ice_1' },
      { row: 2, col: 5, type: 'ice_1' },
      { row: 5, col: 2, type: 'ice_1' },
      { row: 5, col: 5, type: 'ice_1' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' },
      { row: 2, col: 3, type: 'ice_1' },
      { row: 2, col: 4, type: 'ice_1' },
      { row: 5, col: 3, type: 'ice_1' },
      { row: 5, col: 4, type: 'ice_1' }
    ],
    starScores: [5000, 8000, 12000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 350,
    rewardGems: 30,
    rewardXp: 160
  },

  // World 3: Ocean Ruins (Introduces Glacier Double-Ice)
  {
    id: 7,
    worldId: 3,
    title: 'Sunken Causeway',
    rows: 8,
    cols: 8,
    moves: 25,
    objectives: [
      { type: 'clear_ice', target: 10, current: 0, description: 'Melt 10 Glacier Sheets' },
      { type: 'collect_gems', gemColor: 'sapphire', target: 22, current: 0, description: 'Collect 22 Sapphires' }
    ],
    initialObstacles: [
      { row: 2, col: 3, type: 'ice_2' },
      { row: 2, col: 4, type: 'ice_2' },
      { row: 3, col: 3, type: 'ice_2' },
      { row: 3, col: 4, type: 'ice_2' },
      { row: 4, col: 3, type: 'ice_2' },
      { row: 4, col: 4, type: 'ice_2' },
      { row: 5, col: 3, type: 'ice_2' },
      { row: 5, col: 4, type: 'ice_2' },
      { row: 3, col: 2, type: 'ice_1' },
      { row: 4, col: 5, type: 'ice_1' }
    ],
    starScores: [4500, 7500, 11000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst'],
    rewardCoins: 350,
    rewardGems: 25,
    rewardXp: 180
  },
  {
    id: 8,
    worldId: 3,
    title: 'Coral Sanctum',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'clear_ice', target: 14, current: 0, description: 'Clear 14 Glacier Ice' },
      { type: 'score', target: 7500, current: 0, description: 'Reach 7,500 points' }
    ],
    initialObstacles: [
      { row: 1, col: 2, type: 'ice_2' },
      { row: 1, col: 5, type: 'ice_2' },
      { row: 2, col: 2, type: 'ice_2' },
      { row: 2, col: 5, type: 'ice_2' },
      { row: 5, col: 2, type: 'ice_2' },
      { row: 5, col: 5, type: 'ice_2' },
      { row: 6, col: 2, type: 'ice_2' },
      { row: 6, col: 5, type: 'ice_2' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' },
      { row: 3, col: 1, type: 'ice_1' },
      { row: 4, col: 6, type: 'ice_1' }
    ],
    starScores: [5500, 9000, 14000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 400,
    rewardGems: 30,
    rewardXp: 210
  },
  {
    id: 9,
    worldId: 3,
    title: 'Leviathan Trench',
    rows: 8,
    cols: 8,
    moves: 30,
    objectives: [
      { type: 'clear_ice', target: 18, current: 0, description: 'Clear all 18 Glacier Layers' },
      { type: 'collect_gems', gemColor: 'diamond', target: 20, current: 0, description: 'Collect 20 Diamonds' }
    ],
    initialObstacles: [
      { row: 2, col: 1, type: 'ice_2' },
      { row: 2, col: 2, type: 'ice_2' },
      { row: 2, col: 5, type: 'ice_2' },
      { row: 2, col: 6, type: 'ice_2' },
      { row: 3, col: 2, type: 'ice_2' },
      { row: 3, col: 5, type: 'ice_2' },
      { row: 4, col: 2, type: 'ice_2' },
      { row: 4, col: 5, type: 'ice_2' },
      { row: 5, col: 1, type: 'ice_2' },
      { row: 5, col: 2, type: 'ice_2' },
      { row: 5, col: 5, type: 'ice_2' },
      { row: 5, col: 6, type: 'ice_2' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' },
      { row: 1, col: 3, type: 'ice_1' },
      { row: 6, col: 4, type: 'ice_1' }
    ],
    starScores: [6500, 11000, 17000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 500,
    rewardGems: 40,
    rewardXp: 250
  },

  // World 4: Ember Mountains (Introduces Obsidian Stones)
  {
    id: 10,
    worldId: 4,
    title: 'Obsidian Ridge',
    rows: 8,
    cols: 8,
    moves: 26,
    objectives: [
      { type: 'collect_gems', gemColor: 'ruby', target: 25, current: 0, description: 'Collect 25 Fire Rubies' },
      { type: 'score', target: 8000, current: 0, description: 'Reach 8,000 points' }
    ],
    initialObstacles: [
      { row: 3, col: 1, type: 'stone' },
      { row: 3, col: 6, type: 'stone' },
      { row: 4, col: 1, type: 'stone' },
      { row: 4, col: 6, type: 'stone' }
    ],
    starScores: [6000, 10000, 15000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 450,
    rewardGems: 30,
    rewardXp: 270
  },
  {
    id: 11,
    worldId: 4,
    title: 'Magma Caldera',
    rows: 8,
    cols: 8,
    moves: 27,
    objectives: [
      { type: 'collect_gems', gemColor: 'topaz', target: 24, current: 0, description: 'Collect 24 Solar Topaz' },
      { type: 'clear_ice', target: 8, current: 0, description: 'Clear 8 Ash Frosts' }
    ],
    initialObstacles: [
      { row: 2, col: 3, type: 'stone' },
      { row: 2, col: 4, type: 'stone' },
      { row: 5, col: 3, type: 'stone' },
      { row: 5, col: 4, type: 'stone' },
      { row: 3, col: 2, type: 'ice_1' },
      { row: 3, col: 5, type: 'ice_1' },
      { row: 4, col: 2, type: 'ice_1' },
      { row: 4, col: 5, type: 'ice_1' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' }
    ],
    starScores: [7000, 11500, 18000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 500,
    rewardGems: 35,
    rewardXp: 300
  },
  {
    id: 12,
    worldId: 4,
    title: 'Heart of the Volcano',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'collect_gems', gemColor: 'ruby', target: 30, current: 0, description: 'Collect 30 Fire Rubies' },
      { type: 'score', target: 10000, current: 0, description: 'Score 10,000 points' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'stone' },
      { row: 2, col: 5, type: 'stone' },
      { row: 5, col: 2, type: 'stone' },
      { row: 5, col: 5, type: 'stone' },
      { row: 3, col: 3, type: 'stone' },
      { row: 4, col: 4, type: 'stone' }
    ],
    starScores: [8000, 13000, 20000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 600,
    rewardGems: 45,
    rewardXp: 350
  },

  // World 5: Sky Kingdom (Introduces Crystal Cages)
  {
    id: 13,
    worldId: 5,
    title: 'Cloud Spire',
    rows: 8,
    cols: 8,
    moves: 25,
    objectives: [
      { type: 'clear_cages', target: 6, current: 0, description: 'Free 6 Caged Crystals' },
      { type: 'score', target: 8500, current: 0, description: 'Score 8,500 points' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'cage' },
      { row: 2, col: 5, type: 'cage' },
      { row: 3, col: 3, type: 'cage' },
      { row: 3, col: 4, type: 'cage' },
      { row: 5, col: 2, type: 'cage' },
      { row: 5, col: 5, type: 'cage' }
    ],
    starScores: [7500, 12000, 19000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 550,
    rewardGems: 40,
    rewardXp: 380
  },
  {
    id: 14,
    worldId: 5,
    title: 'Zephyr Bastion',
    rows: 8,
    cols: 8,
    moves: 27,
    objectives: [
      { type: 'clear_cages', target: 8, current: 0, description: 'Free 8 Caged Crystals' },
      { type: 'collect_gems', gemColor: 'amethyst', target: 26, current: 0, description: 'Collect 26 Amethysts' }
    ],
    initialObstacles: [
      { row: 1, col: 3, type: 'cage' },
      { row: 1, col: 4, type: 'cage' },
      { row: 3, col: 1, type: 'cage' },
      { row: 3, col: 6, type: 'cage' },
      { row: 4, col: 1, type: 'cage' },
      { row: 4, col: 6, type: 'cage' },
      { row: 6, col: 3, type: 'cage' },
      { row: 6, col: 4, type: 'cage' }
    ],
    starScores: [8500, 14000, 22000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 600,
    rewardGems: 45,
    rewardXp: 420
  },
  {
    id: 15,
    worldId: 5,
    title: 'Aether Citadel',
    rows: 8,
    cols: 8,
    moves: 30,
    objectives: [
      { type: 'clear_cages', target: 10, current: 0, description: 'Free 10 Caged Crystals' },
      { type: 'clear_ice', target: 8, current: 0, description: 'Clear 8 Sky Frosts' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'cage' },
      { row: 2, col: 3, type: 'cage' },
      { row: 2, col: 4, type: 'cage' },
      { row: 2, col: 5, type: 'cage' },
      { row: 5, col: 2, type: 'cage' },
      { row: 5, col: 3, type: 'cage' },
      { row: 5, col: 4, type: 'cage' },
      { row: 5, col: 5, type: 'cage' },
      { row: 3, col: 3, type: 'ice_1' },
      { row: 3, col: 4, type: 'ice_1' },
      { row: 4, col: 3, type: 'ice_1' },
      { row: 4, col: 4, type: 'ice_1' },
      { row: 3, col: 2, type: 'cage' },
      { row: 4, col: 5, type: 'cage' }
    ],
    starScores: [9500, 16000, 25000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 700,
    rewardGems: 50,
    rewardXp: 480
  },

  // World 6: Ancient Temple (Combined Obstacle Trials)
  {
    id: 16,
    worldId: 6,
    title: 'Temple of the Sun',
    rows: 8,
    cols: 8,
    moves: 26,
    objectives: [
      { type: 'clear_cages', target: 6, current: 0, description: 'Free 6 Caged Runes' },
      { type: 'clear_ice', target: 10, current: 0, description: 'Clear 10 Frost Relics' }
    ],
    initialObstacles: [
      { row: 3, col: 3, type: 'stone' },
      { row: 3, col: 4, type: 'stone' },
      { row: 4, col: 3, type: 'stone' },
      { row: 4, col: 4, type: 'stone' },
      { row: 2, col: 2, type: 'cage' },
      { row: 2, col: 5, type: 'cage' },
      { row: 5, col: 2, type: 'cage' },
      { row: 5, col: 5, type: 'cage' },
      { row: 1, col: 3, type: 'ice_1' },
      { row: 1, col: 4, type: 'ice_1' },
      { row: 6, col: 3, type: 'ice_1' },
      { row: 6, col: 4, type: 'ice_1' }
    ],
    starScores: [9000, 15000, 24000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 750,
    rewardGems: 50,
    rewardXp: 520
  },
  {
    id: 17,
    worldId: 6,
    title: 'Labyrinth of Whispers',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'collect_gems', gemColor: 'diamond', target: 28, current: 0, description: 'Collect 28 Diamonds' },
      { type: 'clear_ice', target: 12, current: 0, description: 'Clear 12 Glacier Relics' }
    ],
    initialObstacles: [
      { row: 1, col: 1, type: 'stone' },
      { row: 1, col: 6, type: 'stone' },
      { row: 6, col: 1, type: 'stone' },
      { row: 6, col: 6, type: 'stone' },
      { row: 2, col: 2, type: 'ice_2' },
      { row: 2, col: 5, type: 'ice_2' },
      { row: 5, col: 2, type: 'ice_2' },
      { row: 5, col: 5, type: 'ice_2' }
    ],
    starScores: [10000, 17000, 27000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 800,
    rewardGems: 55,
    rewardXp: 570
  },
  {
    id: 18,
    worldId: 6,
    title: 'Sanctum of the Archon',
    rows: 8,
    cols: 8,
    moves: 30,
    objectives: [
      { type: 'score', target: 14000, current: 0, description: 'Score 14,000 points' },
      { type: 'clear_cages', target: 8, current: 0, description: 'Free 8 Archon Cages' }
    ],
    initialObstacles: [
      { row: 2, col: 3, type: 'stone' },
      { row: 2, col: 4, type: 'stone' },
      { row: 5, col: 3, type: 'stone' },
      { row: 5, col: 4, type: 'stone' },
      { row: 3, col: 2, type: 'cage' },
      { row: 3, col: 5, type: 'cage' },
      { row: 4, col: 2, type: 'cage' },
      { row: 4, col: 5, type: 'cage' },
      { row: 1, col: 1, type: 'cage' },
      { row: 1, col: 6, type: 'cage' },
      { row: 6, col: 1, type: 'cage' },
      { row: 6, col: 6, type: 'cage' }
    ],
    starScores: [12000, 20000, 32000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 900,
    rewardGems: 60,
    rewardXp: 650
  },

  // World 7: Lunar Realm (High-level celestial precision)
  {
    id: 19,
    worldId: 7,
    title: 'Crescent Basin',
    rows: 8,
    cols: 8,
    moves: 26,
    objectives: [
      { type: 'collect_gems', gemColor: 'diamond', target: 30, current: 0, description: 'Collect 30 Moon Diamonds' },
      { type: 'score', target: 15000, current: 0, description: 'Score 15,000 points' }
    ],
    starScores: [13000, 22000, 35000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 950,
    rewardGems: 65,
    rewardXp: 700
  },
  {
    id: 20,
    worldId: 7,
    title: 'Eclipse Nexus',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'clear_ice', target: 16, current: 0, description: 'Shatter 16 Eclipse Ice' },
      { type: 'clear_cages', target: 6, current: 0, description: 'Free 6 Moon Cages' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'cage' },
      { row: 2, col: 5, type: 'cage' },
      { row: 5, col: 2, type: 'cage' },
      { row: 5, col: 5, type: 'cage' },
      { row: 3, col: 3, type: 'cage' },
      { row: 4, col: 4, type: 'cage' },
      { row: 3, col: 1, type: 'ice_2' },
      { row: 3, col: 6, type: 'ice_2' },
      { row: 4, col: 1, type: 'ice_2' },
      { row: 4, col: 6, type: 'ice_2' }
    ],
    starScores: [14000, 24000, 38000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 1000,
    rewardGems: 70,
    rewardXp: 750
  },
  {
    id: 21,
    worldId: 7,
    title: 'Celestial Zenith',
    rows: 8,
    cols: 8,
    moves: 30,
    objectives: [
      { type: 'score', target: 20000, current: 0, description: 'Score 20,000 points' },
      { type: 'collect_gems', gemColor: 'amethyst', target: 35, current: 0, description: 'Collect 35 Amethysts' }
    ],
    starScores: [16000, 28000, 45000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 1100,
    rewardGems: 80,
    rewardXp: 850
  },

  // World 8: Cyber Crystal City (Mastery Showcase)
  {
    id: 22,
    worldId: 8,
    title: 'Neon Boulevard',
    rows: 8,
    cols: 8,
    moves: 28,
    objectives: [
      { type: 'score', target: 22000, current: 0, description: 'Score 22,000 points' },
      { type: 'clear_ice', target: 14, current: 0, description: 'Clear 14 Data Frosts' }
    ],
    initialObstacles: [
      { row: 1, col: 3, type: 'ice_2' },
      { row: 1, col: 4, type: 'ice_2' },
      { row: 6, col: 3, type: 'ice_2' },
      { row: 6, col: 4, type: 'ice_2' },
      { row: 3, col: 1, type: 'ice_2' },
      { row: 4, col: 1, type: 'ice_2' },
      { row: 3, col: 6, type: 'ice_2' },
      { row: 4, col: 6, type: 'ice_2' }
    ],
    starScores: [18000, 30000, 50000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 1200,
    rewardGems: 90,
    rewardXp: 900
  },
  {
    id: 23,
    worldId: 8,
    title: 'Quantum Core',
    rows: 8,
    cols: 8,
    moves: 30,
    objectives: [
      { type: 'clear_cages', target: 10, current: 0, description: 'Free 10 Quantum Cages' },
      { type: 'collect_gems', gemColor: 'topaz', target: 35, current: 0, description: 'Collect 35 Solar Topaz' }
    ],
    initialObstacles: [
      { row: 2, col: 2, type: 'cage' },
      { row: 2, col: 5, type: 'cage' },
      { row: 5, col: 2, type: 'cage' },
      { row: 5, col: 5, type: 'cage' },
      { row: 3, col: 3, type: 'stone' },
      { row: 3, col: 4, type: 'stone' },
      { row: 4, col: 3, type: 'stone' },
      { row: 4, col: 4, type: 'stone' },
      { row: 2, col: 3, type: 'cage' },
      { row: 2, col: 4, type: 'cage' },
      { row: 5, col: 3, type: 'cage' },
      { row: 5, col: 4, type: 'cage' },
      { row: 3, col: 2, type: 'cage' },
      { row: 4, col: 5, type: 'cage' }
    ],
    starScores: [20000, 35000, 60000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 1400,
    rewardGems: 100,
    rewardXp: 1000
  },
  {
    id: 24,
    worldId: 8,
    title: 'Singularity Apex',
    rows: 8,
    cols: 8,
    moves: 32,
    objectives: [
      { type: 'score', target: 30000, current: 0, description: 'Score 30,000 points' },
      { type: 'collect_gems', gemColor: 'ruby', target: 40, current: 0, description: 'Collect 40 Cyber Rubies' },
      { type: 'clear_ice', target: 12, current: 0, description: 'Shatter 12 Quantum Glaciers' }
    ],
    initialObstacles: [
      { row: 0, col: 0, type: 'stone' },
      { row: 0, col: 7, type: 'stone' },
      { row: 7, col: 0, type: 'stone' },
      { row: 7, col: 7, type: 'stone' },
      { row: 2, col: 2, type: 'ice_2' },
      { row: 2, col: 5, type: 'ice_2' },
      { row: 5, col: 2, type: 'ice_2' },
      { row: 5, col: 5, type: 'ice_2' },
      { row: 3, col: 3, type: 'cage' },
      { row: 3, col: 4, type: 'cage' },
      { row: 4, col: 3, type: 'cage' },
      { row: 4, col: 4, type: 'cage' }
    ],
    starScores: [25000, 45000, 80000],
    allowedColors: ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'],
    rewardCoins: 2000,
    rewardGems: 150,
    rewardXp: 1500
  }
];

/**
 * Procedural Level Generator for Infinite Expansion (Levels 25+)
 */
export function generateProceduralLevel(levelId: number): LevelConfig {
  const worldIndex = Math.min(7, Math.floor((levelId - 1) / 3));
  const world = WORLDS_CONFIG[worldIndex] || WORLDS_CONFIG[7];

  const baseMoves = Math.max(22, 34 - Math.floor(levelId / 5));
  const targetScore = 5000 + levelId * 1200;

  const colors: CrystalColor[] = ['ruby', 'sapphire', 'emerald', 'topaz', 'amethyst', 'diamond'];

  const objectives: LevelObjective[] = [
    {
      type: 'score',
      target: targetScore,
      current: 0,
      description: `Reach ${targetScore.toLocaleString()} points`
    }
  ];

  if (levelId % 2 === 0) {
    const gemCol = colors[levelId % colors.length];
    objectives.push({
      type: 'collect_gems' as const,
      gemColor: gemCol,
      target: 20 + (levelId % 15),
      current: 0,
      description: `Collect ${20 + (levelId % 15)} ${gemCol.toUpperCase()} crystals`
    });
  }

  return {
    id: levelId,
    worldId: world.id,
    title: `${world.name} - Tier ${levelId - world.levelRange[0] + 1}`,
    rows: 8,
    cols: 8,
    moves: baseMoves,
    objectives,
    starScores: [Math.floor(targetScore * 0.8), targetScore, Math.floor(targetScore * 1.6)],
    allowedColors: colors,
    rewardCoins: 300 + levelId * 25,
    rewardGems: 20 + Math.floor(levelId * 2),
    rewardXp: 100 + levelId * 20
  };
}

export function getLevelConfig(levelId: number): LevelConfig {
  const found = HANDCRAFTED_LEVELS.find(l => l.id === levelId);
  if (found) return found;
  return generateProceduralLevel(levelId);
}
