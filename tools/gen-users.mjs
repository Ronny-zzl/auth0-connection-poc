#!/usr/bin/env node
// Auth0「User Import / Export」拡張機能用のテストユーザー JSON を生成する。
//   node tools/gen-users.mjs you@gmail.com
// 出力先は private/（.gitignore 済み）。パスワードは実行のたびにランダム生成。
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.argv[2];
if (!base || !/^[^@+\s]+@[^@\s]+$/.test(base)) {
  console.error('usage: node tools/gen-users.mjs you@gmail.com');
  process.exit(1);
}
const [local, domain] = base.split('@');
const alias = (tag) => `${local}+${tag}@${domain}`;

// 英大文字・小文字・数字を必ず含める（Auth0 の "Good" ポリシーを満たす）
const genPassword = (label) => `${label}-${randomBytes(6).toString('base64url')}-9a`;

// Auth0 は $2a$/$2b$ を受け付ける。htpasswd の $2y$ はアルゴリズムが同じなので接頭辞だけ置換する。
const bcrypt = (pw) =>
  execFileSync('htpasswd', ['-nbB', '-C', '10', 'u', pw], { encoding: 'utf8' })
    .trim()
    .slice(2)
    .replace(/^\$2y\$/, '$2b$');

const jiroShared = genPassword('Jiro');
const accounts = [
  // ケース 1〜7：同じメールで、個人と法人のパスワードが違う
  { tag: 'taro', name: '山田 太郎', personal: genPassword('TaroP'), corporate: genPassword('TaroC'),
    corporateNumbers: ['2000011110001'], purpose: 'ケース1〜8（基本）' },
  // パスワードが同じでも、connection ごとに別アカウントになることの確認
  { tag: 'jiro', name: '鈴木 次郎', personal: jiroShared, corporate: jiroShared,
    corporateNumbers: ['2000011110002'], purpose: '同じパスワードでも別アカウントか' },
  // ケース 9：ロックされる前提の専用アカウント
  { tag: 'lock', name: 'ロック 検証', personal: genPassword('LockP'), corporate: genPassword('LockC'),
    corporateNumbers: ['2000011110001'], purpose: 'ケース9（ブルートフォース保護）専用' },
];

const toUser = (a, kind) => ({
  email: alias(a.tag),
  email_verified: true,
  name: a.name,
  password_hash: bcrypt(a[kind]),
  app_metadata: kind === 'corporate' ? { corporateNumbers: a.corporateNumbers } : {},
});

mkdirSync('private', { recursive: true });
writeFileSync('private/personal-database.json', JSON.stringify(accounts.map((a) => toUser(a, 'personal')), null, 2) + '\n');
writeFileSync('private/corporate-database.json', JSON.stringify(accounts.map((a) => toUser(a, 'corporate')), null, 2) + '\n');

const rows = accounts.map((a) => `| ${alias(a.tag)} | \`${a.personal}\` | \`${a.corporate}\` | ${a.purpose} |`);
writeFileSync('private/accounts.md', [
  '# テストアカウント（このファイルは公開しない）',
  '',
  '| メール | personal-database | corporate-database | 用途 |',
  '|---|---|---|---|',
  ...rows,
  '',
].join('\n'));

console.log('generated: private/personal-database.json, private/corporate-database.json, private/accounts.md');
