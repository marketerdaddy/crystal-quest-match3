import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getLevelConfig } from '../game/levels';
import { CrystalLogo } from './CrystalLogo';
import {
  Play,
  Map,
  ShoppingBag,
  Trophy,
  Flame,
  Settings,
  Mail,
  Gift,
  Zap,
  Star,
  Heart,
  User,
  Sparkles,
  Calendar,
  Coins,
  Gem,
  ChevronRight,
  Shield,
  Award
} from 'lucide-react';

const CRYSTAL_EMOJIS = ['💎', '🔮', '⚡', '🌟', '❄️', '🔥'];

interface FloatingOrb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const QUICK_STATS = [
  { icon: '⭐', label: 'Total Stars', key: 'starsEarned' as const },
  { icon: '🏆', label: 'Levels Done', key: 'levelsCompleted' as const },
  { icon: '⚡', label: 'Best Combo', key: 'highestCombo' as const },
];

export const HomeScreen: React.FC = () => {
  const {
    profile,
    setScreen,
    startLevel,
    startEndless,
    unreadInboxCount
  } = useGame();

  const [orbs] = useState<FloatingOrb[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      size: 60 + Math.random() * 100,
      color: ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b'][i],
      delay: i * 0.8,
      duration: 5 + Math.random() * 4
    }))
  );

  // Find next playable level
  const completedLevelIds = Object.keys(profile.completedLevels).map(Number);
  const nextLevelId = completedLevelIds.length > 0 ? Math.max(...completedLevelIds) + 1 : 1;
  const totalStars = profile.stats.starsEarned;

  const handleQuickPlay = () => {
    const levelConfig = getLevelConfig(nextLevelId);
    startLevel(levelConfig);
  };

  const xpPct = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden text-white" style={{
      background: 'radial-gradient(ellipse at 50% 0%, #0e1f3d 0%, #060d1c 40%, #03060e 100%)'
    }}>
      {/* Star background */}
      <div className="star-bg" />

      {/* Floating ambient orbs */}
      {orbs.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}15, transparent 70%)`,
            animation: `float ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            filter: 'blur(20px)'
          }}
        />
      ))}

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="relative z-20 px-4 pt-4 pb-3" style={{
        background: 'linear-gradient(180deg, rgba(5,10,25,0.95) 0%, rgba(5,10,25,0.7) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(6,182,212,0.15)'
      }}>
        <div className="flex items-center justify-between mb-3">
          {/* Avatar & Name */}
          <button
            onClick={() => setScreen('profile')}
            className="flex items-center gap-2.5 transition active:scale-95"
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  boxShadow: '0 0 15px rgba(6,182,212,0.5), 0 4px 12px rgba(0,0,0,0.3)',
                  border: '2px solid rgba(255,255,255,0.15)'
                }}
              >
                {profile.avatar}
              </div>
              {/* Level badge */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderColor: '#78350f',
                  color: '#1c0700',
                  boxShadow: '0 0 6px rgba(251,191,36,0.5)'
                }}
              >
                {profile.level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{profile.name}</span>
              </div>
              {/* XP Progress */}
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-20 h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="h-full rounded-full relative"
                    style={{
                      width: `${xpPct}%`,
                      background: 'linear-gradient(90deg, #22d3ee, #6366f1)',
                      boxShadow: '0 0 6px rgba(34,211,238,0.6)',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
                <span className="text-[10px] font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
                  {profile.xp}/{profile.xpToNextLevel} XP
                </span>
              </div>
            </div>
          </button>

          {/* Currency pills */}
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <Heart className="w-3.5 h-3.5" style={{ fill: '#ef4444', color: '#ef4444' }} />
              <span className="text-xs font-black text-rose-300">{profile.lives}/{profile.maxLives}</span>
            </div>

            <button
              onClick={() => setScreen('shop')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition active:scale-95"
              style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)' }}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-black text-amber-300">{profile.coins.toLocaleString()}</span>
            </button>

            <button
              onClick={() => setScreen('shop')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition active:scale-95"
              style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}
            >
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-black text-cyan-300">{profile.gems.toLocaleString()}</span>
            </button>
          </div>
        </div>

        {/* Quick action icons row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScreen('inbox')}
              className="relative p-2 rounded-xl transition active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              {unreadInboxCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center animate-pulse"
                  style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}
                >
                  {unreadInboxCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setScreen('achievements')}
              className="p-2 rounded-xl transition active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Award className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => setScreen('reward_wheel')}
              className="p-2 rounded-xl transition active:scale-95"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Gift className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={() => setScreen('daily')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition active:scale-95"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(234,88,12,0.1))',
                border: '1px solid rgba(251,191,36,0.3)'
              }}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Day {profile.dailyStreak}</span>
            </button>
          </div>

          <button
            onClick={() => setScreen('settings')}
            className="p-2 rounded-xl transition active:scale-95"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Settings className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 z-10 gap-5 overflow-y-auto no-scrollbar py-4">

        {/* Crystal hero emblem */}
        <div className="relative flex items-center justify-center animate-slide-up">
          {/* Outer glow rings */}
          <div
            className="absolute rounded-full"
            style={{
              width: 180, height: 180,
              border: '1px solid rgba(6,182,212,0.15)',
              animation: 'spin-slow 15s linear infinite'
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 148, height: 148,
              border: '1px solid rgba(139,92,246,0.2)',
              animation: 'spin-slow-reverse 10s linear infinite'
            }}
          />

          {/* Ambient glow */}
          <div
            className="absolute rounded-full"
            style={{
              width: 120, height: 120,
              background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
              animation: 'pulse-glow 2.5s ease-in-out infinite'
            }}
          />

          {/* Crystal */}
          <CrystalLogo
            className="relative z-10"
            size={100}
            style={{
              animation: 'float 3.5s ease-in-out infinite',
              filter: 'drop-shadow(0 0 25px rgba(0,242,254,0.8)) drop-shadow(0 0 50px rgba(0,242,254,0.3))'
            }}
          />

          {/* Title badge */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap"
            style={{
              background: 'rgba(5,12,30,0.9)',
              border: '1px solid rgba(6,182,212,0.4)',
              color: '#67e8f9',
              boxShadow: '0 0 15px rgba(6,182,212,0.3)'
            }}
          >
            Realms of Aetheria
          </div>
        </div>

        {/* Game title */}
        <div className="text-center animate-slide-up-delay-1">
          <h1
            className="font-black tracking-widest"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '2rem',
              backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a8edea 40%, #00f2fe 70%, #4facfe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.4))'
            }}
          >
            CRYSTAL QUEST
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.7)' }}>
            Match. Cascade. Conquer the 8 Realms.
          </p>
        </div>

        {/* ── PRIMARY CTA ─────────────────────────────────────────── */}
        <button
          onClick={handleQuickPlay}
          className="relative w-full overflow-hidden rounded-2xl transition active:scale-95 animate-slide-up-delay-2"
          style={{
            maxWidth: 340,
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #00c6fb 0%, #005bea 50%, #7c3aed 100%)',
            boxShadow: '0 8px 32px rgba(0,91,234,0.5), 0 0 0 1px rgba(255,255,255,0.15) inset',
            border: 'none'
          }}
        >
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2.5s linear infinite'
            }}
          />
          <div className="relative flex items-center justify-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <Play className="w-4 h-4 fill-white text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-black text-base tracking-wide uppercase">
                Play Level {nextLevelId}
              </div>
              <div className="text-white/70 text-xs">Quick Play · Jump Right In</div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 ml-auto" />
          </div>
        </button>

        {/* Secondary buttons */}
        <div className="grid grid-cols-2 gap-3 w-full animate-slide-up-delay-3" style={{ maxWidth: 340 }}>
          <button
            onClick={() => setScreen('world_map')}
            className="relative py-3 px-4 rounded-xl transition active:scale-95 text-left overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(6,182,212,0.25)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Map className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white">World Map</span>
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(148,163,184,0.6)' }}>
              {profile.unlockedWorlds.length}/8 Realms
            </div>
          </button>

          <button
            onClick={startEndless}
            className="relative py-3 px-4 rounded-xl transition active:scale-95 text-left overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))',
              border: '1px solid rgba(139,92,246,0.35)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-white">Endless</span>
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(148,163,184,0.6)' }}>
              Hi: {profile.stats.endlessHighScore.toLocaleString()}
            </div>
          </button>
        </div>

        {/* Quick stats row */}
        <div
          className="w-full grid grid-cols-3 gap-2 animate-fade-in"
          style={{ maxWidth: 340, animationDelay: '0.4s' }}
        >
          {QUICK_STATS.map(stat => (
            <div
              key={stat.key}
              className="flex flex-col items-center py-2.5 px-2 rounded-xl text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <span className="text-lg mb-0.5">{stat.icon}</span>
              <span className="text-sm font-black text-white">
                {(profile.stats[stat.key] as number).toLocaleString()}
              </span>
              <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.6)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM NAV ───────────────────────────────────────────── */}
      <div
        className="relative z-20 flex items-center px-2 py-2"
        style={{
          background: 'linear-gradient(0deg, rgba(3,6,14,0.98) 0%, rgba(5,10,25,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {[
          { icon: Sparkles, label: 'Home', screen: 'home', color: '#22d3ee', active: true },
          { icon: Map, label: 'Worlds', screen: 'world_map', color: '#94a3b8', active: false },
          { icon: ShoppingBag, label: 'Shop', screen: 'shop', color: '#94a3b8', active: false },
          { icon: Trophy, label: 'Rankings', screen: 'leaderboard', color: '#94a3b8', active: false },
          { icon: User, label: 'Profile', screen: 'profile', color: '#94a3b8', active: false },
        ].map(item => (
          <button
            key={item.screen}
            onClick={() => setScreen(item.screen as any)}
            className="flex-1 flex flex-col items-center gap-1 py-1 rounded-xl transition active:scale-90"
          >
            <item.icon
              className="w-5 h-5"
              style={{
                color: item.active ? '#22d3ee' : 'rgba(148,163,184,0.6)',
                filter: item.active ? 'drop-shadow(0 0 8px rgba(34,211,238,0.8))' : undefined
              }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: item.active ? '#22d3ee' : 'rgba(148,163,184,0.5)' }}
            >
              {item.label}
            </span>
            {item.active && (
              <div
                className="absolute bottom-1 w-1 h-1 rounded-full"
                style={{ background: '#22d3ee', boxShadow: '0 0 6px #22d3ee' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
