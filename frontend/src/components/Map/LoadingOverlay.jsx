import React from 'react';

export const LoadingOverlay = ({ isVisible, message = 'スポット情報を更新中...' }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2000,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '15px 20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #1976d2',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p style={{ margin: 0, color: '#333' }}>{message}</p>
    </div>
  );
};