import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  Trophy,
  Star,
  Coins,
  Gem,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Home,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LevelCompleteModal: React.FC = () => {
  const {
    levelCompleteData,
    closeModals,
    nextLevel,
    retryLevel,
    setScreen,
    activeLevel
  } = useGame();

  const [visibleStars, setVisibleStars] = useState(0);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    if (!levelCompleteData) return;

    // Reset
    setVisibleStars(0);
    setShowRewards(false);

    // Launch confetti
    const launch = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#22d3ee', '#a855f7', '#10b981', '#ef4444'],
        scalar: 0.9
      });
    };

    setTimeout(launch, 200);
    setTimeout(launch, 600);

    // Animate stars appearing one by one
    const { stars } = levelCompleteData;
    if (stars >= 1) setTimeout(() => setVisibleStars(1), 400);
    if (stars >= 2) setTimeout(() => setVisibleStars(2), 750);
    if (stars >= 3) {
      setTimeout(() => setVisibleStars(3), 1100);
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, scalar: 1.2 });
      }, 1200);
    }

    setTimeout(() => setShowRewards(true), 1400);
  }, [levelCompleteData]);

  if (!levelCompleteData) return null;

  const { stars, score, rewards } = levelCompleteData;

  const starMessages = ['', 'Good Job!', 'Great Work!', '⭐ PERFECT! ⭐'];

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,15,0.88)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden text-white text-center animate-pop-in"
        style={{
          background: 'linear-gradient(180deg, #0f1f3d 0%, #070d1c 100%)',
          border: '1px solid rgba(251,191,36,0.3)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9), 0 0 40px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
      >
        {/* Shimmer top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.8), transparent)',
            animation: 'shimmer 2s linear infinite'
          }}
        />

        {/* Victory Header */}
        <div
          className="relative px-6 pt-8 pb-5"
          style={{ background: 'linear-gradient(180deg, rgba(251,191,36,0.1) 0%, transparent 100%)' }}
        >
          {/* Trophy */}
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-3 relative"
            style={{
              background: 'rgba(251,191,36,0.12)',
              border: '2px solid rgba(251,191,36,0.4)',
              boxShadow: '0 0 30px rgba(251,191,36,0.3)',
              animation: 'float 3s ease-in-out infinite'
            }}
          >
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>

          <div
            className="text-[11px] font-black uppercase tracking-[0.3em] mb-1"
            style={{ color: '#fbbf24' }}
          >
            Realm Liberated!
          </div>
          <h2
            className="text-3xl font-black mb-4"
            style={{
              fontFamily: "'Cinzel', serif",
              backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.5))'
            }}
          >
            VICTORY!
          </h2>

          {/* Animated 3-star display */}
          <div className="flex items-end justify-center gap-2 mb-2" style={{ height: 56 }}>
            {/* Star 1 */}
            <div
              className="transition-all"
              style={{
                transform: visibleStars >= 1 ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
                opacity: visibleStars >= 1 ? 1 : 0,
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Star
                className="w-10 h-10"
                style={{
                  color: '#fbbf24',
                  fill: stars >= 1 ? '#fbbf24' : 'none',
                  filter: stars >= 1 ? 'drop-shadow(0 0 12px rgba(251,191,36,0.9))' : undefined
                }}
              />
            </div>

            {/* Star 2 - center (bigger) */}
            <div
              className="transition-all"
              style={{
                transform: visibleStars >= 2 ? 'scale(1) translateY(-8px)' : 'scale(0) translateY(20px)',
                opacity: visibleStars >= 2 ? 1 : 0,
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Star
                className="w-14 h-14"
                style={{
                  color: '#fbbf24',
                  fill: stars >= 2 ? '#fbbf24' : 'none',
                  filter: stars >= 2 ? 'drop-shadow(0 0 16px rgba(251,191,36,0.9))' : undefined
                }}
              />
            </div>

            {/* Star 3 */}
            <div
              className="transition-all"
              style={{
                transform: visibleStars >= 3 ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
                opacity: visibleStars >= 3 ? 1 : 0,
                transitionDuration: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <Star
                className="w-10 h-10"
                style={{
                  color: '#fbbf24',
                  fill: stars >= 3 ? '#fbbf24' : 'none',
                  filter: stars >= 3 ? 'drop-shadow(0 0 12px rgba(251,191,36,0.9))' : undefined
                }}
              />
            </div>
          </div>

          {/* Star message */}
          {visibleStars > 0 && (
            <div
              className="text-sm font-bold animate-fade-in"
              style={{ color: 'rgba(251,191,36,0.8)' }}
            >
              {starMessages[visibleStars]}
            </div>
          )}

          {/* Score */}
          <div
            className="mt-3 py-2.5 px-6 rounded-2xl inline-flex items-center gap-2"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400 font-semibold">Score:</span>
            <span
              className="text-xl font-black"
              style={{
                backgroundImage: 'linear-gradient(135deg, #fff, #67e8f9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Rewards Section */}
        <div
          className="px-5 pb-5 space-y-3 transition-all"
          style={{
            opacity: showRewards ? 1 : 0,
            transform: showRewards ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s ease'
          }}
        >
          {/* Rewards grid */}
          <div
            className="p-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)'
            }}
          >
            <div
              className="text-[10px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ color: '#22d3ee' }}
            >
              ✦ Rewards Acquired ✦
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { Icon: Coins, value: rewards.coins, label: 'Coins', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
                { Icon: Gem, value: rewards.gems, label: 'Gems', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.2)' },
                { Icon: Sparkles, value: rewards.xp, label: 'XP', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
              ].map(({ Icon, value, label, color, bg, border }) => (
                <div
                  key={label}
                  className="py-3 px-2 rounded-xl flex flex-col items-center gap-1"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                  <span className="text-sm font-black" style={{ color }}>+{value}</span>
                  <span className="text-[10px]" style={{ color: 'rgba(148,163,184,0.7)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <button
            onClick={nextLevel}
            className="relative w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wide overflow-hidden transition active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #10b981, #0891b2)',
              boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
              color: 'white',
              border: 'none'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite'
              }}
            />
            <div className="relative flex items-center justify-center gap-2">
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={retryLevel}
              className="py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(203,213,225,0.8)'
              }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={() => { closeModals(); setScreen('home'); }}
              className="py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(203,213,225,0.8)'
              }}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
