/**
 * 遊戲主控制器
 * 統一管理遊戲初始化、事件處理和全域功能
 */

window.GameController = (function() {
    'use strict';

    // 私有變數
    let currentLevel = 1;
    let gameInitialized = false;

    /**
     * 初始化遊戲
     */
    function initGame() {
        if (gameInitialized) {
            console.log('遊戲已經初始化過了');
            return;
        }

        console.log('開始初始化遊戲...');

        try {
            // 1. 初始化安全防護
            SecurityModule.initSecurity();

            // 2. 檢查並修復進度資料
            GameProgress.repairProgressData();

            // 3. 如果是首頁且沒有進度，確保乾淨的開始
            const currentPage = window.location.pathname;
            if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
                const progress = GameProgress.loadProgress();
                if (!progress.completed || progress.completed.length === 0) {
                    console.log('首次載入，確保乾淨的遊戲狀態');
                }
            }

            // 4. 確定當前關卡
            determineCurrentLevel();

            // 5. 初始化UI
            GameUI.initPageUI();

            // 6. 根據頁面初始化對應關卡
            initCurrentLevel();

            // 7. 設定全域事件監聽
            setupGlobalEventListeners();

            // 8. 設定頁面離開時的清理
            setupPageCleanup();

            gameInitialized = true;
            console.log('遊戲初始化完成');

        } catch (error) {
            console.error('遊戲初始化失敗:', error);
            GameUI.showNotification('遊戲初始化失敗，請重新整理頁面', 'error');
        }
    }

    /**
     * 確定當前關卡
     */
    function determineCurrentLevel() {
        const currentPage = window.location.pathname;

        if (currentPage.includes('page3.html')) {
            currentLevel = 3;
        } else if (currentPage.includes('page2.html')) {
            currentLevel = 2;
        } else {
            currentLevel = 1;
        }

        console.log('當前關卡:', currentLevel);
    }

    /**
     * 初始化當前關卡
     */
    function initCurrentLevel() {
        switch (currentLevel) {
            case 1:
                if (window.Level1) {
                    Level1.init();
                }
                break;
            case 2:
                if (window.Level2) {
                    Level2.init();
                }
                break;
            case 3:
                if (window.Level3) {
                    Level3.init();
                }
                break;
            default:
                console.warn('未知的關卡編號:', currentLevel);
        }
    }

    /**
     * 設定全域事件監聽
     */
    function setupGlobalEventListeners() {
        // 鍵盤快捷鍵
        document.addEventListener('keydown', handleGlobalKeydown);

        // 視窗大小變化
        window.addEventListener('resize', handleWindowResize);

        // 視窗失去焦點
        window.addEventListener('blur', handleWindowBlur);

        // 視窗獲得焦點
        window.addEventListener('focus', handleWindowFocus);

        // 頁面可見性變化
        if (typeof document.hidden !== 'undefined') {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
    }

    /**
     * 處理全域鍵盤事件
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    function handleGlobalKeydown(e) {
        // Ctrl + R 重新整理提示
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            GameUI.showConfirmDialog(
                '確定要重新整理頁面嗎？未保存的輸入將會遺失。',
                function() {
                    window.location.reload();
                }
            );
            return false;
        }

        // 開發模式快捷鍵（僅在開發環境啟用）
        if (SecurityModule.isDevelopmentMode()) {
            handleDevelopmentShortcuts(e);
        }
    }

    /**
     * 處理開發模式快捷鍵
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    function handleDevelopmentShortcuts(e) {
        // Ctrl + Shift + D: 顯示除錯資訊
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            showDebugInfo();
        }

        // Ctrl + Shift + R: 重置遊戲
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            GameUI.showConfirmDialog(
                '確定要重置整個遊戲進度嗎？',
                function() {
                    resetGame();
                }
            );
        }

        // Ctrl + Shift + A: 自動解答當前關卡
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            autoSolveCurrentLevel();
        }
    }

    /**
     * 處理視窗大小變化
     */
    function handleWindowResize() {
        // 重新檢查開發者工具
        // 由安全模組自動處理
    }

    /**
     * 處理視窗失去焦點
     */
    function handleWindowBlur() {
        // 可以在這裡暫停某些功能
        console.log('視窗失去焦點');
    }

    /**
     * 處理視窗獲得焦點
     */
    function handleWindowFocus() {
        // 可以在這裡恢復某些功能
        console.log('視窗獲得焦點');
    }

    /**
     * 處理頁面可見性變化
     */
    function handleVisibilityChange() {
        if (document.hidden) {
            console.log('頁面隱藏');
        } else {
            console.log('頁面顯示');
        }
    }

    /**
     * 設定頁面清理
     */
    function setupPageCleanup() {
        window.addEventListener('beforeunload', function(e) {
            cleanup();
        });

        window.addEventListener('unload', function(e) {
            cleanup();
        });
    }

    /**
     * 顯示除錯資訊
     */
    function showDebugInfo() {
        const progress = GameProgress.loadProgress();
        const stats = GameProgress.getGameStats();

        const debugInfo = {
            currentLevel: currentLevel,
            progress: progress,
            stats: stats,
            gameInitialized: gameInitialized,
            toolsEnabled: currentLevel === 2 ? Level2.isToolsEnabled() : 'N/A',
            selectedLetters: currentLevel === 3 ? Level3.getSelectedLetters() : 'N/A'
        };

        console.log('=== 遊戲除錯資訊 ===');
        console.table(debugInfo);

        GameUI.showNotification('除錯資訊已輸出到控制台', 'info');
    }

    /**
     * 自動解答當前關卡
     */
    function autoSolveCurrentLevel() {
        switch (currentLevel) {
            case 1:
                if (window.Level1) {
                    const answer = Level1.getCorrectAnswer();
                    document.getElementById('caesar-input').value = answer;
                    GameUI.showNotification('已自動填入第一關答案', 'info');
                }
                break;
            case 2:
                if (window.Level2) {
                    const answer = CryptoModule.safeBase64Decode(GameConfig.ENCRYPTED_ANSWERS.LEVEL_2);
                    document.getElementById('vigenere-input').value = answer;
                    GameUI.showNotification('已自動填入第二關答案', 'info');
                }
                break;
            case 3:
                if (window.Level3) {
                    Level3.autoSolve();
                    GameUI.showNotification('正在自動解答第三關...', 'info');
                }
                break;
        }
    }

    /**
     * 重置遊戲
     */
    function resetGame() {
        if (GameProgress.resetGame()) {
            GameUI.showNotification('遊戲已重置', 'info');
            setTimeout(function() {
                window.location.href = GameConfig.PAGES.INDEX;
            }, 1000);
        } else {
            GameUI.showNotification('重置失敗', 'error');
        }
    }

    /**
     * 獲取遊戲狀態
     * @returns {Object} 遊戲狀態物件
     */
    function getGameState() {
        return {
            currentLevel: currentLevel,
            initialized: gameInitialized,
            progress: GameProgress.loadProgress(),
            stats: GameProgress.getGameStats(),
            completionPercentage: GameProgress.getCompletionPercentage()
        };
    }

    /**
     * 檢查遊戲是否已完成
     * @returns {boolean} 是否已完成所有關卡
     */
    function isGameComplete() {
        return GameProgress.getCompletionPercentage() === 100;
    }

    /**
     * 獲取當前可用功能
     * @returns {Object} 功能可用性狀態
     */
    function getAvailableFeatures() {
        const features = {
            level1: true,
            level2: GameProgress.isLevelAccessible(2),
            level3: GameProgress.isLevelAccessible(3),
            hints: true,
            tools: currentLevel === 2 ? Level2.isToolsEnabled() : true,
            gridHelper: currentLevel === 3,
            reset: true
        };

        return features;
    }

    /**
     * 導航到指定關卡
     * @param {number} level - 目標關卡
     */
    function navigateToLevel(level) {
        if (!GameProgress.isLevelAccessible(level)) {
            GameUI.showNotification('該關卡尚未解鎖', 'warning');
            return;
        }

        const pages = {
            1: GameConfig.PAGES.INDEX,
            2: GameConfig.PAGES.LEVEL_2,
            3: GameConfig.PAGES.LEVEL_3
        };

        if (pages[level]) {
            window.location.href = pages[level];
        }
    }

    /**
     * 清理遊戲資源
     */
    function cleanup() {
        console.log('清理遊戲資源...');

        // 清理各關卡資源
        if (window.Level2 && typeof Level2.cleanup === 'function') {
            Level2.cleanup();
        }

        if (window.Level3 && typeof Level3.cleanup === 'function') {
            Level3.cleanup();
        }

        // 清理安全模組
        if (window.SecurityModule && typeof SecurityModule.cleanup === 'function') {
            SecurityModule.cleanup();
        }

        gameInitialized = false;
    }

    /**
     * 匯出遊戲資料
     * @returns {string} JSON格式的遊戲資料
     */
    function exportGameData() {
        const data = GameProgress.exportData();
        return JSON.stringify(data, null, 2);
    }

    /**
     * 匯入遊戲資料
     * @param {string} jsonData - JSON格式的遊戲資料
     * @returns {boolean} 是否成功匯入
     */
    function importGameData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            return GameProgress.importData(data);
        } catch (error) {
            console.error('匯入資料格式錯誤:', error);
            return false;
        }
    }

    // 公開介面
    return {
        // 初始化和控制
        initGame: initGame,
        cleanup: cleanup,
        resetGame: resetGame,

        // 狀態查詢
        getGameState: getGameState,
        isGameComplete: isGameComplete,
        getAvailableFeatures: getAvailableFeatures,
        getCurrentLevel: function() { return currentLevel; },

        // 導航
        navigateToLevel: navigateToLevel,

        // 資料管理
        exportGameData: exportGameData,
        importGameData: importGameData,

        // 開發工具
        showDebugInfo: showDebugInfo,
        autoSolveCurrentLevel: autoSolveCurrentLevel
    };
})();

// DOM載入完成後自動初始化遊戲
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM載入完成，開始初始化遊戲');

    // 延遲初始化以確保所有模組都已載入
    setTimeout(function() {
        try {
            GameController.initGame();
        } catch (error) {
            console.error('遊戲初始化錯誤:', error);
            // 顯示友善的錯誤訊息
            document.body.innerHTML =
                '<div style="display:flex;align-items:center;justify-content:center;height:100vh;' +
                'font-size:1.5rem;color:#d6336c;text-align:center;padding:2rem;background:#fef9f9;">' +
                '<div>' +
                '<h1>🚫 遊戲載入失敗</h1>' +
                '<p style="font-size:1rem;margin-top:1rem;color:#666;">請重新整理頁面再試一次</p>' +
                '<button onclick="location.reload()" style="margin-top:2rem;padding:1rem 2rem;' +
                'background:#d6336c;color:white;border:none;border-radius:25px;font-size:1rem;cursor:pointer;">' +
                '重新整理頁面</button>' +
                '</div>' +
                '</div>';
        }
    }, 100);
});

// 頁面載入完成後的額外初始化
window.addEventListener('load', function() {
    console.log('頁面完全載入');

    // 顯示載入完成訊息
    setTimeout(function() {
        if (window.GameController && window.GameUI) {
            try {
                const currentLevel = GameController.getCurrentLevel();
                const messages = {
                    1: '第一關已載入，準備好接受挑戰了嗎？',
                    2: '第二關開始！這次的密碼更有挑戰性～',
                    3: '最終關卡！用你的智慧解開最後的謎題吧！'
                };

                if (messages[currentLevel]) {
                    GameUI.showNotification(messages[currentLevel], 'info');
                }
            } catch (error) {
                console.error('載入完成訊息顯示錯誤:', error);
            }
        }
    }, 1500);
});

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('全域錯誤:', e.error);
    if (window.GameUI && typeof GameUI.showNotification === 'function') {
        GameUI.showNotification('發生了一個錯誤，請檢查控制台或重新整理頁面', 'error');
    }
});

// 未處理的Promise拒絕
window.addEventListener('unhandledrejection', function(e) {
    console.error('未處理的Promise拒絕:', e.reason);
    if (window.GameUI && typeof GameUI.showNotification === 'function') {
        GameUI.showNotification('發生了一個異步錯誤', 'warning');
    }
});

// 為向後相容性提供的全域函數（安全包裝）
window.checkCaesar = function() {
    try {
        if (window.Level1 && typeof Level1.checkAnswer === 'function') {
            Level1.checkAnswer();
        } else {
            console.error('Level1 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('checkCaesar 錯誤:', error);
    }
};

window.downloadCheese = function() {
    try {
        if (window.Level1 && typeof Level1.downloadCheese === 'function') {
            Level1.downloadCheese();
        } else {
            console.error('Level1 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('downloadCheese 錯誤:', error);
    }
};

window.checkVigenere = function() {
    try {
        if (window.Level2 && typeof Level2.checkAnswer === 'function') {
            Level2.checkAnswer();
        } else {
            console.error('Level2 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('checkVigenere 錯誤:', error);
    }
};

window.showVigenereTools = function() {
    try {
        if (window.Level2 && typeof Level2.showTools === 'function') {
            Level2.showTools();
        } else {
            console.error('Level2 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('showVigenereTools 錯誤:', error);
    }
};

window.checkFinalAnswer = function() {
    try {
        if (window.Level3 && typeof Level3.checkAnswer === 'function') {
            Level3.checkAnswer();
        } else {
            console.error('Level3 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('checkFinalAnswer 錯誤:', error);
    }
};

window.showGridHelper = function() {
    try {
        if (window.Level3 && typeof Level3.showGridHelper === 'function') {
            Level3.showGridHelper();
        } else {
            console.error('Level3 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('showGridHelper 錯誤:', error);
    }
};

window.toggleLetter = function(row, col) {
    try {
        if (window.Level3 && typeof Level3.toggleLetter === 'function') {
            Level3.toggleLetter(row, col);
        } else {
            console.error('Level3 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('toggleLetter 錯誤:', error);
    }
};

window.clearSelection = function() {
    try {
        if (window.Level3 && typeof Level3.clearSelection === 'function') {
            Level3.clearSelection();
        } else {
            console.error('Level3 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('clearSelection 錯誤:', error);
    }
};

window.showSelected = function() {
    try {
        if (window.Level3 && typeof Level3.showSelected === 'function') {
            Level3.showSelected();
        } else {
            console.error('Level3 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('showSelected 錯誤:', error);
    }
};

window.showHint = function(level) {
    try {
        if (window.GameUI && typeof GameUI.showHint === 'function') {
            GameUI.showHint(level);
        } else {
            console.error('GameUI 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('showHint 錯誤:', error);
    }
};

window.resetGame = function() {
    try {
        if (window.GameController && typeof GameController.resetGame === 'function') {
            GameController.resetGame();
        } else {
            console.error('GameController 模組未載入或方法不存在');
        }
    } catch (error) {
        console.error('resetGame 錯誤:', error);
    }
};

// 開發者工具（僅在開發模式下可用）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.devTools = {
        getGameState: function() {
            return GameController.getGameState();
        },
        showDebugInfo: function() {
            return GameController.showDebugInfo();
        },
        autoSolve: function() {
            return GameController.autoSolveCurrentLevel();
        },
        exportData: function() {
            return GameController.exportGameData();
        },
        importData: function(data) {
            return GameController.importGameData(data);
        },
        forceReset: function() {
            localStorage.clear();
            location.reload();
        }
    };

    console.log('🛠️ 開發者工具已載入，使用 window.devTools 存取');
}

console.log('遊戲腳本載入完成');