# Auth0 テナント設定手順

この PoC と同じ環境を作るための手順。現在のテナントは `dev-zwom4aj7m0buuspq.us.auth0.com`。

## 1. Application

Applications → 対象アプリ → **Settings**

| 項目                  | 値                                                  |
| --------------------- | --------------------------------------------------- |
| Application Type      | Single Page Application                             |
| Allowed Callback URLs | `https://ronny-zzl.github.io/auth0-connection-poc/` |
| Allowed Logout URLs   | 同上                                                |
| Allowed Web Origins   | 同上                                                |

Domain と Client ID は [index.html](index.html) の `CONFIG` に書く（どちらも公開して問題ない値）。

## 2. Database Connection

Authentication → Database → **Create DB Connection** を 2 回。名前は index.html と一致させる。

1. `personal-database`（先に作る）
2. `corporate-database`

ケース 8 のためにサインアップは有効のままにしておく。

アプリの **Connections** タブで、この 2 つだけを有効にする。`Username-Password-Authentication` と `google-oauth2` は無効にする（ケース 4 の結果がぶれるため）。

## 3. Post-Login Action

ID Token にはどの connection で認証したかが入らない（DB 接続ならどちらも `sub` が `auth0|...` 形式）。判定に必要なので Action で追加する。

Actions → Library → **Create Action** → Build from scratch

- Name: `add-connection-claim`
- Trigger: Login / Post Login

```js
exports.onExecutePostLogin = async (event, api) => {
  const ns = "https://ronny-zzl.github.io/auth0-connection-poc/";
  api.idToken.setCustomClaim(ns + "connection", event.connection.name);
  api.idToken.setCustomClaim(
    ns + "corporateNumbers",
    event.user.app_metadata?.corporateNumbers ?? [],
  );
  api.idToken.setCustomClaim(
    ns + "authMethods",
    event.authentication?.methods ?? [],
  );
};
```

**Deploy** した後、Actions → Triggers → **post-login** を開いて、右の Custom から `add-connection-claim` をフローにドラッグし、**Apply** する。Deploy だけでは動かない。

## 4. テストユーザー

User Import / Export 拡張機能で JSON を取り込む。

```bash
node tools/gen-users.mjs 受信できるメールアドレス
```

次の 3 ファイルができる。

- `private/personal-database.json`：personal-database に Import する（git 管理外）
- `private/corporate-database.json`：corporate-database に Import する（git 管理外）
- `accounts.json`：平文パスワードの一覧。検証ページに表示されるのでコミットする

Extensions → User Import / Export → Import で、connection を選んでそれぞれアップロードする。再生成するとパスワードが変わるので、取り込み直すときは Upsert にチェックを入れる。

## 5. 片付け

検証が終わったら、Auth0 テナント（Tenant Settings → Advanced → Delete）と GitHub リポジトリを削除する。
