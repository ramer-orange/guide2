import { MAP_CONFIG } from '@/utils/map/mapConsts';

// スポット追加後の遅延更新処理
export const refreshSpotsAfterDelay = (planId, loadRegisteredSpots) => {
  setTimeout(() => {
    if (planId) {
      loadRegisteredSpots();
    }
  }, MAP_CONFIG.refreshDelay);
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