import { useState } from 'react';

export const usePlaceSelection = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showCustomInfoWindow, setShowCustomInfoWindow] = useState(false);
  const [selectedRegisteredSpot, setSelectedRegisteredSpot] = useState(null);

  // 新しいスポット（Place）の選択
  const selectPlace = (place) => {
    setSelectedPlace(place);
    setShowCustomInfoWindow(true);
    // 登録済みスポットの選択を解除
    setSelectedRegisteredSpot(null);
  };

  // 登録済みスポットの選択
  const selectRegisteredSpot = (spot) => {
    setSelectedRegisteredSpot(spot);
    // 新規スポットの選択を解除
    setShowCustomInfoWindow(false);
    setSelectedPlace(null);
  };

  // すべての選択を解除
  const clearSelection = () => {
    setSelectedPlace(null);
    setShowCustomInfoWindow(false);
    setSelectedRegisteredSpot(null);
  };

  // 新規スポットのInfoWindowを閉じる
  const closeNewSpotInfoWindow = () => {
    setShowCustomInfoWindow(false);
    setSelectedPlace(null);
  };

  // 登録済みスポットのInfoWindowを閉じる
  const closeRegisteredSpotInfoWindow = () => {
    setSelectedRegisteredSpot(null);
  };

  return {
    selectedPlace,
    showCustomInfoWindow,
    selectedRegisteredSpot,
    selectPlace,
    selectRegisteredSpot,
    clearSelection,
    closeNewSpotInfoWindow,
    closeRegisteredSpotInfoWindow
  };
};