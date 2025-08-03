/**
 * Web3.0 戀鏈資訊營 - 密碼學CTF遊戲配置文件
 * 包含遊戲的基本配置、常數和設定
 */

// 遊戲配置常數
const GameConfig = {
    // 關卡配置
    LEVELS: {
        TOTAL: 3,
        LEVEL_1: 1,
        LEVEL_2: 2,
        LEVEL_3: 3
    },

    // 時間配置
    TIMING: {
        TOOLS_DELAY: 5 * 60 * 1000,  // 5分鐘（毫秒）
        ACCESS_CHECK_INTERVAL: 2000,  // 2秒
        NOTIFICATION_DURATION: 3000,  // 3秒
        COUNTDOWN_UPDATE_INTERVAL: 1000  // 1秒
    },

    // 加密答案（Base64編碼）
    ENCRYPTED_ANSWERS: {
        LEVEL_1: 'c2VjcmV0IGlzIHRoZSBrZXkgdG8gbXkgbG92ZQ==',
        LEVEL_2: 'aXdhbnR0b2JleW91cmJhYmU=',
        LEVEL_3: 'aW5zOmVsbWEwODMx'
    },

    // 密碼學配置
    CRYPTO: {
        CAESAR_SHIFT: 13,  // ROT13
        VIGENERE_KEY: 'LOVE'
    },

    // 字母網格（第三關）
    LETTER_GRID: [
        ['7', 'I', 'N', 'U', 'R', '%', 'H', 'O'],
        ['S', 'P', 'Q', 'K', '!', 'K', ':', 'Q'],
        ['E', 'C', 'B', 'T', '2', '$', 'L', 'G'],
        ['W', 'M', '6', 'F', 'A', '0', '#', 'C'],
        ['2', '8', 'D', 'Y', 'V', 'X', '!', 'Z'],
        ['3', 'R', '5', 'J', 'H', 'W', '1', 'P']
    ],

    // 頁面配置
    PAGES: {
        INDEX: 'index.html',
        LEVEL_2: 'page2.html',
        LEVEL_3: 'page3.html'
    },

    // 儲存鍵名
    STORAGE_KEYS: {
        PROGRESS: 'ctf_progress',
        STATS: 'ctf_stats'
    },

    // 提示訊息
    HINTS: {
        1: '🔤 既然這是Web3.0營隊，你知道比特幣的發行日期嗎？那個數字或許有特殊意義...',
        2: '💕 想想看我在信中提到的那個「口頭禪」...一個四個字母的英文單字，當我很喜歡一個人的時候就會不自覺地說出來。這個詞就是解開密碼的關鍵！',
        3: '🧀 起司好吃一直吃XD'
    },

    // 通知類型
    NOTIFICATION_TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        INFO: 'info',
        WARNING: 'warning'
    },

    // CSS 類名
    CSS_CLASSES: {
        HIDDEN: 'hidden',
        ACTIVE: 'active',
        COMPLETED: 'completed',
        DISABLED: 'disabled',
        SUCCESS: 'success',
        ERROR: 'error',
        SELECTED: 'selected',
        GLOW: 'glow-effect'
    }
};

// 錯誤訊息
const ErrorMessages = {
    ACCESS_DENIED: '存取被拒絕',
    INVALID_ANSWER: '答案不正確',
    TOOLS_NOT_READY: '工具尚未準備好',
    PROGRESS_LOAD_FAILED: '進度載入失敗',
    DOWNLOAD_FAILED: '下載失敗，請稍後再試'
};

// 成功訊息
const SuccessMessages = {
    LEVEL_1_COMPLETE: '第一關完成！',
    LEVEL_2_COMPLETE: '第二關完成！',
    LEVEL_3_COMPLETE: '恭喜完成所有關卡！',
    CHEESE_DOWNLOADED: '起司圖片下載成功！',
    TOOLS_ENABLED: '解密工具已啟用'
};

// 將配置對象設為全域變數
window.GameConfig = GameConfig;
window.ErrorMessages = ErrorMessages;
window.SuccessMessages = SuccessMessages;