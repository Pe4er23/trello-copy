import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Avatar } from './Avatar';

export const ProfileCard = ( task ) => {
  const { users } = useApp();
  const user = users.find(u => u.id === task.userId);
  const cardWidth = 220;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

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
        <Avatar user={user} size={20} />
      </button>

      {/* Само выпадающее меню */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          // ...calculateCardPosition(),
          top: '30px',
          right: '-30px',
          backgroundColor: 'var(--bg)',
          border: 'var(--border)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          width: `${cardWidth}px`,
          padding: '10px 0',
          zIndex: 1000
        }}>
          {/* Шапка профиля */}
          <div style={{ padding: '0 15px', marginBottom: '5px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div>
                <Avatar user={user} />
            </div>
            <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>{user.name}</strong>
                <span style={{ fontSize: '12px', color: 'gray' }}>
                {user.role === 'lead' ? 'Teamlead' : 'Member'}
            </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};