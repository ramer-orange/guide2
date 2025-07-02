import React from "react";

function PlanOverview({ tripData, onPlanOverviewChange }) {
  return(
    <>
      <h3>
        <label htmlFor="tripTitle">旅行タイトル</label>
        <input
          type="text"
          id="tripTitle"
          name="tripTitle"
          value={tripData.tripTitle || ''}
          placeholder="旅行タイトル"
          onChange={onPlanOverviewChange}
        />
      </h3>
      <div>
        <span>
          <label htmlFor="startDate">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={tripData.startDate || ''}
              onChange={onPlanOverviewChange}
            />
          </label>
        </span>
        <span> ~ </span>
        <span>
          <label htmlFor="endDate">
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={tripData.endDate || ''}
              onChange={onPlanOverviewChange}
            />
          </label>
        </span>
      </div>
    </>
  );
}

export default PlanOverview;
