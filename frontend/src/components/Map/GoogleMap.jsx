import React, { useState} from 'react';
import {APIProvider, InfoWindow, Map} from '@vis.gl/react-google-maps';
import { AddSpot } from '../button/AddSpot';

export const GoogleMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [infoWindowPosition, setInfoWindowPosition] = useState({});
  const handleMapClick = (event) => {
    setInfoWindowPosition({
      lat: event.detail.latLng.lat + 1,
      lng: event.detail.latLng.lng + 1
    });
    setShowInfoWindow(true);
  };
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={{lat: 36.2048, lng: 138.2529}} // 日本の中心
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={false} // UIを表示（ズーム、ストリートビューなど）
        onClick={handleMapClick}
      >
      {showInfoWindow && (
        <InfoWindow 
          position={infoWindowPosition}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <AddSpot onAddSpot={() => alert('スポットを追加する機能は未実装です。')} />
        </InfoWindow>
      )}

      </Map>
    </APIProvider>
  );
};

