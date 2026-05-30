import { create } from 'zustand';

const SEED = [
  { id: 't-1', type: 'income',  amount: 8500000, note: 'Monthly salary',        category: 'Salary',        emoji: '💼', date: '2026-05-01' },
  { id: 't-2', type: 'expense', amount: 450000,  note: 'Grocery at Indomaret',   category: 'Food & Drinks', emoji: '🛒', date: '2026-05-03' },
  { id: 't-3', type: 'expense', amount: 150000,  note: 'Grab to the office',     category: 'Transport',     emoji: '🚗', date: '2026-05-05' },
  { id: 't-4', type: 'expense', amount: 320000,  note: 'Netflix & Spotify',      category: 'Entertainment', emoji: '🎬', date: '2026-05-07' },
  { id: 't-5', type: 'income',  amount: 1200000, note: 'Freelance logo design',  category: 'Freelance',     emoji: '🎨', date: '2026-05-10' },
  { id: 't-6', type: 'expense', amount: 780000,  note: 'Electricity & internet', category: 'Utilities',     emoji: '💡', date: '2026-05-12' },
  { id: 't-7', type: 'expense', amount: 250000,  note: 'Lunch with team',        category: 'Food & Drinks', emoji: '🍱', date: '2026-05-15' },
  { id: 't-8', type: 'expense', amount: 1200000, note: 'New sneakers',           category: 'Shopping',      emoji: '👟', date: '2026-05-18' },
];

const load = () => { try { const r = localStorage.getItem('finance_data_vite'); return r ? JSON.parse(r) : { transactions: SEED }; } catch { return { transactions: SEED }; } };
const save = (s) => localStorage.setItem('finance_data_vite', JSON.stringify({ transactions: s.transactions }));

export const useFinanceStore = create((set, get) => ({
  ...load(),

  addTransaction: (tx) => set(s => {
    const n = { ...s, transactions: [tx, ...s.transactions] };
    save(n); return n;
  }),

  deleteTransaction: (id) => set(s => {
    const n = { ...s, transactions: s.transactions.filter(t => t.id !== id) };
    save(n); return n;
  }),


}));
