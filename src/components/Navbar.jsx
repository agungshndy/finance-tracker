import React from 'react';

export default function Navbar() {
  return (
    <nav className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50 shadow-card">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white text-sm">💰</div>
        <span className="font-display font-extrabold text-lg tracking-tight text-slate-800">CoinSight</span>
        <span className="text-xs font-semibold bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">AI-Powered</span>
      </div>
      <p className="text-sm text-slate-400 hidden md:block">Track smarter, spend wiser.</p>
    </nav>
  );
}
