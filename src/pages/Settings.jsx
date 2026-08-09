import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Code, Database, Info, Edit2, Save, BookOpen, AlertTriangle, Trash2 } from 'lucide-react';
import { LocalDB } from '../config/localStorage';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => LocalDB.getProfile() || { name: 'User', isDarkMode: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editAge, setEditAge] = useState(profile?.age || '');
  const [showFactoryReset, setShowFactoryReset] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFactoryReset = async () => {
    try {
      LocalDB.clearAll();
      await currentUser.delete();
    } catch (e) {
      console.error(e);
      // Even if user.delete() fails (e.g. requires recent login), we should still logout and clear DB.
    } finally {
      logout();
    }
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
          Flux Finance is designed with privacy and intelligence in mind. It includes powerful features like the Leakage Tracker, Monthly History, and separate modules tailored for Students and Working Professionals.
        </p>
        <button onClick={() => navigate('/guide')} className="btn" style={{ width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <BookOpen size={18} /> Read Full Guide & Usage
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code size={18} /> Theme Settings
        </h3>
        <button onClick={toggleTheme} className="btn-outline" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
          Toggle {profile?.isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

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

      <div className="glass-card" style={{ padding: '20px', marginBottom: '20px', borderColor: 'var(--danger)' }}>
        <h3 style={{ margin: 0, marginBottom: '15px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
          <AlertTriangle size={18} /> Danger Zone
        </h3>
        <p className="text-muted" style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>
          Factory Reset will permanently delete your account, all your transactions, and settings from this device and the database.
        </p>
        <button onClick={() => setShowFactoryReset(true)} className="btn" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--danger)', width: '100%', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Trash2 size={18} /> Factory Reset
        </button>
      </div>

      <button onClick={logout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <LogOut size={20} /> Log Out
      </button>

      {showFactoryReset && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--danger)' }}>
            <h2 style={{ margin: '0 0 15px 0', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={24} /> Warning!
            </h2>
            <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Are you absolutely sure you want to Factory Reset? 
              <br/><br/>
              This action <strong>CANNOT</strong> be undone. All your financial history, profile details, and account will be permanently deleted. You will need to create a new account to use the app again.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowFactoryReset(false)} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={handleFactoryReset} className="btn" style={{ flex: 1, background: 'var(--danger)', color: '#fff' }}>
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
