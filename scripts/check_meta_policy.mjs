#!/usr/bin/env node
/**
 * Meta 広告ポリシー (Personal Attributes / Unrealistic Outcomes) 事前 lint
 * LP 公開テキストの中で審査リジェクト常連の表現を検知。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = [
  'lp/index.html',
  'lp/liff.html',
  'lp/privacy/index.html',
];

// data-pending を除外
function stripPendingBlocks(html) {
  return html.replace(
    /<(\w+)[^>]*\bdata-pending\s*=\s*"true"[^>]*>[\s\S]*?<\/\1>/gi,
    ''
  );
}

// Meta Advertising Policies — Personal Attributes
// 二人称で経済・感情・属性の名指しは禁止。
const POLICY_PATTERNS = [
  { pattern: /あなたは[借金困窮負け]/u, cat: 'Personal Attributes (hardship)' },
  { pattern: /頭を下げ(?!たくない)/u, cat: 'Personal Attributes (humiliation)' },
  { pattern: /借金.+あなた/u, cat: 'Personal Attributes (financial)' },
  { pattern: /稼げる(?!る人)(.{0,4}月|.{0,4}確実)/u, cat: 'Unrealistic Outcomes (income)' },
  { pattern: /月収\s*\d+万円(?!の例|の方)/u, cat: 'Unrealistic Outcomes (income claim)' },
  { pattern: /確実に(儲か|稼|勝)/u, cat: 'Unrealistic Outcomes (guarantee)' },
  { pattern: /絶対に(儲か|稼|勝)/u, cat: 'Unrealistic Outcomes (guarantee)' },
  { pattern: /ゼロリスク/, cat: 'Unrealistic Outcomes (no risk)' },
  { pattern: /必ず成功/, cat: 'Unrealistic Outcomes (guarantee)' },
];

let warnings = 0;
let errors = 0;

for (const rel of TARGETS) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  const raw = fs.readFileSync(abs, 'utf-8');
  const sanitized = stripPendingBlocks(raw);
  for (const { pattern, cat } of POLICY_PATTERNS) {
    const m = sanitized.match(pattern);
    if (m) {
      console.error(`POLICY-HIT: ${cat} → "${m[0]}" in ${rel}`);
      errors += 1;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} policy hit(s). Rewrite to avoid Meta Personal Attributes / Unrealistic Outcomes.`);
  process.exit(1);
}
console.log('check_meta_policy.mjs: OK (no policy red flags detected)');
