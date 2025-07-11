This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## フォロー機能の実装

### 概要
チャレンジ・進捗管理アプリにフォロー機能を追加しました。ユーザーは他のユーザーをフォローし、フォロー中のユーザーの活動を追跡できます。

### 実装内容

#### 1. データベース設計
- `follows`テーブル：フォロー関係を管理
- フォロー数・フォロワー数取得関数
- RLS（Row Level Security）ポリシー設定

#### 2. API実装
- `POST /api/follow`：フォロー実行
- `DELETE /api/follow`：フォロー解除
- `GET /api/follow`：フォロー状態確認・一覧取得

#### 3. フロントエンド実装
- `FollowButton`コンポーネント：フォロー/フォロー解除ボタン
- `FollowList`コンポーネント：フォロワー/フォロー中一覧表示
- `UserStats`コンポーネント：フォロー統計表示
- `UserProfileHeader`コンポーネント：フォローボタン統合

#### 4. 通知機能
- フォロー時に通知を自動生成
- `notifications`テーブルに`follow`タイプで保存

### セットアップ手順

1. Supabaseで`supabase-follows-setup.sql`を実行
2. 環境変数の設定確認
3. アプリケーションの起動

### 使用方法

1. ユーザープロフィールページでフォローボタンをクリック
2. フォロー統計をクリックしてフォロワー/フォロー中一覧を表示
3. フォロー中のユーザーの活動を追跡

### 技術仕様

- **フレームワーク**: Next.js 14 (App Router)
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **型安全性**: TypeScript
- **UI**: インラインスタイル（CSS-in-JS）

## 検索・フィルター機能の実装

### 概要
チャレンジ・進捗管理アプリに包括的な検索・フィルター機能を追加しました。ユーザーはチャレンジ、ユーザー、地域、カテゴリで検索・フィルタリングできます。

### 実装内容

#### 1. データベース設計
- **検索インデックス**: タイトル・説明文、ユーザー名、地域の高速検索用
- **全文検索**: PostgreSQLの全文検索機能を活用
- **検索履歴**: ユーザーの検索履歴を保存・管理
- **パフォーマンス最適化**: 適切なインデックスと関数

#### 2. API実装
- **`GET /api/search`**: 統合検索API
  - キーワード検索
  - カテゴリフィルター
  - 地域フィルター
  - 検索タイプ指定（all, challenges, users, categories, locations）

#### 3. フロントエンド実装
- **`SearchLayout`**: 検索ページのレイアウト
- **`SearchBar`**: 検索クエリ入力・検索実行
- **`SearchFilters`**: 検索タイプ・カテゴリ・地域フィルター
- **`SearchResults`**: 検索結果の表示
- **検索ヒント**: 人気の検索キーワード表示

#### 4. 検索機能
- ✅ チャレンジ検索（タイトル・説明文）
- ✅ ユーザー検索（ユーザー名・自己紹介）
- ✅ カテゴリ検索・フィルター
- ✅ 地域検索・フィルター
- ✅ 複合検索（キーワード + フィルター）
- ✅ 検索履歴保存
- ✅ リアルタイム検索結果表示
- ✅ 検索結果のカテゴリ別表示

#### 5. フィルター機能
- ✅ 検索タイプ選択（すべて、チャレンジ、ユーザー、カテゴリ、地域）
- ✅ カテゴリドロップダウン（動的取得）
- ✅ 地域ドロップダウン（動的取得）
- ✅ フィルタークリア機能
- ✅ アクティブフィルター表示

### セットアップ手順

1. Supabaseで`supabase-search-setup.sql`を実行
2. 検索ページにアクセス: `/search`
3. ヘッダーの「検索」リンクから利用可能

### 使用方法

1. **キーワード検索**: 検索バーにキーワードを入力
2. **フィルター適用**: 検索タイプ、カテゴリ、地域を選択
3. **結果閲覧**: カテゴリ別に整理された検索結果を確認
4. **詳細表示**: チャレンジ・ユーザー詳細ページへのリンク

### 技術仕様

- **全文検索**: PostgreSQL `to_tsvector` / `plainto_tsquery`
- **インデックス**: GINインデックス（高速検索）
- **検索履歴**: ユーザー別検索履歴保存
- **パフォーマンス**: 適切なインデックスとクエリ最適化
- **UI/UX**: 直感的な検索インターフェース

## モバイル最適化の実装

### 概要
チャレンジ・進捗管理アプリをモバイルデバイスに最適化しました。スマートフォンでの使いやすさを大幅に向上させ、タッチ操作とレスポンシブデザインを実装しました。

### 実装内容

#### 1. モバイルユーティリティ
- **`src/lib/mobile-utils.ts`**: モバイル最適化のためのユーティリティ関数
  - デバイスタイプ検出（モバイル・タブレット・デスクトップ）
  - タッチデバイス検出
  - モバイル向けスタイル定義
  - タッチ操作最適化
  - レスポンシブレイアウト

#### 2. モバイルナビゲーション
- **`MobileNavigation`コンポーネント**: モバイル専用ナビゲーション
  - ボトムナビゲーション（モバイル）
  - ハンバーガーメニュー（追加メニュー）
  - タッチ操作最適化
  - デスクトップ用ナビゲーション（従来）

#### 3. モバイル地図
- **`MobileMapView`コンポーネント**: モバイル最適化地図
  - タッチ操作対応（ピンチズーム、スワイプ）
  - モバイル用コントロール（ズーム、現在地、フルスクリーン）
  - カスタムマーカーアイコン
  - モバイル用詳細表示オーバーレイ
  - 統計表示

#### 4. モバイルフォーム
- **`MobileForm`コンポーネント**: モバイル最適化フォーム
  - タッチ操作対応入力フィールド
  - ファイルアップロード最適化
  - 位置情報取得機能
  - バリデーション表示
  - キーボード回避スペース

#### 5. レスポンシブデザイン
- **ヘッダー**: モバイル・デスクトップ対応
- **チャレンジ作成**: モバイル専用フォーム
- **地図ページ**: モバイル最適化表示
- **グローバルCSS**: モバイル用スタイル定義

#### 6. タッチ操作最適化
- **最小タッチターゲット**: 44px × 44px（iOS推奨）
- **タッチフィードバック**: 視覚的フィードバック
- **スワイプ検出**: ジェスチャー操作
- **タップハイライト**: 無効化（見た目向上）

#### 7. パフォーマンス最適化
- **フォントサイズ**: iOSズーム防止（16px以上）
- **スクロール**: スムーズスクロール
- **画像**: レスポンシブ画像
- **レイアウト**: モバイルファースト設計

### セットアップ手順

1. モバイルユーティリティの確認
2. レスポンシブCSSの適用確認
3. モバイルデバイスでの動作確認

### 使用方法

1. **モバイルナビゲーション**: ボトムナビゲーションで主要機能にアクセス
2. **地図操作**: タッチ操作で地図を操作、マーカーをタップして詳細表示
3. **投稿**: モバイル最適化フォームでチャレンジ・進捗を投稿
4. **検索**: タッチ操作で検索・フィルター機能を利用

### 技術仕様

- **レスポンシブデザイン**: CSS Media Queries
- **タッチ操作**: Touch Events API
- **デバイス検出**: JavaScript + CSS
- **パフォーマンス**: モバイル最適化
- **アクセシビリティ**: タッチターゲットサイズ
- **ブラウザ対応**: iOS Safari, Android Chrome

### モバイル対応機能

- ✅ ボトムナビゲーション
- ✅ タッチ操作地図
- ✅ モバイル最適化フォーム
- ✅ レスポンシブレイアウト
- ✅ タッチ操作最適化
- ✅ パフォーマンス最適化
- ✅ アクセシビリティ対応

## PWA対応の実装

### 概要
チャレンジ・進捗管理アプリをPWA（Progressive Web App）対応しました。モバイルアプリのような使用体験を提供し、ホーム画面への追加、オフライン対応、スプラッシュ画面などの機能を実装しました。

### 実装内容

#### 1. PWA設定
- **`public/manifest.json`**: PWAの基本設定
  - アプリ名: 「チャレンジマップ」
  - テーマカラー: `#3b82f6`（青系）
  - 表示モード: `standalone`（ブラウザUI非表示）
  - ショートカット機能: 新規作成、マイページ、地図探索

#### 2. アイコン設計
- **メインアイコン**: 地図とチャレンジマーカーをモチーフにしたデザイン
- **複数サイズ対応**: 72x72〜512x512（8種類）
- **ショートカットアイコン**: 機能別アイコン（新規作成、マイページ、地図）
- **アダプティブアイコン**: `maskable`対応

#### 3. Service Worker設定
- **`next-pwa`**: Next.js用PWAプラグイン
- **キャッシュ戦略**: 
  - フォント: CacheFirst（1年）
  - 画像: StaleWhileRevalidate（24時間）
  - API: NetworkFirst（10秒タイムアウト）
  - 静的ファイル: CacheFirst（365日）

#### 4. インストール促進
- **`PWAInstallPrompt`コンポーネント**: インストール促進UI
  - 自動表示（条件満たした場合）
  - インストール/後で選択
  - 既にインストール済みの場合は非表示

#### 5. オフライン対応
- **`OfflineNotification`コンポーネント**: オフライン状態通知
  - オンライン/オフライン検出
  - 視覚的フィードバック
  - 機能制限の案内

#### 6. メタデータ最適化
- **HTMLヘッダー**: PWA用metaタグ追加
- **Apple対応**: iOS用設定
- **Windows対応**: browserconfig.xml
- **SNS対応**: OGP・Twitter Card

#### 7. パフォーマンス最適化
- **プリキャッシュ**: 重要なリソースを事前キャッシュ
- **ランタイムキャッシュ**: 動的コンテンツの効率的キャッシュ
- **オフライン対応**: 基本的な機能のオフライン利用

### セットアップ手順

1. **依存関係のインストール**:
   ```bash
   npm install next-pwa
   ```

2. **アイコンの準備**:
   - `public/icons/`に各サイズのPNGアイコンを配置
   - SVGアイコンからPNGへの変換（手動または自動化）

3. **設定ファイルの確認**:
   - `next.config.ts`: PWA設定
   - `public/manifest.json`: アプリ設定
   - `public/browserconfig.xml`: Windows対応

4. **動作確認**:
   - Chrome DevToolsの「アプリケーション」タブでPWAチェック
   - インストール機能のテスト
   - オフライン動作の確認

### 使用方法

1. **インストール**: ブラウザのインストールプロンプトに従ってホーム画面に追加
2. **ショートカット**: ホーム画面から直接機能にアクセス
3. **オフライン利用**: 基本的な機能をオフラインでも利用可能
4. **アプリ体験**: ブラウザUIなしでネイティブアプリのような体験

### 技術仕様

- **PWAフレームワーク**: next-pwa
- **Service Worker**: Workbox
- **キャッシュ戦略**: CacheFirst, NetworkFirst, StaleWhileRevalidate
- **アイコン形式**: PNG（複数サイズ）、SVG
- **ブラウザ対応**: Chrome, Safari, Firefox, Edge
- **プラットフォーム**: iOS, Android, Windows, macOS

### PWA対応機能

- ✅ ホーム画面追加
- ✅ オフライン対応
- ✅ インストール促進
- ✅ ショートカット機能
- ✅ スプラッシュ画面
- ✅ アプリアイコン
- ✅ フルスクリーンモード
- ✅ オフライン通知
- ✅ キャッシュ戦略
- ✅ パフォーマンス最適化

### アイコン作成手順

1. **SVGアイコンの確認**: `public/icons/icon.svg`
2. **HTMLファイルの生成**: `node scripts/generate-pwa-icons.js`
3. **PNG変換**: ブラウザでHTMLファイルを開いてスクリーンショット
4. **配置**: 生成されたPNGファイルを`public/icons/`に配置

### デバッグ・テスト

1. **Chrome DevTools**: 「アプリケーション」タブでPWAスコア確認
2. **Lighthouse**: PWAスコアの測定
3. **実機テスト**: 実際のデバイスでのインストール・動作確認
4. **オフラインテスト**: ネットワーク切断時の動作確認
