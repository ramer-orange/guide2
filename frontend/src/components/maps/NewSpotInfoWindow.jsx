import React from 'react';
import { CommonInfoWindow } from './CommonInfoWindow';

export const NewSpotInfoWindow = ({
  place,
  isVisible,
  onClose,
  onAddToPlan
}) => {
  if (!isVisible || !place || !place.geometry || !place.geometry.location) {
    return null;
  }

  return (
    <CommonInfoWindow
      position={{
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }}
      onClose={onClose}
      title={place.name}
      address={place.formatted_address}
      rating={place.rating}
      placeId={place.place_id}
      onAddToPlan={onAddToPlan}
    />
  );
};