import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ShieldCheck, GraduationCap, Building2, Coins, ArrowRight } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    localStorage.setItem('flux_intro_seen', 'true');
    navigate('/login');
  };

  return (
    <div className="main-content" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 1s ease-in' }}>
        <div style={{ padding: '20px', borderRadius: '50%', display: 'inline-block', marginBottom: '15px' }}>
          <img src="/logo.png" alt="Flux Finance Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
        </div>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0', fontWeight: '800', color: 'var(--text-primary)' }}>Welcome to Flux Finance</h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 15px 0', lineHeight: '1.6' }}>
          Your personal space to understand, manage, and grow your money — <br/>
          built with privacy, simplicity, and smart insights at its core.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
          Whether you're a student, a professional, or building a business,<br/>
          Flux Finance helps you stay in control of every rupee — effortlessly.
        </p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', marginBottom: '30px', padding: '25px 20px' }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: 'var(--text-primary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Everything You Need, In One Place</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <ShieldCheck size={24} color="#34D399" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', color: 'var(--text-primary)' }}>Semi-Offline Privacy</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Your data stays where it belongs — on your device.<br/>No unnecessary syncing, no compromises.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <GraduationCap size={24} color="#34D399" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', color: 'var(--text-primary)' }}>College Mode</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Track daily expenses, manage budgets, and build better money habits<br/>— designed specifically for student life.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <Building2 size={24} color="#34D399" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', color: 'var(--text-primary)' }}>Office Mode</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Stay on top of your business finances with structured tracking<br/>for income, expenses, and growth.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '10px', borderRadius: '12px' }}>
              <Coins size={24} color="#34D399" />
            </div>
            <div>
              <h4 style={{ margin: '0 0 3px 0', fontSize: '14px', color: 'var(--text-primary)' }}>Digital Coin Vault</h4>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Turn your small savings into something meaningful.<br/>A smart way to track and grow your physical coin collections.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(52, 211, 153, 0.05)', padding: '15px', borderRadius: '12px', marginBottom: '30px', border: '1px dashed rgba(52, 211, 153, 0.3)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#34D399' }}>
          <strong>💡 Pro Tip:</strong> Add Flux Finance to your home screen for a faster, app-like experience — no installation needed.
        </p>
      </div>

      <button onClick={handleGetStarted} className="btn" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        padding: '16px', 
        fontSize: '16px', 
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}>
        Start Managing Smarter <ArrowRight size={20} />
      </button>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
        🔒 100% Private • No Ads • Built for You
      </div>

    </div>
  );
}
