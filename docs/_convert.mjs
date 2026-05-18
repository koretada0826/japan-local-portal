import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "/tmp/node_modules/marked/lib/marked.esm.js";

const HEAD = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
  :root {
    --brand: #ff6b35;
    --brand-deep: #d94c1a;
    --brand-hover: #ea580c;
    --brand-soft: #fff4ee;
    --brand-tint: #ffe5d5;
    --brand-peach: #fdba74;
    --fg: #1f2937;
    --fg-soft: #374151;
    --muted: #6b7280;
    --muted-soft: #9ca3af;
    --border: #e8e6e1;
    --border-soft: #f0eeea;
    --bg-soft: #faf9f6;
    --paper: #ffffff;
    --page-bg: #f5f3ef;
  }
  * { box-sizing: border-box; }
  body {
    font-family: "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Yu Gothic", "Meiryo", -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.85;
    color: var(--fg);
    background:
      radial-gradient(circle at 10% 0%, rgba(255,107,53,.04) 0%, transparent 40%),
      radial-gradient(circle at 90% 100%, rgba(253,186,116,.05) 0%, transparent 40%),
      var(--page-bg);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-feature-settings: "palt";
  }
  /* 紙のプロポーザル感を出す中央カード */
  .doc {
    max-width: 920px;
    margin: 3em auto 4em;
    background: var(--paper);
    padding: 4em 4em 5em;
    border-radius: 8px;
    box-shadow:
      0 1px 2px rgba(0,0,0,.04),
      0 8px 24px rgba(0,0,0,.06),
      0 20px 60px rgba(0,0,0,.04);
    position: relative;
    overflow: hidden;
  }
  /* 上部ブランドストライプ */
  .doc::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 6px;
    background:
      linear-gradient(90deg, var(--brand) 0%, var(--brand-peach) 50%, var(--brand) 100%);
  }
  /* 右下のブランドウォーターマーク（控えめ） */
  .doc::after {
    content: "MACHI SELECT";
    position: absolute;
    right: 1.6em;
    bottom: 1.2em;
    font-size: .7em;
    letter-spacing: .4em;
    color: var(--muted-soft);
    opacity: .35;
    font-weight: 700;
    pointer-events: none;
  }

  /* ─────  タイポグラフィ  ───── */
  h1 {
    font-size: 2.3em;
    font-weight: 800;
    color: var(--fg);
    margin: 0 0 1.2em;
    padding: 0;
    border: none;
    line-height: 1.3;
    letter-spacing: -.01em;
    position: relative;
  }
  h1::after {
    content: "";
    display: block;
    width: 56px;
    height: 4px;
    background: var(--brand);
    margin-top: .6em;
    border-radius: 2px;
  }
  h2 {
    font-size: 1.6em;
    font-weight: 800;
    margin: 3em 0 1em;
    padding: 0 0 0 .8em;
    border: none;
    border-left: 5px solid var(--brand);
    line-height: 1.4;
    letter-spacing: -.005em;
    color: var(--fg);
  }
  h3 {
    font-size: 1.18em;
    font-weight: 700;
    margin: 2em 0 .6em;
    padding: 0 0 0 .7em;
    color: var(--brand-deep);
    border-left: 3px solid var(--brand-peach);
    line-height: 1.45;
  }
  h4 {
    font-size: 1.02em;
    font-weight: 700;
    margin: 1.6em 0 .5em;
    color: var(--fg);
  }
  p { margin: .9em 0; font-size: .98em; }
  ul, ol { padding-left: 1.5em; margin: .9em 0; }
  li { margin: .4em 0; }
  li::marker { color: var(--brand); }
  ol li::marker { font-weight: 700; }
  strong {
    color: var(--brand-deep);
    font-weight: 700;
  }
  a {
    color: var(--brand);
    text-decoration: none;
    border-bottom: 1px solid rgba(255,107,53,.3);
    transition: border-color .2s;
  }
  a:hover { border-color: var(--brand); }

  /* ─────  テーブル  ───── */
  table {
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5em 0;
    width: 100%;
    font-size: .94em;
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,.03);
  }
  thead { background: linear-gradient(180deg, var(--brand-deep), var(--brand)); }
  th {
    color: #fff;
    font-weight: 700;
    letter-spacing: .03em;
    padding: .85em 1em;
    text-align: left;
    border: none;
    font-size: .92em;
  }
  td {
    padding: .8em 1em;
    border: none;
    border-top: 1px solid var(--border-soft);
    vertical-align: top;
  }
  tbody tr:first-child td { border-top: none; }
  tbody tr:nth-child(even) { background: rgba(255,107,53,.025); }
  tbody tr:hover { background: var(--brand-soft); }

  /* ─────  引用（プルクオート） ───── */
  blockquote {
    border: none;
    background:
      linear-gradient(135deg, var(--brand-soft) 0%, #fff 100%);
    margin: 2em 0;
    padding: 1.4em 1.8em 1.4em 3.4em;
    color: var(--fg);
    border-radius: 12px;
    border-left: 4px solid var(--brand);
    position: relative;
    font-size: 1.02em;
    font-weight: 500;
    box-shadow: 0 2px 12px rgba(255,107,53,.05);
  }
  blockquote::before {
    content: "“";
    position: absolute;
    left: .5em;
    top: -.05em;
    font-size: 3.8em;
    color: var(--brand);
    font-family: Georgia, serif;
    line-height: 1;
    font-weight: 700;
    opacity: .55;
  }
  blockquote p { margin: .3em 0; }

  /* ─────  装飾HR  ───── */
  hr {
    margin: 3em 0;
    border: none;
    height: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  hr::before {
    content: "";
    position: absolute;
    left: 0; right: 0; top: 50%;
    height: 1px;
    background: var(--border);
  }
  hr::after {
    content: "◆";
    position: relative;
    background: var(--paper);
    padding: 0 1em;
    color: var(--brand);
    font-size: .7em;
    opacity: .6;
  }

  /* ─────  Code  ───── */
  code {
    background: var(--bg-soft);
    padding: .15em .4em;
    border-radius: 4px;
    font-family: Menlo, Monaco, monospace;
    font-size: .9em;
    color: var(--brand-deep);
  }
  pre {
    background: var(--bg-soft);
    padding: 1em 1.2em;
    border-radius: 8px;
    overflow-x: auto;
    font-size: .85em;
    line-height: 1.6;
    border-left: 3px solid var(--brand);
  }
  pre code { background: transparent; padding: 0; color: var(--fg); }
  .print-note {
    position: fixed;
    top: 12px;
    right: 12px;
    background: var(--brand);
    color: #fff;
    padding: .5em 1em;
    border-radius: 999px;
    font-size: .85em;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    cursor: pointer;
    user-select: none;
    border: none;
  }
  .print-note:hover { background: #ea580c; }
  /* ─────────  デザインコンポーネント  ───────── */

  /* ヒーロー（表紙・コンセプト枠） */
  .hero {
    text-align: center;
    padding: 3em 2em;
    background: linear-gradient(135deg, var(--brand-soft) 0%, #fff 70%, #fff 100%);
    border-radius: 20px;
    margin: 2em 0 3em;
    border: 1px solid var(--border);
    box-shadow: 0 8px 32px rgba(0,0,0,.04);
  }
  .hero .hero-eyebrow {
    display: inline-block;
    color: var(--brand);
    font-size: .85em;
    font-weight: 700;
    letter-spacing: .2em;
    padding: .3em 1em;
    background: #fff;
    border-radius: 999px;
    margin-bottom: 1em;
  }
  .hero .hero-title {
    font-size: 2.2em;
    font-weight: 700;
    margin: .3em 0;
    color: var(--fg);
    line-height: 1.3;
  }
  .hero .hero-sub {
    color: var(--muted);
    font-size: 1.05em;
    margin-top: .5em;
  }
  .hero .hero-tag {
    display: inline-block;
    font-size: .85em;
    color: var(--muted);
    margin-top: 1.5em;
    padding-top: 1em;
    border-top: 1px solid var(--border);
    width: 60%;
  }

  /* ステップカード（横並び・矢印付き / 3〜5ステップ対応） */
  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
    gap: 1.2em;
    margin: 2.5em 0;
  }
  /* 5ステップは明示的に5列固定（HTMLでもPDFでも崩れない） */
  .steps:has(.step:nth-child(5)) {
    grid-template-columns: repeat(5, 1fr);
    gap: .7em;
  }
  /* 4ステップは4列固定 */
  .steps:has(.step:nth-child(4)):not(:has(.step:nth-child(5))) {
    grid-template-columns: repeat(4, 1fr);
    gap: .9em;
  }
  .step {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.3em .7em 1.1em;
    position: relative;
    text-align: center;
    box-shadow: 0 2px 12px rgba(0,0,0,.04);
    min-width: 0;
  }
  /* 5ステップ時はコンパクト */
  .steps:has(.step:nth-child(5)) .step {
    padding: 1.1em .5em .9em;
  }
  .step-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2em;
    height: 2.2em;
    border-radius: 50%;
    background: var(--brand);
    color: #fff;
    font-weight: 700;
    font-size: 1.05em;
    margin-bottom: .5em;
    box-shadow: 0 4px 12px rgba(255,107,53,.3);
  }
  .steps:has(.step:nth-child(5)) .step-num {
    width: 1.9em;
    height: 1.9em;
    font-size: .95em;
    margin-bottom: .4em;
  }
  .step-title {
    font-weight: 700;
    margin-bottom: .3em;
    font-size: .95em;
    color: var(--fg);
    line-height: 1.4;
    word-break: keep-all;
  }
  .steps:has(.step:nth-child(5)) .step-title {
    font-size: .85em;
  }
  .step-desc {
    font-size: .8em;
    color: var(--muted);
    line-height: 1.6;
  }
  .steps:has(.step:nth-child(5)) .step-desc {
    font-size: .72em;
    line-height: 1.5;
  }
  .step::after {
    content: "→";
    position: absolute;
    right: -.6em;
    top: 50%;
    transform: translateY(-50%);
    color: var(--brand);
    font-size: 1.2em;
    font-weight: 700;
    z-index: 1;
    pointer-events: none;
  }
  .step:last-child::after { display: none; }
  /* モバイル：5列だと潰れるので2列に折り返し（HTMLのみ・PDFはA4固定なので発火しない） */
  @media (max-width: 700px) {
    .steps:has(.step:nth-child(5)),
    .steps:has(.step:nth-child(4)):not(:has(.step:nth-child(5))) {
      grid-template-columns: repeat(2, 1fr);
    }
    .step::after { display: none; }
  }

  /* お問い合わせカード */
  .contact-card {
    background: linear-gradient(135deg, #fff 0%, var(--brand-soft) 100%);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2em 2.2em;
    margin: 2em 0;
    box-shadow: 0 8px 32px rgba(0,0,0,.06);
  }
  .contact-card .contact-title {
    font-weight: 700;
    font-size: 1.1em;
    margin-bottom: 1.2em;
    color: var(--fg);
  }
  .contact-grid {
    display: grid;
    gap: 1em;
  }
  .contact-row {
    display: flex;
    align-items: center;
    gap: 1.2em;
    padding: 1em 1.2em;
    background: #fff;
    border-radius: 12px;
    border: 1px solid var(--border);
  }
  .contact-icon {
    width: 2.6em;
    height: 2.6em;
    flex-shrink: 0;
    background: var(--brand-soft);
    color: var(--brand);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    font-weight: 700;
  }
  .contact-body { flex: 1; min-width: 0; }
  .contact-label {
    font-size: .75em;
    color: var(--muted);
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
  }
  .contact-value {
    font-size: 1em;
    font-weight: 600;
    margin-top: .15em;
    word-break: break-word;
  }
  .contact-value a {
    color: var(--brand);
  }
  .contact-note {
    margin-top: 1.2em;
    font-size: .85em;
    color: var(--muted);
    text-align: center;
  }

  /* フローダイアグラム（縦・横） */
  .flow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .4em;
    margin: 2em 0;
  }
  .flow-row {
    display: flex;
    gap: 1em;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .flow-node {
    background: #fff;
    border: 1px solid var(--border);
    padding: 1em 1.4em;
    border-radius: 12px;
    min-width: 220px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0,0,0,.04);
  }
  .flow-node.brand {
    background: var(--brand);
    color: #fff;
    border-color: var(--brand);
    font-weight: 700;
  }
  .flow-node.soft {
    background: var(--brand-soft);
    border-color: var(--brand);
  }
  .flow-node-label {
    font-size: .75em;
    color: var(--muted);
    font-weight: 700;
    letter-spacing: .05em;
    margin-bottom: .2em;
  }
  .flow-node.brand .flow-node-label {
    color: rgba(255,255,255,.85);
  }
  .flow-node-text {
    font-weight: 600;
    font-size: 1em;
  }
  .flow-arrow {
    color: var(--brand);
    font-size: 1.6em;
    font-weight: 700;
    line-height: 1;
  }
  .flow-arrow-h {
    color: var(--brand);
    font-size: 1.4em;
    font-weight: 700;
  }
  .flow-note {
    font-size: .8em;
    color: var(--muted);
    margin-top: .2em;
  }

  /* ランキング（検索順位） */
  .ranking {
    margin: 2em auto;
    max-width: 540px;
  }
  .ranking-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1em;
    padding: .8em 1.2em;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 10px;
    margin: .35em 0;
  }
  .ranking-item.gold {
    background: linear-gradient(90deg, var(--brand-soft), #fff);
    border-color: var(--brand);
    border-width: 2px;
    font-weight: 600;
  }
  .ranking-pos {
    font-weight: 700;
    color: var(--fg);
    min-width: 3em;
  }
  .ranking-bar {
    flex: 1;
    height: 8px;
    background: var(--border);
    border-radius: 4px;
    margin: 0 1em;
    overflow: hidden;
  }
  .ranking-bar-fill {
    height: 100%;
    background: var(--brand);
    border-radius: 4px;
  }
  .ranking-note {
    font-size: .8em;
    color: var(--brand);
    font-weight: 600;
    min-width: 8em;
    text-align: right;
  }
  .ranking-divider {
    margin: .7em 0;
    text-align: center;
    font-size: .75em;
    color: var(--muted);
    letter-spacing: .1em;
    padding: .4em;
    background: var(--bg-soft);
    border-radius: 6px;
  }
  .ranking-item.faded {
    opacity: .45;
    background: var(--bg-soft);
  }
  .ranking-item.faded .ranking-note { color: var(--muted); }

  /* 2カラム比較（Before / After） */
  .compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5em;
    margin: 2em 0;
  }
  @media (max-width: 600px) {
    .compare { grid-template-columns: 1fr; }
  }
  .compare-col {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.4em 1.6em;
  }
  .compare-col-head {
    font-weight: 700;
    margin-bottom: 1em;
    padding-bottom: .6em;
    border-bottom: 2px solid var(--border);
    font-size: 1em;
  }
  .compare-after {
    border-color: var(--brand);
    background: linear-gradient(135deg, #fff 0%, var(--brand-soft) 100%);
  }
  .compare-after .compare-col-head {
    color: var(--brand);
    border-color: var(--brand);
  }
  .compare-col ul {
    margin: 0;
    padding-left: 1.2em;
  }
  .compare-col li.new {
    color: var(--brand);
    font-weight: 600;
  }

  /* ビジネスモデル図 */
  .model {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2em;
    margin: 2em 0;
    box-shadow: 0 4px 20px rgba(0,0,0,.04);
  }
  .model-title {
    text-align: center;
    font-weight: 700;
    margin-bottom: 1.5em;
    color: var(--fg);
    font-size: .95em;
    letter-spacing: .05em;
  }
  .model-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1em;
    margin: 1em 0;
  }
  .model-actor {
    text-align: center;
    background: var(--bg-soft);
    padding: 1em 1.2em;
    border-radius: 10px;
    font-weight: 600;
    font-size: .95em;
    border: 1px solid var(--border);
  }
  .model-platform {
    background: var(--brand);
    color: #fff;
    padding: 1em 1.2em;
    border-radius: 10px;
    font-weight: 700;
    text-align: center;
    box-shadow: 0 4px 12px rgba(255,107,53,.25);
  }
  .model-flow {
    text-align: center;
    font-size: .8em;
    color: var(--brand);
    font-weight: 700;
    line-height: 1.3;
  }
  .model-flow-line {
    height: 2px;
    background: var(--brand);
    margin: .4em auto;
    width: 80%;
    position: relative;
  }
  .model-flow-line::after {
    content: "▶";
    position: absolute;
    right: -.5em;
    top: 50%;
    transform: translateY(-50%);
    color: var(--brand);
    font-size: .8em;
  }

  /* カバレッジ（県×業種） */
  .coverage {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1.5em;
    margin: 2em 0;
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2em 1.5em;
    box-shadow: 0 4px 20px rgba(0,0,0,.04);
  }
  .coverage-cell { text-align: center; }
  .coverage-num {
    font-size: 2.8em;
    font-weight: 800;
    color: var(--brand);
    line-height: 1;
    margin-bottom: .3em;
  }
  .coverage-label {
    font-size: .85em;
    color: var(--muted);
    font-weight: 600;
  }
  .coverage-mult {
    font-size: 2em;
    color: var(--muted);
    font-weight: 300;
  }
  .coverage-result {
    grid-column: 1 / -1;
    text-align: center;
    margin-top: 1em;
    padding: 1em;
    background: var(--brand-soft);
    border-radius: 10px;
    font-weight: 700;
    color: var(--fg);
    font-size: 1.05em;
  }

  /* 特徴カードグリッド（3枚は3列・4枚は2x2をデフォルト） */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.2em;
    margin: 2em 0;
  }
  /* 4枚用：2x2レイアウト */
  .feature-grid-2x2 {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 520px) {
    .feature-grid-2x2 { grid-template-columns: 1fr; }
  }
  .feature-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.5em;
    box-shadow: 0 2px 12px rgba(0,0,0,.04);
  }
  .feature-card-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background: var(--brand);
    color: #fff;
    font-weight: 700;
    margin-bottom: .8em;
  }
  .feature-card-title {
    font-weight: 700;
    font-size: 1.05em;
    margin-bottom: .5em;
  }
  .feature-card-body {
    font-size: .9em;
    color: var(--muted);
    line-height: 1.7;
  }

  /* Q&A カードリスト */
  .qa-list {
    margin: 2em 0;
    display: grid;
    gap: 1em;
  }
  .qa-item {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.4em 1.6em;
    box-shadow: 0 2px 12px rgba(0,0,0,.04);
  }
  .qa-q {
    font-weight: 700;
    font-size: 1em;
    color: var(--fg);
    display: flex;
    gap: .9em;
    align-items: flex-start;
    padding-bottom: 1em;
    margin-bottom: 1em;
    border-bottom: 1px dashed var(--border);
  }
  .qa-a {
    color: var(--fg);
    display: flex;
    gap: .9em;
    align-items: flex-start;
    line-height: 1.85;
    font-weight: 400;
  }
  .qa-mark {
    flex-shrink: 0;
    min-width: 2.2em;
    height: 2.2em;
    padding: 0 .5em;
    border-radius: 999px;
    font-weight: 700;
    font-size: .8em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    letter-spacing: .03em;
  }
  .qa-mark-q {
    background: var(--brand);
    color: #fff;
    box-shadow: 0 2px 8px rgba(255,107,53,.25);
  }
  .qa-mark-a {
    background: #fff;
    color: var(--brand);
    border: 2px solid var(--brand);
  }
  .qa-text {
    flex: 1;
    min-width: 0;
    padding-top: .25em;
  }

  /* CTAクロージング */
  .closing {
    margin: 3em 0 2em;
    padding: 2.5em 2em;
    text-align: center;
    background: linear-gradient(135deg, var(--brand) 0%, #ea580c 100%);
    color: #fff;
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(255,107,53,.25);
  }
  .closing-title {
    font-size: 1.3em;
    font-weight: 700;
    margin-bottom: .8em;
  }
  .closing-body {
    font-size: .95em;
    opacity: .95;
    line-height: 1.8;
  }

  /* アクションボタンエリア（PDF/印刷） */
  .actions {
    position: fixed;
    top: 16px;
    right: 16px;
    display: flex;
    gap: .5em;
    z-index: 100;
  }
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: .4em;
    background: #fff;
    color: var(--brand-deep);
    padding: .55em 1.1em;
    border-radius: 999px;
    font-size: .85em;
    font-weight: 700;
    box-shadow: 0 4px 16px rgba(0,0,0,.12);
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--border);
    text-decoration: none;
    transition: transform .15s, box-shadow .15s;
  }
  .action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0,0,0,.15);
    border-color: var(--brand);
  }
  .action-btn.primary {
    background: var(--brand);
    color: #fff;
    border-color: var(--brand);
  }
  .action-btn.primary:hover {
    background: var(--brand-hover);
  }

  @media print {
    body { background: #fff; padding: 0; margin: 0; }
    /* 1ページ縦長PDFのため、画面表示時と同じ余白感をキープ */
    .doc { box-shadow: none; padding: 3em 3em 4em; margin: 0; max-width: none; border-radius: 0; }
    .doc::before { display: block; }  /* ブランドストライプは保持 */
    .doc::after { display: none; }
    .actions { display: none; }
    h1, h2, h3 { page-break-after: avoid; }
    table, pre, blockquote, .step, .flow-node, .contact-card, .hero, .model, .compare, .ranking, .feature-card, .qa-item { page-break-inside: avoid; }
    .closing { background: var(--brand-soft) !important; color: var(--fg) !important; box-shadow: none !important; }
    .closing-title, .closing-body { color: var(--fg) !important; }
    a { border-bottom: none; }
    /*
     * Chrome のヘッドレスPDF生成は、円形の小さい要素にかかった有色 box-shadow を
     * "四角の塗りブロック" として描画するバグがある（HTMLでは正しく丸い影）。
     * 印刷時は影を全て無効化して見た目を正常化する。
     */
    .step-num,
    .qa-mark-q,
    .qa-mark-a,
    .feature-card-num,
    .model-platform,
    .action-btn,
    .ranking-item.gold,
    .ranking-bar-fill,
    .step,
    .flow-node,
    .contact-card,
    .feature-card,
    .qa-item,
    .model,
    .coverage,
    .hero,
    table {
      box-shadow: none !important;
    }
  }
</style>
</head>
<body>
<div class="actions">
  <a class="action-btn primary" href="__PDF_NAME__" download>⬇ PDFをダウンロード</a>
  <button class="action-btn" onclick="window.print()">🖨 印刷</button>
</div>
<div class="doc">
`;

const FOOT = `</div></body></html>`;

const files = [
  { src: "01_営業資料.md", title: "まちセレクト 営業資料" },
  { src: "02_提案資料.md", title: "まちセレクト 提案資料" },
];

const here = path.dirname(fileURLToPath(import.meta.url));

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chromeExists = fs.existsSync(CHROME);

// 先に全HTMLを生成
const generated = [];
for (const { src, title } of files) {
  const md = fs.readFileSync(path.join(here, src), "utf-8");
  const html = marked.parse(md, { gfm: true, breaks: false });
  const pdfName = src.replace(/\.md$/, ".pdf");
  const out =
    HEAD.replace("__TITLE__", title).replace("__PDF_NAME__", pdfName) +
    html +
    FOOT;
  const outPath = path.join(here, src.replace(/\.md$/, ".html"));
  fs.writeFileSync(outPath, out, "utf-8");
  console.log("✓ HTML:", outPath);
  generated.push({ outPath, pdfPath: path.join(here, pdfName) });
}

// PDFはpuppeteer-core経由でコンテンツ高を実測 → ぴったりサイズの1ページPDFを生成
if (chromeExists) {
  const { default: puppeteer } = await import(
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
  );
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
  });
  const PAGE_WIDTH_PX = 920; // HTMLの.doc max-widthと揃える
  for (const { outPath, pdfPath } of generated) {
    try {
      const page = await browser.newPage();
      await page.setViewport({
        width: PAGE_WIDTH_PX,
        height: 800,
        deviceScaleFactor: 1,
      });
      await page.goto("file://" + encodeURI(outPath), {
        waitUntil: "networkidle0",
      });
      await page.emulateMediaType("print");
      // 描画完了まで少し待つ
      await new Promise((r) => setTimeout(r, 300));
      const height = await page.evaluate(() =>
        Math.ceil(document.documentElement.scrollHeight)
      );
      await page.pdf({
        path: pdfPath,
        width: `${PAGE_WIDTH_PX}px`,
        height: `${height + 20}px`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await page.close();
      console.log("✓ PDF :", pdfPath, `(${PAGE_WIDTH_PX}x${height + 20}px / 1ページ縦長)`);
    } catch (e) {
      console.warn("  PDF生成失敗:", e.message);
    }
  }
  await browser.close();
} else {
  console.warn("Chromeが見つからないためPDF生成をスキップ:", CHROME);
}
