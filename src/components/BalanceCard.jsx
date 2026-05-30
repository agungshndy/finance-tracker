import React from 'react';
import { useFinanceStore } from '../store/useFinanceStore';

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function BalanceCard() {
  const balance = useFinanceStore(s => s.getBalance());
  const income  = useFinanceStore(s => s.getTotalIncome());
  const expense = useFinanceStore(s => s.getTotalExpense());
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-6 text-white shadow-soft relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-white/10 rounded-full" />
        <p className="text-brand-100 text-sm font-medium mb-1 relative">Total Balance</p>
        <p className="font-display font-extrabold text-3xl relative leading-tight">{fmt(balance)}</p>
        <div className="mt-4 flex items-center gap-2 relative">
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
            {savingsRate >= 0 ? `💪 ${savingsRate}% savings rate` : `⚠️ Overspending`}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500 font-medium">Total Income</p>
          <span className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center text-lg">📈</span>
        </div>
        <p className="font-display font-bold text-2xl text-slate-800">{fmt(income)}</p>
        <div className="mt-3 h-1.5 bg-brand-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full" style={{ width: income > 0 ? '100%' : '0%' }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
          <span className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center text-lg">📉</span>
        </div>
        <p className="font-display font-bold text-2xl text-slate-800">{fmt(expense)}</p>
        <div className="mt-3 h-1.5 bg-red-100 rounded-full overflow-hidden">
          <div className="h-full bg-red-400 rounded-full" style={{ width: income > 0 ? `${Math.min((expense / income) * 100, 100)}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}
