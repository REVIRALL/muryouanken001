# 運用: LP Netlify デプロイ

## 前提
- Netlify アカウント作成済み（未作成なら次節を参照）
- サイト登録済み（本件では `dairiten-muryoanken1.netlify.app`。未登録なら次節参照）

## 0. Netlify サイトを新規作成する場合（初回のみ）

1. https://app.netlify.com/ にアクセス → GitHub/GitLab/Bitbucket アカウントでログイン（または「Sign up with email」）
2. ダッシュボードで **「Add new site」** → **「Deploy manually」** を選択
3. `lp/` フォルダをドラッグ&ドロップ
4. 自動でランダムサイト名（例 `random-word-12345.netlify.app`）が割り当てられる
5. 「**Site configuration**」→「**Change site name**」でサイト名を変更可能

## 1. 更新デプロイ手順（2回目以降、手動ドラッグ&ドロップ）

1. https://app.netlify.com/ にログイン
2. 対象サイト（例 `dairiten-muryoanken1`）を開く
3. 「**Deploys**」タブ
4. Deploys タブの最下部にドロップゾーン（点線の枠）がある → `lp/` フォルダ全体をドラッグ&ドロップ
5. ビルド完了まで約10〜30秒待機
6. 上部に新しいデプロイURL（`*--*.netlify.app`）が発行される → サイト設定でメインドメインに紐付くようになる

## 2. ファイル構成（重要）

`lp/` の中身はそのままドラッグ対象:
```
lp/
├── index.html                 ← FV + CTA + 本文
├── privacy/
│   └── index.html             ← プライバシーポリシー（/privacy でアクセス可能）
├── _headers                   ← assets配下を長期キャッシュ設定（下記注意）
└── assets/
    ├── *.jpg, *.svg           ← 画像
    ├── cr001.mp4              ← 動画素材（12MB）
    ├── fbevents.js            ← Facebook Pixel 公式ライブラリ
    ├── gtm.js                 ← Google Tag Manager 公式
    └── url-map.json.example   ← UTM→LIFF URLマップのテンプレ（要リネーム）
```

### ⚠️ `_headers` ファイルの罠（Windows）
- Windowsのメモ帳で開いて保存すると**自動で `.txt` 拡張子が付く**（`_headers.txt` になる）
- Netlifyは `_headers`（拡張子なし）でないと認識しない
- 対処: エクスプローラの「表示 → ファイル名拡張子」をONにして、`.txt` が付いていないか確認。付いていたらリネームで削除。
- もしくはVSCode/Sublime Text等のエディタで編集（拡張子を勝手に付けない）

### ⚠️ `url-map.json.example` の処理
LP の index.html は `./assets/url-map.json` を fetch してCTAのLIFF URLを動的差し替えする。このファイルが無いと fetch が失敗し（catchされてLeadイベントは飛ぶが）、CTAリンクが index.html 内のハードコード URL のままになる。

本番デプロイ前に以下のどちらかを実施:
- **A. 動的差し替えを使う**: `url-map.json.example` を `url-map.json` にリネームし、内容を自社のLIFF URLに書き換える。UTM別にマッピング可能
- **B. 動的差し替えを使わない（シンプル）**: `url-map.json.example` を削除し、index.html の全 `<a class="cta-btn">` の `href` を直接本番LIFF URLに書き換える。fetch は catch で握りつぶされるため害なし

## 3. Pixel ID の確認

デプロイ前に `lp/index.html` の以下部分が正しいPixel IDを指しているか確認:
```html
fbq("init","2450922202046153");fbq("track","PageView");
```
```html
<img ... src="https://www.facebook.com/tr?id=2450922202046153&ev=PageView&noscript=1">
```

Pixel ID を変更する場合:
- `index.html` 内の2箇所を全置換

## 4. デプロイ後チェックリスト

- [ ] トップページ: `https://<your-site>.netlify.app/` が200
- [ ] プライバシー: `https://<your-site>.netlify.app/privacy/` が200
- [ ] FV直下のCTAボタンが表示されているか
- [ ] CTAボタンクリックで `line.me` に遷移するか
- [ ] `docs/04-lead-event-verification.md` の手順でLead発火確認

## 5. Netlify CLI（自動化、上級者向け）

手動ドラッグが面倒な場合、CLIでデプロイ可能:

```bash
npm install -g netlify-cli
netlify login
cd lp/
netlify deploy --prod --dir .
```

## 6. 独自ドメイン設定（推奨）

Netlify サブドメイン（`*.netlify.app`）は:
- 信頼性低（ユーザーの心理的離脱要因）
- Meta広告審査で不利な場合あり
- ピクセル計測でAEMの合算イベント測定が弱い

独自ドメイン取得後、Netlify の「Domain Management」から紐付け。SSLは自動発行（Let's Encrypt）。

## 7. `_headers` の仕様

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

assets/配下のファイルは**1年間ブラウザキャッシュ**される。更新時はファイル名を変えるか、index.html 側のパスにクエリパラメータ追加。

HTML側（`index.html`, `privacy/index.html`）はキャッシュ指定なし=Netlifyデフォルト（通常数分のCDNキャッシュ）。

## 8. よくあるトラブル

### デプロイ後もFV下ボタンが出ない
- ブラウザキャッシュが残っている → 強制リロード（Ctrl+Shift+R）
- Netlify側のCDN反映待ち → 5分待機

### /privacy が404
- `privacy/index.html` が `lp/privacy/` に正しく配置されているか確認
- Netlifyは `privacy/` を `/privacy` と `/privacy/` 両方で解決（末尾スラッシュ自動補完）

### Lead イベントが発火しない
- → `docs/04-lead-event-verification.md` のトラブルシューティング参照

## 次へ
→ `04-lead-event-verification.md` でデプロイ後の発火検証
