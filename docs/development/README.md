# 開発フロー

## タスク管理システム

### タスクチケット形式
タスクは `docs/development/tasks.yml` で管理します。

```yaml
- id: "feature-001"
  branch_name: "feature/user-authentication"
  depends_on: ["setup-001", "design-001"]
  status: "todo"
  overview: "ユーザー認証機能の実装"
  description: |
    JWT（JSON Web Token）を使用したユーザー認証システムを実装する。
    ログイン・ログアウト機能とセッション管理を含む。
  deliverables:
    - JWT認証ライブラリの設定
    - ログイン・ログアウトAPI実装
    - セッション管理機能
    - 認証ミドルウェアの実装
```

### ステータス定義
- `todo`: 未着手、依存関係待ち
- `doing`: 現在作業中
- `review`: PR作成済み、承認待ち
- `blocked`: 依存関係で進められない
- `done`: 承認・マージ完了

## ブランチ戦略
- main: 本番環境用（メインブランチ）
- feature/*: 機能開発用（feature/[task-id]形式）

### ワークフロー
1. タスク開始時: `feature/[task-id]` でブランチ作成
2. 作業完了時: mainへPR作成
3. レビュー完了後: マージしてブランチ削除

## 並列開発のルール

### 依存関係の確認
- タスクを開始する前に `depends_on` をチェック
- 依存タスクが `done` でない場合は `blocked` 状態
