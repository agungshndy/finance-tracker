import React, { useState } from 'react';
import { useFinanceStore } from '../store/useFinanceStore';
import { autoTagTransaction } from '../lib/claude';

const CATEGORIES = ['Food & Drinks','Transport','Shopping','Entertainment','Health','Housing','Salary','Freelance','Investment','Education','Utilities','Other'];
const EMOJI_MAP  = { 'Food & Drinks':'🍱','Transport':'🚗','Shopping':'🛍','Entertainment':'🎬','Health':'💊','Housing':'🏠','Salary':'💼','Freelance':'🎨','Investment':'📊','Education':'📚','Utilities':'💡','Other':'💳' };

export default function TransactionForm() {
  const addTransaction = useFinanceStore(s => s.addTransaction);
  const [open, setOpen]       = useState(false);
  const [tagging, setTagging] = useState(false);
  const [tagged, setTagged]   = useState(null);
  const [form, setForm] = useState({ type: 'expense', amount: '', note: '', category: '', emoji: '', date: new Date().toISOString().slice(0,10) });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAutoTag = async () => {
    if (!form.note.trim() || !form.amount) return;
    setTagging(true);
    const result = await autoTagTransaction(form.note, form.amount, form.type);
    setTagged(result);
    setForm(f => ({ ...f, category: result.category, emoji: result.emoji }));
    setTagging(false);
  };

  const handleSubmit = () => {
    if (!form.amount || !form.note.trim() || !form.category) return;
    addTransaction({
      id: `t-${Date.now()}`,
      type: form.type,
      amount: parseFloat(form.amount),
      note: form.note,
      category: form.category,
      emoji: form.emoji || EMOJI_MAP[form.category] || '💳',
      date: form.date,
    });
    setForm({ type: 'expense', amount: '', note: '', category: '', emoji: '', date: new Date().toISOString().slice(0,10) });
    setTagged(null);
    setOpen(false);
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 placeholder:text-slate-400 transition-all";

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm py-3 rounded-2xl transition-colors shadow-soft flex items-center justify-center gap-2">
          <span className="text-lg">+</span> Add Transaction
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-slate-800">New Transaction</h3>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
          </div>

          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            {['expense','income'].map(t => (
              <button key={t} onClick={() => set('type', t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${form.type === t ? (t === 'income' ? 'bg-brand-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm') : 'text-slate-400 hover:text-slate-600'}`}
              >{t}</button>
            ))}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Amount (IDR)</label>
            <input type="number" className={inputCls} placeholder="e.g. 150000" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Note</label>
            <div className="flex gap-2">
              <input className={inputCls} placeholder="e.g. Lunch at warung" value={form.note} onChange={e => set('note', e.target.value)} />
              <button
                onClick={handleAutoTag}
                disabled={tagging || !form.note.trim() || !form.amount}
                className="flex-shrink-0 px-3 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                {tagging ? <span className="animate-spin inline-block">⟳</span> : '✨'} {tagging ? 'Tagging...' : 'AI Tag'}
              </button>
            </div>
          </div>

          {tagged && (
            <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2">
              <span className="text-lg">{tagged.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-violet-700">{tagged.category}</p>
                <p className="text-xs text-violet-400">Confidence: {tagged.confidence}</p>
              </div>
              <span className="ml-auto text-xs text-violet-400">AI tagged ✓</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Category {tagged ? '(override AI)' : ''}</label>
            <select className={inputCls} value={form.category} onChange={e => { set('category', e.target.value); set('emoji', EMOJI_MAP[e.target.value] || '💳'); }}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{EMOJI_MAP[c]} {c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Date</label>
            <input type="date" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.amount || !form.note.trim() || !form.category}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >Save Transaction</button>
        </div>
      )}
    </div>
  );
}
