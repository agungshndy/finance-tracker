import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function TransactionList() {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [filter, setFilter] = useState('all');
  const filtered = transactions.filter(t => filter === 'all' ? true : t.type === filter);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="font-display font-bold text-slate-800">Transactions</h3>
        <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {['all','income','expense'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${filter === f ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >{f}</button>
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-50 max-h-[420px] overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No transactions yet.</div>
        ) : filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 group transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">{t.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{t.note}</p>
              <p className="text-xs text-slate-400">{t.category} · {t.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${t.type === 'income' ? 'text-brand-600' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
              </span>
              <button onClick={() => deleteTransaction(t.id)} className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-base leading-none">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
