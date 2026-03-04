# pkg-lens

package.json + package-lock.json を可視化・編集するデスクトップアプリケーション。

複数プロジェクトをタブで切り替え、outdated / audit / 依存ツリーを統合表示する。

## 技術スタック

| レイヤー       | 技術               |
| -------------- | ------------------ |
| シェル         | Electron           |
| フロントエンド | React + TypeScript |
| ビルド         | electron-vite      |

## コマンド

| コマンド            | 説明                          |
| ------------------- | ----------------------------- |
| `npm install`       | 依存パッケージのインストール  |
| `npm run dev`       | 開発サーバー起動              |
| `npm run build`     | プロダクションビルド          |
| `npm run typecheck` | 型チェック（main + renderer） |

## 機能

- プロジェクトタブ切替
- パッケージ一覧（dependencies / devDependencies / peerDependencies）
- outdated 表示（現在 → 最新バージョン差分）
- audit 結果表示（脆弱性レベル別フィルタ）
- 依存ツリー表示
- パッケージの追加・削除・バージョン変更
- ドラッグ&ドロップによる依存カテゴリ間の移動
