import React from 'react';
import Navbar from './components/Navbar';
import BalanceCard from './components/BalanceCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Charts from './components/Charts';
import InsightsPanel from './components/InsightsPanel';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-5">
        <BalanceCard />
        <Charts />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <TransactionForm />
            <TransactionList />
          </div>
          <div className="lg:col-span-1">
            <InsightsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
