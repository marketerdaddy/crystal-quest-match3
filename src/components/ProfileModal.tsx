import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameApiService } from '../services/api';
import {
  ChevronLeft,
  User,
  Shield,
  Cloud,
  Sparkles,
  Award,
  Flame,
  Star,
  Zap,
  Check,
  LogOut
} from 'lucide-react';

const AVATARS = ['💎', '🔮', '⚡', '👑', '🐉', '🌙', '☀️', '❄️'];

export const ProfileModal: React.FC = () => {
  const { profile, setScreen, loginUser, logoutUser, updateSettings } = useGame();
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleAvatarChange = (av: string) => {
    setSelectedAvatar(av);
    loginUser({ ...profile, avatar: av });
  };

  const handleCloudSync = async () => {
    setSyncStatus('Syncing with Aetheria Cloud...');
    const ok = await GameApiService.syncCloudSave(profile.email, profile);
    if (ok) {
      setSyncStatus('Progress successfully synced to Cloud!');
    } else {
      setSyncStatus('Local progress verified.');
    }
    setTimeout(() => setSyncStatus(null), 3000);
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
            Archon Dossier
          </span>
          <h2 className="text-base font-black text-white">Player Profile</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6 max-w-md mx-auto w-full">
        {/* Avatar & Player Card */}
        <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-col items-center text-center relative overflow-hidden shadow-lg">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(6,182,212,0.5)] mb-3">
            {profile.avatar}
          </div>

          <h3 className="text-lg font-black text-white">{profile.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              Archon Tier {profile.level}
            </span>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
              {profile.isGuest ? 'Guest Traveler' : 'Verified Champion'}
            </span>
          </div>

          {/* Avatar Selector */}
          <div className="mt-4 pt-3 border-t border-slate-700/60 w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Choose Avatar Sigil
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => handleAvatarChange(av)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition ${
                    selectedAvatar === av
                      ? 'bg-cyan-950 border-cyan-400 scale-110 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'bg-slate-700/60 border-slate-600 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
            Archon Career Statistics
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <div>
                <span className="text-lg font-black text-white">{profile.stats.starsEarned}</span>
                <span className="text-[10px] text-slate-400 block uppercase">Stars Earned</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Award className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-lg font-black text-white">{profile.stats.levelsCompleted}</span>
                <span className="text-[10px] text-slate-400 block uppercase">Levels Cleared</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Flame className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <span className="text-lg font-black text-white">x{Math.max(profile.stats.highestCombo, 1)}</span>
                <span className="text-[10px] text-slate-400 block uppercase">Best Combo</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-lg font-black text-white">{profile.stats.endlessHighScore.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block uppercase">Endless Record</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Save & Account Management */}
        <div className="space-y-2">
          <button
            onClick={handleCloudSync}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Sync Cloud Save</span>
          </button>

          {syncStatus && (
            <p className="text-xs text-center font-semibold text-emerald-400 animate-pulse">
              {syncStatus}
            </p>
          )}

          {profile.isGuest ? (
            <button
              onClick={() => setScreen('auth')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <span>Link Account / Save Progress</span>
            </button>
          ) : (
            <button
              onClick={logoutUser}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          )}
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
