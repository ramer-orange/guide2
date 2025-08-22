import React from 'react';
import { CommonInfoWindow } from './CommonInfoWindow';

export const RegisteredSpotInfoWindow = ({
  spot,
  onClose,
  onAddToPlan
}) => {
  if (!spot) return null;

  return (
    <CommonInfoWindow
      position={{ lat: spot.lat, lng: spot.lng }}
      onClose={onClose}
      title={spot.name}
      address={spot.address}
      rating={spot.rating}
      placeId={spot.placeId}
      onAddToPlan={onAddToPlan}
    >
      {/* 登録済みスポット固有のコンテンツ */}
      {spot.dayNumber && (
        <p style={{
          margin: '0 0 10px 0',
          fontSize: '12px',
          color: '#1976d2',
          fontWeight: 'bold'
        }}>
          {spot.dayNumber}日目
          {spot.order && `(${spot.order}番目)`}
        </p>
      )}
    </CommonInfoWindow>
  );
};