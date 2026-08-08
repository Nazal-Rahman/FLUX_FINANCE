import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Trash2 } from 'lucide-react';

export default function Timeline() {
  const [transactions, setTransactions] = useState([]);

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

  return (
    <div className="main-content">
      <h1>Timeline</h1>
      <p className="text-muted" style={{ marginBottom: '20px' }}>All your daily history</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {transactions.map(tx => (
          <div key={tx.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '16px' }}>{tx.category}</p>
              <p className="text-muted" style={{ margin: 0, fontSize: '12px', marginTop: '4px' }}>
                {new Date(tx.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              {tx.note && <p className="text-muted" style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>{tx.note}</p>}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: tx.type === 'income' ? '#34D399' : '#F43F5E' }}>
                {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
              </p>
              <button onClick={() => handleDelete(tx.id)} style={{ background: 'transparent', border: 'none', color: '#F43F5E', cursor: 'pointer', padding: '5px' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {transactions.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p className="text-muted">No history found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
