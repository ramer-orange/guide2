import React from "react";

export function PlanOverview({ tripData, onPlanOverviewChange }) {
  return (
    <div className="flex-grow">
      {/* --- Trip Title Input --- */}
      {/* 
        - `aria-label`でアクセシビリティを確保。
        - `font-bold`と大きめのテキストでタイトルとしての重要度を表現。
        - `focus:border-transparent`などでデフォルトのフォーカスリングを消し、
          `focus:ring`でカスタムのフォーカススタイルを適用。
      */}
      <input
        type="text"
        id="tripTitle"
        name="title"
        value={tripData.title || ''}
        placeholder="旅行のタイトルを入力"
        onChange={onPlanOverviewChange}
        aria-label="旅行タイトル"
        className="ui-input-text text-lg font-bold w-full bg-transparent truncate"
      />

      {/* --- Date Range Inputs --- */}
      <div className="flex items-center text-sm text-text-secondary mt-1">
        <input
          type="date"
          id="startDate"
          name="start_date"
          value={tripData.start_date || ''}
          onChange={onPlanOverviewChange}
          aria-label="開始日"
          className="ui-input-date bg-transparent"
        />
        <span className="mx-1">〜</span>
        <input
          type="date"
          id="endDate"
          name="end_date"
          value={tripData.end_date || ''}
          onChange={onPlanOverviewChange}
          aria-label="終了日"
          className="ui-input-date bg-transparent"
        />
      </div>
    </div>
  );
}

/**
 * 共通UIコンポーネントのスタイル定義例
 * これらは別途 `styles/components.css` などで定義します。
 * 
 * .ui-input-text {
 *   @apply p-1 -ml-1 rounded-ui-sm border border-transparent;
 *   @apply hover:border-border-secondary focus:bg-background-secondary focus:border-border-secondary;
 *   @apply a11y-focus; // 共通のフォーカススタイル
 * }
 * 
 * .ui-input-date {
 *    @apply p-1 rounded-ui-sm border border-transparent;
 *    @apply hover:border-border-secondary focus:bg-background-secondary focus:border-border-secondary;
 *    @apply a11y-focus; // 共通のフォーカススタイル
 * }
 */
