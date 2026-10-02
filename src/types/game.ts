export type CrystalColor = 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'diamond';

export type SpecialType = 'none' | 'horizontal_beam' | 'vertical_beam' | 'nova_bomb' | 'super_prism';

export type ObstacleType = 'none' | 'ice_1' | 'ice_2' | 'cage' | 'stone';

export interface TilePiece {
  id: string;
  row: number;
  col: number;
  color: CrystalColor;
  special: SpecialType;
  obstacle: ObstacleType;
  isMatched?: boolean;
  scale?: number;
  alpha?: number;
  xOffset?: number;
  yOffset?: number;
}

export type ObjectiveType = 'score' | 'clear_ice' | 'collect_gems' | 'clear_cages';

export interface LevelObjective {
  type: ObjectiveType;
  target: number;
  current: number;
  gemColor?: CrystalColor;
  description: string;
}

export interface LevelConfig {
  id: number;
  worldId: number;
  title: string;
  rows: number;
  cols: number;
  moves: number;
  objectives: LevelObjective[];
  starScores: [number, number, number];
  allowedColors: CrystalColor[];
  initialObstacles?: { row: number; col: number; type: ObstacleType }[];
  rewardCoins: number;
  rewardGems: number;
  rewardXp: number;
}

export interface WorldConfig {
  id: number;
  name: string;
  subtitle: string;
  bgGradient: string;
  ambientColor: string;
  accentColor: string;
  description: string;
  levelRange: [number, number];
  unlockedAtStars: number;
  icon: string;
}

export type BoosterType = 'hammer' | 'nova' | 'lightning' | 'prism' | 'shuffle';

export interface BoosterInfo {
  id: BoosterType;
  name: string;
  description: string;
  costCoins: number;
  iconName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  rewardGems: number;
  claimed: boolean;
  category: 'gameplay' | 'progression' | 'mastery';
}

export interface DailyChallenge {
  id: string;
  dayIndex: number;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardGems: number;
  completed: boolean;
  expiresAt: string;
}

export interface PurchaseReceipt {
  orderId: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  amount: number;
  currency: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  supportEmail: string;
  itemsReceived: {
    coins?: number;
    gems?: number;
    boosters?: Partial<Record<BoosterType, number>>;
  };
}

export interface InboxMessage {
  id: string;
  title: string;
  sender: string;
  date: string;
  preview: string;
  htmlContent: string;
  read: boolean;
  claimed: boolean;
  reward?: {
    coins?: number;
    gems?: number;
    boosters?: Partial<Record<BoosterType, number>>;
  };
}

export interface PlayerStats {
  totalMatches: number;
  totalCombos: number;
  highestCombo: number;
  levelsCompleted: number;
  starsEarned: number;
  endlessHighScore: number;
  specialPiecesCreated: number;
  obstaclesDestroyed: number;
  playTimeMinutes: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gems: number;
  lives: number;
  maxLives: number;
  lastLifeRegen: number;
  boosters: Record<BoosterType, number>;
  completedLevels: Record<number, { stars: number; highScore: number }>;
  currentWorld: number;
  unlockedWorlds: number[];
  achievements: Record<string, Achievement>;
  stats: PlayerStats;
  inbox: InboxMessage[];
  lastDailyRewardDate?: string;
  dailyStreak: number;
  settings: {
    musicVolume: number;
    sfxVolume: number;
    haptics: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
  };
}

export interface ShopItem {
  id: string;
  category: 'coins' | 'gems' | 'boosters' | 'bundles';
  title: string;
  description: string;
  priceUsd: number;
  coinsReward?: number;
  gemsReward?: number;
  boostersReward?: Partial<Record<BoosterType, number>>;
  badge?: string;
  popular?: boolean;
}
