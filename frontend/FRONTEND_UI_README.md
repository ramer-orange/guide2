# Guide2 Frontend UI/UX Implementation

旅行地図アプリ「Guide2」のフロントエンドUI/UX実装ドキュメントです。

## 🎨 デザイン概要

### コンセプト
- **モバイルファースト**: 片手操作で3タップ以内でMap ↔ Plan往復完結
- **アクセシビリティ重視**: WCAG AA準拠、キーボード操作完結
- **気持ち良いモーション**: 150-200ms、過剰な動き禁止、prefers-reduced-motion配慮

### デザインシステム
- **デザイントークン**: CSS変数ベースの統一されたデザインシステム
- **ダーク/ライトモード**: next-themesを使用したテーマ切替
- **レスポンシブ**: 3ブレークポイント対応（Mobile/Tablet/Desktop）

## 📱 レスポンシブ仕様

### ブレークポイント定義
```css
--breakpoint-mobile: 640px    /* ≤640px */
--breakpoint-tablet: 1024px   /* 641-1024px */
--breakpoint-desktop: 1025px  /* ≥1025px */
```

### レイアウト指針

#### Mobile (≤640px)
- **Map**: 全画面表示
- **Plan**: BottomSheet（スナップ 16%/50%/88%）
- **CTA**: 右下固定フローティングボタン
- **最小タップ領域**: 48px

#### Tablet (641-1024px) 
- **構成**: 上段Map、下段Plan（40:60比率）
- **タブナビゲーション**: Day切り替えタブ
- **サイドバー**: なし

#### Desktop (≥1025px)
- **構成**: Map:Plan = 2:1の2カラム、Plan固定
- **Toolbar**: 右上マップツールバー
- **詳細情報**: 拡張された情報密度

## 🎯 主要コンポーネント

### 1. MapView (GoogleMap.jsx)
```javascript
// 機能
- 右上MapToolbar（ズーム・現在地・フィルタ）
- ピン選択時：scale(1.05) + shadow効果
- 関連カードの右からスライドイン
- クラスタ個数バッジ表示
```

### 2. PlaceCard (PlaceCard.jsx)  
```javascript
// 情報密度（中）
- 名前/評価/カテゴリ/営業時間/距離
- 写真スケルトンローディング
- CTA配置：モバイル右下固定、デスクトップカード内
```

### 3. PlanPanel/BottomSheet
```javascript
// モバイル：BottomSheet（3段階スナップ）
// デスクトップ：右ペイン固定
- 日タブ（Day1/2/…）
- DnDハンドル視覚化
- 追加後ハイライトスクロール
- 日別移動時間サマリ
```

### 4. 共通UIコンポーネント

#### Toast (Toast.jsx)
- 4種類：SUCCESS/WARNING/ERROR/INFO
- 自動消去（3秒、エラーは5秒）
- モーションレデュースド対応
- キーボード操作（Escape）

#### AddToPlanDialog (AddToPlanDialog.jsx) 
- 2段構成：上段（日付/時刻）、下段（メモ）
- Enter追加、Esc閉じる
- フォーカストラップ実装
- フォームバリデーション

#### Button/IconButton (Button.jsx)
- 6種類バリアント：PRIMARY/SECONDARY/OUTLINE/GHOST/DANGER/SUCCESS  
- 5種類サイズ：XS/SM/MD/LG/XL
- ロード状態、フローティングアクション対応
- フォーカスリング、最小タップ領域

## 🎨 デザイントークン仕様

### カラーパレット
```css
/* ライトモード */
--bg: #ffffff;
--surface: #f8f9fa;
--text: #1a202c;
--primary: #2563eb;
--accent: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;

/* ダークモード */
[data-theme="dark"] {
  --bg: #0d1117;
  --surface: #161b22;
  --text: #f0f6fc;
  --primary: #58a6ff;
  /* ... */
}
```

### エレベーション（影）
```css
--elev1: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--elev2: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--elev3: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--elev4: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### スペーシング
```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-12: 48px; --space-16: 64px;
```

### アニメーション
```css
--duration-fast: 150ms;
--duration-normal: 200ms; 
--duration-slow: 300ms;
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

## ♿ アクセシビリティ実装

### キーボードナビゲーション
- **Tab順序**: ピン→カード→追加→Plan反映まで完結
- **Enterキー**: 全主要アクション実行可能
- **Escキー**: ダイアログ/モーダル閉じる
- **Arrow Keys**: BottomSheetサイズ変更、Tabナビゲーション

### ARIA属性
```javascript
// ダイアログ
role="dialog" aria-modal="true" 
aria-labelledby="dialog-title"
aria-describedby="dialog-description"

// 状態管理
aria-selected aria-expanded aria-live="polite"

// フォーカス管理
:focus-visible { outline: 2px solid var(--outline-focus); }
```

### スクリーンリーダー対応
- **Live Regions**: 動的コンテンツ変更の通知
- **Skip Links**: メインコンテンツへのジャンプ
- **Landmark Roles**: navigation, main, complementary
- **Alternative Text**: 画像、アイコンの説明

### カラーコントラスト
- **AA準拠**: 4.5:1以上のコントラスト比
- **フォーカスリング**: 明確に識別可能
- **カラー以外の手がかり**: 形、アイコンで状態表現

## 🎬 マイクロインタラクション

### ピンインタラクション  
```css
/* Hover: 80msで影+微スケール */
.pin:hover { 
  transform: scale(1.05);
  box-shadow: var(--elev2);
  transition: all 80ms var(--ease-out);
}

/* 選択: 150-200msでスプリング風 */
.pin--selected {
  transform: scale(1.1);
  z-index: 1000;
  animation: bounce 200ms var(--ease-out);
}
```

### カード出現
```css
/* fade + slide(12px) */
.card-enter {
  opacity: 0;
  transform: translateX(12px);
}
.card-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all var(--duration-normal) var(--ease-out);
}
```

### DnD状態
```css
.dragging {
  opacity: 0.7;
  transform: rotate(5deg);
  box-shadow: var(--elev3);
}
.placeholder {
  border: 2px dashed var(--primary);
  background: var(--surface);
}
```

### Toast通知
```css
/* 上から0.8sでfade-in→3s後にfade-out */
.toast {
  animation: slideInDown 200ms var(--ease-out),
             slideOutUp 200ms var(--ease-out) 3s;
}
```

## 🛠 開発・ビルド

### 環境変数
```bash
# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 開発コマンド
```bash
# 開発サーバー起動
npm run dev

# 本番ビルド 
npm run build

# Lint実行
npm run lint

# Storybook起動（コンポーネント確認）
npm run storybook
```

### ディレクトリ構造
```
frontend/src/
├── components/
│   ├── ui/                 # 共通UIコンポーネント
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Toast.jsx
│   │   ├── BottomSheet.jsx
│   │   ├── PlanPanel.jsx
│   │   ├── MapToolbar.jsx
│   │   └── PlaceCard.jsx
│   ├── maps/              # 地図関連
│   └── forms/             # フォーム関連
├── hooks/
│   ├── useBreakpoint.js   # レスポンシブフック
│   └── ...
├── styles/
│   ├── tokens.css         # デザイントークン
│   └── index.css          # グローバルスタイル
└── utils/
```

## 📋 クラス命名規約

### BEMスタイル
```css
.component-name              /* Block */
.component-name__element     /* Element */
.component-name--modifier    /* Modifier */

例:
.place-card
.place-card__header
.place-card__image  
.place-card--selected
.place-card--loading
```

### ユーティリティクラス
```css
.sr-only          /* スクリーンリーダー専用 */
.focus-ring       /* フォーカスリング */
.tap-target       /* 最小タップ領域 */
.fade-in          /* フェードイン */
.slide-up         /* スライドアップ */
.mobile-only      /* モバイル専用表示 */
.desktop-only     /* デスクトップ専用表示 */
```

## 🧪 品質管理

### 受け入れ基準（Definition of Done）

#### ✅ 機能要件
- [x] 3ブレークポイント（Mobile/Tablet/Desktop）で崩れなし
- [x] 主要CTAが常に可視域内
- [x] Map ↔ Planの往復が片手3タップ以内で完結

#### ✅ アクセシビリティ
- [x] ダーク/ライトで文字コントラストWCAG AA達成
- [x] キーボード操作でピン→カード→追加→Plan反映まで完結
- [x] スクリーンリーダーで全機能利用可能
- [x] フォーカスリング明確に表示

#### ✅ パフォーマンス
- [x] ボトムシートのスワイプ/スナップが自然
- [x] 追加直後にPlanアイテムへハイライトスクロール発火
- [x] prefers-reduced-motionに対応
- [x] タップ領域最小48px確保

#### ✅ 品質
- [x] ESLint通過
- [x] 型安全性確保（JSDocコメント）
- [x] コンポーネント単体テスト（Storybook）

## 🚀 パフォーマンス最適化

### バンドルサイズ
- Tree-shakingによる未使用コード削除
- 動的import使用でコード分割
- CSS-in-JSのランタイム最小化

### レンダリング最適化  
- React.memo使用でコンポーネント再描画抑制
- useMemo/useCallbackでパフォーマンス向上
- VirtualizedList（将来実装予定）

### アクセシビリティパフォーマンス
- フォーカス管理の最適化
- ARIA属性の動的更新最小化
- スクリーンリーダー読み上げの配慮

## 🔧 トラブルシューティング

### よくある問題

#### ダークモード切替が反映されない
```javascript
// 解決策：html要素にdata-theme属性確認
document.documentElement.setAttribute('data-theme', 'dark');
```

#### BottomSheetが正しく動作しない
```javascript  
// 解決策：viewport高さ設定確認
height: 100vh; /* ブラウザによっては100dvh */
height: -webkit-fill-available; /* Safari対応 */
```

#### Google Maps APIキーエラー
```bash
# 解決策：環境変数設定確認
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### ブラウザ対応
- **モダンブラウザ**: Chrome/Firefox/Safari/Edge最新版
- **レガシー**: CSS Grid、Flexbox必須
- **モバイル**: iOS Safari、Android Chrome

## 📚 参考資料

### デザインガイドライン
- [Material Design 3](https://m3.material.io/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/AA/)

### ライブラリドキュメント
- [Chakra UI v3](https://chakra-ui.com/)
- [React Router DOM](https://reactrouter.com/)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [@vis.gl/react-google-maps](https://visgl.github.io/react-google-maps/)

---

**実装者**: Claude（AI Assistant）  
**実装日**: 2024年  
**バージョン**: 1.0.0