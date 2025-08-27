import React from "react";
import { IoCalendar, IoLocation } from "react-icons/io5";

export function PlanOverview({ tripData, onPlanOverviewChange }) {
  return(
    <div className="flex flex-col gap-4">
      {/* 旅行タイトル */}
      <div>
        <label 
          htmlFor="tripTitle"
          className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"
        >
          <IoLocation 
            size={16} 
            className="mr-2 text-blue-600" 
          />
          旅行タイトル
        </label>
        <input
          type="text"
          id="tripTitle"
          name="tripTitle"
          value={tripData.tripTitle || ''}
          placeholder="例: 京都・大阪 3泊4日の旅"
          onChange={onPlanOverviewChange}
          className="w-full p-2 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-lg font-medium outline-none transition-all duration-200 ease-out shadow-sm focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 dark:focus:shadow-blue-900/20"
        />
      </div>

      {/* 旅行期間 */}
      <div>
        <label 
          className="flex items-center text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1"
        >
          <IoCalendar 
            size={16} 
            className="mr-2 text-blue-600" 
          />
          旅行期間
        </label>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label 
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
            >
              出発日
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={tripData.startDate || ''}
              onChange={onPlanOverviewChange}
              className="w-full p-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base outline-none transition-all duration-200 ease-out focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 dark:focus:shadow-blue-900/20"
            />
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-lg font-medium mt-6">
            ~
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label 
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              帰着日
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={tripData.endDate || ''}
              onChange={onPlanOverviewChange}
              className="w-full p-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-base outline-none transition-all duration-200 ease-out focus:border-blue-600 focus:shadow-lg focus:shadow-blue-100 dark:focus:shadow-blue-900/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}