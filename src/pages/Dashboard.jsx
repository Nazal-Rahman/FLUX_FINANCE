import React, { useState, useEffect } from 'react';
import { LocalDB } from '../config/localStorage';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const profile = LocalDB.getProfile();
  const persona = profile?.persona || 'student';
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCollegeMode, setIsCollegeMode] = useState(false);
  const [isOfficeMode, setIsOfficeMode] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 10));
  const [isPastTx, setIsPastTx] = useState(false);
  const [showGraphIntro, setShowGraphIntro] = useState(() => !localStorage.getItem('flux_graph_intro_seen'));
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const greetings = [
    "Have a great day!",
    "Make today amazing!",
    "Wishing you a productive day!",
    "Here's to a successful day!",
    "Have a wonderful day ahead!",
    "Let's achieve your goals today!",
    "Hope you have a fantastic day!"
  ];

  const handleSkipGraphIntro = () => {
    localStorage.setItem('flux_graph_intro_seen', 'true');
    setShowGraphIntro(false);
  };

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
    
    // Welcome Greeting Logic
    const today = new Date().toISOString().substring(0, 10);
    const lastGreetingDate = localStorage.getItem('flux_last_greeting_date');
    if (lastGreetingDate !== today) {
      // Use the day of the week to pick a greeting, or just random
      const dayIndex = new Date().getDay(); // 0 to 6
      setWelcomeMessage(`Hello ${profile?.name || 'User'},\n${greetings[dayIndex]}`);
      setShowWelcome(true);
      localStorage.setItem('flux_last_greeting_date', today);
    }
  }, []);

  const loadData = () => {
    const txs = LocalDB.getTransactions();
    setTransactions(txs);
    const total = txs.reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
    setBalance(total);
  };

  const collegeCategories = ['Books', 'Lab Materials', 'Exam Fees', 'Project Expenses', 'Other'];
  const collegeTotal = transactions
    .filter(tx => (tx.type === 'expense' && collegeCategories.includes(tx.category)) || tx.module === 'college')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const officeCategories = ['Office Income', 'Office Expense', 'Software/Tools', 'Business Travel', 'Other'];
  const officeTotal = transactions
    .filter(tx => officeCategories.includes(tx.category) || tx.module === 'office')
    .reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!amount) return;
    
    let finalCategory = category;
    if (category === 'Other' && customCategory.trim()) {
      finalCategory = customCategory.trim();
    }
    
    const module = isCollegeMode ? 'college' : isOfficeMode ? 'office' : 'general';
    
    // Check if a past transaction is valid
    let finalDate = new Date().toISOString();
    if (isPastTx && selectedDate) {
      const parsedDate = new Date(selectedDate);
      if (parsedDate > new Date()) {
        alert("Future dates are not allowed for past transactions.");
        return;
      }
      finalDate = parsedDate.toISOString();
    }

    const txs = LocalDB.getTransactions();
    txs.push({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      amount: parseFloat(amount),
      type,
      category: finalCategory,
      note,
      module,
      date: finalDate
    });
    localStorage.setItem('flux_transactions', JSON.stringify(txs));

    setShowAddModal(false);
    setIsCollegeMode(false);
    setIsOfficeMode(false);
    setIsPastTx(false);
    setAmount('');
    setNote('');
    setCustomCategory('');
    loadData();
  };

  const openNormalAdd = () => {
    setIsCollegeMode(false);
    setIsOfficeMode(false);
    setIsPastTx(false);
    setType('expense');
    setCategory('Food');
    setShowAddModal(true);
  };

  const openPastTxAdd = () => {
    setIsCollegeMode(false);
    setIsOfficeMode(false);
    setIsPastTx(true);
    setType('expense');
    setCategory('Food');
    setShowAddModal(true);
  };

  const openCollegeAdd = () => {
    setIsCollegeMode(true);
    setIsOfficeMode(false);
    setIsPastTx(false);
    setType('expense');
    setCategory('Books');
    setShowAddModal(true);
  };

  const openOfficeAdd = () => {
    setIsCollegeMode(false);
    setIsOfficeMode(true);
    setIsPastTx(false);
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

      {persona === 'student' && (
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
      )}

      {persona === 'working' && (
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
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Recent Transactions</h2>
        <button className="btn-outline" onClick={openPastTxAdd} style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '8px' }}>
          + Past Transaction
        </button>
      </div>
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
            <h2>
              {isPastTx ? 'Add Past Transaction' : isCollegeMode ? 'Add College Expense' : isOfficeMode ? 'Add Office Transaction' : 'Add Transaction'}
            </h2>
            <form onSubmit={handleAddTransaction}>
              {!isCollegeMode && (
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <button type="button" className={`btn ${type === 'expense' ? '' : 'btn-outline'}`} onClick={() => setType('expense')}>Expense</button>
                  <button type="button" className={`btn ${type === 'income' ? '' : 'btn-outline'}`} onClick={() => { setType('income'); setCategory('Salary'); }} style={{ background: type === 'income' ? 'var(--success)' : 'transparent', borderColor: 'var(--success)', color: type==='income'?'#fff':'var(--success)' }}>Income</button>
                </div>
              )}
              {isPastTx && (
                <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} required max={new Date().toISOString().substring(0, 10)} />
              )}
              <input type="number" placeholder="Amount (₹)" value={amount} onChange={e=>setAmount(e.target.value)} required min="1" step="0.01" />
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                {(type === 'income' ? ['Salary', 'Other'] : isCollegeMode ? collegeCategories : isOfficeMode ? officeCategories : categories).map(c => <option key={c} value={c} style={{ color: '#000' }}>{c}</option>)}
              </select>
              {category === 'Other' && (
                <input type="text" placeholder="Enter custom category" value={customCategory} onChange={e=>setCustomCategory(e.target.value)} required />
              )}
              <input type="text" placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--text-secondary)', color: 'var(--text-secondary)' }} onClick={() => { setShowAddModal(false); setIsCollegeMode(false); setIsOfficeMode(false); setIsPastTx(false); }}>Cancel</button>
                <button type="submit" className="btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showGraphIntro && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--primary-color)' }}>
            <h2 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)', textAlign: 'center' }}>Understanding Your Graphs</h2>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
              Flux Finance uses intelligent visual graphs to help you understand your spending at a glance:
            </p>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              <li style={{ marginBottom: '8px' }}><strong>Cash Flow Pie Chart (Here):</strong> Shows the simple ratio between your total Income and total Expenses.</li>
              <li style={{ marginBottom: '8px' }}><strong>Expense Breakdown Ring Chart (Reports Tab):</strong> Maps all your all-time expenses color-coded by specific categories so you know exactly where your money goes.</li>
              <li style={{ marginBottom: '8px' }}><strong>Weekly Bar Chart (Reports Tab):</strong> Compares your Income vs Expense visually across recent weeks.</li>
            </ul>
            <button onClick={handleSkipGraphIntro} className="btn" style={{ width: '100%' }}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {showWelcome && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '350px', width: '100%', border: '1px solid var(--primary-color)', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
              {welcomeMessage}
            </h2>
            <button onClick={() => setShowWelcome(false)} className="btn" style={{ width: '100%' }}>
              Thank you!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
