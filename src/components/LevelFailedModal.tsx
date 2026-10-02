import React from 'react';
import { useGame } from '../context/GameContext';
import {
  RotateCcw,
  Home,
  AlertTriangle,
  Heart,
  Trophy,
  Flame,
  Zap,
  ShoppingBag
} from 'lucide-react';

export const LevelFailedModal: React.FC = () => {
  const {
    levelFailedData,
    closeModals,
    retryLevel,
    setScreen,
    profile,
    activeLevel
  } = useGame();

  if (!levelFailedData) return null;

  const hasLives = profile.lives > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-slate-900 via-[#0d101d] to-[#080a14] border border-rose-500/40 shadow-[0_25px_60px_rgba(244,63,94,0.25)] overflow-hidden text-white text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-rose-600/30 blur-[45px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-8 pb-4">
          {/* Fractured Insignia */}
          <div className="relative w-20 h-20 mx-auto mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-rose-500/10 border-2 border-rose-500/30 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-600/30 to-purple-900/40 border border-rose-500/60 flex items-center justify-center shadow-[0_0_25px_rgba(244,63,94,0.5)]">
              <AlertTriangle className="w-9 h-9 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            </div>
          </div>

          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-400 block mb-1">
            Out of Moves
          </span>
          <h2 className="text-3xl font-black text-white font-['Cinzel'] tracking-wide">
            LEVEL FAILED
          </h2>

          {activeLevel && (
            <span className="text-xs font-bold text-slate-400 block mt-0.5">
              Level {activeLevel.id} • {activeLevel.title}
            </span>
          )}
        </div>

        {/* Goal Deficit Card */}
        <div className="px-6 space-y-3">
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block mb-1">
              Unfinished Objective
            </span>
            <p className="text-xs font-medium text-slate-300">
              {levelFailedData.target}
            </p>
            <div className="mt-2.5 pt-2 border-t border-rose-500/20 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Score Achieved:</span>
              <span className="text-white font-black text-sm">
                {levelFailedData.score.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Current Lives Status */}
          <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-slate-300">
            <span>Remaining Lives:</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Heart className={`w-3.5 h-3.5 ${hasLives ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span className={hasLives ? 'text-rose-400 font-black' : 'text-slate-500'}>
                {profile.lives} / {profile.maxLives}
              </span>
            </div>
          </div>
        </div>

        {/* Content & Action Buttons */}
        <div className="p-6 pt-3 space-y-2.5">
          {hasLives ? (
            <button
              onClick={retryLevel}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(244,63,94,0.4)] active:scale-95 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again (1 <Heart className="w-3.5 h-3.5 inline fill-white text-white -mt-0.5" />)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                closeModals();
                setScreen('shop');
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(245,158,11,0.4)] active:scale-95 transition"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span>Refill Lives in Treasury</span>
            </button>
          )}

          <button
            onClick={() => {
              closeModals();
              setScreen('world_map');
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Realm Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
