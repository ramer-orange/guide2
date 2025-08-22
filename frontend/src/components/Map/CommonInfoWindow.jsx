import React from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';

export const CommonInfoWindow = ({
  position,
  onClose,
  title,
  address,
  rating,
  placeId,
  onAddToPlan,
  children, // 追加コンテンツ用（dayNumber表示など）
}) => {
  return (
    <InfoWindow
      position={position}
      onCloseClick={onClose}
    >
      <div style={{ padding: '12px', minWidth: '250px', maxWidth: '300px' }}>
        <h3 style={{ 
          margin: '0 0 10px 0', 
          fontSize: '16px', 
          fontWeight: 'bold', 
        }}>
          {title}
        </h3>
        
        {address && (
          <p style={{ 
            margin: '0 0 8px 0', 
            color: '#666', 
            fontSize: '14px' 
          }}>
            {address}
          </p>
        )}
        
        {rating && (
          <div style={{ 
            margin: '0 0 8px 0', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <span style={{ color: '#fbbc04', marginRight: '4px' }}>⭐</span>
            <span style={{ fontWeight: 'bold' }}>{rating}</span>
            <span style={{ color: '#666' }}>/5</span>
          </div>
        )}
        
        {/* 追加コンテンツ（dayNumber表示など） */}
        {children}
        
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <button
            onClick={onAddToPlan}
            style={{
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            プランに追加
          </button>
          
          {placeId && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '12px',
                textAlign: 'center'
              }}
            >
              Googleマップで見る
            </a>
          )}
        </div>
      </div>
    </InfoWindow>
  );
};