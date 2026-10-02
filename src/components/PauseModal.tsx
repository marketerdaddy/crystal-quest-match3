import React from 'react';
import { useGame } from '../context/GameContext';
import {
  Play,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Music,
  Vibrate,
  X,
  Award
} from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onResume, onRestart }) => {
  const { setScreen, profile, updateSettings, activeLevel, isEndlessMode } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-sm rounded-[32px] bg-gradient-to-b from-slate-900 via-[#0d1222] to-[#070913] border border-cyan-500/40 shadow-[0_25px_60px_rgba(6,182,212,0.25)] overflow-hidden text-white text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Glow Element */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-cyan-600/25 blur-[45px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative px-6 pt-7 pb-3 border-b border-slate-800/80">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-1">
            Suspended
          </span>
          <h2 className="text-2xl font-black text-white font-['Cinzel'] tracking-wide">
            GAME PAUSED
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEndlessMode ? 'Infinite Astral Spire' : `Level ${activeLevel?.id}: ${activeLevel?.title}`}
          </p>
        </div>

        {/* Level Objectives Box (if story level) */}
        {activeLevel && !isEndlessMode && (
          <div className="p-4 mx-6 mt-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 text-left">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1.5">
              Mission Objectives
            </span>
            <div className="space-y-1">
              {activeLevel.objectives.map((obj, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{obj.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Audio & Haptics Toggles */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            {/* SFX Toggle */}
            <button
              onClick={() =>
                updateSettings({
                  sfxVolume: profile.settings.sfxVolume > 0 ? 0 : 0.8
                })
              }
              title="Toggle Sound Effects"
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                profile.settings.sfxVolume > 0
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500'
              }`}
            >
              {profile.settings.sfxVolume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-bold">SFX</span>
            </button>

            {/* BGM Toggle */}
            <button
              onClick={() =>
                updateSettings({
                  musicVolume: profile.settings.musicVolume > 0 ? 0 : 0.5
                })
              }
              title="Toggle Ambient Music"
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                profile.settings.musicVolume > 0
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500'
              }`}
            >
              <Music className="w-5 h-5" />
              <span className="text-[10px] font-bold">BGM</span>
            </button>

            {/* Haptics Toggle */}
            <button
              onClick={() =>
                updateSettings({
                  haptics: !profile.settings.haptics
                })
              }
              title="Toggle Tactile Haptics"
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-1 min-w-[70px] ${
                profile.settings.haptics
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-500'
              }`}
            >
              <Vibrate className="w-5 h-5" />
              <span className="text-[10px] font-bold">Haptic</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={onResume}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(6,182,212,0.4)] active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Resume Game</span>
            </button>

            <button
              onClick={onRestart}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Level</span>
            </button>

            <button
              onClick={() => setScreen('world_map')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-400 hover:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Quit to Realm Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
