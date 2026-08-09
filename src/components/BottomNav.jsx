import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, BarChart2, Coins, Settings, Target } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={22} />, label: 'Home' },
    { to: '/timeline', icon: <History size={22} />, label: 'Timeline' },
    { to: '/reports', icon: <BarChart2 size={22} />, label: 'Reports' },
    { to: '/vault', icon: <Coins size={22} />, label: 'Vault' },
    { to: '/analyzer', icon: <Target size={22} />, label: 'Tracker' },
    { to: '/settings', icon: <Settings size={22} />, label: 'Settings' }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '600px',
      margin: '0 auto',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 10px 20px 10px',
      zIndex: 1000
    }}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
            transition: 'color 0.2s ease'
          })}
        >
          {item.icon}
          <span style={{ fontSize: '11px', marginTop: '4px', fontWeight: '500' }}>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
