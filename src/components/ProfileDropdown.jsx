import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Avatar } from './Avatar';


export const ProfileDropdown = () => {
  const { currentUser, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    // Добавляем слушатель только если меню открыто
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    void navigate('/login');
  };

  const handleSettingsClick = () => {
    void navigate('/settings');
    setIsOpen(false);
  }
  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          padding: 0,
          borderRadius: '50%',
          boxShadow: isOpen ? '0 0 0 2px #0079bf' : 'none'
        }}
      >
        <Avatar user={currentUser} size={40} />
      </button>

      {/* Само выпадающее меню */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '50px',
          right: 0,
          backgroundColor: 'var(--bg)',
          border: 'var(--border)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: '220px',
          padding: '10px 0',
          zIndex: 1000
        }}>
          {/* Шапка профиля */}
          <div style={{ padding: '0 15px 10px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
            <strong style={{ display: 'block', fontSize: '14px' }}>{currentUser.name}</strong>
            <span style={{ fontSize: '12px', color: 'gray' }}>
              {currentUser.role === 'lead' ? 'Teamlead' : 'Member'}
            </span>
          </div>

          {/* Кнопки меню */}
          <button 
            onClick={handleSettingsClick}
            style={{ 
              width: '100%', textAlign: 'left', padding: '10px 15px', 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' 
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#39404b'}
            onFocus={(e) => e.target.style.backgroundColor = '#39404b'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Налаштування
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ 
              width: '100%', textAlign: 'left', padding: '10px 15px', 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#d32f2f' 
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#4d2128'}
            onFocus={(e) => e.target.style.backgroundColor = '#4d2128'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Вийти з акаунту
          </button>
        </div>
      )}
    </div>
  );
};