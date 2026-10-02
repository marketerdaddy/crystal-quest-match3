import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { getLevelConfig, WORLDS_CONFIG } from '../game/levels';
import { ChevronLeft, ChevronRight, Lock, Star, Play, MapPin, Zap } from 'lucide-react';

const WORLD_THEMES: Record<number, { gradient: string; glow: string; accent: string; icon: string }> = {
  1: { gradient: 'from-cyan-900/40 via-blue-900/30 to-slate-900/20', glow: 'rgba(6,182,212,0.3)', accent: '#06b6d4', icon: '💎' },
  2: { gradient: 'from-emerald-900/40 via-green-900/30 to-slate-900/20', glow: 'rgba(16,185,129,0.3)', accent: '#10b981', icon: '🌿' },
  3: { gradient: 'from-blue-900/40 via-indigo-900/30 to-slate-900/20', glow: 'rgba(59,130,246,0.3)', accent: '#3b82f6', icon: '🌊' },
  4: { gradient: 'from-orange-900/40 via-red-900/30 to-slate-900/20', glow: 'rgba(234,88,12,0.3)', accent: '#ea580c', icon: '🔥' },
  5: { gradient: 'from-violet-900/40 via-purple-900/30 to-slate-900/20', glow: 'rgba(139,92,246,0.3)', accent: '#8b5cf6', icon: '🌙' },
  6: { gradient: 'from-amber-900/40 via-yellow-900/30 to-slate-900/20', glow: 'rgba(245,158,11,0.3)', accent: '#f59e0b', icon: '☀️' },
  7: { gradient: 'from-teal-900/40 via-cyan-900/30 to-slate-900/20', glow: 'rgba(20,184,166,0.3)', accent: '#14b8a6', icon: '🌀' },
  8: { gradient: 'from-rose-900/40 via-pink-900/30 to-slate-900/20', glow: 'rgba(244,63,94,0.3)', accent: '#f43f5e', icon: '⭐' },
};

interface LevelNodeProps {
  levelId: number;
  index: number;
  isUnlocked: boolean;
  stars: number;
  title: string;
  isNext: boolean;
  accent: string;
  onClick: () => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({
  levelId, index, isUnlocked, stars, title, isNext, accent, onClick
}) => {
  // Zigzag positioning
  const isLeft = index % 2 === 0;
  const xOffset = isLeft ? '15%' : '55%';

  return (
    <div
      className="absolute"
      style={{
        left: xOffset,
        top: `${50 + index * 130}px`,
        width: '40%',
        zIndex: 10,
      }}
    >
      {/* Connector line to next node */}
      {index > 0 && (
        <div
          className="absolute"
          style={{
            bottom: '100%',
            left: '50%',
            width: '2px',
            height: '85px',
            background: isUnlocked
              ? `linear-gradient(180deg, ${accent}80, ${accent}20)`
              : 'rgba(255,255,255,0.06)',
            transform: index % 2 === 0
              ? 'translateX(-50%) rotate(-15deg) translateY(20px) scaleY(1.2)'
              : 'translateX(-50%) rotate(15deg) translateY(20px) scaleY(1.2)',
          }}
        />
      )}

      <button
        onClick={isUnlocked ? onClick : undefined}
        className={`relative w-full transition-all ${isUnlocked ? 'active:scale-90 cursor-pointer' : 'cursor-not-allowed'}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Node circle */}
        <div
          className="relative flex flex-col items-center"
        >
          {/* Glow for next level */}
          {isNext && (
            <div
              className="absolute -inset-3 rounded-full"
              style={{
                background: `radial-gradient(circle, ${accent}40, transparent 70%)`,
                animation: 'pulse-glow 2s ease-in-out infinite'
              }}
            />
          )}

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl relative"
            style={{
              background: isUnlocked
                ? `linear-gradient(135deg, ${accent}30, ${accent}15)`
                : 'rgba(255,255,255,0.04)',
              border: isNext
                ? `3px solid ${accent}`
                : isUnlocked
                  ? `2px solid ${accent}60`
                  : '2px solid rgba(255,255,255,0.08)',
              boxShadow: isNext
                ? `0 0 20px ${accent}60, 0 4px 16px rgba(0,0,0,0.4)`
                : isUnlocked
                  ? `0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
                  : '0 2px 8px rgba(0,0,0,0.3)',
              color: isUnlocked ? accent : 'rgba(148,163,184,0.3)'
            }}
          >
            {isUnlocked ? (
              <span className="font-black text-base" style={{ color: isNext ? accent : 'white' }}>
                {levelId}
              </span>
            ) : (
              <Lock className="w-5 h-5" />
            )}

            {/* Play icon overlay for next level */}
            {isNext && (
              <div
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: accent,
                  boxShadow: `0 0 10px ${accent}`,
                  animation: 'bounce-gentle 1.5s ease-in-out infinite'
                }}
              >
                <Play className="w-2.5 h-2.5 fill-white text-white" />
              </div>
            )}
          </div>

          {/* Stars below node */}
          {isUnlocked && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3].map(s => (
                <Star
                  key={s}
                  className="w-3 h-3"
                  style={{
                    color: s <= stars ? '#fbbf24' : 'rgba(255,255,255,0.15)',
                    fill: s <= stars ? '#fbbf24' : 'none',
                    filter: s <= stars ? 'drop-shadow(0 0 3px rgba(251,191,36,0.6))' : undefined
                  }}
                />
              ))}
            </div>
          )}

          {/* Level title */}
          <div
            className="text-center text-[10px] font-semibold mt-0.5 max-w-[100px] leading-tight"
            style={{ color: isUnlocked ? 'rgba(203,213,225,0.8)' : 'rgba(100,116,139,0.5)' }}
          >
            {title}
          </div>
        </div>
      </button>
    </div>
  );
};

export const WorldMapScreen: React.FC = () => {
  const { profile, setScreen, openLevelModal, startLevel } = useGame();
  const [worldIndex, setWorldIndex] = useState(0);

  const worlds = WORLDS_CONFIG;
  const currentWorld = worlds[worldIndex];
  const theme = WORLD_THEMES[currentWorld.id] || WORLD_THEMES[1];
  const isWorldUnlocked = profile.unlockedWorlds.includes(currentWorld.id);

  const [levelStart, levelEnd] = currentWorld.levelRange;
  const levelIds = Array.from({ length: levelEnd - levelStart + 1 }, (_, i) => levelStart + i);

  const completedLevelIds = Object.keys(profile.completedLevels).map(Number);
  const nextLevelId = completedLevelIds.length > 0 ? Math.max(...completedLevelIds) + 1 : 1;

  const totalStars = profile.stats.starsEarned;

  const handleLevelClick = (levelId: number) => {
    const cfg = getLevelConfig(levelId);
    openLevelModal(cfg);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden text-white"
      style={{
        background: `radial-gradient(ellipse at 50% 20%, ${theme.glow.replace('0.3', '0.15')} 0%, #060d1c 50%, #03060e 100%)`
      }}
    >
      {/* Star background */}
      <div className="star-bg" />

      {/* Ambient world glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.glow}, transparent 70%)`,
          animation: 'pulse-glow 3s ease-in-out infinite',
          filter: 'blur(30px)'
        }}
      />

      {/* Header */}
      <div
        className="relative z-20 flex items-center justify-between px-4 pt-4 pb-3"
        style={{
          background: 'rgba(3,6,14,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-xl transition active:scale-90"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>

        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>
            WORLD {currentWorld.id} / {worlds.length}
          </div>
          <div className="text-base font-black text-white">{currentWorld.name}</div>
        </div>

        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.25)'
          }}
        >
          <Star className="w-3.5 h-3.5 text-amber-400" style={{ fill: '#fbbf24' }} />
          <span className="text-xs font-black text-amber-300">{totalStars}</span>
        </div>
      </div>

      {/* World selector tabs */}
      <div
        className="relative z-10 flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar"
        style={{
          background: 'rgba(3,6,14,0.6)',
          borderBottom: '1px solid rgba(255,255,255,0.04)'
        }}
      >
        {worlds.map((w, i) => {
          const wTheme = WORLD_THEMES[w.id];
          const isUnlocked = profile.unlockedWorlds.includes(w.id);
          const isActive = i === worldIndex;
          return (
            <button
              key={w.id}
              onClick={() => isUnlocked && setWorldIndex(i)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-90 flex-shrink-0"
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${wTheme.accent}30, ${wTheme.accent}15)`
                  : 'rgba(255,255,255,0.03)',
                border: isActive
                  ? `1px solid ${wTheme.accent}60`
                  : '1px solid rgba(255,255,255,0.06)',
                color: isActive ? wTheme.accent : isUnlocked ? 'rgba(203,213,225,0.6)' : 'rgba(100,116,139,0.4)',
                opacity: isUnlocked ? 1 : 0.5
              }}
            >
              <span>{wTheme.icon}</span>
              <span>{w.name}</span>
              {!isUnlocked && <Lock className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* World info banner */}
      <div className="px-4 py-3 z-10">
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${theme.glow.replace('0.3', '0.12')}, rgba(255,255,255,0.02))`,
            border: `1px solid ${theme.accent}30`
          }}
        >
          <span className="text-3xl">{theme.icon}</span>
          <div>
            <div className="font-bold text-white text-sm">{currentWorld.subtitle}</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>
              {currentWorld.description}
            </div>
          </div>
          {!isWorldUnlocked && (
            <div
              className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{
                background: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.25)',
                color: '#fbbf24'
              }}
            >
              🌟 {currentWorld.unlockedAtStars} Stars
            </div>
          )}
        </div>
      </div>

      {/* Level Map */}
      <div className="flex-1 relative overflow-y-auto no-scrollbar px-4 pb-6">
        {!isWorldUnlocked ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(255,255,255,0.08)'
              }}
            >
              <Lock className="w-10 h-10" style={{ color: 'rgba(148,163,184,0.4)' }} />
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-400 text-sm">World Locked</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(148,163,184,0.5)' }}>
                Earn {currentWorld.unlockedAtStars} stars to unlock
              </div>
            </div>
            <div
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                background: 'rgba(251,191,36,0.12)',
                border: '1px solid rgba(251,191,36,0.25)',
                color: '#fbbf24'
              }}
            >
              ⭐ {totalStars} / {currentWorld.unlockedAtStars} Stars
            </div>
          </div>
        ) : (
          <div className="relative" style={{ minHeight: `${50 + levelIds.length * 130 + 80}px` }}>
            {/* Path connector SVG */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              {levelIds.map((_, index) => {
                if (index === 0) return null;
                const isLeft = index % 2 === 0;
                const prevIsLeft = (index - 1) % 2 === 0;
                const x1 = prevIsLeft ? '35%' : '75%';
                const y1 = 50 + (index - 1) * 130 + 28;
                const x2 = isLeft ? '35%' : '75%';
                const y2 = 50 + index * 130 + 28;
                const levelId = levelIds[index];
                const isCompleted = profile.completedLevels[levelId];
                return (
                  <path
                    key={index}
                    d={`M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={isCompleted ? `${theme.accent}60` : 'rgba(255,255,255,0.06)'}
                    strokeWidth="2"
                    strokeDasharray={isCompleted ? 'none' : '6 4'}
                  />
                );
              })}
            </svg>

            {levelIds.map((levelId, index) => {
              const completed = profile.completedLevels[levelId];
              const stars = completed?.stars || 0;
              const isCompleted = !!completed;
              const isNext = levelId === nextLevelId;
              const isUnlocked = isCompleted || isNext || levelId === levelIds[0];
              const cfg = getLevelConfig(levelId);

              // Zigzag: even index = left side, odd = right side
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={levelId}
                  className="absolute"
                  style={{
                    left: isLeft ? '15%' : '55%',
                    top: `${50 + index * 130}px`,
                    width: '30%',
                  }}
                >
                  <button
                    onClick={() => isUnlocked ? handleLevelClick(levelId) : undefined}
                    className={`relative w-full transition-all ${isUnlocked ? 'active:scale-90 cursor-pointer' : 'cursor-not-allowed'}`}
                  >
                    {/* Glow pulse for next level */}
                    {isNext && (
                      <div
                        className="absolute -inset-4 rounded-full pointer-events-none"
                        style={{
                          background: `radial-gradient(circle, ${theme.accent}40, transparent 65%)`,
                          animation: 'pulse-glow 1.8s ease-in-out infinite'
                        }}
                      />
                    )}

                    {/* Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                        style={{
                          background: isUnlocked
                            ? `linear-gradient(135deg, ${theme.accent}25, rgba(255,255,255,0.04))`
                            : 'rgba(255,255,255,0.03)',
                          border: isNext
                            ? `2px solid ${theme.accent}`
                            : isCompleted
                              ? `2px solid ${theme.accent}50`
                              : '2px solid rgba(255,255,255,0.07)',
                          boxShadow: isNext
                            ? `0 0 20px ${theme.accent}50, 0 4px 16px rgba(0,0,0,0.5)`
                            : isCompleted
                              ? `0 4px 12px rgba(0,0,0,0.4)`
                              : 'none',
                        }}
                      >
                        {isUnlocked ? (
                          <span className="font-black text-base" style={{ color: isNext ? theme.accent : 'white' }}>
                            {levelId}
                          </span>
                        ) : (
                          <Lock className="w-5 h-5" style={{ color: 'rgba(100,116,139,0.5)' }} />
                        )}

                        {/* Play badge for next level */}
                        {isNext && (
                          <div
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              background: theme.accent,
                              boxShadow: `0 0 12px ${theme.accent}`,
                              animation: 'bounce-gentle 1.5s ease-in-out infinite'
                            }}
                          >
                            <Play className="w-2.5 h-2.5 fill-white text-white" />
                          </div>
                        )}

                        {/* Checkmark for completed */}
                        {isCompleted && !isNext && (
                          <div
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                            style={{
                              background: '#22c55e',
                              boxShadow: '0 0 6px rgba(34,197,94,0.5)'
                            }}
                          >
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Stars */}
                      {isUnlocked && (
                        <div className="flex gap-0.5 mt-1.5">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className="w-2.5 h-2.5"
                              style={{
                                color: s <= stars ? '#fbbf24' : 'rgba(255,255,255,0.12)',
                                fill: s <= stars ? '#fbbf24' : 'none',
                                filter: s <= stars ? 'drop-shadow(0 0 2px rgba(251,191,36,0.6))' : undefined
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Label */}
                      <div
                        className="text-center text-[10px] font-medium mt-0.5 leading-tight px-1"
                        style={{
                          color: isUnlocked ? 'rgba(203,213,225,0.7)' : 'rgba(100,116,139,0.4)',
                          maxWidth: 80
                        }}
                      >
                        {cfg.title}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-20 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'rgba(3,6,14,0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        <button
          onClick={() => setWorldIndex(Math.max(0, worldIndex - 1))}
          disabled={worldIndex === 0}
          className="p-2 rounded-xl transition active:scale-90 disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>

        <button
          onClick={() => setScreen('home')}
          className="flex-1 py-2.5 rounded-xl font-bold text-sm transition active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(203,213,225,0.8)'
          }}
        >
          ← Return to Home
        </button>

        <button
          onClick={() => setWorldIndex(Math.min(worlds.length - 1, worldIndex + 1))}
          disabled={worldIndex === worlds.length - 1 || !profile.unlockedWorlds.includes(worlds[worldIndex + 1]?.id)}
          className="p-2 rounded-xl transition active:scale-90 disabled:opacity-30"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
};
