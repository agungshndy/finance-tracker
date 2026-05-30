import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useFinanceStore } from '../store/useFinanceStore';

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
const fmtK = (v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-soft text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Charts() {
  const transactions = useFinanceStore(s => s.transactions);

  const monthly = (() => {
    const map = {};
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      if (!map[month]) map[month] = { month, income: 0, expense: 0 };
      if (t.type === 'income') map[month].income += t.amount;
      else map[month].expense += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  })();

  const byCategory = (() => {
    const map = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <h3 className="font-display font-bold text-slate-800 mb-4">Monthly Flow</h3>
        {monthly.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} barGap={4}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtK} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income"  name="Income"  fill="#22c55e" radius={[6,6,0,0]} />
              <Bar dataKey="expense" name="Expense" fill="#f87171" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <h3 className="font-display font-bold text-slate-800 mb-4">Spending by Category</h3>
        {byCategory.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No expenses yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40}>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
