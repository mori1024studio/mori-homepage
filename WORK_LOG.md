# Mori Homepage 工作日誌

> 記錄每次 Session 做了什麼、改了哪裡、為什麼改。
> 格式：日期 → 區塊 → 動作 → 原因

---

## 2026-07-19｜Session：修復 IG 內建瀏覽器黑屏/閃爍（c1946ac）

### 背景
Mori 朋友回報：從 IG 連結點進測驗頁，只在首頁看到閃爍、什麼都看不到。診斷：首頁 `#site{opacity:0}` 只靠 GSAP 時間軸揭示，Three.js（手機 14000 顆粒子）在 IG 的 WKWebView 記憶體上限下崩潰重載循環 → 閃爍；任何 CDN/WebGL 失敗也會讓頁面永久黑屏。

### 完成
- **首頁保險絲**（`index.html`）：獨立 script，5 秒後偵測 `#site` 仍隱藏就強制關 preloader、顯示 hero/medallion；不依賴 THREE/GSAP。已用「three.js 載入失敗」情境本機驗證通過
- **首頁 in-app 降載**：偵測 IG/FB/LINE/WeChat UA → 粒子 6000 顆 + pixelRatio 1，從根源避免 WebView 崩潰
- **sidebiz init 順序修正**（唯一脆弱順序的測驗頁）：preloader 關閉排程先跑，`MoriParticles.init` 包 try/catch
- **git 分岔修復**：發現 7/16 掃 key 時本地 29 個檔案的 CF beacon token（公開值）被誤植為 REDACTED 佔位字，造成本地/遠端歷史分岔。以 origin/main（真 token、與線上一致）為基底 cherry-pick 本次修復，本地已重新對齊遠端
- **部署驗證**：push 自動 deploy，線上首頁 + sidebiz 皆 0 console error、內容正常顯示

### 待辦
- 請 Mori 或朋友在 IG 內建瀏覽器實測確認（Claude 無法真機模擬 WKWebView 記憶體行為）
- `quiz/start-with-why/index.html` 有一份 session 前就存在的未 commit 修改（16+/52-），來源不明，保留在工作區待 Mori 確認

---

## 2026-07-16｜Session：Agent/Skill 顧問審查後續執行（Sonnet 5）

### 背景
上一輪召集 6 位領域顧問審查現有 Agent/Skill 配置，找出 18 條缺口與進化建議；這次逐條執行「立即該做」+「值得規劃」共 18 項。

### 完成（mori-homepage / quiz-tracker 相關部分）
- **quiz-tracker Worker**：新增 KV 每日寫入配額監控（80%閾值 header 警告）、每週自動備份（cron，8週滾動保留）、後台密碼防暴力鎖定（5次錯誤鎖15分鐘）；已部署驗證（`ba589b1`）
- **部署後 smoke test**：`deploy.yml` 加一步驗證代表性測驗頁 + `/api/kit/` 405 防護 + quiz-tracker `/data` 401 防護，失敗即標紅（`ca25df2`）
- **sidebiz 追蹤修正**：改用共用 `shared/tracker.js`，修正原本寫死 `quiz:'side-gene'` 跟實際 URL slug (`sidebiz`) 對不上的問題，且改成在結果揭露當下就記錄（不再只在填 email 時才記錄）（`ca25df2`）
- **全站 SEO 補齊**：首頁 + 27 個測驗頁全部加上 meta description / OG tags / JSON-LD Quiz schema（依各測驗實際結果類型寫的描述，非通用文字）；新增 `sitemap.xml`（28 URL）+ `robots.txt`；template 同步更新讓未來新測驗預設就有（`9e56a36`）
- **首頁 H1 補齊**：seo-audit 正式健檢抓到首頁零 H1，把 hero 品牌標題的 wrapper 從 `div` 改 `h1`（只換標籤，class/CSS 不動）（`bc8fd71`）
- **gitleaks pre-commit hook**：mori-homepage + quiz-tracker 兩個 repo 都裝上，`gitleaks detect` 順便抓到 mori-homepage git 歷史裡還留有 41 筆舊 MailerLite JWT（已知已作廢，但historyi 沒清）

### 待 Mori
- git 歷史裡的舊 JWT 要不要用 BFG/filter-repo 清掉（涉及 force-push，需要你點頭才動）
- Kit 側的 win-back 再啟動序列已寫好文案草稿（`100_Todo/drafts/email-sequences/_win-back/`），但沒有 KIT_API_KEY 沒辦法幫你接進 Kit 後台，需要你或下一個有key的 session 執行

---

## 2026-07-04｜Session：找回並重建 quiz-tracker 後台（Sonnet 5）

### 背景
Mori 想找「測驗完成後可看到結果、分析暖養 vs 副業合作」的後台，一度以為 Notion 紀錄被刪。追查後發現是獨立的 Cloudflare Worker 專案 `000_Agent/quiz-tracker/`（密碼 mori2026），從未進版控，且只有 `sidebiz` 一個測驗還在回報資料，其餘 26 個新測驗都沒接線。

### 完成
- **密碼移出原始碼**：`ADMIN_PW` 改用 `wrangler secret put`，不再寫死在 `src/index.js`（舊密碼 mori2026 已作廢，新密碼只存在 Mori 本人手上，不寫入任何檔案）
- **quiz-tracker 備份**：`git init` 推到私有 repo `github.com/mori1024studio/quiz-tracker`
- **Worker API 擴充**：新增 `PUT /update`（後台編輯）、`DELETE /delete`（後台刪除）、`POST /email`（測驗頁補寫 email，公開端點僅能改 email 欄位）；`/data`、`/update`、`/delete` 改用 `Authorization: Bearer` 標頭驗證，不再把密碼放 URL query
- **後台 UI**：`/admin` 頁面新增編輯/刪除按鈕 + 「未分類」篩選與統計
- **shared/tracker.js**：新增 `sendQuizTrack()`（測驗解鎖結果時呼叫，自動判斷 quiz slug、依 q1-3 算 segment）與 `sendQuizEmail()`（email 送出後補寫同一筆記錄，不重複建列）
- **全站接線**：template + 26 個上線測驗頁自動接上（sidebiz 已有自己的整合邏輯，未變動）
- **端對端驗證**：Playwright 實跑 not-enough 測驗 → 確認 KV 有新記錄、segment 自動算對、email 補寫到同一筆、後台編輯/刪除按鈕都正常運作

### 待辦
- 密碼已更新但只跟 Mori 口頭/介面內交接，注意保管（後台網址：`https://quiz-tracker.mori1024.workers.dev/admin`）
- Cloudflare Workers KV 免費版每日寫入上限約 1000 次，流量大時留意
- `— 未分類` 的 segment 需要 Mori 在後台手動複核（自動算出的 partner/client/warm/cold 只是粗略公式，來自 sidebiz 原本的判斷邏輯）

---

## 2026-07-03｜Session：安全修復 + 全漏斗稽核（Fable 5）

### 完成
- **Kit API key 移出前端**：新建 `functions/api/kit/[[path]].js` 同源代理（白名單三端點、POST-only、key 存 CF 環境變數 `KIT_API_KEY`）；27 個測驗頁改打 `/api/kit/`，前端零 key；JS 語法全數驗證；deploy 後線上驗證（405/403 防護 + 真實訂閱 201）
- **舊 GH Pages repo key 清理**：wealth-ladder index-v3.html 的 MailerLite JWT 移除並 push；其餘 7 個 repo 遠端 6/27 已清（本地過期副本已同步遠端）
- **git 同步**：mori-homepage 全部變更 commit `bbc23b0` 推上 GitHub（含 deploy.yml，待 CLOUDFLARE_API_TOKEN secret）
- **Kit 名單備份**：38 訂閱者 / 127 tags / 125 sequences → `000_Agent/backups/`
- **清理**：147 張根目錄截圖歸檔、MailerLite todo 作廢移 archive、memory 更新

### ⚠️ 稽核發現（未解）
- **102/125 個 sequence 是空殼**（email_count=0），只有 23 個有內容；32 訂閱者人次卡在空殼序列
- 發送時間全是 America/New_York 11:00（台灣半夜）；寄件人 gmail.com 無 DMARC；creator 方案疑為試用（6/25 建立）
- Email 序列內容全部沒有商品/CTA 出口（Day 7 連回測驗本身）——商業閉環未閉合

### 待 Mori
- Kit 後台旋轉 API key（舊 key 在 git 歷史）→ 給 Claude 更新 CF secret
- CF 建 API token → `gh secret set CLOUDFLARE_API_TOKEN`
- 決定空殼 sequence 補內容的方式（Playwright 自動化 vs 手動）

### 同日後續（全部解決）
- ✅ Kit key 旋轉完成：舊 key 401 失效、新 key 入 CF secret、代理驗證通過
- ✅ GitHub Actions 自動部署跑通（CLOUDFLARE_API_TOKEN 已設，push 即 deploy）
- ✅ 「102 空殼」真相：714 封信 6/27 已上傳但全卡草稿——`kit_publish_all.py` 全數發佈（713 成功 0 失敗）
- ✅ 125 sequence 發送時間全改 Asia/Taipei 09:00（原美東 11:00 = 台灣半夜）
- ✅ 終驗：125/125 email_count=7、時區正確、active
- 剩餘：寄件域名/DMARC（需自有網域）、Kit 方案試用期確認、email 商業出口、寄達驗證（明早 09:00 後查 proxytest 信箱）

### 同日第三批（閉環出口 + 衝刺準備）
- ✅ **交棒信**：125 個 sequence 尾端各追加第 8 封（Day 15）＝下一步測驗連結（UTM）+ 回信/15分鐘對談邀請；終驗 125/125 全部 8 封已發佈
- ✅ 發現並記錄 Kit API 限制：PUT 改不了 content（回 200 但靜默忽略），要改內容須刪除重建
- ✅ **30 天 IG 日曆**：`100_Todo/projects/ig-500-sprint/30day-calendar.md`（07-04 起，支柱 40/30/20/10，KPI 檢查點 Day 7/14/21/30）
- Kit key 已二次旋轉並更新 CF secret + redeploy 驗證
- 待 Mori：Kit From name 改「Mori」、CF Web Analytics 開通（token 權限不足無法代辦）、7/7 看數據決定 Kit 付費

---

## 2026-06-29｜Session：新測驗 + 內容資產補全

### 完成
- **蛤蟆先生去看心理師** 完整流程：補全 prompt實戰版/Prompt庫/Threads/Lead Magnet；建立 `/quiz/inner-state/` 測驗 HTML（T4光譜，4型）；Kit tags H1-H4 (20715559/61/62/63)；Kit seqs 2809689-2809692
- **sidebiz 副業基因診斷**：新建 6 Reels + 11 輪播（reels-scripts/副業基因診斷/、ig-carousels/副業基因診斷-*）
- **部署**：`wrangler pages deploy` 上傳 3 個新檔（含 quiz/inner-state/index.html）→ https://a9211a48.mori-homepage.pages.dev
- **Validate**：蛤蟆先生 5/5 ✅、副業基因診斷 5/5 ✅

### 完成（續）
- **AI-First自我升級革命**：建立 `/quiz/ai-bottleneck/` 測驗（T4光譜，4型 A1-A4）；Kit tags 20715648-51；Kit seqs 2809707-2809710；補全 Prompt庫/Threads/Lead Magnet；Validate 5/5 ✅
- **Supercommunicators**：建立 `/quiz/comm-style/` 測驗（T4光譜，4型 S1-S4）；Kit tags 20715701/02/04/05；Kit seqs 2809719-2809722；補全 Prompt庫/Threads/Lead Magnet；Validate 5/5 ✅
- **為什麼要睡覺**：建立 `/quiz/sleep-saboteur/` 測驗（T4光譜，4型 L1-L4）；Kit tags 20715798/99/803/805；Kit seqs 2809739-2809742；補全 prompt實戰版/Prompt庫/Threads/Lead Magnet；Validate 5/5 ✅
- **部署**：`wrangler pages deploy` 上傳最新版 → https://5e81fd8a.mori-homepage.pages.dev

---

## 2026-06-28｜Session：冒煙測試 + CF Pages 重新部署

### 完成
- **發現 CF Pages 版本落後**：mori-homepage.pages.dev 未接 GitHub，需手動 wrangler deploy；上次 deploy 為 1 天前，anti-fragile/start-with-why 仍是 MailerLite 舊版，beyond-origins/die-with-zero/anxiety-resolve 完全未 deploy
- **重新部署**：`npx wrangler pages deploy . --project-name=mori-homepage` 上傳 17 個新檔，全站更新到最新版
- **冒煙測試（自動化）**：Playwright Node.js 腳本跑完 5 個新測驗完整流程（preloader → 答題 → survey → email 送出 → Kit API 驗證）
  - anti-fragile F1 脆弱型 → tag 20673076 ✅
  - start-with-why W1 外部符號驅動型 → tag 20673081 ✅
  - beyond-origins O1 鏡像重演型 → tag 20673926 ✅
  - die-with-zero D1 安全囤積型 → tag 20673931 ✅
  - anxiety-resolve X1 迴避逃逸型 → tag 20674024 ✅
- **結果**：5/5 全部通過，Kit 訂閱者已建立並打上正確 Tag

### 影響範圍
全站 CF Pages（mori-homepage.pages.dev）

---

## 2026-06-27｜Session：PDF 完整內容修復 + 社群分享字型修正

### 完成
- **全站 15 個測驗**：將 `buildPDFHTML` 拆分為 `buildShareHTML`（社群分享，精簡版）和 `buildFullPDFHTML`（PDF 下載，完整內容）
- **PDF 完整內容**：各測驗類型根據資料結構加入完整欄位（analysis/morview/focus/strategy/mori/action 等）
- **字型修正**：所有 html2canvas 呼叫前加入 `await document.fonts.ready`，確保 Noto Sans TC 等字型完整載入
- **wealth-ladder**：移除 desc 200 字截斷，完整輸出 desc + strategy + focus + mori 觀點
- **sidebiz**：移除 portrait 180 字截斷，完整輸出 portrait + action + mori 觀點
- **mindfuck/anti-fragile/atomic-habits/start-with-why**：移除截斷，加入完整 morview

### 影響範圍
`quiz/*/index.html`（15 個）

---

## 2026-06-27｜Session：13 個新 Email Sequence 完成（3 新測驗）

### 完成
- **beyond-origins O1-O5**：5 個 sequence × 7 封 = 35 封（seq_id 2808445-2808449）
  - O1 鏡像重演型 / O2 反向逃離型 / O3 愧疚承擔型 / O4 過度補償型 / O5 界線清醒型
- **die-with-zero D1-D4**：4 個 sequence × 7 封 = 28 封（seq_id 2808450-2808453）
  - D1 安全囤積型 / D2 延遲滿足型 / D3 平衡探索型 / D4 體驗優先型
- **anxiety-resolve X1-X4**：4 個 sequence × 7 封 = 28 封（seq_id 2808454/2808456-2808458）
  - X1 迴避逃逸型 / X2 過度控制型 / X3 反芻思考型 / X4 接觸轉化型
- 本地存放於 `100_Todo/drafts/email-sequences/beyond-origins-quiz/`、`die-with-zero-quiz/`、`anxiety-resolve-quiz/`

### 待辦
- Kit 後台手動匯入 91 封 Email 到對應 sequence（seq_id 已對照）
- Notion 同步（測驗漏斗工作室需分享給 n8n Integration 才能 API 存取）

---

## 2026-06-27｜Session：Kit Email Sequences 補全

### 完成
- **anti-fragile 5 個 sequence（F1-F5）**：各寫 Day 1-7 共 35 封 Email，已上傳至 Kit（seq_id 2808410-2808414）
- **start-with-why 5 個 sequence（W1-W5）**：各寫 Day 1-7 共 35 封 Email，已上傳至 Kit（seq_id 2808415-2808419）
- 本地 markdown 存放於 `100_Todo/drafts/email-sequences/anti-fragile-quiz/` 和 `start-with-why-quiz/`

### 狀態
- 全部 12 個測驗 × 全部 sequence 現在均有完整 Email 內容（共 70 封新 Email + 既有 Email）
- Kit 上 anti-fragile 和 start-with-why 的 sequence 從 0 emails → 7 emails

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

## 2026-06-27｜Session：三個新測驗上線 + Notion 引流品

### 完成
- **超越原生家庭** `quiz/beyond-origins/index.html`
  - T7 核心解鎖，10 題，5 型（O1鏡像重演/O2反向逃離/O3愧疚承擔/O4過度補償/O5界線清醒）
  - Kit 串接完成（tag:20673926-20673930 / seq:2808445-2808449）

- **別把你的錢留到死** `quiz/die-with-zero/index.html`
  - T4 光譜，8 題，4 型（D1安全囤積/D2延遲滿足/D3平衡探索/D4體驗優先）
  - Kit 串接完成（tag:20673931,20674010-12 / seq:2808450-2808453）

- **與焦慮和解** `quiz/anxiety-resolve/index.html`
  - T4 光譜，8 題，4 型（X1迴避逃逸/X2過度控制/X3反芻思考/X4接觸轉化）
  - Kit 串接完成（tag:20674024-27 / seq:2808454,2808456-2808458）

- **首頁更新** `index.html`
  - 卡片從 17 → 20 張
  - 新增卡片 18：超越原生家庭 → `/quiz/beyond-origins/`
  - 新增卡片 19：別把你的錢留到死 → `/quiz/die-with-zero/`
  - 新增卡片 20：與焦慮和解 → `/quiz/anxiety-resolve/`
  - 所有卡片序號更新為「XX / 20」，新增 pip 17-19

- **Git Push** commit `bfdd466` 已推送，Cloudflare Pages 部署中

### 待辦
- Notion 同步（anti-fragile + start-with-why 子頁面）手動補入
- 確認 Email 實際寄送（測試帳號跑完一個測驗）
- O1-O5 / D1-D4 / X1-X4 共 13 個 Email Sequence 內容待寫

---

## 2026-06-27｜Session：Notion 引流品 + 測驗狀態同步

### 完成
- **反脆弱 Notion 引流品** `200_Reference/lead-magnets/反脆弱-notion.md`
  - 5 大洞見（三分法/槓鈴策略/Via Negativa/選擇性/皮膚在遊戲裡）
  - 10 句精選金句
  - 5 個核心 Prompt（脆弱點分析/槓鈴策略設計/Via Negativa/不對稱機會/反脆弱成長策略）

- **先問為什麼 Notion 引流品** `200_Reference/lead-magnets/先問為什麼-notion.md`
  - 5 大洞見（黃金圈/邊緣系統/早期採用者/WHY 稀缺性/方向 vs 速度）
  - 10 句精選金句
  - 5 個核心 Prompt（找 WHY/重設自我介紹/目標受眾/找回 WHY/WHY 傳播設計）

### 待辦
- Notion 同步：手動將以下兩個測驗補入測驗漏斗工作室父頁面（見下方內容）
- 下一個測驗（待定主題）
- 確認 Email 實際寄送（測試帳號跑完 anti-fragile 測驗）

---

## 2026-06-25｜Session：首頁 GH→CF 連結更新 + 返回鈕確認

### 完成

- **首頁卡片 1-5 連結更新** `index.html`
  - card 1: GH mbti-shadow-quiz → `/quiz/mbti-shadow/`
  - card 2: GH mindfuck-quiz → `/quiz/mindfuck/`
  - card 3: GH wealth-ladder → `/quiz/wealth-ladder/`
  - card 4: GH atomic-habits-quiz → `/quiz/atomic-habits/`
  - card 5: GH sidebiz-quiz → `/quiz/sidebiz/`
  - 同時移除 `target="_blank" rel="noopener"`（改為同站內部連結）

- **返回鈕確認**：6 個舊版 CF 測驗（not-enough / wealth-mindset / human-nature / mbti-shadow / logic-layers / scarcity-mode）全部已有 `prevQ()` 實作，無需補做

### 待辦
- MailerLite 串接（anti-fragile F1-F5 / start-with-why W1-W5）

---
