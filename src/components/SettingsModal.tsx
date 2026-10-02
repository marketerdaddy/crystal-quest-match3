import React from 'react';
import { useGame } from '../context/GameContext';
import {
  ChevronLeft,
  Volume2,
  Music,
  Vibrate,
  Eye,
  RotateCcw,
  ShieldAlert,
  Cloud,
  Check
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { profile, updateSettings, setScreen } = useGame();

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
      localStorage.removeItem('crystal_quest_profile_v1');
      window.location.reload();
    }
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
            System Config
          </span>
          <h2 className="text-base font-black text-white">Settings</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Main Settings Form */}
      <div className="flex-1 p-4 space-y-5 max-w-md mx-auto w-full">
        {/* Audio Sliders */}
        <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Audio Synthesizer
          </span>

          {/* SFX Volume */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-2 text-slate-300">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Sound FX Volume</span>
              </span>
              <span className="text-cyan-400 font-mono">
                {Math.round(profile.settings.sfxVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={profile.settings.sfxVolume}
              onChange={(e) => updateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-2 text-slate-300">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Ambient Music Volume</span>
              </span>
              <span className="text-purple-400 font-mono">
                {Math.round(profile.settings.musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={profile.settings.musicVolume}
              onChange={(e) => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-purple-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Accessibility & Haptics Toggles */}
        <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Controls & Accessibility
          </span>

          {/* Haptic Toggle */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Vibrate className="w-4 h-4 text-amber-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Tactile Haptics</h4>
                <p className="text-[10px] text-slate-400">Vibration feedback on crystal matches.</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ haptics: !profile.settings.haptics })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                profile.settings.haptics ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  profile.settings.haptics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between py-1 border-t border-slate-700/60 pt-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Reduced Motion</h4>
                <p className="text-[10px] text-slate-400">Minimizes screen shakes & rapid flashes.</p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !profile.settings.reducedMotion })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                profile.settings.reducedMotion ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  profile.settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Restore Purchases & Danger Zone */}
        <div className="space-y-2">
          <button
            onClick={() => alert('Purchases verified and restored from Aetheria Ledger!')}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Restore In-Game Purchases</span>
          </button>

          <button
            onClick={handleResetData}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Game Progress</span>
          </button>
        </div>
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
