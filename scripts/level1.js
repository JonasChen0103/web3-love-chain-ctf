/**
 * 第一關 - 凱撒密碼挑戰
 */

window.Level1 = (function() {
    'use strict';

    /**
     * 檢查第一關答案
     */
    function checkAnswer() {
        const input = document.getElementById("caesar-input");
        if (!input) {
            console.error('找不到輸入元素');
            return;
        }

        const userInput = input.value.trim();

        // 記錄嘗試次數
        GameProgress.recordAttempt(1);

        if (CryptoModule.checkAnswer(userInput, 1)) {
            // 答案正確
            GameProgress.saveProgress(1, true);  // 標記第一關已完成
            GameProgress.saveProgress(2, false); // 解鎖第二關

            const successMessage = "🎉 答對了！你可以前往下一關了！<br>" +
                GameUI.createNextLevelButton('前往第二關', 'page2.html', '🚀');

            GameUI.showResult("caesar-result", successMessage, true);
            GameUI.showNotification(SuccessMessages.LEVEL_1_COMPLETE, 'success');

            // 更新進度指示器
            GameUI.updateProgressIndicator();

        } else {
            // 答案錯誤
            GameUI.showResult("caesar-result",
                "❌ 不對喔，再試試看！記住凱撒沙拉的秘密～", false);
        }
    }

    /**
     * 下載起司圖片
     */
    function downloadCheese() {
        const svgElement = document.getElementById('cheese-svg');
        if (!svgElement) {
            GameUI.showNotification(ErrorMessages.DOWNLOAD_FAILED, 'error');
            return;
        }

        try {
            // 序列化SVG元素
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);

            // 創建下載連結
            const downloadLink = document.createElement('a');
            downloadLink.href = svgUrl;
            downloadLink.download = 'special_cheese.svg';
            downloadLink.style.display = 'none';

            // 執行下載
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // 清理URL
            URL.revokeObjectURL(svgUrl);

            // 顯示成功訊息
            GameUI.showNotification('起司圖片下載成功！', 'success');

        } catch (error) {
            console.error('下載失敗:', error);
            GameUI.showNotification(ErrorMessages.DOWNLOAD_FAILED, 'error');
        }
    }

    /**
     * 初始化第一關
     */
    function init() {
        console.log('第一關初始化');

        // 設定輸入框事件監聽
        const input = document.getElementById("caesar-input");
        if (input) {
            // Enter鍵提交
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    checkAnswer();
                }
            });
        }

        // 檢查是否已完成，但不自動顯示完成訊息
        if (GameProgress.isLevelCompleted(1)) {
            console.log('第一關已完成');
            // 只在控制台記錄，不顯示UI訊息
        }
    }

    /**
     * 獲取關卡提示
     * @returns {string} 提示內容
     */
    function getHint() {
        return GameConfig.HINTS[1];
    }

    /**
     * 獲取密文
     * @returns {string} 第一關密文
     */
    function getCipherText() {
        return "frperg vf gur xrl gb zl ybir";
    }

    /**
     * 獲取正確答案（僅用於測試）
     * @returns {string} 正確答案
     */
    function getCorrectAnswer() {
        return CryptoModule.safeBase64Decode(GameConfig.ENCRYPTED_ANSWERS.LEVEL_1);
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

        if (input.trim().length < 3) {
            GameUI.showNotification('答案太短了，請檢查一下', 'warning');
            return false;
        }

        return true;
    }

    /**
     * 顯示第一關提示
     */
    function showHint() {
        GameUI.showHint(1);
    }

    /**
     * 顯示密碼學說明
     */
    function showCryptoExplanation() {
        const explanation =
            "凱撒密碼（Caesar Cipher）是一種替換加密技術，" +
            "通過將字母表中的每個字母向前或向後移動固定數量的位置來加密訊息。" +
            "ROT13是凱撒密碼的一個特例，移動13個位置。";

        GameUI.showNotification(explanation, 'info');
    }

    // 公開介面
    return {
        checkAnswer: checkAnswer,
        downloadCheese: downloadCheese,
        showHint: showHint,
        init: init,
        getHint: getHint,
        getCipherText: getCipherText,
        getCorrectAnswer: getCorrectAnswer,
        validateInput: validateInput,
        showCryptoExplanation: showCryptoExplanation
    };
})();

console.log('Level1 載入完成');