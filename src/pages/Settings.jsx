import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Code, Database, Info, Edit2, Save } from 'lucide-react';
import { LocalDB } from '../config/localStorage';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState(() => LocalDB.getProfile() || { name: 'User', isDarkMode: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editAge, setEditAge] = useState(profile?.age || '');
  const fileInputRef = useRef(null);

  const [isInstalled, setIsInstalled] = useState(() => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  });

  useEffect(() => {
    const handleAppInstalled = () => setIsInstalled(true);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => window.removeEventListener('appinstalled', handleAppInstalled);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        LocalDB.updateProfile({ profilePic: reader.result });
        setProfile(LocalDB.getProfile());
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !(profile?.isDarkMode);
    LocalDB.updateProfile({ isDarkMode: newDarkMode });
    setProfile(LocalDB.getProfile() || { name: 'User', isDarkMode: newDarkMode });
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const saveProfile = () => {
    LocalDB.updateProfile({ name: editName, age: editAge });
    setProfile(LocalDB.getProfile());
    setIsEditing(false);
  };

  const startYear = profile?.appStartDate ? new Date(profile.appStartDate).getFullYear() : new Date().getFullYear();

  return (
    <div className="main-content">
      <h1>Settings</h1>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
              {profile?.profilePic ? (
                <img src={profile.profilePic} alt="Profile" style={{ width: '50px', height: '50px', borderRadius: '25px', objectFit: 'cover' }} />
              ) : (
                <div style={{ background: 'var(--primary-color)', width: '50px', height: '50px', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={24} color="#000" />
                </div>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
            <div>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" style={{ padding: '5px', margin: 0 }} />
                  <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} placeholder="Age" style={{ padding: '5px', margin: 0 }} />
                </div>
              ) : (
                <>
                  <h2 style={{ margin: 0, fontSize: '18px' }}>{profile?.name || 'User'} {profile?.age ? `(${profile.age})` : ''}</h2>
                  <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>{currentUser?.email}</p>
                </>
              )}
            </div>
          </div>
          {isEditing ? (
            <button onClick={saveProfile} style={{ background: 'transparent', border: 'none', color: 'var(--success)', cursor: 'pointer' }}><Save size={20} /></button>
          ) : (
            <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit2 size={20} /></button>
          )}
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: '12px', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
          App Using Starting Year: <strong>{startYear}</strong>
        </p>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={18} /> Feature Guide & Uses
        </h3>
        <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', marginBottom: '15px' }}>
          Flux Finance is designed with privacy and intelligence in mind. Here is how everything works:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>📱 Native Web App Experience</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              For the best experience, open your browser menu and tap <strong>"Add to Home Screen"</strong>. This web application will then behave exactly like a native app on your phone!
            </p>
          </div>

          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>🔒 Semi-Offline Privacy</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              We use Firebase only for logging you in securely. All your financial data is saved directly on your phone's local storage and is never uploaded to the internet.
            </p>
          </div>

          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>🎓 College Finance Module</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              A dedicated section to track academic expenses (Books, Lab Materials, Exam Fees). It keeps your college expenses completely separate from your general cash flow so you know exactly how much your education costs.
            </p>
          </div>

          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>🏢 Office Finance Module</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              Designed for working professionals. Track your salary/income, business travel, and software subscriptions separately. It calculates your net office balance automatically.
            </p>
          </div>

          <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>🪙 Coin Vault</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              A digital piggy bank! Track the physical ₹1, ₹2, ₹5, ₹10, and ₹20 coins you save in real life. It calculates your total physical coin savings instantly.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--text-primary)' }}>📊 Intelligent Weekly Reports & Graphs</h4>
            <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5' }}>
              The app automatically calculates your past week's spending every Sunday. Even if you forget to open the app on Sunday, it will smartly generate the report the next time you open it.
              <br/><br/>
              <strong>• Cash Flow Pie Chart (Home):</strong> Shows the simple ratio between your total Income and total Expenses at a glance.
              <br/>
              <strong>• Expense Breakdown Ring Chart (Reports):</strong> Maps all your all-time expenses color-coded by specific categories so you know exactly where your money goes.
              <br/>
              <strong>• Weekly Bar Chart (Reports):</strong> Compares your Income vs Expense visually across recent weeks.
            </p>
          </div>
          
        </div>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} /> Theme Settings
        </h3>
        <button onClick={toggleTheme} className="btn-outline" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
          Toggle {profile?.isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {!isInstalled && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} /> App Installation
          </h3>
          <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>
            Missed the prompt? Install this web application directly to your device for the native PWA experience.
          </p>
          <button 
            onClick={async () => {
              if (window.deferredPrompt) {
                window.deferredPrompt.prompt();
                const { outcome } = await window.deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                  window.deferredPrompt = null;
                  setIsInstalled(true);
                }
              } else {
                alert("Your browser doesn't support direct installation or the app is already installed! (Try 'Add to Home screen' from your browser menu)");
              }
            }} 
            className="btn" 
            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
          >
            Install Web Application
          </button>
        </div>
      )}

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} /> About Developer
        </h3>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
          Developed by <strong>NAZAL RAHMAN</strong><br/>
          <span style={{ fontSize: '12px' }}>(fluxifydev)</span><br/>
          <span style={{ display: 'inline-block', marginTop: '10px', lineHeight: '1.8' }}>
            Got suggestions? WhatsApp me: <a href="https://wa.me/919207842646" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>9207842646</a>
            <br/>
            or DM me: <a href="https://instagram.com/nazzalll___" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>@nazzalll___</a>
          </span>
        </p>
      </div>

      <button onClick={logout} className="btn" style={{ background: 'rgba(244,63,94,0.1)', color: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <LogOut size={20} /> Log Out
      </button>
    </div>
  );
}
