import React from 'react';

export function NewTripOverview({ tripData, error, handleTrip }) {
  return (
    <>
      <div>
        <p>{error}</p>
        <div>
          <label htmlFor="tripTitle">旅行タイトル</label>
          <input
            type="text"
            id="tripTitle"
            name="tripTitle"
            value={tripData.tripTitle || ''}
            placeholder="旅行タイトル"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="startDate">出発日</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={tripData.startDate || ''}
            placeholder="出発日"
            onChange={handleTrip}
          />
        </div>
        <div>
          <label htmlFor="endDate">帰着日</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={tripData.endDate || ''}
            placeholder="帰着日"
            onChange={handleTrip}
          />
        </div>
      </div>
    </>
  );
}