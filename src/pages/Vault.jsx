import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Plus, Minus, Coins } from 'lucide-react';

export default function Vault() {
  const [vault, setVault] = useState({});

  useEffect(() => {
    setVault(LocalDB.getVault());
  }, []);

  const handleUpdate = (denom, delta) => {
    LocalDB.updateVault(denom, delta);
    setVault(LocalDB.getVault());
  };

  const denominations = [
    { value: '1', label: '₹1 Coin' },
    { value: '2', label: '₹2 Coin' },
    { value: '5', label: '₹5 Coin' },
    { value: '10', label: '₹10 Coin' },
    { value: '20', label: '₹20 Coin' }
  ];

  const totalValue = Object.keys(vault).reduce((acc, key) => acc + (parseInt(key) * vault[key]), 0);

  return (
    <div className="main-content">
      <h1>Coin Vault</h1>
      
      <div className="glass-card" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Total Saved Coins</p>
        <h1 style={{ margin: '10px 0', fontSize: '36px', color: 'var(--primary-color)' }}>₹{totalValue}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {denominations.map(d => (
          <div key={d.value} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <Coins size={32} color="var(--primary-color)" style={{ marginBottom: '10px' }} />
            <h3 style={{ margin: 0 }}>{d.label}</h3>
            <h2 style={{ margin: '10px 0', fontSize: '28px' }}>{vault[d.value] || 0}</h2>
            
            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
              <button onClick={() => handleUpdate(d.value, -1)} className="btn btn-outline" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Minus size={18} />
              </button>
              <button onClick={() => handleUpdate(d.value, 1)} className="btn" style={{ padding: '8px', flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Plus size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
