import { MAP_CONFIG } from '@/consts/mapConsts';

// スポット追加後の遅延更新処理
export const refreshSpotsAfterDelay = (planId, loadRegisteredSpots) => {
  setTimeout(() => {
    if (planId) {
      loadRegisteredSpots();
    }
  }, MAP_CONFIG.refreshDelay);
};

// 登録済みスポットのデータフォーマット
export const formatRegisteredSpotData = (spot) => {
  return {
    name: spot.name,
    address: spot.address,
    lat: spot.lat,
    lng: spot.lng,
    placeId: spot.placeId,
    rating: spot.rating
  };
};

// 新規スポット（Place）のデータフォーマット
export const formatNewSpotData = (place) => {
  if (!place.geometry || !place.geometry.location) {
    throw new Error('Cannot format spot: missing location data');
  }

  return {
    name: place.name,
    address: place.formatted_address,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    placeId: place.place_id,
    rating: place.rating
  };
};

// Places API リクエストのコールバック処理
export const handlePlaceDetailsResponse = (place, status, placesLib, onSuccess, onError) => {
  if (status === placesLib.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {
    onSuccess(place);
  } else {
    const errorMessage = `Place details could not be retrieved: ${status}`;
    console.error(errorMessage, place);
    if (onError) {
      onError(new Error(errorMessage));
    }
  }
};