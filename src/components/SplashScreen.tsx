import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Sound } from '../game/audio';

const CRYSTAL_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#06b6d4'
];

interface FloatingCrystal {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  opacity: number;
}

export const SplashScreen: React.FC = () => {
  const { setScreen } = useGame();
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [progress, setProgress] = useState(0);
  const [crystals] = useState<FloatingCrystal[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 12 + Math.random() * 24,
      color: CRYSTAL_COLORS[i % CRYSTAL_COLORS.length],
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      opacity: 0.15 + Math.random() * 0.3
    }))
  );

  useEffect(() => {
    // Simulate loading progress
    const steps = [0, 20, 45, 70, 90, 100];
    let stepIdx = 0;
    const advance = () => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx]);
        stepIdx++;
        setTimeout(advance, 280 + Math.random() * 200);
      } else {
        setTimeout(() => setPhase('ready'), 300);
      }
    };
    setTimeout(advance, 400);
  }, []);

  const handleEnter = () => {
    if (phase !== 'ready') return;
    Sound.playVictory();
    setScreen('home');
  };

  const loadingMessages = [
    'Channeling Elemental Crystals...',
    'Weaving Arcane Resonance...',
    'Summoning Astral Prisms...',
    'Awakening Ancient Realms...',
    'Calibrating Ley Lines...',
    'Portal Ready!'
  ];
  const msgIndex = Math.min(5, Math.floor(progress / 20));

  return (
    <div
      onClick={handleEnter}
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #0c1840 0%, #050812 50%, #02040a 100%)' }}
    >
      {/* Starfield Background */}
      <div className="star-bg" />

      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-[70px] animate-pulse-subtle" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-[60px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating mini crystals */}
      {crystals.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.size,
            height: c.size,
            opacity: c.opacity,
            animation: `float ${c.duration}s ease-in-out ${c.delay}s infinite`
          }}
        >
          <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%' }}>
            <polygon
              points="20,2 38,15 32,36 8,36 2,15"
              fill={c.color}
              opacity="0.6"
            />
            <polygon
              points="20,2 38,15 20,20"
              fill="white"
              opacity="0.2"
            />
          </svg>
        </div>
      ))}

      {/* Rotating rings around logo */}
      <div className="relative mb-8 flex items-center justify-center" style={{ width: 220, height: 220 }}>
        {/* Outermost ring */}
        <div
          className="absolute rounded-full border border-cyan-500/20 animate-spin-slow"
          style={{ width: 210, height: 210 }}
        />
        {/* Second ring */}
        <div
          className="absolute rounded-full border border-purple-500/25 animate-spin-slow-reverse"
          style={{ width: 175, height: 175 }}
        />
        {/* Inner glow ring */}
        <div
          className="absolute rounded-full border-2 border-cyan-400/30 animate-spin-faster"
          style={{ width: 140, height: 140 }}
        />

        {/* Orbiters */}
        {[0, 120, 240].map((deg, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 210,
              height: 210,
              animation: `spin-slow ${10 + i * 2}s linear infinite`,
              animationDirection: i % 2 === 0 ? 'normal' : 'reverse'
            }}
          >
            <div
              className="absolute"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: CRYSTAL_COLORS[i * 2],
                boxShadow: `0 0 12px ${CRYSTAL_COLORS[i * 2]}`,
                top: '0%',
                left: '50%',
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            />
          </div>
        ))}

        {/* Central crystal logo */}
        <div
          className="relative w-24 h-24 flex items-center justify-center"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          <div
            className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
          />
          <img
            src="/crystal.svg"
            alt="Crystal Quest"
            className="w-24 h-24 relative z-10"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.9)) drop-shadow(0 0 40px rgba(0,242,254,0.5))'
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-2 animate-slide-up">
        <h1
          className="text-5xl font-black tracking-widest text-transparent bg-clip-text"
          style={{
            fontFamily: "'Cinzel', serif",
            backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a8edea 40%, #00f2fe 70%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 20px rgba(0,242,254,0.6))'
          }}
        >
          CRYSTAL QUEST
        </h1>
        <p
          className="text-xs font-extrabold tracking-[0.35em] mt-2"
          style={{
            color: '#7dd3fc',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            textShadow: '0 0 10px rgba(125,211,252,0.6)'
          }}
        >
          ✦ REALMS OF AETHERIA ✦
        </p>
      </div>

      {/* Loading bar */}
      <div className="w-64 mt-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #00c6fb, #005bea, #a855f7)',
              boxShadow: '0 0 10px rgba(0,198,251,0.6)',
              position: 'relative'
            }}
          >
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Status message */}
        <p className="text-center mt-3 text-[11px] font-medium tracking-widest" style={{ color: 'rgba(148,163,184,0.8)', textTransform: 'uppercase' }}>
          {loadingMessages[msgIndex]}
        </p>
      </div>

      {/* Enter prompt */}
      {phase === 'ready' && (
        <div className="mt-6 animate-pop-in">
          <div
            className="px-8 py-3 rounded-full font-black text-xs tracking-widest uppercase"
            style={{
              background: 'rgba(6,182,212,0.15)',
              border: '1px solid rgba(6,182,212,0.4)',
              color: '#67e8f9',
              animation: 'radial-pulse 1.5s ease-in-out infinite',
              letterSpacing: '0.2em'
            }}
          >
            ✦ TAP TO ENTER REALM ✦
          </div>
        </div>
      )}

      {/* Version */}
      <div className="absolute bottom-5 text-[10px] font-mono" style={{ color: 'rgba(100,116,139,0.6)' }}>
        v1.0.0 · Crystal Quest: Realms of Aetheria
      </div>
    </div>
  );
};
