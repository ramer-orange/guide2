import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';

export function PlanDetailItem({ item, index, onPlanDetailChange, onPlanDetailDelete, isHighlighted }) {
  const uniqueId = `item-form-${item.id || index}`;

  return (
    <div 
      id={`plan-item-${item.id}`}
      className={`
        ui-card flex items-start space-x-3 p-3 bg-background-secondary rounded-ui-md border border-border-primary
        ${isHighlighted ? 'animate-highlight' : ''}
      `}
    >
      <button aria-label="項目をドラッグして並べ替え" className="p-1 mt-2 text-text-tertiary cursor-grab focus:outline-none">
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="flex-shrink-0">
        <label htmlFor={`${uniqueId}-arrivalTime`} className="sr-only">時刻</label>
        <input 
          type="time" 
          id={`${uniqueId}-arrivalTime`}
          name="arrivalTime" 
          value={item.arrivalTime || ''} 
          onChange={e => onPlanDetailChange(index, e)}
          className="ui-input-text w-28 text-sm bg-background-primary"
        />
      </div>

      <div className="flex-grow space-y-1">
        <label htmlFor={`${uniqueId}-title`} className="sr-only">タイトル</label>
        <input 
          type="text" 
          id={`${uniqueId}-title`}
          name="title" 
          value={item.title || ''} 
          placeholder="場所や予定を入力"
          onChange={e => onPlanDetailChange(index, e)} 
          className="ui-input-text w-full font-semibold bg-transparent"
        />
        
        <label htmlFor={`${uniqueId}-memo`} className="sr-only">メモ</label>
        <textarea 
          name="memo" 
          id={`${uniqueId}-memo`}
          value={item.memo || ''} 
          placeholder="メモを追加"
          onChange={e => onPlanDetailChange(index, e)}
          className="ui-input-text w-full text-sm resize-none bg-transparent"
          rows={1}
        ></textarea>
      </div>

      <div className="flex-shrink-0">
        <button 
          onClick={() => onPlanDetailDelete(index)}
          aria-label={`${item.title || 'この項目'}を削除`}
          className="ui-button-icon"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
