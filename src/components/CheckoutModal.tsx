import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GameApiService } from '../services/api';
import { PurchaseReceipt } from '../types/game';
import {
  X,
  ShieldCheck,
  CreditCard,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { checkoutItem, closeCheckout, onPurchaseSuccess, profile, viewEmail } = useGame();
  const [customerName, setCustomerName] = useState(profile.name || 'Archon Player');
  const [customerEmail, setCustomerEmail] = useState(profile.email || 'archon@crystalquest.realm');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<PurchaseReceipt | null>(null);

  if (!checkoutItem) return null;

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    const result = await GameApiService.checkout(checkoutItem, customerName, customerEmail);

    if (result.success && result.receipt) {
      setCompletedReceipt(result.receipt);
      onPurchaseSuccess(result.receipt, result.inboxItem);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Secure Checkout Gateway
            </span>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!completedReceipt ? (
          <form onSubmit={handleConfirmPurchase} className="p-6 space-y-4">
            {/* Item Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Order Summary
              </span>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-black text-white">{checkoutItem.title}</h3>
                <span className="text-lg font-black text-amber-400">
                  ${checkoutItem.priceUsd.toFixed(2)} USD
                </span>
              </div>
              <p className="text-xs text-slate-400">{checkoutItem.description}</p>
            </div>

            {/* Inputs: Customer Name & Email */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Customer / Archon Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Your Name"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Receipt Delivery Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white focus:outline-none focus:border-cyan-400"
                    placeholder="receipt@example.com"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  A verified HTML invoice & order confirmation will be delivered to this address and your in-game inbox.
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Payment Channel (Sandbox Mode)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'card'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'apple_pay'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google_pay')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    paymentMethod === 'google_pay'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <span>G-Pay</span>
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 font-black text-slate-950 text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(16,185,129,0.4)] active:scale-95 transition"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Transaction...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Pay ${checkoutItem.priceUsd.toFixed(2)} USD</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Receipt Success Confirmation Screen */
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                Payment Verified
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">Order Fulfilled!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Order ID: <span className="font-mono text-cyan-300 font-bold">{completedReceipt.orderId}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Product:</span>
                <span className="font-bold text-white">{completedReceipt.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-emerald-400">${completedReceipt.amount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivered To:</span>
                <span className="text-slate-200">{completedReceipt.customerEmail}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Your items have been credited instantly to your vault. A copy of this receipt has been saved in your in-game Mail Inbox.
            </p>

            <button
              onClick={closeCheckout}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition active:scale-95"
            >
              Continue Playing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
