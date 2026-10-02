import React from 'react';
import { useGame } from '../context/GameContext';
import {
  ChevronLeft,
  Calendar,
  Gift,
  CheckCircle2,
  Sparkles,
  Flame,
  Zap,
  Coins,
  Gem,
  Award
} from 'lucide-react';

const STREAK_REWARDS = [
  { day: 1, reward: '500 Coins', coins: 500, gems: 0 },
  { day: 2, reward: '20 Gems', coins: 0, gems: 20 },
  { day: 3, reward: '1,000 Coins', coins: 1000, gems: 0 },
  { day: 4, reward: '2x Hammers', coins: 0, gems: 0, booster: 'hammer' },
  { day: 5, reward: '50 Gems', coins: 0, gems: 50 },
  { day: 6, reward: '2,500 Coins', coins: 2500, gems: 0 },
  { day: 7, reward: 'Archon Geode Chest', coins: 5000, gems: 100 }
];

export const DailyChallengeScreen: React.FC = () => {
  const { profile, setScreen, claimDailyStreak } = useGame();

  const isTodayClaimed = profile.lastDailyRewardDate === new Date().toDateString();

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
            Daily Sanctuary
          </span>
          <h2 className="text-base font-black text-white">Quests & Streaks</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6 max-w-md mx-auto w-full">
        {/* 7-Day Streak Calendar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>7-Day Login Calendar</span>
            </span>
            <span className="text-xs font-black text-amber-400">
              Streak: Day {profile.dailyStreak}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {STREAK_REWARDS.slice(0, 4).map((r) => {
              const isPast = profile.dailyStreak > r.day;
              const isCurrent = profile.dailyStreak === r.day;

              return (
                <div
                  key={r.day}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center relative ${
                    isPast
                      ? 'bg-slate-900/60 border-slate-700 text-slate-500'
                      : isCurrent
                      ? 'bg-gradient-to-b from-cyan-950 to-slate-900 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/70 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Day {r.day}</span>
                  <Gift className={`w-6 h-6 my-1 ${isCurrent ? 'text-cyan-400 animate-bounce' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-black line-clamp-1">{r.reward}</span>

                  {isPast && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            {STREAK_REWARDS.slice(4, 7).map((r) => {
              const isPast = profile.dailyStreak > r.day;
              const isCurrent = profile.dailyStreak === r.day;

              return (
                <div
                  key={r.day}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-between text-center relative ${
                    isPast
                      ? 'bg-slate-900/60 border-slate-700 text-slate-500'
                      : isCurrent
                      ? 'bg-gradient-to-b from-amber-950 to-slate-900 border-amber-400 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-slate-800/70 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Day {r.day}</span>
                  <Gift className={`w-6 h-6 my-1 ${isCurrent ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-black line-clamp-1">{r.reward}</span>

                  {isPast && (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Claim Streak Button */}
          <button
            onClick={claimDailyStreak}
            disabled={isTodayClaimed}
            className={`w-full mt-3 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
              isTodayClaimed
                ? 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isTodayClaimed ? 'Claimed for Today' : 'Claim Daily Reward'}</span>
          </button>
        </div>

        {/* Daily Challenges List */}
        <div>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span>Active Realm Missions</span>
          </span>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-white">Elemental Matcher</h4>
                <p className="text-[11px] text-slate-400">Match 100 total crystals in any mode.</p>
                <div className="w-36 bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-black">
                <Gem className="w-3.5 h-3.5 text-cyan-400" />
                <span>+15</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-white">Pyrotechnic Alchemist</h4>
                <p className="text-[11px] text-slate-400">Create 3 Nova Bombs with T/L matches.</p>
                <div className="w-36 bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '33%' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-black">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>+500</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-white">Harmonic Cascade</h4>
                <p className="text-[11px] text-slate-400">Achieve a x4 Mega Combo or higher.</p>
                <div className="w-36 bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-black">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Claimed</span>
              </div>
            </div>
          </div>
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
