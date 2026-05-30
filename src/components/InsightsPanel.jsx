import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { generateInsights } from '../lib/claude';

const TYPE_CONFIG = {
  warning:  { bg: 'bg-amber-50',  border: 'border-amber-200',  icon: '⚠️', title: 'text-amber-700',  body: 'text-amber-600'  },
  tip:      { bg: 'bg-blue-50',   border: 'border-blue-200',   icon: '💡', title: 'text-blue-700',   body: 'text-blue-600'   },
  positive: { bg: 'bg-brand-50',  border: 'border-brand-200',  icon: '✅', title: 'text-brand-700',  body: 'text-brand-600'  },
};

export default function InsightsPanel() {
  const { transactions, getBalance } = useFinanceStore();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleGenerate = async () => {
    setLoading(true); setError(''); setInsights(null);
    const result = await generateInsights(transactions, getBalance());
    if (!result) setError('Not enough data or something went wrong. Add more transactions and try again.');
    else setInsights(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-base">🧠</div>
          <div>
            <h3 className="font-display font-bold text-slate-800 leading-none">AI Insights</h3>
            <p className="text-xs text-slate-400 mt-0.5">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || transactions.length < 2}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
        >
          {loading ? <><span className="animate-spin inline-block">⟳</span> Analyzing...</> : <><span>✨</span> Analyze My Spending</>}
        </button>
      </div>

      {!insights && !loading && !error && (
        <div className="border-2 border-dashed border-slate-200 rounded-xl py-8 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm font-semibold text-slate-500">No insights yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "Analyze My Spending" to get personalized AI insights.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-slate-100 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-4/5 mt-1" />
            </div>
          ))}
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>}

      {insights && (
        <div className="flex flex-col gap-3">
          {insights.map((ins, i) => {
            const cfg = TYPE_CONFIG[ins.type] || TYPE_CONFIG.tip;
            return (
              <div key={i} className={`${cfg.bg} ${cfg.border} border rounded-xl p-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base leading-none">{cfg.icon}</span>
                  <p className={`text-sm font-bold ${cfg.title}`}>{ins.title}</p>
                </div>
                <p className={`text-xs leading-relaxed ${cfg.body}`}>{ins.body}</p>
              </div>
            );
          })}
          <p className="text-xs text-slate-400 text-center mt-1">Analysis based on your {transactions.length} transactions.</p>
        </div>
      )}
    </div>
  );
}
