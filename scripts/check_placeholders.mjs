#!/usr/bin/env node
/**
 * プレースホルダ残存チェック
 * 公開前に本番に入ってはいけないパターンを検出。
 * data-pending="true" がついたセクション内は意図的に隠されているため除外。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = [
  'lp/index.html',
  'lp/liff.html',
  'lp/privacy/index.html',
];

const PATTERNS = [
  { pattern: /\[差し替え\]/, name: '[差し替え]' },
  { pattern: /\bXXXX\b/, name: 'XXXX' },
  { pattern: /\bXXX-XXXX\b/, name: 'XXX-XXXX' },
  { pattern: /〇〇/u, name: '〇〇' },
  { pattern: /example\.jp/i, name: 'example.jp' },
  { pattern: /example\.com/i, name: 'example.com' },
  { pattern: /0000-0000-0000/, name: '0000-0000-0000' },
];

// data-pending="true" を持つタグ要素全体（その子孫含む）を除外する超簡易スキャン
function stripPendingBlocks(html) {
  // <section data-pending="true">...</section> 単純ケース、ネスト未対応でもOK
  return html.replace(
    /<(\w+)[^>]*\bdata-pending\s*=\s*"true"[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  ).replace(
    /<(\w+)[^>]*\bdata-pending\s*=\s*"true"[^>]*\/?>/gi,
    ''
  );
}

let errors = 0;
for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const raw = fs.readFileSync(abs, 'utf-8');
  const sanitized = stripPendingBlocks(raw);
  for (const { pattern, name } of PATTERNS) {
    if (pattern.test(sanitized)) {
      console.error(`ERROR: placeholder "${name}" remains in ${rel}`);
      errors += 1;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} placeholder violation(s). Fill values or mark section with data-pending="true".`);
  process.exit(1);
}
console.log('check_placeholders.mjs: OK (no visible placeholders)');
