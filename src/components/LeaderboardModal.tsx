import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameApiService } from '../services/api';
import {
  ChevronLeft,
  Trophy,
  Star,
  Medal,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';

export const LeaderboardModal: React.FC = () => {
  const { profile, setScreen } = useGame();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tab, setTab] = useState<'endless' | 'stars'>('endless');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GameApiService.getLeaderboard().then((data) => {
      setLeaderboard(data);
      setLoading(false);
    });
  }, []);

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
            Pantheon of Aetheria
          </span>
          <h2 className="text-base font-black text-white">Global Leaderboard</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Mode Tabs */}
      <div className="px-4 py-2 flex items-center justify-center gap-2 bg-slate-900/40">
        <button
          onClick={() => setTab('endless')}
          className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'endless'
              ? 'bg-cyan-500 text-slate-950 border-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Endless Spire</span>
        </button>

        <button
          onClick={() => setTab('stars')}
          className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
            tab === 'stars'
              ? 'bg-amber-500 text-slate-950 border-white font-black shadow-[0_0_10px_rgba(245,158,11,0.6)]'
              : 'bg-slate-800/80 border-slate-700 text-slate-300'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Realm Stars</span>
        </button>
      </div>

      {/* Ladder List */}
      <div className="flex-1 p-4 space-y-2 max-w-md mx-auto w-full overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          leaderboard.map((item, idx) => {
            const rank = idx + 1;
            const isTop3 = rank <= 3;

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  isTop3
                    ? rank === 1
                      ? 'bg-gradient-to-r from-amber-950/60 to-slate-900 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                      : rank === 2
                      ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-400'
                      : 'bg-gradient-to-r from-amber-950/30 to-slate-900 border-amber-700'
                    : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 text-center font-black">
                    {rank === 1 ? (
                      <Crown className="w-5 h-5 text-amber-400 mx-auto" />
                    ) : rank === 2 ? (
                      <Medal className="w-5 h-5 text-slate-300 mx-auto" />
                    ) : rank === 3 ? (
                      <Medal className="w-5 h-5 text-amber-600 mx-auto" />
                    ) : (
                      <span className="text-xs text-slate-500">#{rank}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-white">{item.name}</h4>
                    <span className="text-[10px] text-slate-400">{item.world}</span>
                  </div>
                </div>

                <div className="text-right">
                  {tab === 'endless' ? (
                    <>
                      <span className="text-xs font-black text-cyan-300 block">
                        {item.score.toLocaleString()}
                      </span>
                      <span className="text-[9px] text-slate-500 uppercase">Points</span>
                    </>
                  ) : (
                    <div className="flex items-center gap-1 text-xs font-black text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.stars}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Bar: Current Player Rank Pill */}
      <div className="w-full p-4 bg-slate-950/90 backdrop-blur-md border-t border-cyan-500/20">
        <div className="max-w-md mx-auto p-3 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black text-cyan-300">You:</span>
            <span className="text-xs font-bold text-white">{profile.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-black text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{profile.stats.starsEarned}</span>
            </div>
            <span className="text-xs font-black text-cyan-300">
              {profile.stats.endlessHighScore > 0 ? profile.stats.endlessHighScore.toLocaleString() : 'Unranked'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
