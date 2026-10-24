---
name: interactive-educational-webapp
description: |
  **互動式學科教育網頁與 3D 數位教具開發實戰手冊**。
  適用於國小、國中與高中各領域之互動教材、闖關學習地圖與 3D/SVG 互動教具開發。
  涵蓋：
  1. 循序漸進闖關地圖與進度鎖定架構 (Level Progression & LocalStorage Persistence)
  2. 3D 幾何投影與無依賴純前端渲染 (Zero-dependency 3D Math Manipulatives)
  3. 多裝置極致自適應版面 (Desktop / Tablet / Mobile 無裁切與 clamp(min(vh,vw)) 動態縮放)
  4. 行動端 PWA 獨立 App 全螢幕模式 (Standalone App Mode & Safari/Chrome 智能安裝導引)
  5. 窄螢幕橫向工具列常駐雙向滾動引導 (Docked Toolbar Guide & Bidirectional Navigation)
  6. 防作弊雙重隨機洗牌評量系統 (Double-Shuffle Quiz Engine)
license: Apache-2.0
metadata:
  version: v1.0
  author: Antigravity
---

# 互動式學科教育網頁與數位教具開發手冊 (Interactive Educational WebApp Skill)

> 本手冊提煉自《幾何形體任你玩》專案之全端工程實踐。專為需要打造高互動性、跨裝置（桌機、平板、手機）、零版面破裂的教育學習應用提供標準化架構與避坑指南。

---

## 核心心法：教育應用的四大工程鐵律

1. **教具優先，操作即理解**：學生不是來看講義的，進入頁面 3 秒內必須能摸到 3D 實體或展開圖，並即時看到視覺回饋。
2. **鎖定闖關，成就感閉環**：先易後難，第 1 關通過後才能解鎖第 2 關；完成所有關卡才開放「⭐ 總測驗」，避免學生跳關猜題。
3. **平板手機零破版**：教學現場 80% 以上使用 iPad 或學生手機。嚴格杜絕「被瀏覽器網址列遮住」、「按鈕滑不到底」、「大螢幕留白太空」等版面瑕疵。
4. **純前端無伺服器負擔**：所有 3D 渲染、幾何計算與進度存檔皆在前端本機完成，支援離線執行、零伺服器維護成本。

---

## 模組一：專案架構與檔案分工

打造類似的互動學習應用，建議採用標準模組化結構：

```text
project-root/
├── index.html            # 主入口：闖關地圖首頁、進度儀表板、總測驗模態彈窗
├── mobile.html           # 手機直向專屬輕量化入口 (垂直流暢滾動)
├── manifest.json         # PWA 應用程式設定 (全螢幕、獨立圖示、主題色)
├── app-mode.js           # 獨立 App 模式管理、UA 偵測與安裝教學引導
├── apple-touch-icon.png  # iOS 桌面專屬高解析圖示 (180x180)
├── icon-192.png          # Android / PWA 桌面圖示 (192x192)
├── icon-512.png          # 高解析啟動圖示 (512x512)
└── website/              # 各關卡互動教具獨立模組
    ├── shape_comparison.html    # 關卡 1：3D 立體圖形觀察與底面/側面特性
    ├── geometry_shapes.html     # 關卡 2：展開圖摺疊與動態組合
    └── interactive_sphere.html  # 關卡 3：球體截面與旋轉特性
```

---

## 模組二：闖關解鎖與進度持久化 (Level Progression)

### 2.1 狀態儲存規範
使用 `localStorage` 儲存已通過的關卡 ID 與最佳成績，保證重新整理或隔天開啟進度不丟失：

```javascript
const STORAGE_KEY = 'edu-progress-v1';
let userState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"done":[],"best":null}');

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
}

// 判斷關卡是否解鎖 (第 1 關恆開，其餘需通過前一關)
function isUnlocked(stepIndex, steps) {
  if (stepIndex === 0) return true;
  return userState.done.includes(steps[stepIndex - 1].id);
}

// 關卡完成回調
function completeStep(stepId) {
  if (!userState.done.includes(stepId)) {
    userState.done.push(stepId);
    saveProgress();
    updateUI();
  }
}
```

---

## 模組三：多解析度極致自適應版面 (Responsive Layout)

### 3.1 首頁「零滾動、等比飽滿」自適應公式
在 1920×1080 桌機、1440×900 筆電、iPad Pro 及各尺寸平板下，內容必須在單一視窗內完全呈現，且大螢幕不可顯得空洞：

```css
/* 使用 clamp 搭配 min(vh, vw) 雙向拘束，兼顧寬高比例 */
.card-icon-wrap {
  width: clamp(75px, min(24vh, 14vw), 170px);
  height: clamp(75px, min(24vh, 14vw), 170px);
}

.card-title {
  font-size: clamp(1.15rem, min(3vh, 2vw), 2.1rem);
  font-weight: 900;
}

.card-desc {
  font-size: clamp(0.82rem, min(1.8vh, 1.1vw), 1.18rem);
}

.action-btn {
  max-width: clamp(190px, 15vw, 260px);
  padding: clamp(9px, 1.5vh, 16px) clamp(16px, 2vw, 24px);
  font-size: clamp(0.85rem, min(1.8vh, 1.2vw), 1.18rem);
}
```

### 3.2 彈窗 Flexbox 捲動截斷避坑 (Scroll Clipping Fix)
**嚴重警告**：彈窗容器千萬**不要**寫 `align-items: center; justify-content: center;`，否則當內容高度大於手機螢幕時，頂部與底部會被推出可捲動區域！

```css
/* 正確的彈窗滾動與 Safe Area 配置 */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 讓長內容依序從最頂端向下排列 */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* 避開 iPhone 瀏海與底部橫條 */
  padding: max(16px, env(safe-area-inset-top, 16px)) 
           max(12px, env(safe-area-inset-right, 12px)) 
           max(36px, env(safe-area-inset-bottom, 36px)) 
           max(12px, env(safe-area-inset-left, 12px));
}

.modal-content {
  width: min(960px, 100%);
  margin: auto 0; /* 短內容自動垂直置中，長內容完整從頂滑到底 */
  flex-shrink: 0;
}
```

---

## 模組四：行動端獨立全螢幕 App 模式 (PWA Standalone)

行動瀏覽器（iOS Safari / Chrome）基於安全考量，網頁腳本無法強制隱藏頂部網址列。最優解法是引導使用者「**加入主畫面**」，以 PWA Standalone 模式開啟。

### 4.1 核心設定檔

**manifest.json**：
```json
{
  "name": "教材名稱",
  "short_name": "教材簡稱",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e1b4b",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

**HTML `<head>` 宣告**：
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="教材名稱" />
<link rel="manifest" href="manifest.json" />
<link rel="apple-touch-icon" href="apple-touch-icon.png" />
<script src="app-mode.js"></script>
```

### 4.2 雙瀏覽器智能教學彈窗 (Safari / Chrome 頁籤切換)
提供自動依 User-Agent 切換頁籤的導引，詳細標示：
- **iOS Chrome**：右上角分享按鈕 ➔ 往下滑選【➕ 加入主畫面】。
- **iOS Safari**：底部工具列分享按鈕 ➔ 【➕ 加入主畫面】。
- **Android Chrome**：右上角選單 `⋮` ➔ 【📲 安裝應用程式】。

---

## 模組五：窄螢幕長工具列常駐雙向滾動導引

當操作工具列（視角切換、旋轉、微調）超出窄螢幕寬度時，**千萬不可只在尾端放按鈕**。必須將引導按鈕**常駐停靠在工具列最右側**，並具備雙向狀態切換：

```jsx
{/* 外層 Flex 容器 */}
<div className="w-full flex items-center justify-center max-w-full px-2">
  <div className="flex items-center gap-1.5 max-w-full w-full justify-center">
    
    {/* 工具列本體 (min-w-0 確保在 Flex 內正確自適應收縮滾動) */}
    <div 
      id="shapeToolbar" 
      ref={toolbarRef}
      onScroll={checkToolbarScroll}
      className="flex items-center gap-1.5 bg-slate-900/95 px-2.5 py-1.5 rounded-2xl min-w-0 overflow-x-auto no-scrollbar scroll-smooth"
    >
      {/* 視角預設按鈕 (看上底、看下底、旋轉、自轉、微調十字鍵) */}
      ...
    </div>

    {/* 🌟 常駐最右側的雙向導引按鈕 🌟 */}
    {(toolbarCanScrollRight || toolbarCanScrollLeft) && (
      <button
        onClick={() => {
          if (toolbarCanScrollRight) {
            toolbarRef.current.scrollBy({ left: 160, behavior: 'smooth' });
          } else {
            toolbarRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          }
        }}
        className={`shrink-0 flex items-center gap-1 px-2.5 py-2 rounded-2xl text-xs font-black shadow-xl active:scale-95 ${
          toolbarCanScrollRight
            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 animate-pulse"
            : "bg-slate-800 text-amber-300"
        }`}
      >
        {toolbarCanScrollRight ? <><span>滑動更多</span><span>❯</span></> : <><span>❮</span><span>回前</span></>}
      </button>
    )}
  </div>
</div>
```

---

## 模組六：防作弊雙重隨機洗牌評量系統 (Double-Shuffle Quiz)

為避免學生重複測驗時背誦答案順序（如「這題選第二個」），測驗引擎必須進行「**題目抽樣洗牌 + 選項打散洗牌**」：

```javascript
function startRandomizedQuiz(questionBank, questionCount = 10) {
  // 1. Fisher-Yates 洗牌演算法
  const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(x => x[1]);

  // 2. 題目抽樣洗牌：從母題庫隨機抽取 N 題
  const selectedQuestions = shuffle(questionBank).slice(0, questionCount).map((item) => {
    // 3. 題目內部選項洗牌：打散選項順序，重新對應正確答案索引
    const shuffledIndices = shuffle(item.o.map((_, i) => i));
    return {
      question: item.q,
      options: shuffledIndices.map(i => item.o[i]),
      answerIndex: shuffledIndices.indexOf(item.a),
      explanation: item.w
    };
  });

  return { questions: selectedQuestions, currentIndex: 0, results: [] };
}
```

---

## 模組七：發布與交付檢核清單 (Quality Checklist)

在將網站交付給使用者或部屬至 GitHub / 伺服器前，依序檢查：

- [ ] **跨解析度檢查**：
  - [ ] 電腦螢幕（1920×1080、1440×900）：首頁卡片飽滿，圖示動態擴展至 150px~170px，無多餘捲軸。
  - [ ] 平板（iPad 1024×768 / 1366×1024）：橫向與直向均能無滾動瀏覽完整版面。
  - [ ] 手機（390×844）：所有關卡介紹彈窗可從頂部標題滑動至最底部按鈕，底部按鈕未被 Home Bar 遮住。
- [ ] **操作引導**：
  - [ ] 長工具列初始狀態下，右側即刻出現「滑動更多 ❯」醒目按鈕。
  - [ ] 滑到底部時，按鈕能自動轉為「❮ 回前」並可平滑滾回。
- [ ] **App 模式相容性**：
  - [ ] 支援 Safari 與 Chrome 兩種瀏覽器的安裝教學與頁籤切換。
  - [ ] 桌面 Icon、apple-touch-icon 與 manifest.json 載入無 404。
- [ ] **Git 衛生維護**：
  - [ ] 排除 `.DS_Store` 與非必要暫存檔案。
  - [ ] 分支與遠端 `origin/main` 保持乾淨同步。
