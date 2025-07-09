import React from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';

export const GoogleMap = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={{lat: 36.2048, lng: 138.2529}} // 日本の中心
        defaultZoom={6}
        gestureHandling={'greedy'}
        disableDefaultUI={false} // UIを表示（ズーム、ストリートビューなど）
      />
    </APIProvider>
  );
};

