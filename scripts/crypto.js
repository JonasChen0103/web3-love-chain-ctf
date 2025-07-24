// Web3.0 戀鏈資訊營 - 密碼學CTF遊戲
// 最終修正版

console.log('遊戲載入中...');

// ===== 防作弊措施 =====
(function() {
    let devtools = {open: false, orientation: null};
    const threshold = 160;

    const checkDevTools = () => {
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:2rem;color:#d6336c;">🚫 請關閉開發者工具後重新整理頁面</div>';
            }
        }
    };

    const detectRightClick = (e) => {
        e.preventDefault();
        return false;
    };

    const detectKeyPress = (e) => {
        if (e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
            return false;
        }
    };

    document.addEventListener('contextmenu', detectRightClick);
    document.addEventListener('keydown', detectKeyPress);
    setInterval(checkDevTools, 500);
})();

// ===== 加密答案 =====
const encryptedAnswers = {
    a: 'c2VjcmV0IGlzIHRoZSBrZXkgdG8gbXkgbG92ZQ==',
    b: 'aXdhbnR0b2JleW91cmJhYmU=',
    c: 'aW5zOmVsbWEwODMx'
};

// ===== 遊戲統計 =====
let gameStats = {
    attempts: { level1: 0, level2: 0, level3: 0 },
    hintsUsed: 0,
    startTime: Date.now(),
    recordAttempt: function(level) {
        this.attempts['level' + level]++;
    },
    recordHint: function() {
        this.hintsUsed++;
    },
    getStats: function() {
        return {
            attempts: this.attempts,
            hintsUsed: this.hintsUsed,
            startTime: this.startTime
        };
    }
};

// ===== 密碼學函數 =====
function caesarDecrypt(text, shift) {
    if (!shift) shift = 13;
    return text.replace(/[a-zA-Z]/g, function(char) {
        const start = char <= 'Z' ? 65 : 97;
        return String.fromCharCode(
            ((char.charCodeAt(0) - start - shift + 26) % 26) + start
        );
    });
}

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

// ===== 答案檢查函數 =====
function checkAnswer(userInput, level) {
    const answers = {
        1: atob(encryptedAnswers.a),
        2: atob(encryptedAnswers.b),
        3: atob(encryptedAnswers.c)
    };
    return userInput.trim().toLowerCase() === answers[level];
}

// ===== 存取控制 =====
function validateAccess(requiredLevel) {
    try {
        const progress = localStorage.getItem('ctf_progress');
        console.log('檢查存取權限 - 需要關卡:', requiredLevel, '進度資料:', progress);

        if (!progress) {
            console.log('沒有進度資料，拒絕存取');
            return false;
        }

        const data = JSON.parse(progress);
        console.log('解析後的進度:', data);

        if (requiredLevel === 2) {
            const hasAccess = data.level >= 2 && data.completed && data.completed.includes(1);
            console.log('第二關存取檢查:', hasAccess);
            return hasAccess;
        }
        if (requiredLevel === 3) {
            const hasAccess = data.level >= 3 && data.completed &&
                data.completed.includes(1) && data.completed.includes(2);
            console.log('第三關存取檢查:', hasAccess);
            return hasAccess;
        }
        return true;
    } catch (e) {
        console.error('存取檢查錯誤:', e);
        return false;
    }
}

function saveProgress(level, completed) {
    try {
        let progress = { level: 1, completed: [] };

        const existing = localStorage.getItem('ctf_progress');
        if (existing) {
            progress = JSON.parse(existing);
        }

        // 更新可存取的關卡等級
        progress.level = Math.max(progress.level || 1, level);

        // 如果是標記完成狀態
        if (completed && !progress.completed.includes(level)) {
            progress.completed.push(level);
        }

        localStorage.setItem('ctf_progress', JSON.stringify(progress));
        console.log('進度已保存:', progress);
    } catch (e) {
        console.warn('無法保存進度:', e);
    }
}

// 頁面載入時的存取檢查
function checkPageAccess() {
    const currentPage = window.location.pathname;
    console.log('當前頁面:', currentPage);

    if (currentPage.includes('page2.html')) {
        if (!validateAccess(2)) {
            console.log('第二關存取被拒絕，重定向到第一關');
            alert('請先完成第一關才能進入第二關！');
            window.location.href = 'index.html';
            return false;
        }
    } else if (currentPage.includes('page3.html')) {
        if (!validateAccess(3)) {
            console.log('第三關存取被拒絕，重定向到第一關');
            alert('請依序完成前面的關卡才能進入最終挑戰！');
            window.location.href = 'index.html';
            return false;
        }
    }
    return true;
}

// 持續檢查存取權限（防止localStorage被篡改）
function startAccessMonitoring() {
    setInterval(function() {
        const currentPage = window.location.pathname;
        if (currentPage.includes('page2.html') && !validateAccess(2)) {
            console.log('偵測到無效存取第二關');
            window.location.href = 'index.html';
        } else if (currentPage.includes('page3.html') && !validateAccess(3)) {
            console.log('偵測到無效存取第三關');
            window.location.href = 'index.html';
        }
    }, 2000); // 每2秒檢查一次
}

// ===== UI 函數 =====
function showResult(elementId, message, isSuccess) {
    const resultElement = document.getElementById(elementId);
    if (!resultElement) return;

    resultElement.innerHTML = message;
    resultElement.className = isSuccess ? 'result-success' : 'result-error';
    resultElement.style.opacity = '1';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;

    const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';

    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: white; font-weight: 600; z-index: 10000; max-width: 300px; word-wrap: break-word; background-color: ' + bgColor + ';';

    document.body.appendChild(notification);
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// ===== 第一關函數 =====
function checkCaesar() {
    const input = document.getElementById("caesar-input");
    if (!input) return;

    const userInput = input.value.trim();
    gameStats.recordAttempt(1);

    if (checkAnswer(userInput, 1)) {
        saveProgress(1, true);  // 標記第一關已完成
        saveProgress(2, false); // 解鎖第二關
        showResult("caesar-result", "🎉 答對了！你可以前往下一關了！<br><a class='next-level-btn' href='page2.html'><span class='btn-icon'>🚀</span> 前往第二關 <span class='btn-arrow'>→</span></a>", true);
        showNotification('第一關完成！', 'success');
    } else {
        showResult("caesar-result", "❌ 不對喔，再試試看！記住凱撒沙拉的秘密～", false);
    }
}

function downloadCheese() {
    const svgElement = document.getElementById('cheese-svg');
    if (!svgElement) {
        showNotification('找不到起司圖片', 'error');
        return;
    }

    try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'special_cheese.svg';
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(svgUrl);
        showNotification('起司圖片下載成功！記得保存好，第三關會用到～', 'success');
    } catch (error) {
        showNotification('下載失敗，請稍後再試', 'error');
    }
}

// ===== 第二關函數 =====
function checkVigenere() {
    if (!validateAccess(2)) {
        window.location.href = 'index.html';
        return;
    }

    const input = document.getElementById("vigenere-input");
    if (!input) return;

    const userInput = input.value.trim();
    gameStats.recordAttempt(2);

    if (checkAnswer(userInput, 2)) {
        saveProgress(2, true);  // 標記第二關已完成
        saveProgress(3, false); // 解鎖第三關
        showResult("vigenere-result", "💕 你成功解開了密碼！<br><a class='next-level-btn' href='page3.html'><span class='btn-icon'>🎯</span> 前往最終關卡 <span class='btn-arrow'>→</span></a>", true);
        showNotification('第二關完成！', 'success');
    } else {
        showResult("vigenere-result", "💔 不對喔，再想想看！密鑰就在我的話語中～", false);
    }
}

function showVigenereTools() {
    const tools = document.getElementById('vigenere-tools');
    if (!tools) return;

    tools.classList.toggle('hidden');
    if (!tools.classList.contains('hidden')) {
        tools.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ===== 第三關函數 =====
let selectedPositions = [];

const gridData = [
    ['7', 'I', 'N', 'U', 'R', '%', 'H', 'O'],
    ['S', 'P', 'Q', 'K', '!', 'K', ':', 'Q'],
    ['E', 'C', 'B', 'T', '2', '$', 'L', 'G'],
    ['W', 'M', '6', 'F', 'A', '0', '#', 'C'],
    ['2', '8', 'D', 'Y', 'V', 'X', '!', 'Z'],
    ['3', 'R', '5', 'J', 'H', 'W', '1', 'P']
];

function checkFinalAnswer() {
    if (!validateAccess(3)) {
        window.location.href = 'index.html';
        return;
    }

    const input = document.getElementById("final-input");
    if (!input) return;

    const userInput = input.value.trim();
    gameStats.recordAttempt(3);

    if (checkAnswer(userInput, 3)) {
        const successSection = document.getElementById('success-section');
        const instagramLink = document.getElementById('instagram-link');

        if (successSection) successSection.classList.remove('hidden');
        if (instagramLink) instagramLink.href = 'https://instagram.com/' + userInput.split(':')[1];

        showResult("final-result", "🎊 完美！你成功解開了最終密碼！", true);
        showNotification('恭喜完成所有關卡！', 'success');

        setTimeout(function() {
            if (successSection) {
                successSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 1500);
    } else {
        showResult("final-result", "🤔 還不對哦！試試用起司圖片對照字母網格，找出隱藏的訊息", false);
    }
}

function showGridHelper() {
    const helper = document.getElementById('grid-helper');
    if (!helper) return;

    helper.classList.toggle('hidden');
    if (!helper.classList.contains('hidden')) {
        generateInteractiveGrid();
        helper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function generateInteractiveGrid() {
    const gridContainer = document.getElementById('interactive-grid');
    if (!gridContainer) return;

    let html = '';
    for (let row = 0; row < gridData.length; row++) {
        for (let col = 0; col < gridData[row].length; col++) {
            html += '<span class="grid-letter" data-row="' + row + '" data-col="' + col + '" onclick="toggleLetter(' + row + ', ' + col + ')" style="display: inline-block; width: 20px; height: 20px; text-align: center; line-height: 20px; cursor: pointer; margin: 2px; border-radius: 3px; transition: all 0.3s ease;">' + gridData[row][col] + '</span>';
            if (col < gridData[row].length - 1) html += '  ';
        }
        html += '<br><br>';
    }
    gridContainer.innerHTML = html;
}

function toggleLetter(row, col) {
    const span = document.querySelector('[data-row="' + row + '"][data-col="' + col + '"]');
    if (!span) return;

    const position = row + ',' + col;
    if (selectedPositions.indexOf(position) !== -1) {
        selectedPositions = selectedPositions.filter(function(p) { return p !== position; });
        span.style.backgroundColor = '';
        span.style.color = '';
        span.style.fontWeight = '';
        span.classList.remove('selected');
    } else {
        selectedPositions.push(position);
        span.style.backgroundColor = '#d6336c';
        span.style.color = 'white';
        span.style.fontWeight = 'bold';
        span.classList.add('selected');
    }
    updateSelectedLetters();
}

function updateSelectedLetters() {
    const letters = selectedPositions.map(function(pos) {
        const parts = pos.split(',');
        const row = parseInt(parts[0]);
        const col = parseInt(parts[1]);
        return gridData[row][col];
    }).join('');

    const letterSequence = document.getElementById('letter-sequence');
    if (letterSequence) {
        letterSequence.textContent = letters || '(尚未選擇)';
    }
}

function clearSelection() {
    selectedPositions = [];
    const gridLetters = document.querySelectorAll('.grid-letter');
    for (let i = 0; i < gridLetters.length; i++) {
        const span = gridLetters[i];
        span.style.backgroundColor = '';
        span.style.color = '';
        span.style.fontWeight = '';
        span.classList.remove('selected');
    }
    updateSelectedLetters();
}

function showSelected() {
    const letters = selectedPositions.map(function(pos) {
        const parts = pos.split(',');
        const row = parseInt(parts[0]);
        const col = parseInt(parts[1]);
        return gridData[row][col];
    }).join('');

    const finalInput = document.getElementById('final-input');
    if (finalInput && letters) {
        finalInput.value = letters.toLowerCase();
        showNotification('已填入：' + letters, 'info');
    }
}

// ===== 提示函數 =====
function showHint(level) {
    const hints = {
        1: '🔤 想想看那道以某個著名人物命名的沙拉...這種加密方法就是把每個字母移動固定的位置數。試試看移動13個位置？A→N, B→O, C→P...',
        2: '💕 這種加密方式比第一關更複雜，需要用一個關鍵字來反覆加密每個字母。想想看我在信中提到的那個「口頭禪」...一個四個字母的英文單字，當我很喜歡一個人的時候就會不自覺地說出來。找到這個密鑰後，你可以使用線上工具來解密！',
        3: '🧀 把第一關下載的起司圖片疊在字母表上！起司上的實心洞洞會告訴你答案。從左到右、從上到下按順序讀出所有被洞洞標記的字母。'
    };

    const hint = hints[level];
    if (hint) {
        showNotification(hint, 'info');
        gameStats.recordHint();
    }
}

function resetGame() {
    if (confirm('確定要重新開始遊戲嗎？這將清除所有進度。')) {
        localStorage.removeItem('ctf_progress');
        showNotification('遊戲已重置', 'info');
        setTimeout(function() {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ===== 全域函數設置 =====
window.checkCaesar = checkCaesar;
window.downloadCheese = downloadCheese;
window.checkVigenere = checkVigenere;
window.showVigenereTools = showVigenereTools;
window.checkFinalAnswer = checkFinalAnswer;
window.showGridHelper = showGridHelper;
window.toggleLetter = toggleLetter;
window.clearSelection = clearSelection;
window.showSelected = showSelected;
window.showHint = showHint;
window.resetGame = resetGame;
window.gameStats = gameStats;

// 將存取檢查函數也加入全域範圍
window.checkPageSpecificAccess = checkPageSpecificAccess;
window.checkPageAccess = checkPageAccess;
window.startAccessMonitoring = startAccessMonitoring;

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('遊戲已載入');

    // 如果是首頁，初始化進度（確保只能從第一關開始）
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        console.log('首頁載入，初始化遊戲進度');
        // 不清除進度，讓玩家可以繼續之前的進度
    } else {
        // 執行頁面存取檢查
        if (!checkPageAccess()) {
            return; // 如果存取被拒絕，停止初始化
        }

        // 啟動持續存取監控
        startAccessMonitoring();
    }

    console.log('頁面存取檢查通過');
});

// 將相關函數加入全域範圍
window.checkPageAccess = checkPageAccess;
window.startAccessMonitoring = startAccessMonitoring;

console.log('腳本載入完成');