# auth0-connection-poc

Auth0 で個人／法人を別々の Database Connection に分け、`/authorize` の `connection` パラメータで切り替える方式を検証するための使い捨て PoC。

- 公開ページ: https://ronny-zzl.github.io/auth0-connection-poc/
- 構成: 静的 SPA（auth0-spa-js + PKCE）を GitHub Pages で配信。Client Secret は使わない。
- 対象: Auth0 の無料開発テナント（本番テナントとは無関係）

検証が終わったら、このリポジトリと Auth0 テナントは削除する。
