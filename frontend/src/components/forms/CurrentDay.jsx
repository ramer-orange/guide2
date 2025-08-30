import React from "react";

export function CurrentDay({ index, onSelectedDayChange, isSelected }) {
  const dayNumber = index + 1;

  return (
    <button 
      key={index}
      onClick={() => onSelectedDayChange(dayNumber)}
      role="tab"
      aria-selected={isSelected}
      className={`
        ui-tab
        ${isSelected ? 'ui-tab-active' : 'ui-tab-inactive'}
      `}
    >
      Day {dayNumber}
    </button>
  );
}

/**
 * 共通UIコンポーネントのスタイル定義例
 * これらは別途 `styles/components.css` などで定義します。
 * 
 * .ui-tab {
 *   @apply px-4 py-2 font-semibold text-sm rounded-ui-md whitespace-nowrap;
 *   @apply motion-fast;
 *   @apply a11y-focus; // 共通のフォーカススタイル
 * }
 * 
 * .ui-tab-active {
 *   @apply bg-accent-primary text-text-on-accent;
 * }
 * 
 * .ui-tab-inactive {
 *   @apply text-text-secondary hover:bg-background-tertiary hover:text-text-primary;
 * }
 */