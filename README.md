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
- **情感連結**：透過個人化密鑰增強參與感
- **密文**：`tkvrehjfpmjycpvfp`
- **答案**：`iwanttobeyourbabe`

### 第三關：視覺密碼學
- **技術重點**：圖像疊加與資料隱藏
- **創新機制**：SVG透明洞洞作為解密模板
- **解謎方法**：將第一關下載的起司圖片疊加在字母網格上
- **最終目標**：解出Instagram帳號 `ins:elma0831`
- **Web3連結**：從虛擬遊戲延伸到真實社交網路

## 🛠 技術架構

### 前端技術
- **HTML5**：響應式網頁結構
- **CSS3**：美觀的視覺設計與動畫效果
- **JavaScript (ES5)**：密碼學演算法實現，確保瀏覽器兼容性
- **SVG**：可下載的向量圖形模板

### 密碼學實現
```javascript
// 凱撒密碼解密
function caesarDecrypt(text, shift) {
    if (!shift) shift = 13;
    return text.replace(/[a-zA-Z]/g, function(char) {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - start - shift + 26) % 26) + start
        );
    });
}

// 維吉尼亞密碼解密
function vigenereDecrypt(ciphertext, key) {
    key = key.toUpperCase();
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i];
        if (/[A-Za-z]/.test(char)) {
            const isUpperCase = char === char.toUpperCase();
            const base = isUpperCase ? 65 : 97;
            const keyShift = key[keyIndex % key.length].charCodeAt(0) - 65;
            const decryptedChar = String.fromCharCode(
                ((char.charCodeAt(0) - base - keyShift + 26) % 26) + base
            );
            result += decryptedChar;
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}
```

### 🔒 安全機制
- **關卡順序控制**：使用localStorage進度追蹤，防止跳關
- **開發者工具防護**：自動偵測並阻止開發者工具使用
- **答案加密保護**：所有正確答案使用base64加密存儲
- **右鍵選單禁用**：防止查看原始碼
- **快捷鍵攔截**：阻止F12、Ctrl+U等開發者工具快捷鍵

## 📁 專案結構

```
web3-love-chain-ctf/
├── index.html          # 第一關：凱撒密碼
├── page2.html          # 第二關：維吉尼亞密碼
├── page3.html          # 第三關：視覺密碼學
├── scripts/
│   └── crypto.js       # 密碼學函數庫
├── styles/
│   └── main.css        # 樣式表
├── README.md           # 專案說明文件
└── LICENSE             # MIT 授權文件
```

## 🚀 快速開始

### 環境需求
- 現代瀏覽器 (Chrome 90+, Firefox 88+, Safari 14+)
- 支援SVG和ES5的環境
- 本地HTTP伺服器（推薦）

### 安裝與運行
```bash
# 複製專案
git clone https://github.com/your-username/web3-love-chain-ctf.git

# 進入專案目錄
cd web3-love-chain-ctf

# 使用本地伺服器運行（推薦）
# 方法一：使用 Python
python -m http.server 8000

# 方法二：使用 Node.js serve
npx serve .

# 方法三：使用 Live Server (VS Code 擴充功能)
# 右鍵點擊 index.html -> "Open with Live Server"

# 瀏覽器開啟
open http://localhost:8000
```

## 🎓 教學應用指南

### 課堂運用建議
1. **課前預習**：讓學員先體驗遊戲，激發學習興趣
2. **分組競賽**：團隊合作解謎，促進協作學習
3. **技術講解**：結合遊戲關卡講解密碼學原理
4. **延伸討論**：探討Web3中的加密應用場景

### 完整解題指南
#### 第一關解答
- **密文**：`frperg vf gur xrl gb zl ybir`
- **方法**：使用ROT13（凱撒密碼位移13）
- **答案**：`secret is the key to my love`

#### 第二關解答
- **密文**：`tkvrehjfpmjycpvfp`
- **密鑰**：`LOVE`（從文中線索推導）
- **工具**：可使用 [CyberChef](https://gchq.github.io/CyberChef/) 或 [dCode](https://www.dcode.fr/)
- **答案**：`iwanttobeyourbabe`

#### 第三關解答
- **方法**：下載第一關的起司SVG圖片，疊加在字母對照表上
- **步驟**：
    1. 觀察起司上的實心洞洞位置
    2. 對照6×8字母網格
    3. 按從左到右、從上到下順序讀取
- **答案**：`ins:elma0831`

## 🔒 密碼學知識點

### 凱撒密碼（Caesar Cipher）
- **歷史背景**：古羅馬軍事通信加密
- **技術原理**：字母表位移替換
- **安全性分析**：容易被頻率分析破解
- **現代應用**：ROT13在網路論壇的簡單混淆

### 維吉尼亞密碼（Vigenère Cipher）
- **創新突破**：多表替換密碼
- **密鑰管理**：重複使用關鍵字
- **破解歷史**：巴貝奇-卡西斯基測試
- **Web3關聯**：對稱加密的概念基礎

### 視覺密碼學（Visual Cryptography）
- **核心概念**：將秘密分散在多個圖像中
- **技術實現**：透明度與疊加操作
- **實用價值**：多方驗證與去中心化授權
- **區塊鏈應用**：多重簽名的視覺化表示

## 🌟 創新特色

### 教育價值
- **寓教於樂**：透過遊戲化學習提升參與度
- **循序漸進**：從簡單到複雜的密碼學概念
- **實作導向**：親手操作加深理解
- **跨域整合**：結合技術、藝術與社交元素

### 技術亮點
- **純前端實現**：無需後端服務器
- **離線可用**：下載後可離線遊玩
- **跨平台相容**：支援桌面與行動裝置
- **開源設計**：可自由修改與擴展
- **防作弊機制**：完整的安全防護系統

### Web3 DNA
- **去中心化驗證**：透過社交媒體完成最終驗證
- **數位身份**：Instagram帳號作為身份標識
- **社群互動**：將遊戲延伸至真實社交網路
- **創新思維**：展現Web3的創意應用可能

## 🛡️ 防作弊機制

### 技術手段
- **開發者工具偵測**：即時監控視窗尺寸變化
- **鍵盤事件攔截**：阻止所有開發者工具快捷鍵
- **右鍵選單禁用**：防止檢視原始碼
- **答案加密**：使用base64編碼隱藏正確答案
- **進度驗證**：localStorage進度追蹤防止跳關

### 使用者體驗
- **無感防護**：正常遊玩不受任何影響
- **友善提示**：偵測到作弊行為時顯示友善警告
- **自動恢復**：關閉開發者工具後可正常繼續遊戲

## 🚧 已知問題與限制

- **瀏覽器相容性**：建議使用現代瀏覽器以獲得最佳體驗
- **防作弊限制**：技術嫻熟的使用者仍可繞過某些保護機制
- **行動裝置體驗**：部分互動功能在小螢幕上可能不夠流暢

## 📄 授權條款

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

MIT License 意味著：
- ✅ 商業使用
- ✅ 修改
- ✅ 分發
- ✅ 私人使用
- ❌ 責任
- ❌ 保固

## 🏷 關鍵字

`#Web3` `#密碼學` `#CTF` `#教育遊戲` `#區塊鏈教學` `#JavaScript` `#SVG` `#前端開發` `#防作弊` `#安全機制` `#視覺密碼學` `#凱撒密碼` `#維吉尼亞密碼`

---

*「在Web3的世界裡，愛情與技術同樣需要密碼學來保護。讓我們一起探索數位時代的浪漫密碼！」* 💕🔐