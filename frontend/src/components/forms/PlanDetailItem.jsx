import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';

export function PlanDetailItem({ item, index, onPlanDetailChange, onPlanDetailDelete, isHighlighted }) {
  const uniqueId = `item-form-${item.id || index}`;

  return (
    <div 
      id={`plan-item-${item.id}`}
      className={`
        ui-card flex flex-col items-start space-y-2 p-2 md:p-4 lg:p-6 bg-background-secondary rounded-ui-md border border-border-primary relative
        ${isHighlighted ? 'animate-highlight' : ''}
      `}
    >
      {/* --- Drag Handle --- */}
      <button aria-label="項目をドラッグして並べ替え" className="p-1 text-text-tertiary cursor-grab focus:outline-none">
        <GripVertical className="w-4 h-4" />
      </button>

      {/* --- Time Input --- */}
      <div className="flex-shrink-0">
        <label htmlFor={`${uniqueId}-arrivalTime`} className="sr-only">時刻</label>
        <input 
          type="time" 
          id={`${uniqueId}-arrivalTime`}
          name="arrivalTime" 
          value={item.arrivalTime || ''} 
          onChange={e => onPlanDetailChange(index, e)}
          className="ui-input-text w-28 text-sm md:text-base bg-background-primary"
        />
      </div>

      {/* --- Main Content (Title & Memo) --- */}
      <div className="flex-grow space-y-2 w-full">
        <label htmlFor={`${uniqueId}-title`} className="sr-only">タイトル</label>
        <input 
          type="text" 
          id={`${uniqueId}-title`}
          name="title" 
          value={item.title || ''} 
          placeholder="場所や予定を入力"
          onChange={e => onPlanDetailChange(index, e)} 
          className="ui-input-text w-full font-semibold text-sm md:text-base bg-transparent"
        />
        
        <label htmlFor={`${uniqueId}-memo`} className="sr-only">メモ</label>
        <textarea 
          name="memo" 
          id={`${uniqueId}-memo`}
          value={item.memo || ''} 
          placeholder="メモを追加"
          onChange={e => onPlanDetailChange(index, e)}
          className="ui-input-text w-full text-sm md:text-base resize-none bg-transparent"
          rows={1}
        ></textarea>
      </div>

      {/* --- Delete Button --- */}
      <div className="absolute top-2 right-2">
        <button 
          onClick={() => onPlanDetailDelete(index)}
          aria-label={`${item.title || 'この項目'}を削除`}
          className="ui-button-icon"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}