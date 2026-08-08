import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCollegeMode, setIsCollegeMode] = useState(false);
  const [isOfficeMode, setIsOfficeMode] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');

  const categories = [
    'Food', 
    'Transport', 
    'Books', 
    'Lab Materials', 
    'Exam Fees', 
    'Project Expenses', 
    'Entertainment', 
    'Bills',
    'Office Income',
    'Office Expense',
    'Software/Tools',
    'Business Travel',
    'Other'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const txs = LocalDB.getTransactions();
    setTransactions(txs);
    const total = txs.reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
    setBalance(total);
  };

  const collegeCategories = ['Books', 'Lab Materials', 'Exam Fees', 'Project Expenses'];
  const collegeTotal = transactions
    .filter(tx => tx.type === 'expense' && collegeCategories.includes(tx.category))
    .reduce((acc, tx) => acc + tx.amount, 0);

  const officeCategories = ['Office Income', 'Office Expense', 'Software/Tools', 'Business Travel'];
  const officeTotal = transactions
    .filter(tx => officeCategories.includes(tx.category))
    .reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!amount) return;
    LocalDB.addTransaction(amount, type, category, note);
    setShowAddModal(false);
    setIsCollegeMode(false);
    setIsOfficeMode(false);
    setAmount('');
    setNote('');
    loadData();
  };

  const openNormalAdd = () => {
    setIsCollegeMode(false);
    setIsOfficeMode(false);
    setType('expense');
    setCategory('Food');
    setShowAddModal(true);
  };

  const openCollegeAdd = () => {
    setIsCollegeMode(true);
    setIsOfficeMode(false);
    setType('expense');
    setCategory('Books');
    setShowAddModal(true);
  };

  const openOfficeAdd = () => {
    setIsCollegeMode(false);
    setIsOfficeMode(true);
    setType('expense');
    setCategory('Office Expense');
    setShowAddModal(true);
  };

  const chartData = [
    { name: 'Income', value: transactions.filter(t => t.type === 'income').reduce((a,b)=>a+b.amount,0) },
    { name: 'Expense', value: transactions.filter(t => t.type === 'expense').reduce((a,b)=>a+b.amount,0) }
  ];
  const COLORS = ['#34D399', '#F43F5E'];

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Total Balance</p>
          <h1 style={{ margin: 0, fontSize: '32px' }}>₹{balance.toFixed(2)}</h1>
        </div>
        <button className="btn" style={{ width: 'auto', borderRadius: '50%', width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={openNormalAdd}>
          <Plus size={24} />
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px', height: '200px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>Cash Flow</h3>
        {(chartData[0].value === 0 && chartData[1].value === 0) ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="text-muted">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="glass-card" style={{ marginBottom: '20px', background: 'var(--glass-bg)', borderColor: 'var(--primary-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--primary-color)' }}>🎓 College Finance Module</h3>
          <button onClick={openCollegeAdd} style={{ background: 'var(--primary-color)', color: '#000', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={18} />
          </button>
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px', marginBottom: '10px' }}>Total Academic Expenses</p>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--danger)' }}>-₹{collegeTotal.toFixed(2)}</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px', background: 'var(--glass-bg)', borderColor: '#3B82F6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#3B82F6' }}>🏢 Office Finance Module</h3>
          <button onClick={openOfficeAdd} style={{ background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={18} />
          </button>
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px', marginBottom: '10px' }}>Net Office Balance</p>
        <h1 style={{ margin: 0, fontSize: '28px', color: officeTotal >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          {officeTotal >= 0 ? '+' : '-'}₹{Math.abs(officeTotal).toFixed(2)}
        </h1>
      </div>

      <h2 style={{ fontSize: '18px' }}>Recent Transactions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {transactions.slice().reverse().slice(0, 5).map(tx => (
          <div key={tx.id} className="glass-card" style={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: tx.type === 'income' ? 'rgba(52,211,153,0.1)' : 'rgba(244,63,94,0.1)' }}>
                {tx.type === 'income' ? <ArrowUpRight color="#34D399" /> : <ArrowDownRight color="#F43F5E" />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '600' }}>{tx.category}</p>
                <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>{new Date(tx.date).toLocaleDateString()}</p>
              </div>
            </div>
            <p style={{ margin: 0, fontWeight: '700', color: tx.type === 'income' ? '#34D399' : '#F43F5E' }}>
              {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
            </p>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-muted" style={{ textAlign: 'center', marginTop: '20px' }}>No transactions yet.</p>}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '400px' }}>
            <h2>{isCollegeMode ? 'Add College Expense' : isOfficeMode ? 'Add Office Transaction' : 'Add Transaction'}</h2>
            <form onSubmit={handleAddTransaction}>
              {!isCollegeMode && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button type="button" className={`btn ${type === 'expense' ? '' : 'btn-outline'}`} onClick={() => setType('expense')}>Expense</button>
                  <button type="button" className={`btn ${type === 'income' ? '' : 'btn-outline'}`} onClick={() => setType('income')} style={{ background: type === 'income' ? 'var(--success)' : 'transparent', borderColor: 'var(--success)', color: type==='income'?'#fff':'var(--success)' }}>Income</button>
                </div>
              )}
              <input type="number" placeholder="Amount (₹)" value={amount} onChange={e=>setAmount(e.target.value)} required min="1" step="0.01" />
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                {(isCollegeMode ? collegeCategories : isOfficeMode ? officeCategories : categories).map(c => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
              </select>
              <input type="text" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)' }} onClick={() => { setShowAddModal(false); setIsCollegeMode(false); setIsOfficeMode(false); }}>Cancel</button>
                <button type="submit" className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
