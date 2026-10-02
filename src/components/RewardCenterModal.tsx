import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sound } from '../game/audio';
import {
  ChevronLeft,
  Gift,
  Sparkles,
  Coins,
  Gem,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const WHEEL_SEGMENTS = [
  { label: '300 Coins', type: 'coins', amount: 300, color: '#f59e0b' },
  { label: '1x Hammer', type: 'booster', booster: 'hammer', amount: 1, color: '#f43f5e' },
  { label: '15 Gems', type: 'gems', amount: 15, color: '#06b6d4' },
  { label: '1x Nova', type: 'booster', booster: 'nova', amount: 1, color: '#eab308' },
  { label: '1,000 Coins', type: 'coins', amount: 1000, color: '#f59e0b' },
  { label: '1x Lightning', type: 'booster', booster: 'lightning', amount: 1, color: '#3b82f6' },
  { label: '50 Gems', type: 'gems', amount: 50, color: '#06b6d4' },
  { label: 'JACKPOT (2,500)', type: 'coins', amount: 2500, color: '#a855f7' }
];

export const RewardCenterModal: React.FC = () => {
  const { setScreen, addCoins, addGems, addBoosters } = useGame();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);
    Sound.playSwap();

    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const randomPrizeIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const extraSpins = 5 * 360;
    const targetRotation = rotation + extraSpins + (360 - randomPrizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const prize = WHEEL_SEGMENTS[randomPrizeIndex];
      setWonPrize(prize.label);

      Sound.playVictory();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (prize.type === 'coins') {
        addCoins(prize.amount);
      } else if (prize.type === 'gems') {
        addGems(prize.amount);
      } else if (prize.type === 'booster' && prize.booster) {
        addBoosters(prize.booster as any, prize.amount);
      }
    }, 4000);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-[#090e1d] via-[#0d162a] to-[#050811] text-white">
      {/* Top Header */}
      <div className="w-full pt-4 px-4 pb-3 z-10 flex items-center justify-between bg-slate-950/70 backdrop-blur-md border-b border-cyan-500/20">
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 active:scale-95 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
            Astral Wheel
          </span>
          <h2 className="text-base font-black text-white">Daily Fortune</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Center Wheel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-sm mx-auto w-full">
        {/* Pointer indicator */}
        <div className="relative z-20 -mb-4">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]" />
        </div>

        {/* Wheel Disc */}
        <div className="relative w-64 h-64 rounded-full border-4 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.4)] overflow-hidden bg-slate-900">
          <div
            className="w-full h-full rounded-full transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1.0)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const angle = (360 / WHEEL_SEGMENTS.length) * idx;
              return (
                <div
                  key={idx}
                  className="absolute w-full h-full top-0 left-0 flex items-start justify-center pt-2"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <span
                    className="text-[10px] font-black uppercase tracking-wider origin-bottom"
                    style={{ color: seg.color }}
                  >
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Central Hub Gem */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
        </div>

        {/* Won Prize Banner */}
        {wonPrize && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-950/80 border border-amber-400 text-amber-300 font-black text-sm animate-bounce shadow-lg">
            You won: {wonPrize}!
          </div>
        )}

        {/* Spin CTA */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full mt-6 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg transition active:scale-95 ${
            isSpinning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-[0_10px_25px_rgba(245,158,11,0.5)] border border-amber-300'
          }`}
        >
          {isSpinning ? 'Consulting the Astral Stars...' : 'Spin the Crystal Wheel!'}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-cyan-500/20 text-center">
        <button
          onClick={() => setScreen('home')}
          className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-bold active:scale-95 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
