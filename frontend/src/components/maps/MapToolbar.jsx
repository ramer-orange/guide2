import React from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { Plus, Minus, LocateFixed, Filter } from 'lucide-react';

export function MapToolbar() {
  const map = useMap();

  const handleZoomIn = () => {
    if (!map) return;
    map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (!map) return;
    map.setZoom(map.getZoom() - 1);
  };

  const handleRecenter = () => {
    if (!map) return;
    // TODO: ユーザーの現在地を取得するロジックを実装
    // 仮に東京駅に設定
    map.panTo({ lat: 35.681236, lng: 139.767125 });
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="bg-background-primary shadow-md rounded-ui-md flex flex-col space-y-1 p-1">
        <button onClick={handleZoomIn} aria-label="ズームイン" className="ui-button-icon">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} aria-label="ズームアウト" className="ui-button-icon">
          <Minus className="w-5 h-5" />
        </button>
        <button onClick={handleRecenter} aria-label="現在地に戻る" className="ui-button-icon">
          <LocateFixed className="w-5 h-5" />
        </button>
        {/* フィルタ機能は将来的な拡張のためのプレースホルダー */}
        <button aria-label="フィルタ" className="ui-button-icon text-text-tertiary cursor-not-allowed">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
