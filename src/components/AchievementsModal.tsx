import React from 'react';
import { useGame } from '../context/GameContext';
import {
  ChevronLeft,
  Trophy,
  Star,
  CheckCircle2,
  Gem,
  Award,
  Flame,
  Zap,
  Shield,
  Sun
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Star className="w-5 h-5 text-amber-400" />,
  Flame: <Flame className="w-5 h-5 text-rose-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-300" />,
  Shield: <Shield className="w-5 h-5 text-cyan-400" />,
  Star: <Star className="w-5 h-5 text-yellow-400" />,
  Zap: <Zap className="w-5 h-5 text-purple-400" />
};

export const AchievementsModal: React.FC = () => {
  const { profile, setScreen, claimAchievement } = useGame();

  const achievementsList = Object.values(profile.achievements);

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
            Hall of Glory
          </span>
          <h2 className="text-base font-black text-white">Achievements</h2>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-black">
          <Gem className="w-3.5 h-3.5 text-cyan-400" />
          <span>{profile.gems}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-3 max-w-md mx-auto w-full">
        {achievementsList.map((ach) => {
          const isDone = ach.current >= ach.target;
          const pct = Math.min(100, Math.round((ach.current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                ach.claimed
                  ? 'bg-slate-900/60 border-slate-800 opacity-60'
                  : isDone
                  ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                {ICON_MAP[ach.icon] || <Trophy className="w-5 h-5 text-amber-400" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-black text-white">{ach.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400">
                    {ach.current}/{ach.target}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">{ach.description}</p>

                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isDone ? 'bg-cyan-400' : 'bg-slate-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                {ach.claimed ? (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Claimed</span>
                  </div>
                ) : isDone ? (
                  <button
                    onClick={() => claimAchievement(ach.id)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95 transition"
                  >
                    <Gem className="w-3.5 h-3.5 text-slate-950" />
                    <span>+{ach.rewardGems}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-bold px-2 py-1 rounded-lg bg-slate-800">
                    <Gem className="w-3 h-3 text-cyan-400" />
                    <span>{ach.rewardGems}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
