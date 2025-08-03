/**
 * 進度儲存模組
 * 處理遊戲進度的儲存和讀取
 */

window.GameProgress = (function() {
    'use strict';

    /**
     * 儲存遊戲進度
     * @param {number} level - 關卡等級
     * @param {boolean} completed - 是否完成
     */
    function saveProgress(level, completed) {
        try {
            let progress = getDefaultProgress();

            // 讀取現有進度
            const existing = localStorage.getItem(GameConfig.STORAGE_KEYS.PROGRESS);
            if (existing) {
                progress = JSON.parse(existing);
            }

            // 更新可存取的關卡等級
            progress.level = Math.max(progress.level || 1, level);

            // 如果是標記完成狀態
            if (completed && !progress.completed.includes(level)) {
                progress.completed.push(level);
            }

            // 更新時間戳
            progress.lastUpdate = Date.now();

            localStorage.setItem(GameConfig.STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
            console.log('進度已保存:', progress);

            return true;
        } catch (e) {
            console.warn('無法保存進度:', e);
            return false;
        }
    }

    /**
     * 讀取遊戲進度
     * @returns {Object} 進度資料
     */
    function loadProgress() {
        try {
            const progress = localStorage.getItem(GameConfig.STORAGE_KEYS.PROGRESS);
            if (progress) {
                return JSON.parse(progress);
            }
        } catch (e) {
            console.error('進度讀取錯誤:', e);
        }

        return getDefaultProgress();
    }

    /**
     * 獲取預設進度
     * @returns {Object} 預設進度物件
     */
    function getDefaultProgress() {
        return {
            level: 1,           // 可存取的最高關卡
            completed: [],      // 已完成的關卡列表（空陣列）
            startTime: Date.now(),
            lastUpdate: Date.now(),
            version: '1.0'
        };
    }

    /**
     * 檢查關卡是否已完成
     * @param {number} level - 關卡編號
     * @returns {boolean} 是否已完成
     */
    function isLevelCompleted(level) {
        try {
            const progress = loadProgress();
            return progress && progress.completed && progress.completed.includes(level);
        } catch (e) {
            console.error('檢查關卡完成狀態時發生錯誤:', e);
            return false;
        }
    }

    /**
     * 檢查關卡是否可存取
     * @param {number} level - 關卡編號
     * @returns {boolean} 是否可存取
     */
    function isLevelAccessible(level) {
        const progress = loadProgress();
        return progress.level >= level;
    }

    /**
     * 重置遊戲進度
     */
    function resetGame() {
        try {
            localStorage.removeItem(GameConfig.STORAGE_KEYS.PROGRESS);
            localStorage.removeItem(GameConfig.STORAGE_KEYS.STATS);
            console.log('遊戲進度已重置');
            return true;
        } catch (e) {
            console.error('重置進度失敗:', e);
            return false;
        }
    }

    /**
     * 獲取遊戲統計
     * @returns {Object} 統計資料
     */
    function getGameStats() {
        try {
            const stats = localStorage.getItem(GameConfig.STORAGE_KEYS.STATS);
            if (stats) {
                return JSON.parse(stats);
            }
        } catch (e) {
            console.error('統計讀取錯誤:', e);
        }

        return getDefaultStats();
    }

    /**
     * 儲存遊戲統計
     * @param {Object} stats - 統計資料
     */
    function saveGameStats(stats) {
        try {
            localStorage.setItem(GameConfig.STORAGE_KEYS.STATS, JSON.stringify(stats));
            return true;
        } catch (e) {
            console.error('統計儲存錯誤:', e);
            return false;
        }
    }

    /**
     * 獲取預設統計
     * @returns {Object} 預設統計物件
     */
    function getDefaultStats() {
        return {
            attempts: { level1: 0, level2: 0, level3: 0 },
            hintsUsed: 0,
            startTime: Date.now(),
            completionTime: null,
            totalPlayTime: 0
        };
    }

    /**
     * 記錄嘗試次數
     * @param {number} level - 關卡編號
     */
    function recordAttempt(level) {
        const stats = getGameStats();
        const levelKey = `level${level}`;

        if (stats.attempts[levelKey] !== undefined) {
            stats.attempts[levelKey]++;
            saveGameStats(stats);
        }
    }

    /**
     * 記錄提示使用
     */
    function recordHintUsed() {
        const stats = getGameStats();
        stats.hintsUsed++;
        saveGameStats(stats);
    }

    /**
     * 記錄遊戲完成
     */
    function recordGameCompletion() {
        const stats = getGameStats();
        stats.completionTime = Date.now();
        stats.totalPlayTime = stats.completionTime - stats.startTime;
        saveGameStats(stats);
    }

    /**
     * 獲取完成百分比
     * @returns {number} 完成百分比 (0-100)
     */
    function getCompletionPercentage() {
        const progress = loadProgress();
        const totalLevels = GameConfig.LEVELS.TOTAL;
        const completedLevels = progress.completed.length;

        return Math.round((completedLevels / totalLevels) * 100);
    }

    /**
     * 匯出進度資料
     * @returns {Object} 所有進度和統計資料
     */
    function exportData() {
        return {
            progress: loadProgress(),
            stats: getGameStats(),
            exportTime: Date.now()
        };
    }

    /**
     * 匯入進度資料
     * @param {Object} data - 要匯入的資料
     * @returns {boolean} 是否成功匯入
     */
    function importData(data) {
        try {
            if (data.progress) {
                localStorage.setItem(GameConfig.STORAGE_KEYS.PROGRESS, JSON.stringify(data.progress));
            }

            if (data.stats) {
                localStorage.setItem(GameConfig.STORAGE_KEYS.STATS, JSON.stringify(data.stats));
            }

            console.log('資料匯入成功');
            return true;
        } catch (e) {
            console.error('資料匯入失敗:', e);
            return false;
        }
    }

    /**
     * 驗證進度資料完整性
     * @returns {boolean} 資料是否完整
     */
    function validateProgressData() {
        try {
            const progress = loadProgress();

            // 檢查必要欄位
            if (typeof progress.level !== 'number' ||
                !Array.isArray(progress.completed) ||
                typeof progress.startTime !== 'number') {
                return false;
            }

            // 檢查關卡邏輯
            for (let i = 0; i < progress.completed.length; i++) {
                const level = progress.completed[i];
                if (level < 1 || level > GameConfig.LEVELS.TOTAL) {
                    return false;
                }
            }

            return true;
        } catch (e) {
            console.error('進度驗證錯誤:', e);
            return false;
        }
    }

    /**
     * 修復損壞的進度資料
     */
    function repairProgressData() {
        if (!validateProgressData()) {
            console.log('偵測到損壞的進度資料，正在修復...');
            localStorage.removeItem(GameConfig.STORAGE_KEYS.PROGRESS);
            localStorage.removeItem(GameConfig.STORAGE_KEYS.STATS);

            // 重新初始化
            saveProgress(1, false);
        }
    }

    // 公開介面
    return {
        // 進度管理
        saveProgress: saveProgress,
        loadProgress: loadProgress,
        resetGame: resetGame,

        // 關卡狀態檢查
        isLevelCompleted: isLevelCompleted,
        isLevelAccessible: isLevelAccessible,
        getCompletionPercentage: getCompletionPercentage,

        // 統計功能
        getGameStats: getGameStats,
        saveGameStats: saveGameStats,
        recordAttempt: recordAttempt,
        recordHintUsed: recordHintUsed,
        recordGameCompletion: recordGameCompletion,

        // 資料管理
        exportData: exportData,
        importData: importData,
        validateProgressData: validateProgressData,
        repairProgressData: repairProgressData,

        // 預設值
        getDefaultProgress: getDefaultProgress,
        getDefaultStats: getDefaultStats
    };
})();

console.log('GameProgress 載入完成');