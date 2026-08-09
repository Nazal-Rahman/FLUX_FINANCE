import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocalDB } from '../config/localStorage';
import { AlertTriangle, GraduationCap, Briefcase } from 'lucide-react';

export default function Onboarding() {
  const [age, setAge] = useState('');
  const [persona, setPersona] = useState('');
  const [warning, setWarning] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setWarning('');

    const parsedAge = parseInt(age, 10);
    if (!parsedAge || parsedAge < 15) {
      setWarning('You must be at least 15 years old to use this module.');
      return;
    }

    if (!persona) {
      setWarning('Please select whether you are a Student or a Working Professional.');
      return;
    }

    LocalDB.updateProfile({ age: parsedAge, persona });
    navigate('/');
  };

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', padding: '20px' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '20px' }}>Complete Your Profile</h2>
        <p className="text-muted" style={{ marginBottom: '25px', fontSize: '14px' }}>
          Please provide a few details so we can tailor the Flux Finance experience to your needs.
        </p>

        {warning && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.15)', 
            border: '1px solid var(--danger)', 
            color: 'var(--danger)', 
            padding: '12px', 
            borderRadius: '12px', 
            marginBottom: '20px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            textAlign: 'left',
            fontSize: '13px'
          }}>
            <AlertTriangle size={20} />
            <strong>Warning:</strong> {warning}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Your Age</label>
            <input 
              type="number" 
              placeholder="Enter your age (Min 15)" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '25px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div 
                onClick={() => setPersona('student')}
                style={{
                  border: `2px solid ${persona === 'student' ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  background: persona === 'student' ? 'rgba(57, 255, 20, 0.05)' : 'var(--input-bg)',
                  padding: '15px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <GraduationCap size={28} color={persona === 'student' ? 'var(--primary-color)' : 'var(--text-secondary)'} style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: persona === 'student' ? '600' : '400', color: persona === 'student' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Student</div>
              </div>

              <div 
                onClick={() => setPersona('working')}
                style={{
                  border: `2px solid ${persona === 'working' ? '#3B82F6' : 'var(--glass-border)'}`,
                  background: persona === 'working' ? 'rgba(59, 130, 246, 0.05)' : 'var(--input-bg)',
                  padding: '15px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Briefcase size={28} color={persona === 'working' ? '#3B82F6' : 'var(--text-secondary)'} style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '14px', fontWeight: persona === 'working' ? '600' : '400', color: persona === 'working' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>Working Pro</div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn">
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
