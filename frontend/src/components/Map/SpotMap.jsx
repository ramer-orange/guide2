import React, { useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';

export const SpotMap = ({ onSpotSelect }) => {
  const [spots, setSpots] = useState([]);
  const [isAddingSpot, setIsAddingSpot] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null); // InfoWindow用
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMapClick = (event) => {
    if (isAddingSpot && event.detail.latLng) {
      const newSpot = {
        id: Date.now(), // 仮のID
        lat: event.detail.latLng.lat,
        lng: event.detail.latLng.lng,
        name: `スポット ${spots.length + 1}`,
        description: ''
      };
      setSpots([...spots, newSpot]);
      setIsAddingSpot(false);
    }
  };

  const handleMarkerClick = (spot) => {
    setSelectedSpot(spot); // InfoWindow表示用
    onSpotSelect && onSpotSelect(spot);
  };

  const handleAddToPlan = () => {
    if (selectedSpot && onSpotSelect) {
      onSpotSelect(selectedSpot);
      setSelectedSpot(null); // InfoWindowを閉じる
    }
  };

  return (
    <div>
      {/* コントロールボタン */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
        <button 
          onClick={() => setIsAddingSpot(!isAddingSpot)}
          style={{
            padding: '10px 15px',
            backgroundColor: isAddingSpot ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isAddingSpot ? 'キャンセル' : 'スポット追加'}
        </button>
      </div>
      <APIProvider apiKey={apiKey}>
        <Map
          style={{width: '100vw', height: '100vh'}}
          defaultCenter={{lat: 36.2048, lng: 138.2529}}
          defaultZoom={6}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          onClick={handleMapClick}
        >
          {/* 登録済みスポットのマーカー表示 */}
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.lat, lng: spot.lng }}
              title={spot.name}
              onClick={() => handleMarkerClick(spot)}
            />
          ))}
          
          {/* InfoWindow */}
          {selectedSpot && (
            <InfoWindow
              position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
              onCloseClick={() => setSelectedSpot(null)}
            >
              <div style={{ padding: '10px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{selectedSpot.name}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666' }}>
                  日本<br />
                  緯度: {selectedSpot.lat.toFixed(6)}<br />
                  経度: {selectedSpot.lng.toFixed(6)}
                </p>
                <button
                  onClick={handleAddToPlan}
                  style={{
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%'
                  }}
                >
                  プランに追加
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};