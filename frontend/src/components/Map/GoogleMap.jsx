import React, { useEffect } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useRegisteredSpots } from '@/hooks/useRegisteredSpots';
import { usePlaceSelection } from '@/hooks/usePlaceSelection';
import { RegisteredSpotInfoWindow } from './RegisteredSpotInfoWindow';
import { NewSpotInfoWindow } from './NewSpotInfoWindow';
import { LoadingOverlay } from './LoadingOverlay';
import { MAP_CONFIG, MARKER_ICONS, PLACES_API_FIELDS, CSS_ANIMATIONS } from '@/consts/mapConsts';
import { refreshSpotsAfterDelay, formatRegisteredSpotData, formatNewSpotData, handlePlaceDetailsResponse } from '@/utils/mapHelpers';

const MapWithPlaces = ({ onAddSpot, planId, onSpotDeleted }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  
  // カスタムフック
  const { registeredSpots, loading, loadRegisteredSpots } = useRegisteredSpots(planId);
  const {
    selectedPlace,
    showCustomInfoWindow,
    selectedRegisteredSpot,
    selectPlace,
    selectRegisteredSpot,
    clearSelection,
    closeNewSpotInfoWindow,
    closeRegisteredSpotInfoWindow
  } = usePlaceSelection();

  // スポット削除時の処理
  useEffect(() => {
    if (onSpotDeleted) {
      const handleSpotDelete = (deletedSpot) => {
        // 削除されたスポットが現在選択中の場合、選択をクリア
        if (selectedRegisteredSpot && selectedRegisteredSpot.id === deletedSpot.id) {
          clearSelection();
        }
        // マーカーデータを再取得
        loadRegisteredSpots();
      };
      
      onSpotDeleted.current = handleSpotDelete;
    }
  }, [selectedRegisteredSpot, clearSelection, loadRegisteredSpots, onSpotDeleted]);

  // map上のスポットをクリック時の処理
  useEffect(() => {
    if (!map || !placesLib) return;

    // 既存スポット（POI）クリック時の処理
    const clickListener = map.addListener('click', (e) => {
      if (e.placeId) {
        // デフォルトのInfoWindowを阻止
        e.stop();
        
        // Places APIでスポット詳細を取得
        const service = new placesLib.PlacesService(map);
        service.getDetails({
          placeId: e.placeId,
          fields: PLACES_API_FIELDS
        }, (place, status) => {
          handlePlaceDetailsResponse(
            place,
            status,
            placesLib,
            selectPlace,
            (error) => console.error(error.message)
          );
        });
      }
    });

    // イベントリスナーのクリーンアップ
    return () => {
      if (clickListener) {
        clickListener.remove();
      }
    };
  }, [map, placesLib, selectPlace]);

  // 登録済みスポットをプランに追加
  const handleAddRegisteredSpotToPlan = () => {
    if (selectedRegisteredSpot && onAddSpot) {
      const spotData = formatRegisteredSpotData(selectedRegisteredSpot);
      onAddSpot(spotData);
      closeRegisteredSpotInfoWindow();
      refreshSpotsAfterDelay(planId, loadRegisteredSpots);
    }
  };

  // 新規スポットをプランに追加
  const handleAddNewSpotToPlan = () => {
    if (selectedPlace && onAddSpot) {
      try {
        const spotData = formatNewSpotData(selectedPlace);
        onAddSpot(spotData);
        closeNewSpotInfoWindow();
        refreshSpotsAfterDelay(planId, loadRegisteredSpots);
      } catch (error) {
        console.error(error.message, selectedPlace);
      }
    }
  };

  return (
    <>
      <LoadingOverlay isVisible={loading} />

      {/* 登録済みスポットのマーカー */}
      {registeredSpots.map((spot) => (
        <Marker
          key={`registered-${spot.id}`}
          position={{ lat: spot.lat, lng: spot.lng }}
          title={spot.name}
          onClick={() => selectRegisteredSpot(spot)}
          icon={MARKER_ICONS.registered}
        />
      ))}

      <RegisteredSpotInfoWindow
        spot={selectedRegisteredSpot}
        onClose={closeRegisteredSpotInfoWindow}
        onAddToPlan={handleAddRegisteredSpotToPlan}
      />

      <NewSpotInfoWindow
        place={selectedPlace}
        isVisible={showCustomInfoWindow}
        onClose={closeNewSpotInfoWindow}
        onAddToPlan={handleAddNewSpotToPlan}
      />
    </>
  );
};

export const GoogleMap = ({ onAddSpot, planId, onSpotDeleted }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <div style={{ position: 'relative' }}>
      <style>{CSS_ANIMATIONS}</style>
      
      <APIProvider
        apiKey={apiKey}
        libraries={['places']}
      >
        <Map
          style={MAP_CONFIG.size}
          defaultCenter={MAP_CONFIG.defaultCenter}
          defaultZoom={MAP_CONFIG.defaultZoom}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        >
          <MapWithPlaces onAddSpot={onAddSpot} planId={planId} onSpotDeleted={onSpotDeleted} />
        </Map>
      </APIProvider>
    </div>
  );
};

