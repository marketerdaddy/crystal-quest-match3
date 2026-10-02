import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { InboxMessage } from '../types/game';
import {
  ChevronLeft,
  Mail,
  MailOpen,
  Gift,
  CheckCircle2,
  X,
  FileText,
  Sparkles
} from 'lucide-react';

export const InboxModal: React.FC = () => {
  const { profile, setScreen, viewEmail, claimInboxGift } = useGame();
  const [activeMessage, setActiveMessage] = useState<InboxMessage | null>(null);

  const handleOpenMessage = (msg: InboxMessage) => {
    setActiveMessage(msg);
    viewEmail(msg);
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
            Aetherian Post
          </span>
          <h2 className="text-base font-black text-white">Mail & Receipts</h2>
        </div>

        <div className="w-9" />
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 space-y-3 max-w-md mx-auto w-full overflow-y-auto">
        {profile.inbox.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Mail className="w-12 h-12 mx-auto mb-2 opacity-40" />
            <p className="text-xs">Your inbox is completely clear.</p>
          </div>
        ) : (
          profile.inbox.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                !msg.read
                  ? 'bg-slate-800/95 border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-800/50 border-slate-700/80 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${!msg.read ? 'bg-cyan-950 text-cyan-300' : 'bg-slate-700 text-slate-400'}`}>
                  {!msg.read ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={`text-xs ${!msg.read ? 'font-black text-white' : 'font-bold text-slate-300'}`}>
                      {msg.title}
                    </h4>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{msg.preview}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{msg.date}</span>
                </div>
              </div>

              {msg.reward && !msg.claimed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    claimInboxGift(msg.id);
                  }}
                  className="py-1 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1 shadow-md active:scale-95 transition"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Claim</span>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* HTML Email Reader Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-white flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  From: {activeMessage.sender}
                </span>
                <h3 className="text-sm font-black text-white">{activeMessage.title}</h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1 rounded-xl bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email HTML Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
              <div
                dangerouslySetInnerHTML={{ __html: activeMessage.htmlContent }}
                className="prose prose-invert max-w-none text-xs"
              />

              {activeMessage.reward && !activeMessage.claimed && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-center">
                  <h4 className="text-xs font-bold text-amber-300 mb-2">Unclaimed Gift Attached</h4>
                  <button
                    onClick={() => {
                      claimInboxGift(activeMessage.id);
                      setActiveMessage(null);
                    }}
                    className="py-2 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider active:scale-95 transition"
                  >
                    Claim Attached Rewards
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 text-right">
              <button
                onClick={() => setActiveMessage(null)}
                className="py-1.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
