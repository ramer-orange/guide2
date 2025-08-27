import React, { useEffect, useState, useCallback } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useRegisteredSpots } from '@/hooks/maps/useRegisteredSpots';
import { usePlaceSelection } from '@/hooks/maps/usePlaceSelection';
import { RegisteredSpotInfoWindow } from './RegisteredSpotInfoWindow';
import { NewSpotInfoWindow } from './NewSpotInfoWindow';
import { LoadingOverlay } from './LoadingOverlay';
import { MapToolbar } from '@/components/ui/MapToolbar';
import { MAP_CONFIG, MARKER_ICONS, PLACES_API_FIELDS, CSS_ANIMATIONS } from '@/utils/map/mapConsts';
import { refreshSpotsAfterDelay, handlePlaceDetailsResponse } from '@/utils/map/mapHelpers';
import { formatRegisteredSpotData, formatNewSpotData } from '@/utils/planDataFormatter';

const MapWithPlaces = ({ onAddSpot, planId, onSpotDeleted, onMapReady }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [zoom, setZoom] = useState(MAP_CONFIG.defaultZoom);
  const [center, setCenter] = useState(MAP_CONFIG.defaultCenter);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  
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

  // マップインスタンスを親に渡す
  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

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

  // ズーム操作
  const handleZoomIn = useCallback(() => {
    if (map && zoom < 21) {
      const newZoom = zoom + 1;
      setZoom(newZoom);
      map.setZoom(newZoom);
    }
  }, [map, zoom]);

  const handleZoomOut = useCallback(() => {
    if (map && zoom > 1) {
      const newZoom = zoom - 1;
      setZoom(newZoom);
      map.setZoom(newZoom);
    }
  }, [map, zoom]);

  // 現在地取得
  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newCenter);
          map.setCenter(newCenter);
          map.setZoom(15);
          setZoom(15);
        },
        (error) => {
          console.error('現在地の取得に失敗しました:', error);
        }
      );
    }
  }, [map]);

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
      {registeredSpots.map((spot) => {
        const isSelected = selectedMarkerId === `registered-${spot.id}`;
        return (
          <Marker
            key={`registered-${spot.id}`}
            position={{ lat: spot.lat, lng: spot.lng }}
            title={spot.name}
            onClick={() => {
              setSelectedMarkerId(`registered-${spot.id}`);
              selectRegisteredSpot(spot);
            }}
            icon={{
              ...MARKER_ICONS.registered,
              scaledSize: new window.google.maps.Size(
                isSelected ? 42 : 36,
                isSelected ? 42 : 36
              )
            }}
            zIndex={isSelected ? 1000 : 1}
            animation={isSelected ? window.google.maps.Animation.BOUNCE : null}
          />
        );
      })}

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

export const GoogleMap = ({ onAddSpot, planId, onSpotDeleted, className = '' }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapInstance, setMapInstance] = useState(null);

  const handleMapReady = (map) => {
    setMapInstance(map);
  };

  return (
    <div 
      className={`google-map ${className}`} 
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backgroundColor: 'var(--surface)'
      }}
    >
      <style>{CSS_ANIMATIONS}</style>
      
      <APIProvider
        apiKey={apiKey}
        libraries={['places']}
      >
        <Map
          style={{
            ...MAP_CONFIG.size,
            borderRadius: 'var(--radius-lg)'
          }}
          defaultCenter={MAP_CONFIG.defaultCenter}
          defaultZoom={MAP_CONFIG.defaultZoom}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onLoad={(map) => setMapInstance(map)}
          options={{
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
        >
          <MapWithPlaces onAddSpot={onAddSpot} planId={planId} onSpotDeleted={onSpotDeleted} onMapReady={handleMapReady} />
        </Map>
        
        {/* マップツールバー */}
        <MapToolbar
          onZoomIn={() => {
            if (mapInstance) {
              mapInstance.setZoom(mapInstance.getZoom() + 1);
            }
          }}
          onZoomOut={() => {
            if (mapInstance) {
              mapInstance.setZoom(mapInstance.getZoom() - 1);
            }
          }}
          onCurrentLocation={() => {
            if (navigator.geolocation && mapInstance) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const newCenter = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  mapInstance.setCenter(newCenter);
                  mapInstance.setZoom(15);
                },
                (error) => {
                  console.error('現在地の取得に失敗しました:', error);
                }
              );
            }
          }}
          position="top-right"
          showFilter={false}
          showLayer={false}
          showOptions={false}
        />
      </APIProvider>
      
      {/* レスポンシブスタイル */}
      <style jsx>{`
        @media (max-width: 640px) {
          .google-map {
            border-radius: 0 !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .google-map * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

