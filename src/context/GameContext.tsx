import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlayerProfile,
  BoosterType,
  LevelConfig,
  Achievement,
  DailyChallenge,
  InboxMessage,
  ShopItem,
  PurchaseReceipt
} from '../types/game';
import { GameApiService } from '../services/api';
import { Sound } from '../game/audio';

export type GameScreen =
  | 'splash'
  | 'home'
  | 'world_map'
  | 'gameplay'
  | 'endless'
  | 'daily'
  | 'events'
  | 'shop'
  | 'profile'
  | 'achievements'
  | 'leaderboard'
  | 'inbox'
  | 'reward_wheel'
  | 'settings'
  | 'auth';

interface GameContextType {
  profile: PlayerProfile;
  currentScreen: GameScreen;
  activeLevel: LevelConfig | null;
  isEndlessMode: boolean;
  selectedLevelModal: LevelConfig | null;
  levelCompleteData: { stars: number; score: number; rewards: { coins: number; gems: number; xp: number } } | null;
  levelFailedData: { score: number; target: string } | null;
  checkoutItem: ShopItem | null;
  selectedEmail: InboxMessage | null;
  unreadInboxCount: number;

  // Actions
  setScreen: (screen: GameScreen) => void;
  openLevelModal: (level: LevelConfig | null) => void;
  startLevel: (level: LevelConfig) => void;
  startEndless: () => void;
  onLevelWon: (levelId: number, stars: number, score: number) => void;
  onLevelLost: (score: number, target: string) => void;
  retryLevel: () => void;
  nextLevel: () => void;
  closeModals: () => void;

  useBooster: (type: BoosterType) => boolean;
  addCoins: (amt: number) => void;
  addGems: (amt: number) => void;
  addBoosters: (type: BoosterType, amt: number) => void;
  claimAchievement: (id: string) => void;
  claimDailyStreak: () => void;
  claimInboxGift: (id: string) => void;
  openCheckout: (item: ShopItem) => void;
  closeCheckout: () => void;
  onPurchaseSuccess: (receipt: PurchaseReceipt, inboxItem?: InboxMessage) => void;
  viewEmail: (email: InboxMessage | null) => void;
  updateSettings: (settings: Partial<PlayerProfile['settings']>) => void;
  loginUser: (user: any) => void;
  logoutUser: () => void;
}

const STORAGE_KEY = 'crystal_quest_profile_v1';

const INITIAL_ACHIEVEMENTS: Record<string, Achievement> = {
  first_match: {
    id: 'first_match',
    title: 'Crystal Seeker',
    description: 'Complete your first realm level.',
    icon: 'Sparkles',
    current: 0,
    target: 1,
    rewardGems: 15,
    claimed: false,
    category: 'progression'
  },
  combo_master: {
    id: 'combo_master',
    title: 'Harmonic Resonance',
    description: 'Trigger a Mega Combo (x4 or higher).',
    icon: 'Flame',
    current: 0,
    target: 1,
    rewardGems: 25,
    claimed: false,
    category: 'gameplay'
  },
  super_prism_unleashed: {
    id: 'super_prism_unleashed',
    title: 'Astral Singularity',
    description: 'Create 5 Astral Super Prisms.',
    icon: 'Sun',
    current: 0,
    target: 5,
    rewardGems: 40,
    claimed: false,
    category: 'gameplay'
  },
  frost_breaker: {
    id: 'frost_breaker',
    title: 'Glacial Thaw',
    description: 'Shatter 50 Frost and Ice blocks.',
    icon: 'Shield',
    current: 0,
    target: 50,
    rewardGems: 35,
    claimed: false,
    category: 'gameplay'
  },
  star_collector: {
    id: 'star_collector',
    title: 'Celestial Constellation',
    description: 'Earn 30 total stars across worlds.',
    icon: 'Star',
    current: 0,
    target: 30,
    rewardGems: 60,
    claimed: false,
    category: 'progression'
  },
  endless_voyager: {
    id: 'endless_voyager',
    title: 'Infinite Realm Voyager',
    description: 'Reach 50,000 points in Endless Mode.',
    icon: 'Zap',
    current: 0,
    target: 50000,
    rewardGems: 75,
    claimed: false,
    category: 'mastery'
  }
};

const INITIAL_PROFILE: PlayerProfile = {
  id: `guest_${Math.random().toString(36).substring(2, 8)}`,
  name: 'Archon Player',
  email: 'archon@crystalquest.realm',
  isGuest: true,
  avatar: '💎',
  level: 1,
  xp: 0,
  xpToNextLevel: 250,
  coins: 850,
  gems: 60,
  lives: 5,
  maxLives: 5,
  lastLifeRegen: Date.now(),
  boosters: {
    hammer: 3,
    nova: 2,
    lightning: 2,
    prism: 2,
    shuffle: 3
  },
  completedLevels: {},
  currentWorld: 1,
  unlockedWorlds: [1],
  achievements: INITIAL_ACHIEVEMENTS,
  stats: {
    totalMatches: 0,
    totalCombos: 0,
    highestCombo: 0,
    levelsCompleted: 0,
    starsEarned: 0,
    endlessHighScore: 0,
    specialPiecesCreated: 0,
    obstaclesDestroyed: 0,
    playTimeMinutes: 0
  },
  inbox: [
    {
      id: 'welcome_gift',
      title: 'Welcome to Crystal Quest, Archon!',
      sender: 'Realm Elders',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      preview: 'Accept this inaugural chest of 500 Gold Coins and 25 Astral Gems!',
      htmlContent: `
        <div style="font-family: sans-serif; color: #f8fafc; padding: 20px;">
          <h2 style="color: #38bdf8;">Welcome, Celestial Traveler!</h2>
          <p>The magical realm of Aetheria is in turmoil. Unstable elemental rifts are freezing the crystal valleys.</p>
          <p>As the chosen Archon, harness the power of Fire, Water, Earth, Lightning, and Sun crystals to restore equilibrium.</p>
          <p style="background: rgba(56, 189, 248, 0.15); border-left: 4px solid #38bdf8; padding: 12px; margin: 16px 0;">
            <strong>Gift Included:</strong> 500 Pure Coins + 25 Astral Gems + 1x Crystal Hammer!
          </p>
          <p>May the Astral Prisms light your journey!</p>
        </div>
      `,
      read: false,
      claimed: false,
      reward: { coins: 500, gems: 25, boosters: { hammer: 1 } }
    }
  ],
  dailyStreak: 1,
  lastDailyRewardDate: undefined,
  settings: {
    musicVolume: 0.5,
    sfxVolume: 0.8,
    haptics: true,
    reducedMotion: false,
    highContrast: false
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_PROFILE, ...parsed };
      }
    } catch {}
    return INITIAL_PROFILE;
  });

  const [currentScreen, setCurrentScreen] = useState<GameScreen>('splash');
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [isEndlessMode, setIsEndlessMode] = useState<boolean>(false);
  const [selectedLevelModal, setSelectedLevelModal] = useState<LevelConfig | null>(null);
  const [levelCompleteData, setLevelCompleteData] = useState<{
    stars: number;
    score: number;
    rewards: { coins: number; gems: number; xp: number };
  } | null>(null);
  const [levelFailedData, setLevelFailedData] = useState<{ score: number; target: string } | null>(null);
  const [checkoutItem, setCheckoutItem] = useState<ShopItem | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<InboxMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Sync settings with audio engine
  useEffect(() => {
    Sound.setVolumes(profile.settings.musicVolume, profile.settings.sfxVolume);
    Sound.setHaptics(profile.settings.haptics);
  }, [profile.settings]);

  // Lives regeneration timer (1 life every 15 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setProfile((prev) => {
        if (prev.lives >= prev.maxLives) return prev;
        const now = Date.now();
        const diff = now - prev.lastLifeRegen;
        const fifteenMinutes = 15 * 60 * 1000;
        if (diff >= fifteenMinutes) {
          return {
            ...prev,
            lives: Math.min(prev.maxLives, prev.lives + 1),
            lastLifeRegen: now
          };
        }
        return prev;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadInboxCount = profile.inbox.filter((m) => !m.read).length;

  const setScreen = (screen: GameScreen) => {
    Sound.playClick();
    setCurrentScreen(screen);
  };

  const openLevelModal = (level: LevelConfig | null) => {
    Sound.playClick();
    setSelectedLevelModal(level);
  };

  const startLevel = (level: LevelConfig) => {
    Sound.playClick();
    setSelectedLevelModal(null);
    setLevelCompleteData(null);
    setLevelFailedData(null);
    setIsEndlessMode(false);
    setActiveLevel(level);
    setCurrentScreen('gameplay');
  };

  const startEndless = () => {
    Sound.playClick();
    setLevelCompleteData(null);
    setLevelFailedData(null);
    setIsEndlessMode(true);
    setActiveLevel(null);
    setCurrentScreen('endless');
  };

  const onLevelWon = (levelId: number, stars: number, score: number) => {
    const prevRecord = profile.completedLevels[levelId];
    const prevStars = prevRecord?.stars || 0;
    const additionalStars = Math.max(0, stars - prevStars);

    const coinsEarned = 200 + stars * 100;
    const gemsEarned = 10 + stars * 5;
    const xpEarned = 80 + stars * 40;

    setProfile((prev) => {
      const nextXp = prev.xp + xpEarned;
      let nextLevel = prev.level;
      let nextXpTarget = prev.xpToNextLevel;

      if (nextXp >= nextXpTarget) {
        nextLevel++;
        nextXpTarget = Math.floor(nextXpTarget * 1.5);
      }

      const totalStars = prev.stats.starsEarned + additionalStars;
      const updatedLevels = {
        ...prev.completedLevels,
        [levelId]: {
          stars: Math.max(prevStars, stars),
          highScore: Math.max(prevRecord?.highScore || 0, score)
        }
      };

      // Check World Unlocks
      const unlockedWorlds = [...prev.unlockedWorlds];
      if (totalStars >= 6 && !unlockedWorlds.includes(2)) unlockedWorlds.push(2);
      if (totalStars >= 14 && !unlockedWorlds.includes(3)) unlockedWorlds.push(3);
      if (totalStars >= 22 && !unlockedWorlds.includes(4)) unlockedWorlds.push(4);
      if (totalStars >= 30 && !unlockedWorlds.includes(5)) unlockedWorlds.push(5);
      if (totalStars >= 38 && !unlockedWorlds.includes(6)) unlockedWorlds.push(6);
      if (totalStars >= 46 && !unlockedWorlds.includes(7)) unlockedWorlds.push(7);
      if (totalStars >= 54 && !unlockedWorlds.includes(8)) unlockedWorlds.push(8);

      // Check Achievements
      const ach = { ...prev.achievements };
      if (ach.first_match) ach.first_match.current = 1;
      if (ach.star_collector) ach.star_collector.current = totalStars;

      return {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        xpToNextLevel: nextXpTarget,
        coins: prev.coins + coinsEarned,
        gems: prev.gems + gemsEarned,
        completedLevels: updatedLevels,
        unlockedWorlds,
        achievements: ach,
        stats: {
          ...prev.stats,
          levelsCompleted: Object.keys(updatedLevels).length,
          starsEarned: totalStars
        }
      };
    });

    setLevelCompleteData({
      stars,
      score,
      rewards: { coins: coinsEarned, gems: gemsEarned, xp: xpEarned }
    });
  };

  const onLevelLost = (score: number, target: string) => {
    setProfile((prev) => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1)
    }));
    setLevelFailedData({ score, target });
  };

  const retryLevel = () => {
    setLevelFailedData(null);
    setLevelCompleteData(null);
    if (activeLevel) {
      startLevel(activeLevel);
    } else if (isEndlessMode) {
      startEndless();
    }
  };

  const nextLevel = () => {
    if (!activeLevel) return;
    const nextId = activeLevel.id + 1;
    import('../game/levels').then(({ getLevelConfig }) => {
      const cfg = getLevelConfig(nextId);
      startLevel(cfg);
    });
  };

  const closeModals = () => {
    setSelectedLevelModal(null);
    setLevelCompleteData(null);
    setLevelFailedData(null);
    setCheckoutItem(null);
    setSelectedEmail(null);
  };

  const useBooster = (type: BoosterType): boolean => {
    if ((profile.boosters[type] || 0) > 0) {
      setProfile((prev) => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [type]: prev.boosters[type] - 1
        }
      }));
      return true;
    }
    return false;
  };

  const addCoins = (amt: number) => {
    setProfile((prev) => ({ ...prev, coins: prev.coins + amt }));
  };

  const addGems = (amt: number) => {
    setProfile((prev) => ({ ...prev, gems: prev.gems + amt }));
  };

  const addBoosters = (type: BoosterType, amt: number) => {
    setProfile((prev) => ({
      ...prev,
      boosters: {
        ...prev.boosters,
        [type]: (prev.boosters[type] || 0) + amt
      }
    }));
  };

  const claimAchievement = (id: string) => {
    const ach = profile.achievements[id];
    if (!ach || ach.claimed || ach.current < ach.target) return;

    Sound.playReward();
    setProfile((prev) => ({
      ...prev,
      gems: prev.gems + ach.rewardGems,
      achievements: {
        ...prev.achievements,
        [id]: { ...ach, claimed: true }
      }
    }));
  };

  const claimDailyStreak = () => {
    Sound.playReward();
    setProfile((prev) => ({
      ...prev,
      coins: prev.coins + 500,
      gems: prev.gems + 20,
      dailyStreak: prev.dailyStreak + 1,
      lastDailyRewardDate: new Date().toDateString()
    }));
  };

  const claimInboxGift = (id: string) => {
    const msg = profile.inbox.find((m) => m.id === id);
    if (!msg || msg.claimed || !msg.reward) return;

    Sound.playReward();
    setProfile((prev) => {
      let coins = prev.coins + (msg.reward?.coins || 0);
      let gems = prev.gems + (msg.reward?.gems || 0);
      const boosters = { ...prev.boosters };
      if (msg.reward?.boosters) {
        Object.entries(msg.reward.boosters).forEach(([bName, bCount]) => {
          boosters[bName as BoosterType] = (boosters[bName as BoosterType] || 0) + (bCount || 0);
        });
      }

      const updatedInbox = prev.inbox.map((m) => (m.id === id ? { ...m, claimed: true, read: true } : m));

      return {
        ...prev,
        coins,
        gems,
        boosters,
        inbox: updatedInbox
      };
    });
  };

  const openCheckout = (item: ShopItem) => {
    Sound.playClick();
    setCheckoutItem(item);
  };

  const closeCheckout = () => {
    setCheckoutItem(null);
  };

  const onPurchaseSuccess = (receipt: PurchaseReceipt, inboxItem?: InboxMessage) => {
    Sound.playVictory();
    setProfile((prev) => {
      const coins = prev.coins + (receipt.itemsReceived.coins || 0);
      const gems = prev.gems + (receipt.itemsReceived.gems || 0);
      const boosters = { ...prev.boosters };
      if (receipt.itemsReceived.boosters) {
        Object.entries(receipt.itemsReceived.boosters).forEach(([bName, bCount]) => {
          boosters[bName as BoosterType] = (boosters[bName as BoosterType] || 0) + (bCount || 0);
        });
      }

      const inbox = inboxItem ? [inboxItem, ...prev.inbox] : prev.inbox;

      return {
        ...prev,
        coins,
        gems,
        boosters,
        inbox
      };
    });

    closeCheckout();
  };

  const viewEmail = (email: InboxMessage | null) => {
    if (email) {
      setProfile((prev) => ({
        ...prev,
        inbox: prev.inbox.map((m) => (m.id === email.id ? { ...m, read: true } : m))
      }));
    }
    setSelectedEmail(email);
  };

  const updateSettings = (newSettings: Partial<PlayerProfile['settings']>) => {
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const loginUser = (user: any) => {
    setProfile((prev) => ({
      ...prev,
      id: user.id,
      name: user.name,
      email: user.email,
      isGuest: user.isGuest
    }));
  };

  const logoutUser = () => {
    const guestId = `guest_${Math.random().toString(36).substring(2, 8)}`;
    setProfile({
      ...INITIAL_PROFILE,
      id: guestId,
      name: `Archon_${Math.floor(1000 + Math.random() * 9000)}`,
      email: `${guestId}@crystalquest.realm`,
      isGuest: true
    });
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        currentScreen,
        activeLevel,
        isEndlessMode,
        selectedLevelModal,
        levelCompleteData,
        levelFailedData,
        checkoutItem,
        selectedEmail,
        unreadInboxCount,
        setScreen,
        openLevelModal,
        startLevel,
        startEndless,
        onLevelWon,
        onLevelLost,
        retryLevel,
        nextLevel,
        closeModals,
        useBooster,
        addCoins,
        addGems,
        addBoosters,
        claimAchievement,
        claimDailyStreak,
        claimInboxGift,
        openCheckout,
        closeCheckout,
        onPurchaseSuccess,
        viewEmail,
        updateSettings,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
