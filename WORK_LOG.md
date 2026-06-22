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

### 待辦
- MailerLite 串接（Email 送出目前是 alert，需接上真實 API）
- 加入首頁測驗卡片（讓訪客從首頁可以點到這張測驗）
- push 到 GitHub + Cloudflare 部署

---
