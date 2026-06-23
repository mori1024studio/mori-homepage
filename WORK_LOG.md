# Mori Homepage 工作日誌

> 記錄每次 Session 做了什麼、改了哪裡、為什麼改。
> 格式：日期 → 區塊 → 動作 → 原因

---

## 2026-06-22｜Session：CSS 模組化 + 粒子引擎 + 字體確認

### 完成
- **CSS 模組化**：從 `index.html` 抽出共用樣式，建立 `shared/style.css`
  - 包含設計 token（色彩/字體變數）、噪點/暈光/God-Ray、Nav、About、Footer
- **粒子引擎**：建立 `shared/particles.js`（MoriParticles），三種 preset
  - homepage：7500 粒子 × 0.3px 星塵
  - quiz：200 粒子 × 4px 螢火
  - article：200 粒子 × 4px 螢火（暖白混色）
- **測驗模板**：建立 `quiz/template/index.html`，三畫面 SPA（開始/作答/結果）
- **字體沙盒**：`playground/font-compare.html` + `playground/font-fullpage.html`
- **字體決策**：大標統一改為 **Noto Serif TC 900**，替換舊的 `cursive` fallback（標楷體）
  - `.start-title`、`.result-type` 改用 `var(--font-display)`
  - `shared/style.css` 加入 `--font-display / --font-body / --font-ui / --font-logo` token
- **push GitHub**：commit `52aa233`

### 未完成
- 測驗頁實際內容（題目 + 結果文案）尚未填入
- T2～T7 結果元件（雷達圖、進度階梯、光譜等）尚未製作

---

## 2026-06-23｜Session：第一張測驗頁製作

### 完成
- **金錢人格測驗** `quiz/wealth-mindset/index.html`
  - 書籍：致富心態（The Psychology of Money）
  - 測驗標題：你的金錢人格是哪種？
  - 8 題情境題，6 型結果（F恐懼/B短視/C攀比/S穩健/P複利/K匱乏）
  - Email CTA 已啟用，各型結果有獨立的 CTA 文案
  - 漏斗：Email 收集 → FIP $297 / CAM $128
  - 冒煙測試通過：開始畫面 → 題目 → 結果頁（複利思維型）全流程正常
- **工作日誌** `WORK_LOG.md` 建立，本次起每次 Session 更新

- **首頁卡片更新** `index.html`
  - 卡片從 6 → 7 張，新增「你的金錢人格是哪種？07/07」
  - 連結指向同站 `/quiz/wealth-mindset/`
  - pip 導覽點同步新增第 7 個

### 待辦
- MailerLite 串接（Email 送出目前是 alert，需接上真實 API）
- Cloudflare Pages 部署（讓 mori-homepage.pages.dev 更新）

---

## 2026-06-23｜Session：心理探索三部曲 #2 + #3

### 完成
- **人性法則測驗** `quiz/human-nature/index.html`
  - 測驗標題：哪條人性一直在操縱你？
  - 8 題情境題，6 型結果（M鏡像陷阱/C比較中毒/S短期接管/H隱性服從/L損失綁架/E資格崇拜）
  - 三部曲導覽區加入（結果頁底部），標示「防守視角 · 你在這裡」
  - 外部連結：暗黑心智（mori1024studio.github.io），內部連結：mbti-shadow

- **MBTI 影子測驗** `quiz/mbti-shadow/index.html`
  - 測驗標題：你最看不見自己的哪一面？
  - 8 題情境題，4 型結果（F情緒潛流/T邏輯防護/N可能性逃逸/S當下錨定）
  - 三部曲導覽區加入（結果頁底部），標示「自我視角 · 你在這裡」
  - Email CTA 預留（目前 display:none）

- **首頁卡片更新** `index.html`
  - 卡片從 7 → 9 張，新增「哪條人性一直在操縱你？08/09」、「你最看不見自己的哪一面？09/09」
  - 連結分別指向 `/quiz/human-nature/` 和 `/quiz/mbti-shadow/`
  - pip 導覽點同步新增第 8、9 個

### 待辦
- MailerLite 串接（Email 送出目前是 alert，需接上真實 API）
- Cloudflare Pages 部署
- 財務思維三部曲（需先建 T2 進度階梯元件）

---
