import React, { useState } from 'react';
import { 
  IoAdd, 
  IoRemove, 
  IoLocate, 
  IoFilter, 
  IoLayers,
  IoOptions 
} from 'react-icons/io5';
import { IconButton } from './Button';

// マップツールバーコンポーネント
export const MapToolbar = ({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
  onToggleFilter,
  onToggleLayer,
  onToggleOptions,
  showFilter = true,
  showLayer = true,
  showOptions = true,
  filterActive = false,
  layerActive = false,
  className = '',
  position = 'top-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ポジション別スタイル
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute',
      zIndex: 'var(--z-fixed)',
      padding: 'var(--space-2)'
    };

    switch (position) {
      case 'top-right':
        return { ...baseStyles, top: 0, right: 0 };
      case 'top-left':
        return { ...baseStyles, top: 0, left: 0 };
      case 'bottom-right':
        return { ...baseStyles, bottom: 0, right: 0 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 0, left: 0 };
      default:
        return { ...baseStyles, top: 0, right: 0 };
    }
  };

  const toolbarItems = [
    {
      id: 'zoom-in',
      icon: <IoAdd />,
      label: 'ズームイン',
      onClick: onZoomIn,
      show: true
    },
    {
      id: 'zoom-out', 
      icon: <IoRemove />,
      label: 'ズームアウト',
      onClick: onZoomOut,
      show: true
    },
    {
      id: 'current-location',
      icon: <IoLocate />,
      label: '現在位置',
      onClick: onCurrentLocation,
      show: true
    },
    {
      id: 'filter',
      icon: <IoFilter />,
      label: 'フィルター',
      onClick: onToggleFilter,
      show: showFilter,
      active: filterActive
    },
    {
      id: 'layer',
      icon: <IoLayers />,
      label: 'レイヤー',
      onClick: onToggleLayer,
      show: showLayer,
      active: layerActive
    },
    {
      id: 'options',
      icon: <IoOptions />,
      label: '設定',
      onClick: onToggleOptions,
      show: showOptions
    }
  ];

  const visibleItems = toolbarItems.filter(item => item.show);

  return (
    <div
      className={`map-toolbar ${className}`}
      style={getPositionStyles()}
      role="toolbar"
      aria-label="地図操作ツール"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          backgroundColor: 'var(--bg)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-2)',
          boxShadow: 'var(--elev2)',
          border: '1px solid var(--outline)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        {visibleItems.map((item, index) => {
          // 区切り線を追加する位置（ズーム操作と他の操作の間）
          const showSeparator = index === 2 && visibleItems.length > 3;
          
          return (
            <React.Fragment key={item.id}>
              <IconButton
                icon={item.icon}
                onClick={item.onClick}
                variant={item.active ? 'primary' : 'ghost'}
                size="sm"
                ariaLabel={item.label}
                style={{
                  backgroundColor: item.active 
                    ? 'var(--primary)' 
                    : 'transparent',
                  color: item.active 
                    ? 'var(--bg)' 
                    : 'var(--text)',
                  transition: 'all var(--duration-fast) var(--ease-out)'
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = 'var(--surface)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              />
              {showSeparator && (
                <div
                  style={{
                    height: '1px',
                    backgroundColor: 'var(--outline)',
                    margin: 'var(--space-1) var(--space-2)'
                  }}
                  role="separator"
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* モバイルでのアクセシビリティ向上 */}
      <style jsx>{`
        @media (max-width: 640px) {
          .map-toolbar {
            padding: var(--space-1) !important;
          }
          .map-toolbar > div {
            padding: var(--space-1) !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .map-toolbar button {
            transition-duration: var(--duration-fast) !important;
          }
        }

        /* ハイコントラストモード対応 */
        @media (prefers-contrast: high) {
          .map-toolbar > div {
            border: 2px solid var(--outline) !important;
            background-color: var(--bg) !important;
          }
        }
      `}</style>
    </div>
  );
};

// ズーム専用の簡易版
export const ZoomControl = ({
  onZoomIn,
  onZoomOut,
  className = '',
  position = 'top-right'
}) => {
  return (
    <MapToolbar
      onZoomIn={onZoomIn}
      onZoomOut={onZoomOut}
      showFilter={false}
      showLayer={false}
      showOptions={false}
      className={className}
      position={position}
    />
  );
};

// コンパクトなフローティングツールバー
export const CompactMapToolbar = ({
  onZoomIn,
  onZoomOut,
  onCurrentLocation,
  className = '',
  position = 'bottom-right'
}) => {
  return (
    <div
      className={`compact-map-toolbar ${className}`}
      style={{
        position: 'absolute',
        [position.split('-')[0]]: 'var(--space-4)',
        [position.split('-')[1]]: 'var(--space-4)',
        zIndex: 'var(--z-fixed)',
        display: 'flex',
        gap: 'var(--space-2)',
        flexDirection: position.includes('bottom') ? 'column-reverse' : 'column'
      }}
      role="toolbar"
      aria-label="地図操作ツール（簡易版）"
    >
      <IconButton
        icon={<IoAdd />}
        onClick={onZoomIn}
        variant="primary"
        size="md"
        isRound
        ariaLabel="ズームイン"
        style={{
          boxShadow: 'var(--elev2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />
      
      <IconButton
        icon={<IoRemove />}
        onClick={onZoomOut}
        variant="secondary"
        size="md"
        isRound
        ariaLabel="ズームアウト"
        style={{
          boxShadow: 'var(--elev2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />
      
      <IconButton
        icon={<IoLocate />}
        onClick={onCurrentLocation}
        variant="ghost"
        size="md"
        isRound
        ariaLabel="現在位置"
        style={{
          backgroundColor: 'var(--bg)',
          boxShadow: 'var(--elev2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid var(--outline)'
        }}
      />
    </div>
  );
};

export default MapToolbar;