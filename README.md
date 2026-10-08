# auth0-connection-poc

Auth0 で個人／法人を別々の Database Connection に分け、`/authorize` の `connection` パラメータで切り替える方式を検証するための使い捨て PoC。

- 公開ページ: https://ronny-zzl.github.io/auth0-connection-poc/
- 構成: 静的 SPA（auth0-spa-js + PKCE）を GitHub Pages で配信。Client Secret は使わない。
- 対象: Auth0 の無料開発テナント（本番テナントとは無関係）

検証が終わったら、このリポジトリと Auth0 テナントは削除する。

## ファイル

- [index.html](index.html)：検証ページ本体。テストケースごとのボタン、結果表示、Markdown での結果コピー
- [SETUP.md](SETUP.md)：Auth0 テナントの設定手順（Connection、Post-Login Action、テストユーザー）
- [tools/gen-users.mjs](tools/gen-users.mjs)：テストユーザーの Import 用 JSON を生成。出力先の `private/` は git 管理外

テスト用のメールアドレスとパスワードは公開しない。`private/accounts.md` をチーム内で別途共有する。
