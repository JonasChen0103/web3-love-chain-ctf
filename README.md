# 🔐 Web3.0 戀鏈資訊營 - 密碼學CTF遊戲

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()

## 📝 專案描述

這是一個結合**密碼學教學**與**浪漫互動**的Web CTF（Capture The Flag）遊戲，專為Web3.0戀鏈資訊營的「錢包運作原理」課程設計。透過三個層層遞進的密碼學謎題，讓學員在解謎過程中學習加密技術的基本原理，同時體驗一場別開生面的數位尋寶之旅。

## 🎯 教學目標

- **密碼學基礎**：學習凱撒密碼、維吉尼亞密碼等經典加密方法
- **視覺解密**：透過SVG圖像疊加技術理解資料隱藏概念
- **Web3思維**：體驗去中心化的互動模式和數位身份驗證
- **實務應用**：將加密技術與社交媒體結合，展現Web3的創新可能

## 🎮 遊戲流程

### 第一關：凱撒密碼挑戰
- **技術重點**：ROT13加密演算法
- **學習目標**：理解對稱加密的基本概念
- **互動元素**：獲得神秘的起司SVG圖片
- **提示線索**：「凱撒沙拉」暗示使用凱撒密碼
- **密文**：`frperg vf gur xrl gb zl ybir`
- **答案**：`secret is the key to my love`

### 第二關：維吉尼亞密碼
- **技術重點**：多表替換密碼系統
- **學習目標**：認識更複雜的加密機制
- **密鑰管理**：使用"LOVE"作為解密密鑰
- **工具延遲**：第二關工具有5分鐘倒數延遲
- **密文**：`tkvrehjfpmjycpvfp`
- **答案**：`iwanttobeyourbabe`

### 第三關：視覺密碼學
- **技術重點**：圖像疊加與資料隱藏
- **創新機制**：SVG透明洞洞作為解密模板
- **解謎方法**：將第一關下載的起司圖片疊加在字母網格上
- **互動助手**：提供互動式網格助手工具
- **最終目標**：解出Instagram帳號 `ins:elma0831`
- **Web3連結**：從虛擬遊戲延伸到真實社交網路

## 🛠 技術架構

### 前端技術
- **HTML5**：語義化結構與響應式設計
- **CSS3**：模組化樣式系統
  - `main.css`：基礎樣式與佈局
  - `components.css`：可重用組件樣式
  - `grid.css`：第三關網格密碼學專用樣式
  - `vigenere.css`：第二關維吉尼亞密碼表樣式
- **JavaScript (ES5)**：模組化架構
  - `config.js`：遊戲配置與常數
  - `crypto.js`：密碼學演算法模組
  - `security.js`：安全防護模組
  - `storage.js`：進度儲存模組
  - `ui.js`：使用者介面模組
  - `level1.js`、`level2.js`、`level3.js`：各關卡邏輯
  - `game.js`：遊戲主控制器
- **SVG**：可下載的向量圖形模板

### 模組化架構
```javascript
// 遊戲配置模組
window.GameConfig = {
    LEVELS: { TOTAL: 3 },
    TIMING: { TOOLS_DELAY: 5 * 60 * 1000 },
    ENCRYPTED_ANSWERS: { /* Base64編碼答案 */ }
};

// 密碼學模組
window.CryptoModule = {
    caesarDecrypt: function(text, shift) { /* 實現 */ },
    vigenereDecrypt: function(ciphertext, key) { /* 實現 */ },
    checkAnswer: function(userInput, level) { /* 實現 */ }
};

// 安全防護模組
window.SecurityModule = {
    initSecurity: function() { /* 實現 */ },
    validateAccess: function(level) { /* 實現 */ }
};
```

### 🔒 強化安全機制
- **多層防護**：開發者工具偵測、鍵盤攔截、右鍵禁用
- **進階偵測**：視窗大小監控、debugger語句偵測
- **存取控制**：嚴格的關卡順序驗證
- **進度保護**：持續監控防止localStorage篡改
- **答案加密**：Base64編碼保護正確答案

## 📁 專案結構

```
web3-love-chain-ctf/
├── index.html              # 第一關：凱撒密碼
├── page2.html              # 第二關：維吉尼亞密碼
├── page3.html              # 第三關：視覺密碼學
├── scripts/
│   ├── config.js           # 遊戲配置與常數
│   ├── crypto.js           # 密碼學演算法模組
│   ├── security.js         # 安全防護模組
│   ├── storage.js          # 進度儲存模組
│   ├── ui.js               # 使用者介面模組
│   ├── level1.js           # 第一關邏輯
│   ├── level2.js           # 第二關邏輯
│   ├── level3.js           # 第三關邏輯
│   └── game.js             # 遊戲主控制器
├── styles/
│   ├── main.css            # 基礎樣式
│   ├── components.css      # 組件樣式
│   ├── grid.css            # 網格密碼學樣式
│   └── vigenere.css        # 維吉尼亞密碼表樣式
├── LICENSE                 # MIT 授權
├── README.md               # 專案說明
└── .gitignore              # Git忽略規則
```

## 🚀 快速開始

### 環境需求
- 現代瀏覽器 (Chrome 90+, Firefox 88+, Safari 14+)
- 支援ES5、SVG和localStorage
- 本地HTTP伺服器（推薦）

### 安裝與運行
```bash
# 複製專案
git clone https://github.com/your-username/web3-love-chain-ctf.git

# 進入專案目錄
cd web3-love-chain-ctf

# 使用本地伺服器運行（推薦）
# 方法一：Python
python -m http.server 8000

# 方法二：Node.js
npx serve .

# 方法三：VS Code Live Server
# 右鍵點擊 index.html -> "Open with Live Server"

# 瀏覽器開啟
open http://localhost:8000
```

## 🎓 教學應用指南

### 課堂運用建議
1. **課前預習**：學員先體驗遊戲，激發學習興趣
2. **分組競賽**：團隊合作解謎，促進協作學習
3. **技術講解**：結合遊戲關卡講解密碼學原理
4. **延伸討論**：探討Web3中的加密應用場景

### 遊戲特色功能
- **進度追蹤**：自動保存學習進度
- **提示系統**：分級提示幫助學習
- **工具延遲**：第二關5分鐘倒數增加挑戰性
- **互動助手**：第三關網格選擇工具
- **響應式設計**：支援各種裝置螢幕

## 🔒 密碼學知識點

### 凱撒密碼（Caesar Cipher）
- **歷史背景**：古羅馬軍事通信加密
- **技術原理**：字母表位移替換（ROT13）
- **安全性分析**：容易被頻率分析破解
- **現代應用**：網路論壇的簡單混淆

### 維吉尼亞密碼（Vigenère Cipher）
- **創新突破**：多表替換密碼系統
- **密鑰管理**：重複使用關鍵字"LOVE"
- **破解歷史**：曾被稱為"不可破解的密碼"
- **Web3關聯**：對稱加密的概念基礎

### 視覺密碼學（Visual Cryptography）
- **核心概念**：將秘密分散在多個圖像中
- **技術實現**：SVG透明度與疊加操作
- **實用價值**：多方驗證與去中心化授權
- **區塊鏈應用**：多重簽名的視覺化表示

## 🌟 創新特色

### 教育價值
- **寓教於樂**：透過遊戲化學習提升參與度
- **循序漸進**：從簡單到複雜的密碼學概念
- **實作導向**：親手操作加深理解
- **跨域整合**：結合技術、藝術與社交元素

### 技術亮點
- **模組化架構**：易於維護和擴展的代碼結構
- **純前端實現**：無需後端服務器
- **離線可用**：下載後可離線遊玩
- **跨平台相容**：支援桌面與行動裝置
- **開源設計**：MIT授權，可自由修改與擴展

### Web3 DNA
- **去中心化驗證**：透過社交媒體完成最終驗證
- **數位身份**：Instagram帳號作為身份標識
- **社群互動**：將遊戲延伸至真實社交網路
- **創新思維**：展現Web3的創意應用可能

## 🛡️ 防作弊機制

### 多層防護系統
- **開發者工具偵測**：即時監控視窗尺寸變化
- **進階偵測**：debugger語句時間檢測
- **鍵盤事件攔截**：阻止所有開發者工具快捷鍵
- **右鍵選單禁用**：防止檢視原始碼
- **答案加密**：Base64編碼隱藏正確答案
- **進度驗證**：localStorage進度追蹤防止跳關
- **持續監控**：定期檢查存取權限

### 使用者體驗
- **無感防護**：正常遊玩完全不受影響
- **友善提示**：偵測到異常時顯示友善警告
- **自動恢復**：關閉開發者工具後可正常繼續

## 🎯 完整解題指南

### 第一關解答
- **密文**：`frperg vf gur xrl gb zl ybir`
- **方法**：使用ROT13（凱撒密碼位移13）
- **提示**：「凱撒沙拉」暗示
- **答案**：`secret is the key to my love`

### 第二關解答
- **密文**：`tkvrehjfpmjycpvfp`
- **密鑰**：`LOVE`（從「口頭禪」線索推導）
- **工具**：5分鐘後解鎖維吉尼亞密碼表
- **外部工具**：[CyberChef](https://gchq.github.io/CyberChef/) 或 [dCode](https://www.dcode.fr/)
- **答案**：`iwanttobeyourbabe`

### 第三關解答
- **方法**：使用第一關下載的起司SVG圖片
- **步驟**：
  1. 將起司圖片疊加在6×8字母網格上
  2. 觀察起司上的實心洞洞位置
  3. 對應網格中的字母位置
  4. 按從左到右、從上到下順序讀取
- **輔助工具**：互動式網格助手
- **答案**：`ins:elma0831`

## 🚧 已知問題與限制

- **瀏覽器相容性**：建議使用現代瀏覽器獲得最佳體驗
- **防作弊限制**：技術嫻熟的使用者可能繞過某些保護
- **行動裝置體驗**：小螢幕上部分互動功能可能受限
- **localStorage依賴**：清除瀏覽器資料會重置進度

## 📊 開發模式

### 開發者工具（僅限localhost）
```javascript
// 可用的開發者命令
window.devTools = {
    getGameState: function() { /* 獲取遊戲狀態 */ },
    showDebugInfo: function() { /* 顯示除錯資訊 */ },
    autoSolve: function() { /* 自動解答當前關卡 */ },
    exportData: function() { /* 匯出遊戲資料 */ },
    importData: function(data) { /* 匯入遊戲資料 */ },
    forceReset: function() { /* 強制重置 */ }
};
```

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

### 授權內容
- ✅ **商業使用**：可用於商業用途
- ✅ **修改**：可自由修改代碼
- ✅ **分發**：可重新分發
- ✅ **私人使用**：可私人使用
- ❌ **責任**：作者不承擔使用責任
- ❌ **保固**：不提供任何保固

## 🏷 標籤

`#Web3` `#密碼學` `#CTF` `#教育遊戲` `#區塊鏈教學` `#JavaScript` `#SVG` `#前端開發` `#模組化` `#安全機制` `#視覺密碼學` `#凱撒密碼` `#維吉尼亞密碼` `#響應式設計`

---

*「在Web3的世界裡，愛情與技術同樣需要密碼學來保護。讓我們一起探索數位時代的浪漫密碼！」* 💕🔐