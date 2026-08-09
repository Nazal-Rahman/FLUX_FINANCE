import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Target, Info, ArrowRight } from 'lucide-react';

export default function Analyzer() {
  const [startingBalance, setStartingBalance] = useState(() => localStorage.getItem('flux_starting_balance') || '');
  const [transactions, setTransactions] = useState([]);
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('flux_analyzer_intro'));

  useEffect(() => {
    setTransactions(LocalDB.getTransactions());
  }, []);

  const handleBalanceChange = (val) => {
    setStartingBalance(val);
    localStorage.setItem('flux_starting_balance', val);
  };

  const handleSkipIntro = () => {
    localStorage.setItem('flux_analyzer_intro', 'true');
    setShowIntro(false);
  };

  const calculateLeakage = () => {
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const balance = parseFloat(startingBalance) || 0;
    const remaining = balance - totalExpenses;

    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catMap).sort((a,b) => b[1] - a[1]);

    return { totalExpenses, remaining, sortedCats };
  };

  const { totalExpenses, remaining, sortedCats } = calculateLeakage();
  const balanceVal = parseFloat(startingBalance) || 0;

  return (
    <div className="main-content">
      <h1>Leakage Tracker</h1>
      <p className="text-muted" style={{ marginBottom: '20px' }}>Understand where your money is going.</p>

      {showIntro && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--primary-color)' }}>
            <h2 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Target size={24} /> Balance Analyzer
            </h2>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
              When you have a specific amount of money (e.g. ₹10,000) and you want to track where it is being lost, use this tracker.
              <br/><br/>
              Simply enter your starting balance, and we will automatically subtract all your expenses and show you exactly where your money leaked away.
            </p>
            <button onClick={handleSkipIntro} className="btn" style={{ width: '100%' }}>
              Start Tracking
            </button>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-secondary)' }}>Enter Starting Balance (₹)</label>
        <input 
          type="number" 
          placeholder="e.g. 5000" 
          value={startingBalance} 
          onChange={(e) => handleBalanceChange(e.target.value)} 
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        />
      </div>

      {balanceVal > 0 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div className="glass-card" style={{ padding: '15px', borderColor: 'var(--danger)' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Total Leaked</p>
              <h2 style={{ margin: '5px 0 0 0', color: 'var(--danger)' }}>-₹{totalExpenses.toFixed(2)}</h2>
            </div>
            <div className="glass-card" style={{ padding: '15px', borderColor: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Remaining</p>
              <h2 style={{ margin: '5px 0 0 0', color: remaining >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                ₹{remaining.toFixed(2)}
              </h2>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Where did it go?</h3>
            {sortedCats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {sortedCats.map(([cat, amt]) => {
                  const percentage = ((amt / balanceVal) * 100).toFixed(1);
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{cat}</span>
                        <span style={{ fontSize: '14px', color: 'var(--danger)' }}>-₹{amt.toFixed(2)} ({percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(percentage, 100)}%`, background: 'var(--danger)', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>No expenses yet to show leakage.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
