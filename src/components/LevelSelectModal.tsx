import React from 'react';
import { useGame } from '../context/GameContext';
import { LevelConfig } from '../types/game';
import {
  X,
  Play,
  Star,
  Award,
  Heart,
  Sparkles,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';

export const LevelSelectModal: React.FC = () => {
  const { selectedLevelModal, openLevelModal, startLevel, profile, setScreen } = useGame();

  if (!selectedLevelModal) return null;

  const record = profile.completedLevels[selectedLevelModal.id];
  const stars = record?.stars || 0;
  const highScore = record?.highScore || 0;

  const handleStart = () => {
    if (profile.lives <= 0) {
      alert('Out of lives! Wait for regeneration or visit the shop for an instant refill.');
      return;
    }
    startLevel(selectedLevelModal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-cyan-950/60 to-slate-900 text-center border-b border-slate-800">
          <button
            onClick={() => openLevelModal(null)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400 block mb-1">
            Realm Challenge
          </span>
          <h2 className="text-2xl font-black text-white">Level {selectedLevelModal.id}</h2>
          <p className="text-xs text-slate-400 font-medium">{selectedLevelModal.title}</p>

          {/* Stars Earned */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-7 h-7 transition-all ${
                  stars >= s
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-110'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Objectives Box */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-2">
              Level Goals
            </span>
            <div className="space-y-1.5">
              {selectedLevelModal.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
                  <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{obj.description}</span>
                </div>
              ))}
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Moves Limit:</span>
              <span className="font-bold text-white">{selectedLevelModal.moves}</span>
            </div>
            {highScore > 0 && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Personal Best:</span>
                <span className="font-bold text-amber-400">{highScore.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Available Boosters Reminder */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 text-center">
              Equipped Boosters
            </span>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>{profile.boosters.hammer}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.boosters.nova}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{profile.boosters.lightning}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-300">
                <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                <span>{profile.boosters.shuffle}</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(6,182,212,0.4)] active:scale-95 transition"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Embark (1 <Heart className="w-3.5 h-3.5 inline fill-rose-500 text-rose-500 -mt-0.5" />)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
