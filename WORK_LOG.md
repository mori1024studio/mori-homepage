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

## 2026-06-23｜Session：財務思維三部曲 #2 + #3 + Cloudflare 上線

### 完成
- **底層邏輯測驗** `quiz/logic-layers/index.html`（T2 思維階梯）
  - 測驗標題：你在用哪個層次思考？
  - 8 題情境題，5 層結果（L1現象接收/L2規則依賴/L3因果分析/L4結構重組/L5模型建構）
  - T2 專屬視覺：結果頁顯示 5 層階梯，亮金=用戶層次，下方=已通過，上方=未解鎖
  - 財務思維三部曲導覽加入

- **稀缺測驗** `quiz/scarcity-mode/index.html`（T4 光譜）
  - 測驗標題：你是在「不夠」的感覺中活著嗎？
  - 8 題情境題，4 型結果（S1隧道視野/S2頻寬壓縮/S3邊界警戒/S4資源充裕）
  - T4 專屬視覺：結果頁顯示稀缺↔充裕光譜，金色標記落點+動畫過渡
  - 財務思維三部曲導覽加入

- **致富心態** `quiz/wealth-mindset/index.html` 補入三部曲導覽
  - 現在三部曲閉環完整，首頁 → 各測驗 → 結果頁互相串連

- **首頁卡片更新** `index.html`
  - 卡片從 9 → 11 張，新增「你在用哪個層次思考？10/11」「你是在「不夠」...11/11」

### 待辦
- MailerLite 串接（Email 送出目前是 alert）
- 追加測驗：原子習慣 / 副業基因

---

## 2026-06-23｜Session：T7 核心解鎖 + 你的不夠好從哪裡來

### 完成
- **T7 核心解鎖元件**（首次建立）
  - 輕柔版設計：6 射線 + 3 同心環 + 中心光暈 + 中心點
  - 觸發機制：`core-wrap.is-unlocking` 類別控制，強制 reflow 支援重跑
  - 文字延遲 1.1s 淡入（結果揭示儀式感）
  - 主題：脆弱 / 低刺激 / 沉靜

- **你的不夠好從哪裡來？** `quiz/not-enough/index.html`
  - 測驗標題：你的「不夠好」從哪裡來？
  - 8 題情境題，5 型結果
    - P 表現綁架型 / A 認可飢渴型 / C 比較底洞型 / D 缺陷中心型 / M 完美主義型
  - 每型結果含深度心理描述 + Email CTA（心理課程暖養）
  - 病毒力 ★★★★★，情緒觸及最廣

- **首頁卡片 01 連結更新** `index.html`
  - 從外部 GitHub Pages URL 改為同站 `/quiz/not-enough/`

### 待辦
- MailerLite 串接
- 追加測驗：副業基因 / 財富階梯

---

## 2026-06-24｜Session：暗黑心智 CF 版 + 首頁第 15 張卡片

### 完成

- **先問為什麼（WHY測驗）** `quiz/start-with-why/index.html`
  - T7 核心解鎖，5 型（W1-W5），10 題逆境情境
  - ML Groups 已建立，Email 串接完成

- **原子習慣 T3 雷達圖** `quiz/atomic-habits/index.html`
  - 六軸 SVG 雷達圖（提示/渴望/執行/獎勵/身份/環境）
  - clip-path circle animation，弱點軸高亮
  - ML Groups 已建立，6 型結果完整

- **暗黑心智 CF 版** `quiz/mindfuck/index.html`
  - T1 類型卡片，21 題，7 型（D/N/P/E/R/U/O）
  - 三段情境（副業啟動 Q1-7 / 職場日常 Q8-14 / 人際關係 Q15-21）
  - p/s 雙分計分 + firstSeen 平局決勝
  - 調查門（3 題），結果卡 + CTA + 相關測驗
  - 使用既有 ML Groups（從 GH 版繼承）

- **首頁第 15 張卡片** `index.html`
  - 新增卡片 15：暗黑心智 → `/quiz/mindfuck/`
  - 所有卡片序號更新為「XX / 15」
  - 新增 pip 14

### 待辦
- MailerLite 串接（anti-fragile F1-F5 / start-with-why W1-W5）

---

## 2026-06-24｜Session：財富階梯 + 副業基因 CF Port + 首頁 17 張

### 完成

- **財富階梯 CF 版** `quiz/wealth-ladder/index.html`
  - T2 CSS 進度階梯，18 題（S×6/B×6/M×4/G×2）
  - L1-L6 六階結果，加權計分（Sp×0.40 + Bp×0.30 + Mp×0.20 + Gp×0.10）
  - Q1=D 觸發 SUB_Q1 注入 → 直接映射 L4/L5/L6
  - 維度分數視覺化（L1-L3 顯示，L4-L6 隱藏）
  - 調查門 3 題，PDF 下載，ML 串接

- **副業基因 CF 版** `quiz/sidebiz/index.html`
  - T6 路線地圖，10 題，5 型（K知識變現/C內容引流/S服務套件/T工具整合/M媒介橋梁）
  - 每題各選項對應基因類型 +2 分，同分取 K>C>S>T>M 優先
  - 每型結果含 4 stage 路線地圖（emoji + 標題 + 說明）+ 今日行動 + Mori 觀察
  - 調查門 3 題，PDF 下載，ML 串接
  - 相關測驗 → /quiz/wealth-ladder/ 和 /quiz/start-with-why/

- **首頁更新** `index.html`
  - 卡片從 15 → 17 張
  - 卡片 16：財富階梯 → `/quiz/wealth-ladder/`
  - 卡片 17：副業基因 → `/quiz/sidebiz/`
  - 所有卡片序號更新為「XX / 17」
  - 新增 pip 15 和 pip 16

### 待辦
- MailerLite 串接（anti-fragile F1-F5 / start-with-why W1-W5）
- Notion 同步（測驗漏斗工作室）

---
