import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ShieldCheck, GraduationCap, Building2, Coins, Target, History, ArrowLeft } from 'lucide-react';

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0 }}>Full User Guide</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px', padding: '25px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 15px 0', fontSize: '18px', color: 'var(--primary-color)' }}>
          <BookOpen size={20} /> Why Track Your Money?
        </h2>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          Tracking your income and expenses is the first step toward financial freedom. By knowing exactly where your money goes, you can identify unnecessary "leakages" in your spending, save more efficiently, and make smarter decisions for your future. Flux Finance brings everything you need into one smart, private space.
        </p>
      </div>

      <div className="glass-card" style={{ marginBottom: '20px', padding: '25px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>Features & Usage</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--primary-color)" /> Semi-Offline Privacy
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              Your financial data is stored locally on your device. We use Firebase only for secure authentication, meaning nobody else can read your transactions.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="var(--primary-color)" /> College Finance Module
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              If you are a student, this dedicated module helps you separate academic expenses (like books and exam fees) from your general cash flow.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#3B82F6" /> Office Finance Module
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              If you are a working professional, you can track salary, software subscriptions, and business travel separately to calculate your net office balance.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} color="var(--danger)" /> Leakage Tracker (Balance Analyzer)
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              Have a lump sum in your account and wonder where it went? Enter your starting balance, and the analyzer will automatically subtract your expenses and show you a visual breakdown of the "leakage".
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--success)" /> Past Transactions & Monthly List
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              Forgot to add an expense yesterday or last week? Use the "+ Past Transaction" button on the dashboard to log retroactively. Visit the Timeline to see a detailed, month-by-month history of your finances.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={18} color="#F59E0B" /> Digital Coin Vault
            </h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              A virtual piggy bank for your physical coins. Track how many ₹1, ₹2, ₹5, ₹10, and ₹20 coins you have saved in real life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
