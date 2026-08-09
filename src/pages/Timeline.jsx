import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Trash2, Calendar, ArrowLeft } from 'lucide-react';

export default function Timeline() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTransactions(LocalDB.getTransactions().sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      LocalDB.deleteTransaction(id);
      loadData();
    }
  };

  // Group by Month-Year
  const monthGroups = {};
  transactions.forEach(tx => {
    const d = new Date(tx.date);
    const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!monthGroups[key]) monthGroups[key] = { txs: [], totalSpend: 0, totalIncome: 0 };
    monthGroups[key].txs.push(tx);
    if (tx.type === 'expense') monthGroups[key].totalSpend += tx.amount;
    if (tx.type === 'income') monthGroups[key].totalIncome += tx.amount;
  });

  const monthKeys = Object.keys(monthGroups);

  return (
    <div className="main-content">
      {selectedMonth ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <button onClick={() => setSelectedMonth(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <ArrowLeft size={24} />
            </button>
            <h1 style={{ margin: 0 }}>{selectedMonth}</h1>
          </div>
          
          <div className="glass-card" style={{ marginBottom: '20px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Income</p>
                <p style={{ margin: 0, fontWeight: '700', color: 'var(--success)' }}>+₹{monthGroups[selectedMonth].totalIncome.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Spend</p>
                <p style={{ margin: 0, fontWeight: '700', color: 'var(--danger)' }}>-₹{monthGroups[selectedMonth].totalSpend.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {monthGroups[selectedMonth].txs.map(tx => (
              <div key={tx.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>{tx.category}</p>
                  <p className="text-muted" style={{ margin: 0, fontSize: '12px', marginTop: '4px' }}>
                    {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                  {tx.note && <p className="text-muted" style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>{tx.note}</p>}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </p>
                  <button onClick={() => handleDelete(tx.id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '5px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1>Monthly List</h1>
          <p className="text-muted" style={{ marginBottom: '20px' }}>Select a month to view detailed transaction history.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {monthKeys.length > 0 ? monthKeys.map(month => (
              <button 
                key={month} 
                onClick={() => setSelectedMonth(month)}
                className="glass-card" 
                style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '10px', borderRadius: '12px' }}>
                    <Calendar size={20} color="var(--primary-color)" />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>{month}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Transactions</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{monthGroups[month].txs.length}</p>
                </div>
              </button>
            )) : (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <p className="text-muted">No history found.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
