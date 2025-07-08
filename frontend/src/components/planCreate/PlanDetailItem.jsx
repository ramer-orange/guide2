import React from 'react';

function PlanDetailItem({ item, index, onPlanDetailChange, onPlanDetailDelete }) {
  return (
    <div key={index}>
      <label htmlFor="arrivalTime">
        <input type="time" id="arrivalTime" name="arrivalTime" value={item.arrivalTime || ''} onChange={e => onPlanDetailChange(index, e)}/>
      </label>
      <label htmlFor="memo">
        <textarea name="memo" id="memo" value={item.memo || ''} onChange={e => onPlanDetailChange(index, e)}></textarea>
      </label>
      <button onClick={() => (onPlanDetailDelete(index))}>削除</button>
  </div>
  );
}

export default PlanDetailItem;
