import React, { useState, useEffect } from 'react';
import { APIProvider, InfoWindow, Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

// Places APIを使用するコンポーネント
const MapWithPlaces = ({ onAddSpot }) => {
  const map = useMap(); // マップインスタンスを取得
  const placesLib = useMapsLibrary('places'); // Places APIライブラリを取得
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showCustomInfoWindow, setShowCustomInfoWindow] = useState(false);

  useEffect(() => {
    if (!map || !placesLib) return;

    // 既存スポット（POI）クリック時の処理
    const clickListener = map.addListener('click', (e) => {
      if (e.placeId) {
        // デフォルトのInfoWindowを阻止
        e.stop();
        
        // Places APIでスポット詳細を取得
        const service = new placesLib.PlacesService(map); //スポット詳細を取得するため
        service.getDetails({
          placeId: e.placeId,
          fields: ['name', 'formatted_address', 'place_id', 'rating', 'photos', 'geometry']
        }, (place, status) => {
          if (status === placesLib.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
            setSelectedPlace(place);
            setShowCustomInfoWindow(true);
          } else {
            console.error('Place details could not be retrieved:', status, place);
          }
        });
      }
    });

    // イベントリスナーのクリーンアップ
    return () => {
      if (clickListener) {
        // google.maps.event.removeListener(clickListener);
        clickListener.remove();
      }
    };
  }, [map, placesLib]);

  // プラン追加処理
  const handleAddToPlan = () => {
    if (selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location) {
      const spotData = {
        name: selectedPlace.name,
        address: selectedPlace.formatted_address,
        lat: selectedPlace.geometry.location.lat(),
        lng: selectedPlace.geometry.location.lng(),
        placeId: selectedPlace.place_id,
        rating: selectedPlace.rating
      };
      
      onAddSpot && onAddSpot(spotData);
      setShowCustomInfoWindow(false);
    } else {
      console.error('Cannot add spot: missing location data', selectedPlace);
    }
  };

  return (
    <>
      {/* カスタムInfoWindow */}
      {showCustomInfoWindow && selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location && (
        <InfoWindow
          position={{
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng()
          }}
          onCloseClick={() => setShowCustomInfoWindow(false)}
        >
          <div style={{ padding: '12px', minWidth: '250px', maxWidth: '300px' }}>
            <h3>{selectedPlace.name}</h3>
            
            <p>{selectedPlace.formatted_address}</p>
            
            {selectedPlace.rating && (
              <div>
                <span style={{ color: '#fbbc04' }}>⭐</span>
                <span style={{ fontWeight: 'bold' }}>{selectedPlace.rating}</span>
                <span style={{ color: '#666' }}>/5</span>
              </div>
            )}
            
            <button onClick={handleAddToPlan}>プランに追加</button>
            
            {/* Googleマップで見るリンク */}
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${selectedPlace.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Googleマップで見る
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export const GoogleMap = ({ onAddSpot }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={['places']} // Places APIライブラリを読み込み
    >
      <Map
        style={{width: '600px', height: '500px'}}
        defaultCenter={{lat: 35.6762, lng: 139.6503}} // 東京
        defaultZoom={10}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        <MapWithPlaces onAddSpot={onAddSpot} />
      </Map>
    </APIProvider>
  );
};

