import React from 'react';

function PlanDetailItem({ item, index, onPlanDetailChange, onPlanDetailDelete }) {
  return (
    <div key={index}>
      <label htmlFor="arrival_time">
        <input type="time" id="arrival_time" name="arrival_time" value={item.arrival_time || ''} onChange={e => onPlanDetailChange(index, e)}/>
      </label>
      <label htmlFor="memo">
        <textarea name="memo" id="memo" value={item.memo || ''} onChange={e => onPlanDetailChange(index, e)}></textarea>
      </label>
      <button onClick={() => (onPlanDetailDelete(index))}>削除</button>
  </div>
  );
}

export default PlanDetailItem;