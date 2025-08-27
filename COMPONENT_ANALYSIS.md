# コンポーネント構造分析

## UIコンポーネント概要

### **Pages（ページコンポーネント）**
- `Login.jsx` - ログインページ
- `Register.jsx` - ユーザー登録ページ  
- `Management.jsx` - 管理画面（プラン一覧）
- `NewTrip.jsx` - 新規旅行作成ページ
- `TripPlan.jsx` - 旅行プラン編集ページ
- `Home.jsx` - ホームページ

### **Map関連コンポーネント**
- `GoogleMap.jsx` - Google Maps統合メインコンポーネント
- `RegisteredSpotInfoWindow.jsx` - 登録済みスポット情報ウィンドウ
- `NewSpotInfoWindow.jsx` - 新規スポット情報ウィンドウ
- `CommonInfoWindow.jsx` - 共通情報ウィンドウコンポーネント
- `LoadingOverlay.jsx` - マップローディング表示

### **Button/UI要素**
- `AddSpot.jsx` - スポット追加ボタン
- `BackToManagementButton.jsx` - 管理画面戻るボタン
- `PlanCreateButton.jsx` - プラン作成ボタン
- `PageTitle.jsx` - ページタイトル表示

### **フォーム/入力関連**
- `planOverview.jsx` - 旅行概要フォーム
- `PlanDetailItem.jsx` - プラン詳細アイテム
- `NewTripOverview.jsx` - 新規旅行概要フォーム
- `CurrentDay.jsx` - 現在の日付表示

### **認証・ルーティング**
- `ProtectedRoute.jsx` - 認証保護ルートコンポーネント
- `AuthContext.jsx` - 認証コンテキスト

## 主なUI機能

### **旅行管理アプリケーション**
1. **認証機能** - ログイン/登録
2. **旅行プラン管理** - 作成/編集/削除
3. **地図統合** - Google Maps でのスポット選択・登録
4. **日程管理** - 日別のプラン詳細編集

### **技術スタック**
- **UI Framework**: React 18+
- **地図**: Google Maps API (@vis.gl/react-google-maps)
- **ルーティング**: React Router
- **フォーム**: react-hook-form-mui
- **UI Components**: Material-UI (@mui/material)
- **スタイリング**: CSS + Chakra UI (@chakra-ui/react)

### **推奨確認方法**

1. **実際のUI確認**:
   ```bash
   cd frontend && npm run dev
   ```

2. **Storybook導入**（推奨）:
   ```bash
   npx storybook@latest init
   npm run storybook
   ```

3. **React DevTools使用**:
   - ブラウザ拡張機能をインストール
   - 開発者ツールでコンポーネント階層を確認

4. **VSCode拡張機能**:
   - ES7+ React/Redux/React-Native snippets
   - Auto Rename Tag
   - Bracket Pair Colorizer

### **コンポーネント関係図**
```
App
├── AuthProvider
├── RouterProvider
    ├── Home
    ├── Login/Register (認証)
    ├── Management (プラン一覧)
    ├── NewTrip (新規作成)
    └── TripPlan (詳細編集)
        ├── GoogleMap
        │   ├── RegisteredSpotInfoWindow
        │   ├── NewSpotInfoWindow
        │   └── LoadingOverlay
        ├── PlanOverview
        ├── PlanDetailItem
        └── CurrentDay
```