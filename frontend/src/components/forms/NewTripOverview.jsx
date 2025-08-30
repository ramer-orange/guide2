import React from 'react';

export function NewTripOverview({ tripData, error, handleTrip }) {
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-error text-error px-4 py-3 rounded-ui-md" role="alert">
          <p className="font-bold">エラー:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="tripTitle" className="block text-sm font-medium text-text-secondary mb-1">旅行タイトル</label>
        <input
          type="text"
          id="tripTitle"
          name="tripTitle"
          value={tripData.tripTitle || ''}
          placeholder="例: 沖縄3泊4日の旅"
          onChange={handleTrip}
          className="ui-input-text w-full text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary mb-1">出発日</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={tripData.startDate || ''}
            onChange={handleTrip}
            className="ui-input-date w-full"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-text-secondary mb-1">帰着日</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={tripData.endDate || ''}
            onChange={handleTrip}
            className="ui-input-date w-full"
          />
        </div>
      </div>
    </div>
  );
}
