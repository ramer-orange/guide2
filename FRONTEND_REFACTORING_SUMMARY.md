# フロントエンド ディレクトリ再構成 実装内容

## 概要
ブランチ `frontend_directory_change` で実施したフロントエンドのディレクトリ構造再構成とパスエイリアス（`@`）導入について、変更されたファイルの内容をまとめました。

## 主要な変更

### 1. ディレクトリ構造の変更

#### 新しいディレクトリ構造
```
frontend/src/
├── components/
│   ├── forms/           # フォーム関連コンポーネント
│   ├── layout/          # レイアウト関連コンポーネント
│   ├── maps/           # マップ関連コンポーネント（旧Map/）
│   └── ui/             # UI要素（ボタン、タイトル等）
├── hooks/
│   ├── maps/           # マップ関連フック
│   └── trips/          # トリップ関連フック（旧tripPlan/）
├── pages/
│   ├── auth/           # 認証関連ページ
│   └── trips/          # トリップ関連ページ
├── services/
│   └── api/            # APIサービス層（旧api/）
├── store/              # 状態管理（旧contexts/）
└── utils/              # ユーティリティ（統合・整理）
```

### 2. パスエイリアス（`@`）の導入

#### 設定
`vite.config.js` で `@` エイリアスを設定済み：
```javascript
resolve: {
  alias: {
    '@': path.resolve('./src'),
  }
}
```

#### インポート形式の変更
```javascript
// Before (相対パス)
import { useAuth } from '../../store/AuthContext';
import { fetchPlanSpots } from '../../../services/api/planDetailApi';

// After (@エイリアス)
import { useAuth } from '@/store/AuthContext';
import { fetchPlanSpots } from '@/services/api/planDetailApi';
```

#### メリット
- **パスの簡潔性**: 長い相対パス（`../../`）が不要
- **保守性向上**: ファイル移動時のパス修正が最小限
- **可読性向上**: インポート先がより明確
- **IDEサポート**: より良い自動補完とナビゲーション

## 変更されたファイル詳細

### 1. メインエントリーポイント

#### `main.jsx`
```jsx
import { StrictMode } from 'react'
import { Provider } from "@/components/ui/provider"
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { routesBasic } from '@/routesBasic.jsx'
import { AuthProvider } from '@/store/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <AuthProvider>
        <RouterProvider router={routesBasic} />
      </AuthProvider>
    </Provider>
  </StrictMode>
)
```
**変更点**: 
- プロバイダーのインポートパスを `@/components/ui/provider` に変更（`@`エイリアス使用）
- AuthProviderのパスを `@/store/AuthContext` に変更（`@`エイリアス使用）
- routesBasicのパスを `@/routesBasic.jsx` に変更（`@`エイリアス使用）

### 2. ルーティング設定

#### `routesBasic.jsx` (新規配置)
```jsx
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Management } from "@/pages/trips/Management";
import { TripPlan } from "@/pages/trips/TripPlan";
import { NewTripPage } from "@/pages/trips/NewTrip";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

export const routesBasic = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/management" element={
          <ProtectedRoute>
            <Management />
          </ProtectedRoute>
        }/>
        <Route path="/trip-plan/:planId" element={
          <ProtectedRoute>
            <TripPlan />
          </ProtectedRoute>
        }/>
        <Route path="/new-trip" element={
          <ProtectedRoute>
            <NewTripPage />
          </ProtectedRoute>
        }/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  )
);
```
**変更点**: 
- `routes/` ディレクトリから `src/` ルートに移動
- インポートパスが新しいディレクトリ構造に対応
- 全インポートで `@` エイリアスを使用

### 3. ユーティリティファイル

#### `utils/mapConsts.js` (新規配置)
```javascript
// Map関連の定数定義

// 地図の基本設定
export const MAP_CONFIG = {
  defaultCenter: { lat: 35.6762, lng: 139.6503 }, // 東京
  defaultZoom: 10,
  size: { width: '600px', height: '500px' },
  refreshDelay: 500, // スポット更新の遅延時間（ms）
};
```
**変更点**: `consts/mapConsts.js` から `utils/mapConsts.js` に移動

#### `utils/mapHelpers.js` (更新)
```javascript
import { MAP_CONFIG } from '@/utils/mapConsts';

// スポット追加後の遅延更新処理
export const refreshSpotsAfterDelay = (planId, loadRegisteredSpots) => {
  setTimeout(() => {
    if (planId) {
      loadRegisteredSpots();
    }
  }, MAP_CONFIG.refreshDelay);
};
```
**変更点**: 
- インポートパスを新しい構造に対応
- `@` エイリアスを使用

#### `utils/planDataFormatter.js` (更新)
```javascript
import { schemas } from "@/utils/index";

// 旅行概要をAPIに送信するためのフォーマットを行う関数
export const formatPlanOverview = (tripData) => {
  const validatedData = schemas.tripSchema.parse(tripData);
  const formattedData = {
    title: validatedData.tripTitle,
    start_date: validatedData.startDate,
    end_date: validatedData.endDate,
  };
  // ...
};
```
**変更点**: 
- スキーマのインポートパスを統合されたインデックスファイルから取得
- `@` エイリアスを使用

#### `utils/index.jsx` (新規)
```javascript
import { tripSchema } from "./tripSchema";
import { planDetailSchema } from "./planDetailSchema";

export const schemas = {
  tripSchema,
  planDetailSchema,
};
```
**機能**: バリデーションスキーマの統合エクスポート

#### `utils/tripSchema.jsx` (移動)
```javascript
import * as z from "zod/v4";

export const tripSchema = z.object({
  tripTitle: z.string().max(255, "旅行名は255文字以内で入力してください。").nullish(),
  startDate: z.string().date('有効な日付を入力してください。').nullish(),
  endDate: z.string().date('有効な日付を入力してください。').nullish(),
}).refine((data) => {
  if (data.startDate > data.endDate) {
    return false;
  }
  // ...
});
```
**変更点**: `validation/tripSchema.jsx` から `utils/tripSchema.jsx` に移動

#### `utils/planDetailSchema.jsx` (移動)
```javascript
import * as z from "zod/v4";

export const planDetailSchema = z.object({
  planId: z.number().int(),
  dayNumber: z.number().int().positive('日数は1以上の整数で入力してください。'),
  type: z.number().int().nullish(),
  title: z.string().max(255, 'タイトルは255文字以内で入力してください。').nullish(),
  // ...
});
```
**変更点**: `validation/planDetailSchema.jsx` から `utils/planDetailSchema.jsx` に移動

#### `utils/errorHandler.js` (新規)
```javascript
import * as z from "zod/v4"; 

/**
 * エラーハンドリング共通部分
 */

// エラーメッセージの定数定義
export const ERROR_MESSAGES = {
  // 一般的なHTTPエラー
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認してください。',
  // ...
};
```
**機能**: 共通エラーハンドリング機能を提供

### 4. 新しいディレクトリに移動したコンポーネント群

#### `components/maps/` (旧 `components/Map/`)
- `GoogleMap.jsx` - Google Maps統合コンポーネント
- `LoadingOverlay.jsx` - マップローディング表示
- `RegisteredSpotInfoWindow.jsx` - 登録済みスポット情報ウィンドウ
- `NewSpotInfoWindow.jsx` - 新規スポット情報ウィンドウ
- `CommonInfoWindow.jsx` - 共通情報ウィンドウ

#### `components/ui/` (旧 `components/button/` + `components/PageTitle/`)
- `AddSpot.jsx` - スポット追加ボタン
- `BackToManagementButton.jsx` - 管理画面戻るボタン
- `PlanCreateButton.jsx` - プラン作成ボタン
- `PageTitle.jsx` - ページタイトルコンポーネント
- `provider.jsx`, `color-mode.jsx`, `toaster.jsx`, `tooltip.jsx` - UI関連プロバイダー

#### `components/layout/`
- `ProtectedRoute.jsx` - 認証保護ルートコンポーネント

#### `components/forms/`
- 各種フォームコンポーネント（旧 `planCreate/` から移動）

#### `pages/auth/` (旧ルートの `pages/`)
- `Login.jsx` - ログインページ
- `Register.jsx` - 登録ページ

#### `pages/trips/` (旧ルートの `pages/`)
- `Management.jsx` - 管理ページ
- `NewTrip.jsx` - 新規旅行作成ページ
- `TripPlan.jsx` - 旅行プランページ

#### `hooks/maps/` (一部旧ルート `hooks/`)
- `useRegisteredSpots.js` - 登録済みスポット管理フック
- `usePlaceSelection.js` - 場所選択フック

#### `hooks/trips/` (旧 `hooks/tripPlan/`)
- `useNewTrip.js` - 新規旅行作成フック
- `usePlanDetails.js` - プラン詳細フック
- `usePlanOverview.js` - プラン概要フック

#### `services/api/` (旧 `api/`)
- `api.jsx` - 基本API設定
- `planDetailApi.js` - プラン詳細API
- `planOverviewApi.js` - プラン概要API

#### `store/` (旧 `contexts/`)
- `AuthContext.jsx` - 認証コンテキスト

## まとめ

この再構成により以下の改善が実現されました：

### ディレクトリ構造の改善
1. **機能別ディレクトリ構造**: 関連するファイルが機能ごとにグループ化
2. **明確な責任分離**: コンポーネント、フック、ページ、サービスが明確に分離
3. **統合されたユーティリティ**: バリデーション、定数、ヘルパー関数が統合管理

### パスエイリアス（`@`）の導入効果
4. **インポートの簡潔性**: `../../` のような長い相対パスが不要
5. **保守性の大幅向上**: ファイル移動時のパス修正が最小限
6. **可読性とナビゲーション**: インポート先が明確で、IDEサポートも向上
7. **開発効率の向上**: より直感的なファイル参照が可能

### 総合的な効果
- **スケーラビリティ**: 新機能追加時の配置場所が明確
- **開発者エクスペリエンス**: 理解しやすく、作業しやすいコードベース
- **チーム開発の円滑化**: 統一されたインポート規則で一貫性を保持

この構造とパスエイリアスの組み合わせにより、プロジェクトの成長に対応しやすく、開発者が理解・保守しやすい現代的なフロントエンド開発環境が構築されています。

## 対象ファイル統計
- **更新されたファイル**: 約15ファイル
- **変更されたインポート**: 約30箇所
- **導入されたパスエイリアス**: 全相対インポートを `@` エイリアスに統一