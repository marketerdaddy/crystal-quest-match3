import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { GameApiService } from '../services/api';
import { ShopItem } from '../types/game';
import {
  ChevronLeft,
  ShoppingBag,
  Coins,
  Gem,
  Sparkles,
  Flame,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ShopScreen: React.FC = () => {
  const { setScreen, openCheckout, profile } = useGame();
  const [catalog, setCatalog] = useState<ShopItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'bundles' | 'coins' | 'gems' | 'boosters'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GameApiService.getShopCatalog().then((items) => {
      setCatalog(items);
      setLoading(false);
    });
  }, []);

  const filteredItems = activeTab === 'all'
    ? catalog
    : catalog.filter((item) => item.category === activeTab);

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
            Aetherian Vault
          </span>
          <h2 className="text-base font-black text-white">Treasury & Shop</h2>
        </div>

        {/* Currency Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-black">{profile.coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-black">{profile.gems.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border-b border-cyan-500/10 flex items-center justify-center gap-2 text-[11px] text-cyan-200">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Server-Verified Instant Delivery & Bullion Security Guarantee</span>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-900/40">
        {(['all', 'bundles', 'coins', 'gems', 'boosters'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-cyan-500 text-slate-950 border-white font-black shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700 hover:border-cyan-500/50 p-4 flex flex-col justify-between transition-all hover:scale-[1.01] shadow-lg"
              >
                {/* Popular or Discount Badge */}
                {item.badge && (
                  <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[10px] tracking-wider uppercase shadow-md">
                    {item.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {item.category === 'bundles' ? (
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    ) : item.category === 'coins' ? (
                      <Coins className="w-6 h-6 text-amber-400" />
                    ) : item.category === 'gems' ? (
                      <Gem className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <Flame className="w-6 h-6 text-rose-400" />
                    )}
                    <h3 className="text-sm font-black text-white">{item.title}</h3>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{item.description}</p>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => openCheckout(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-between active:scale-95 transition shadow-md"
                >
                  <span className="uppercase tracking-wider">Purchase</span>
                  <span className="text-sm font-black text-white">${item.priceUsd.toFixed(2)}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="w-full p-4 bg-slate-950/80 backdrop-blur-md border-t border-cyan-500/20 text-center">
        <p className="text-[11px] text-slate-400">
          Purchases are processed through a sandbox verified payment gateway with instant email receipt.
        </p>
      </div>
    </div>
  );
};
