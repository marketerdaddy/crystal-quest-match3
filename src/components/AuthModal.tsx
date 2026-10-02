import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameApiService } from '../services/api';
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { setScreen, loginUser, profile } = useGame();
  const [tab, setTab] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (tab === 'signup') {
      const res = await GameApiService.signup(name, email, password);
      if (res.success) {
        loginUser(res.user);
        setScreen('home');
      } else {
        setError(res.error || 'Signup failed.');
      }
    } else {
      const res = await GameApiService.login(email, password);
      if (res.success) {
        loginUser(res.user);
        setScreen('home');
      } else {
        setError(res.error || 'Invalid email or password.');
      }
    }

    setLoading(false);
  };

  const handleGuestEntry = async () => {
    setLoading(true);
    const res = await GameApiService.guestLogin();
    loginUser(res.user);
    setLoading(false);
    setScreen('home');
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
            Aetheria Gateway
          </span>
          <h2 className="text-base font-black text-white">Archon Authentication</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Main Form */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-5">
        <div className="text-center mb-2">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 mx-auto flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Lock className="w-7 h-7 text-cyan-400" />
          </div>
          <h3 className="text-lg font-black text-white">Link Your Cloud Save</h3>
          <p className="text-xs text-slate-400">Preserve your realm levels, stars, coins, and purchases.</p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 w-full p-1 bg-slate-800/80 rounded-2xl border border-slate-700">
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition ${
              tab === 'signup'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-black transition ${
              tab === 'login'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
        </div>

        {error && (
          <div className="w-full p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {tab === 'signup' && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Archon Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  placeholder="Your Archon Name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="archon@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(6,182,212,0.4)] active:scale-95 transition"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <span>{tab === 'signup' ? 'Register Account' : 'Log In & Sync'}</span>
            )}
          </button>
        </form>

        <div className="w-full flex items-center gap-3 my-2">
          <div className="flex-1 h-[1px] bg-slate-700" />
          <span className="text-[10px] text-slate-500 uppercase font-bold">or</span>
          <div className="flex-1 h-[1px] bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGuestEntry}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold active:scale-95 transition"
        >
          Continue as Guest Traveler
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
