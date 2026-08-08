import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, googleSignIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setError('');
    setLoading(true);
    try {
      await googleSignIn();
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Wallet size={64} color="#38BDF8" style={{ marginBottom: '10px' }} />
        <h1>Flux Finance</h1>
        <p className="text-muted">Manage your wealth offline-first</p>
      </div>

      <div className="glass-card">
        <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div className="text-danger" style={{ marginBottom: '15px', textAlign: 'center', fontSize: '14px', background: 'rgba(244,63,94,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button disabled={loading} className="btn" type="submit" style={{ marginTop: '10px' }}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '15px 0', color: 'var(--text-secondary)' }}>
          <span style={{ fontSize: '12px' }}>— OR —</span>
        </div>

        <button 
          disabled={loading} 
          className="btn" 
          onClick={handleGoogleSignIn} 
          style={{ 
            background: '#fff', 
            color: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px',
            marginBottom: '15px'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button className="btn-outline" style={{ border: 'none' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
