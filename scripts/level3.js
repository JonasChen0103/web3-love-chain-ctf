/**
 * 第三關 - 視覺密碼學挑戰
 */

window.Level3 = (function() {
    'use strict';

    // 私有變數
    let selectedPositions = [];

    /**
     * 檢查第三關答案
     */
    function checkAnswer() {
        // 檢查存取權限
        if (!SecurityModule.validateAccess(3)) {
            window.location.href = GameConfig.PAGES.INDEX;
            return;
        }

        const input = document.getElementById("final-input");
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
        GameProgress.recordAttempt(3);

        if (CryptoModule.checkAnswer(userInput, 3)) {
            // 答案正確 - 遊戲完成！
            GameProgress.saveProgress(3, true);
            GameProgress.recordGameCompletion();

            // 顯示成功區域
            showSuccessSection(userInput);

            GameUI.showResult("final-result", "🎊 完美！你成功解開了最終密碼！", true);
            GameUI.showNotification(SuccessMessages.LEVEL_3_COMPLETE, 'success');

            // 更新進度指示器
            GameUI.updateProgressIndicator();

        } else {
            // 答案錯誤
            GameUI.showResult("final-result",
                "🤔 還不對哦！", false);
        }
    }

    /**
     * 顯示成功區域
     * @param {string} answer - 正確答案
     */
    function showSuccessSection(answer) {
        const successSection = document.getElementById('success-section');
        const instagramLink = document.getElementById('instagram-link');

        if (successSection) {
            GameUI.showElement('success-section');
        }

        // 設定Instagram連結
        if (instagramLink && answer.includes(':')) {
            const username = answer.split(':')[1];
            instagramLink.href = 'https://instagram.com/' + username;
        }

        // 滾動到成功區域
        setTimeout(function() {
            if (successSection) {
                GameUI.scrollToElement('success-section', 'center');
            }
        }, 1500);
    }

    /**
     * 顯示網格助手
     */
    function showGridHelper() {
        const helper = document.getElementById('grid-helper');
        if (!helper) return;

        GameUI.toggleElement('grid-helper');

        if (!helper.classList.contains('hidden')) {
            generateInteractiveGrid();
            GameUI.scrollToElement('grid-helper', 'center');
        }
    }

    /**
     * 生成互動式網格
     */
    function generateInteractiveGrid() {
        const gridContainer = document.getElementById('interactive-grid');
        if (!gridContainer) return;

        const gridData = GameConfig.LETTER_GRID;
        let html = '';

        for (let row = 0; row < gridData.length; row++) {
            html += '<div class="interactive-grid-row">';
            for (let col = 0; col < gridData[row].length; col++) {
                html += '<div class="grid-letter" ' +
                    'data-row="' + row + '" ' +
                    'data-col="' + col + '" ' +
                    'onclick="Level3.toggleLetter(' + row + ', ' + col + ')" ' +
                    'title="第' + (row + 1) + '行第' + (col + 1) + '列: ' + gridData[row][col] + '">' +
                    gridData[row][col] +
                    '</div>';
            }
            html += '</div>';
        }

        gridContainer.innerHTML = html;
        console.log('互動式網格已生成');
    }

    /**
     * 切換字母選擇狀態
     * @param {number} row - 行索引
     * @param {number} col - 列索引
     */
    function toggleLetter(row, col) {
        const span = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!span) return;

        const position = row + ',' + col;
        const index = selectedPositions.indexOf(position);

        if (index !== -1) {
            // 取消選擇
            selectedPositions.splice(index, 1);
            span.classList.remove('selected');
        } else {
            // 選擇
            selectedPositions.push(position);
            span.classList.add('selected');
        }

        updateSelectedLetters();

        // 提供音效反饋（如果瀏覽器支援）
        playClickSound();
    }

    /**
     * 更新選中字母顯示
     */
    function updateSelectedLetters() {
        const gridData = GameConfig.LETTER_GRID;
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

    /**
     * 清除所有選擇
     */
    function clearSelection() {
        selectedPositions = [];
        const gridLetters = document.querySelectorAll('.grid-letter');

        gridLetters.forEach(function(span) {
            span.classList.remove('selected');
        });

        updateSelectedLetters();
        GameUI.showNotification('已清除所有選擇', 'info');
    }

    /**
     * 顯示選中的字母
     */
    function showSelected() {
        const gridData = GameConfig.LETTER_GRID;
        const letters = selectedPositions.map(function(pos) {
            const parts = pos.split(',');
            const row = parseInt(parts[0]);
            const col = parseInt(parts[1]);
            return gridData[row][col];
        }).join('');

        const finalInput = document.getElementById('final-input');
        if (finalInput && letters) {
            finalInput.value = letters.toLowerCase();
            GameUI.showNotification('已填入：' + letters, 'info');
        } else {
            GameUI.showNotification('請先選擇一些字母', 'warning');
        }
    }

    /**
     * 播放點擊音效
     */
    function playClickSound() {
        // 簡單的音效反饋
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // 音效播放失敗，忽略
        }
    }

    /**
     * 初始化第三關
     */
    function init() {
        console.log('第三關初始化');

        // 檢查存取權限
        if (!SecurityModule.checkPageAccess()) {
            return;
        }

        // 設定輸入框事件監聽
        const input = document.getElementById("final-input");
        if (input) {
            // Enter鍵提交
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    checkAnswer();
                }
            });
        }

        // 啟動存取監控
        SecurityModule.startAccessMonitoring();

        // 檢查是否已完成，如果已完成則顯示成功區域
        if (GameProgress.isLevelCompleted(3)) {
            console.log('第三關已完成，顯示成功區域');
            showSuccessSection('ins:elma0831');
        }
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

        if (!input.includes(':')) {
            GameUI.showNotification('答案格式似乎不對，檢查一下是否包含特殊符號', 'warning');
            return false;
        }

        return true;
    }

    /**
     * 顯示第三關提示
     */
    function showHint() {
        GameUI.showHint(3);
    }

    /**
     * 獲取關卡提示
     * @returns {string} 提示內容
     */
    function getHint() {
        return GameConfig.HINTS[3];
    }

    /**
     * 獲取字母網格
     * @returns {Array} 字母網格陣列
     */
    function getLetterGrid() {
        return GameConfig.LETTER_GRID;
    }

    /**
     * 顯示視覺密碼學說明
     */
    function showCryptoExplanation() {
        const explanation =
            "視覺密碼學是一種將秘密資訊分散在多個圖像中的技術。" +
            "當這些圖像疊加在一起時，隱藏的資訊就會顯現出來。" +
            "這種方法常用於安全驗證和多重授權系統。";

        GameUI.showNotification(explanation, 'info');
    }

    /**
     * 自動解答（用於演示）
     */
    function autoSolve() {
        // 預設的正確位置（對應起司洞洞的位置）
        const correctPositions = [
            '1,0',  // S
            '2,0',  // E
            '0,1',  // I
            '3,1',  // M
            '0,2',  // N
            '5,0',  // 3
            '4,1',  // 8
            '3,4',  // A
            '3,5',  // 0
            '2,6',  // L
            '5,6',  // 1
            '1,6'   // :
        ];

        // 清除現有選擇
        clearSelection();

        // 逐一選擇正確位置
        correctPositions.forEach(function(pos, index) {
            setTimeout(function() {
                const parts = pos.split(',');
                toggleLetter(parseInt(parts[0]), parseInt(parts[1]));
            }, index * 200);
        });

        // 最後填入答案
        setTimeout(function() {
            showSelected();
        }, correctPositions.length * 200 + 500);
    }

    /**
     * 清理第三關資源
     */
    function cleanup() {
        SecurityModule.stopAccessMonitoring();
        selectedPositions = [];
    }

    // 公開介面
    return {
        checkAnswer: checkAnswer,
        showGridHelper: showGridHelper,
        showHint: showHint,
        generateInteractiveGrid: generateInteractiveGrid,
        toggleLetter: toggleLetter,
        clearSelection: clearSelection,
        showSelected: showSelected,
        init: init,
        cleanup: cleanup,
        getHint: getHint,
        getLetterGrid: getLetterGrid,
        validateInput: validateInput,
        showCryptoExplanation: showCryptoExplanation,
        autoSolve: autoSolve,

        // 狀態查詢
        getSelectedPositions: function() { return selectedPositions.slice(); },
        getSelectedLetters: function() {
            const gridData = GameConfig.LETTER_GRID;
            return selectedPositions.map(function(pos) {
                const parts = pos.split(',');
                return gridData[parseInt(parts[0])][parseInt(parts[1])];
            }).join('');
        }
    };
})();

console.log('Level3 載入完成');