# auth0-connection-poc

Auth0 で個人／法人を別々の Database Connection に分け、`/authorize` の `connection` パラメータで切り替える方式を検証するための使い捨て PoC。

- 公開ページ: https://ronny-zzl.github.io/auth0-connection-poc/
- 構成: 静的 SPA（auth0-spa-js + PKCE）を GitHub Pages で配信。Client Secret は使わない。
- 対象: Auth0 の無料開発テナント（本番テナントとは無関係）

検証が終わったら、このリポジトリと Auth0 テナントは削除する。

## ファイル

- [index.html](index.html)：検証ページ本体。テストケースごとのボタン、結果表示、Markdown での結果コピー
- [docs/login-design-points.html](docs/login-design-points.html)：検証結果をもとにした、ログイン画面構成の討議用メモ（公開ページ: https://ronny-zzl.github.io/auth0-connection-poc/docs/login-design-points.html ）
- [SETUP.md](SETUP.md)：Auth0 テナントの設定手順（Connection、Post-Login Action、テストユーザー）
- [accounts.json](accounts.json)：テストアカウント一覧。検証ページに表示される（使い捨てテナント専用なので公開している）
- [tools/gen-users.mjs](tools/gen-users.mjs)：テストユーザーを生成。Import 用 JSON は `private/`（git 管理外）、平文の一覧は `accounts.json` に出す
