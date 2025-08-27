import React from 'react';

export function NewTripOverview({ tripData, error, fieldErrors = {}, handleTrip }) {
  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* 旅行タイトル */}
        <div>
          <label 
            htmlFor="tripTitle" 
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            旅行タイトル <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="tripTitle"
            name="tripTitle"
            value={tripData.tripTitle || ''}
            placeholder="例：沖縄旅行、東京出張"
            onChange={handleTrip}
            className={`w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              fieldErrors.tripTitle 
                ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
            } text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {fieldErrors.tripTitle && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.tripTitle}</p>
          )}
        </div>

        {/* 日付入力 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 出発日 */}
          <div>
            <label 
              htmlFor="startDate" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              出発日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={tripData.startDate || ''}
              onChange={handleTrip}
              className={`w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                fieldErrors.startDate 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
              } text-gray-900 dark:text-gray-100`}
            />
            {fieldErrors.startDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.startDate}</p>
            )}
          </div>

          {/* 帰着日 */}
          <div>
            <label 
              htmlFor="endDate" 
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              帰着日 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={tripData.endDate || ''}
              onChange={handleTrip}
              className={`w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                fieldErrors.endDate 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700' 
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
              } text-gray-900 dark:text-gray-100`}
            />
            {fieldErrors.endDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.endDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}