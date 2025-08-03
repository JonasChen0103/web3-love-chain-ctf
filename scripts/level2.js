/**
 * 第二關 - 維吉尼亞密碼挑戰
 */

window.Level2 = (function() {
    'use strict';

    // 私有變數
    let pageLoadTime = Date.now();
    let countdownTimer = null;
    let toolsEnabled = false;

    /**
     * 檢查第二關答案
     */
    function checkAnswer() {
        // 檢查存取權限
        if (!SecurityModule.validateAccess(2)) {
            window.location.href = GameConfig.PAGES.INDEX;
            return;
        }

        const input = document.getElementById("vigenere-input");
        if (!input) {
            console.error('找不到輸入元素');
            return;
        }

        const userInput = input.value.trim();

        // 驗證輸入
        if (!validateInput(userInput)) {
            return;
        }

        // 記錄嘗試次數
        GameProgress.recordAttempt(2);

        if (CryptoModule.checkAnswer(userInput, 2)) {
            // 答案正確
            GameProgress.saveProgress(2, true);  // 標記第二關已完成
            GameProgress.saveProgress(3, false); // 解鎖第三關

            const successMessage = "💕 你成功解開了密碼！<br>" +
                GameUI.createNextLevelButton('前往最終關卡', 'page3.html', '🎯');

            GameUI.showResult("vigenere-result", successMessage, true);
            GameUI.showNotification(SuccessMessages.LEVEL_2_COMPLETE, 'success');

            // 更新進度指示器
            GameUI.updateProgressIndicator();

        } else {
            // 答案錯誤
            GameUI.showResult("vigenere-result",
                "💔 不對喔，再想想看！密鑰就在我的話語中～", false);
        }
    }

    /**
     * 顯示解密工具
     */
    function showTools() {
        if (!toolsEnabled) {
            GameUI.showNotification('工具尚未啟用，請耐心等待', 'warning');
            return;
        }

        const tools = document.getElementById('vigenere-tools');
        if (!tools) return;

        GameUI.toggleElement('vigenere-tools');

        if (!tools.classList.contains('hidden')) {
            // 生成維吉尼亞密碼表
            generateVigenereTable();
            GameUI.scrollToElement('vigenere-tools', 'center');
        }
    }

    /**
     * 生成維吉尼亞密碼表
     */
    function generateVigenereTable() {
        const table = document.getElementById('vigenere-table');
        if (!table) return;

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let html = '';

        // 生成表頭
        html += '<thead><tr><th></th>'; // 左上角空白
        for (let i = 0; i < 26; i++) {
            html += '<th>' + alphabet[i] + '</th>';
        }
        html += '</tr></thead>';

        // 生成表身
        html += '<tbody>';
        for (let i = 0; i < 26; i++) {
            html += '<tr>';
            html += '<th>' + alphabet[i] + '</th>'; // 行標題字母

            for (let j = 0; j < 26; j++) {
                const encryptedChar = alphabet[(i + j) % 26];
                html += '<td>' + encryptedChar + '</td>';
            }

            html += '</tr>';
        }
        html += '</tbody>';

        table.innerHTML = html;

        console.log('密碼表已生成');
    }

    /**
     * 啟動倒數計時器
     */
    function startCountdown() {
        const toolsBtn = document.getElementById('tools-btn');
        if (!toolsBtn) return;

        const duration = GameConfig.TIMING.TOOLS_DELAY; // ← 5分鐘設定在這裡
        const endTime = pageLoadTime + duration;

        // 設定初始狀態
        toolsBtn.classList.add('disabled');

        countdownTimer = setInterval(function() {
            const now = Date.now();
            const remaining = endTime - now;

            if (remaining <= 0) {
                // 時間到，啟用按鈕
                clearInterval(countdownTimer);
                toolsEnabled = true;
                toolsBtn.classList.remove('disabled');
                toolsBtn.removeAttribute('data-countdown');
                GameUI.showNotification(SuccessMessages.TOOLS_ENABLED, 'success');
                console.log('解密工具已啟用');
                return;
            }

            // 更新倒數顯示
            const countdown = GameUI.formatCountdown(remaining);
            toolsBtn.setAttribute('data-countdown', countdown);
        }, GameConfig.TIMING.COUNTDOWN_UPDATE_INTERVAL); // ← 每1秒更新
    }

    /**
     * 初始化第二關
     */
    function init() {
        console.log('第二關初始化');

        // 檢查存取權限
        if (!SecurityModule.checkPageAccess()) {
            return;
        }

        // 設定輸入框事件監聽
        const input = document.getElementById("vigenere-input");
        if (input) {
            // Enter鍵提交
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    checkAnswer();
                }
            });
        }

        // 啟動工具倒數計時
        startCountdown();

        // 啟動存取監控
        SecurityModule.startAccessMonitoring();

        // 檢查是否已完成，但不自動顯示
        if (GameProgress.isLevelCompleted(2)) {
            console.log('第二關已完成');
        }
    }

    /**
     * 顯示第二關提示
     */
    function showHint() {
        GameUI.showHint(2);
    }

    /**
     * 驗證輸入格式
     * @param {string} input - 使用者輸入
     * @returns {boolean} 是否為有效格式
     */
    function validateInput(input) {
        if (!input || input.trim().length === 0) {
            GameUI.showNotification('請輸入答案', 'warning');
            return false;
        }

        if (input.trim().length < 5) {
            GameUI.showNotification('答案太短了，請檢查一下', 'warning');
            return false;
        }

        return true;
    }

    /**
     * 獲取關卡提示
     * @returns {string} 提示內容
     */
    function getHint() {
        return GameConfig.HINTS[2];
    }

    /**
     * 獲取密文
     * @returns {string} 第二關密文
     */
    function getCipherText() {
        return "tkvrehjfpmjycpvfp";
    }

    /**
     * 獲取密鑰提示
     * @returns {string} 密鑰提示
     */
    function getKeyHint() {
        return "想想看我的「口頭禪」...一個四個字母的英文單字";
    }

    /**
     * 顯示維吉尼亞密碼說明
     */
    function showCryptoExplanation() {
        const explanation =
            "維吉尼亞密碼是一種使用密鑰的多表替換加密技術。" +
            "它使用一個關鍵字來重複加密明文中的每個字母，" +
            "比單一的凱撒密碼更加安全。";

        GameUI.showNotification(explanation, 'info');
    }

    /**
     * 重置工具狀態（用於測試）
     */
    function resetToolsTimer() {
        pageLoadTime = Date.now();
        toolsEnabled = false;

        if (countdownTimer) {
            clearInterval(countdownTimer);
        }

        startCountdown();
    }

    /**
     * 清理第二關資源
     */
    function cleanup() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        SecurityModule.stopAccessMonitoring();
    }

    // 公開介面
    return {
        checkAnswer: checkAnswer,
        showTools: showTools,
        showHint: showHint,
        generateVigenereTable: generateVigenereTable,
        init: init,
        cleanup: cleanup,
        getHint: getHint,
        getCipherText: getCipherText,
        getKeyHint: getKeyHint,
        validateInput: validateInput,
        showCryptoExplanation: showCryptoExplanation,
        resetToolsTimer: resetToolsTimer,

        // 狀態檢查
        isToolsEnabled: function() { return toolsEnabled; },
        getTimeRemaining: function() {
            return Math.max(0, pageLoadTime + GameConfig.TIMING.TOOLS_DELAY - Date.now());
        }
    };
})();

console.log('Level2 載入完成');