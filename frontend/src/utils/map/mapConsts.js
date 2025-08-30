// Map関連の定数定義

// 地図の基本設定
export const MAP_CONFIG = {
  defaultCenter: { lat: 35.6762, lng: 139.6503 }, // 東京
  defaultZoom: 10,
  size: { width: '600px', height: '500px' },
  refreshDelay: 500, // スポット更新の遅延時間（ms）
};

// マーカーアイコンの定義
export const MARKER_ICONS = {
  registered: {
    url: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF5A5F">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    scaledSize: { width: 30, height: 30 }
  }
};

// Google Places APIのフィールド定義
export const PLACES_API_FIELDS = [
  'name',
  'formatted_address', 
  'place_id',
  'rating',
  'photos',
  'geometry'
];

// CSSアニメーションの定義
export const CSS_ANIMATIONS = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;