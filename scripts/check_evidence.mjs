#!/usr/bin/env node
/**
 * 景表法 7 条 2 項（不実証広告規制）対応 lint
 * LP に数値的主張（「提携〇社」「累計〇件」「〇年目」等）が**実数値で**記載されているとき、
 * docs/evidence/ に合理的根拠資料（1ファイル以上、.gitkeep 除く）が存在することを必須化する。
 *
 * data-pending="true" or "準備中" の状態では検出対象外。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EVIDENCE_DIR = path.join(ROOT, 'docs/evidence');
const TARGETS = ['lp/index.html'];

function stripPendingBlocks(html) {
  return html.replace(
    /<(\w+)[^>]*\bdata-pending\s*=\s*"true"[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  );
}

// 数値主張パターン（placeholder "準備中" を含まない、具体数値のみ検出）
const CLAIM_PATTERNS = [
  { pattern: /提携[^\n]*?(\d+)\s*社/, cat: '提携代理店数' },
  { pattern: /累計[^\n]*?(\d+)\s*件/, cat: '累計紹介実績' },
  { pattern: /(\d+)\s*年目/, cat: '運営歴' },
  { pattern: /取引[^\n]*?(\d+)\s*団体/, cat: '取引コミュニティ数' },
];

function hasEvidence() {
  if (!fs.existsSync(EVIDENCE_DIR)) return false;
  const items = fs.readdirSync(EVIDENCE_DIR)
    .filter((n) => n !== '.gitkeep' && n !== 'README.md');
  return items.length > 0;
}

let violations = 0;

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const raw = fs.readFileSync(abs, 'utf-8');
  const sanitized = stripPendingBlocks(raw);
  // 「準備中」プレースホルダ周辺は除外
  const noPending = sanitized.replace(/<span[^>]*class="stat-pending"[^>]*>[^<]*<\/span>/g, '');
  for (const { pattern, cat } of CLAIM_PATTERNS) {
    const m = noPending.match(pattern);
    if (m) {
      if (!hasEvidence()) {
        console.error(`ERROR: claim "${cat}: ${m[0]}" requires evidence in docs/evidence/`);
        violations += 1;
      } else {
        console.log(`OK: claim "${cat}: ${m[0]}" with evidence on file.`);
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} claim(s) without evidence. Either add files to docs/evidence/ or revert to <span class="stat-pending">準備中</span>.`);
  process.exit(1);
}
console.log('check_evidence.mjs: OK');
