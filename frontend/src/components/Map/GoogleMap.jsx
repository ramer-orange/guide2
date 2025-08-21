import React, { useState, useEffect } from 'react';
import { APIProvider, InfoWindow, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { fetchPlanSpots } from '@/api/planDetailApi';
import { formatPlanDetailSpots } from "@/utils/planDataFormatter";

const MapWithPlaces = ({ onAddSpot, planId }) => {
  const map = useMap(); // マップインスタンスを取得
  const placesLib = useMapsLibrary('places'); // Places APIライブラリを取得
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showCustomInfoWindow, setShowCustomInfoWindow] = useState(false);
  const [registeredSpots, setRegisteredSpots] = useState([]);
  const [selectedRegisteredSpot, setSelectedRegisteredSpot] = useState(null);
  const [loading, setLoading] = useState(false);

  // 登録済みスポットを取得
  useEffect(() => {
    loadRegisteredSpots();
  }, [planId]);

  // 登録済みスポットをDBからを取得
  const loadRegisteredSpots = async () => {
    if (!planId) return;
    
    try {
      setLoading(true);
      const spotData = await fetchPlanSpots(planId);
      const formattedSpots = formatPlanDetailSpots(spotData);
      setRegisteredSpots(formattedSpots);
    } catch (error) {
      console.error('スポットデータの取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  // map上のスポットをクリック時の処理
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

  // 登録済みスポットのマーカークリック時の処理
  const handleRegisteredSpotClick = (spot) => {
    setSelectedRegisteredSpot(spot);
    // 他のInfoWindowを閉じる
    setShowCustomInfoWindow(false);
    setSelectedPlace(null);
  };

  // 登録済みスポットをプランに追加
  const handleAddRegisteredSpotToPlan = () => {
    if (selectedRegisteredSpot && onAddSpot) {
      const spotData = {
        name: selectedRegisteredSpot.name,
        address: selectedRegisteredSpot.address,
        lat: selectedRegisteredSpot.lat,
        lng: selectedRegisteredSpot.lng,
        placeId: selectedRegisteredSpot.placeId,
        rating: selectedRegisteredSpot.rating
      };
      onAddSpot(spotData);
      setSelectedRegisteredSpot(null);
      
      // スポット追加後、登録済みスポット一覧を更新
      setTimeout(() => {
        if (planId) {
          loadRegisteredSpots();
        }
      }, 500);
    }
  };

  // プラン追加処理
  const handleAddToPlan = () => {
    if (selectedPlace && selectedPlace.geometry && selectedPlace.geometry.location) {
      const spotData = {
        name: registeredSpots.name || selectedPlace.name,
        address: registeredSpots.address || selectedPlace.formatted_address,
        lat: registeredSpots.lat || selectedPlace.geometry.location.lat(),
        lng: registeredSpots.lng || selectedPlace.geometry.location.lng(),
        placeId: registeredSpots.placeId || selectedPlace.place_id,
        rating: registeredSpots.name || selectedPlace.rating
      };
      
      onAddSpot(spotData);
      setShowCustomInfoWindow(false);
      
      // スポット追加後、登録済みスポット一覧を更新
      setTimeout(() => {
        if (planId) {
          loadRegisteredSpots();
        }
      }, 500);
    } else {
      console.error('Cannot add spot: missing location data', selectedPlace);
    }
  };

  return (
    <>
      {/* ローディング表示 */}
      {loading && (
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
          <p style={{ margin: 0, color: '#333' }}>スポット情報を更新中...</p>
        </div>
      )}

      {/* 登録済みスポットのマーカー */}
      {registeredSpots.map((spot) => (
        <Marker
          key={`registered-${spot.id}`}
          position={{ lat: spot.lat, lng: spot.lng }}
          title={spot.name}
          onClick={() => handleRegisteredSpotClick(spot)}
          icon={{
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#1976d2">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: { width: 30, height: 30 }
          }}
        />
      ))}

      {/* 登録済みスポットのInfoWindow */}
      {selectedRegisteredSpot && (
        <InfoWindow
          position={{ lat: selectedRegisteredSpot.lat, lng: selectedRegisteredSpot.lng }}
          onCloseClick={() => setSelectedRegisteredSpot(null)}
        >
          <div style={{ padding: '12px', minWidth: '250px', maxWidth: '300px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
              {selectedRegisteredSpot.name}
            </h3>
            
            {selectedRegisteredSpot.address && (
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                {selectedRegisteredSpot.address}
              </p>
            )}
            
            {selectedRegisteredSpot.rating && (
              <div style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#fbbc04', marginRight: '4px' }}>⭐</span>
                <span style={{ fontWeight: 'bold' }}>{selectedRegisteredSpot.rating}</span>
                <span style={{ color: '#666' }}>/5</span>
              </div>
            )}
            
            {selectedRegisteredSpot.dayNumber && (
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#1976d2', fontWeight: 'bold' }}>
                {selectedRegisteredSpot.dayNumber}日目
                {selectedRegisteredSpot.order && `(${selectedRegisteredSpot.order}番目)`}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button
                onClick={handleAddRegisteredSpotToPlan}
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
              
              {selectedRegisteredSpot.placeId && (
                <a
                  href={`https://www.google.com/maps/place/?q=place_id:${selectedRegisteredSpot.placeId}`}
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
      )}

      {/* 新しいスポットのカスタムInfoWindow */}
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

export const GoogleMap = ({ onAddSpot, planId }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div style={{ position: 'relative' }}>
      {/* CSSアニメーション */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
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
          <MapWithPlaces onAddSpot={onAddSpot} planId={planId} />
        </Map>
      </APIProvider>
    </div>
  );
};

