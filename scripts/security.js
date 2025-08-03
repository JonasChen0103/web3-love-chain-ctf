/**
 * 安全防護模組
 * 包含防作弊、存取控制等安全機制
 */

window.SecurityModule = (function() {
    'use strict';

    // 私有變數
    let devToolsOpen = false;
    let accessMonitorInterval = null;
    let isDevToolsCheckActive = true;

    /**
     * 初始化安全防護
     */
    function initSecurity() {
        setupDevToolsDetection();
        setupKeyboardProtection();
        setupContextMenuProtection();
        console.log('安全防護已啟動');
    }

    /**
     * 設置開發者工具偵測
     */
    function setupDevToolsDetection() {
        const threshold = 160;

        function checkDevTools() {
            if (!isDevToolsCheckActive) return;

            const heightDiff = window.outerHeight - window.innerHeight;
            const widthDiff = window.outerWidth - window.innerWidth;

            if (heightDiff > threshold || widthDiff > threshold) {
                if (!devToolsOpen) {
                    devToolsOpen = true;
                    showDevToolsWarning();
                }
            } else {
                devToolsOpen = false;
            }
        }

        // 每500毫秒檢查一次
        setInterval(checkDevTools, 500);

        // 額外的偵測方法
        setupAdvancedDevToolsDetection();
    }

    /**
     * 進階開發者工具偵測
     */
    function setupAdvancedDevToolsDetection() {
        // 檢測 console.log 時間差異
        let devtools = {
            open: false,
            orientation: null
        };

        const threshold = 160;

        function detectDevTools() {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    showDevToolsWarning();
                }
            }
        }

        // 使用 debugger 語句偵測
        function debuggerDetection() {
            try {
                const start = performance.now();
                debugger;
                const end = performance.now();

                if (end - start > 100) { // 如果 debugger 停頓超過100ms
                    showDevToolsWarning();
                }
            } catch (e) {
                // 忽略錯誤
            }
        }

        setInterval(detectDevTools, 1000);
        // 較少頻率的 debugger 檢測，避免影響使用者體驗
        setInterval(debuggerDetection, 5000);
    }

    /**
     * 設置鍵盤保護
     */
    function setupKeyboardProtection() {
        document.addEventListener('keydown', function(e) {
            // 阻止 F12
            if (e.key === 'F12') {
                e.preventDefault();
                showKeyboardWarning();
                return false;
            }

            // 阻止 Ctrl+Shift+I/C/J (開發者工具)
            if (e.ctrlKey && e.shiftKey &&
                (e.key === 'I' || e.key === 'C' || e.key === 'J')) {
                e.preventDefault();
                showKeyboardWarning();
                return false;
            }

            // 阻止 Ctrl+U (查看原始碼)
            if (e.ctrlKey && e.key === 'U') {
                e.preventDefault();
                showKeyboardWarning();
                return false;
            }

            // 阻止 Ctrl+S (儲存頁面)
            if (e.ctrlKey && e.key === 'S') {
                e.preventDefault();
                return false;
            }
        });
    }

    /**
     * 設置右鍵選單保護
     */
    function setupContextMenuProtection() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showContextMenuWarning();
            return false;
        });

        // 防止拖曳
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });

        // 防止選取
        document.addEventListener('selectstart', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return true; // 允許在輸入框中選取
            }
            e.preventDefault();
            return false;
        });
    }

    /**
     * 顯示開發者工具警告
     */
    function showDevToolsWarning() {
        document.body.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:center;height:100vh;' +
            'font-size:2rem;color:#d6336c;text-align:center;padding:2rem;background:#fef9f9;">' +
            '<div>' +
            '<h1>🚫 請關閉開發者工具</h1>' +
            '<p style="font-size:1.2rem;margin-top:1rem;color:#666;">請關閉開發者工具後重新整理頁面</p>' +
            '<button onclick="location.reload()" style="margin-top:2rem;padding:1rem 2rem;' +
            'background:#d6336c;color:white;border:none;border-radius:25px;font-size:1rem;cursor:pointer;">' +
            '重新整理頁面</button>' +
            '</div>' +
            '</div>';
    }

    /**
     * 顯示鍵盤警告
     */
    function showKeyboardWarning() {
        if (window.GameUI && typeof window.GameUI.showNotification === 'function') {
            window.GameUI.showNotification('請專心遊戲，不要嘗試查看原始碼喔！', 'warning');
        }
    }

    /**
     * 顯示右鍵選單警告
     */
    function showContextMenuWarning() {
        if (window.GameUI && typeof window.GameUI.showNotification === 'function') {
            window.GameUI.showNotification('右鍵選單已被禁用，請專心解謎！', 'info');
        }
    }

    /**
     * 驗證頁面存取權限
     * @param {number} requiredLevel - 需要的關卡等級
     * @returns {boolean} 是否有存取權限
     */
    function validateAccess(requiredLevel) {
        try {
            const progress = localStorage.getItem(GameConfig.STORAGE_KEYS.PROGRESS);
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

    /**
     * 檢查頁面存取權限
     * @returns {boolean} 是否通過檢查
     */
    function checkPageAccess() {
        const currentPage = window.location.pathname;
        console.log('當前頁面:', currentPage);

        if (currentPage.includes('page2.html')) {
            if (!validateAccess(2)) {
                console.log('第二關存取被拒絕，重定向到第一關');
                showAccessDenied('請先完成第一關才能進入第二關！');
                return false;
            }
        } else if (currentPage.includes('page3.html')) {
            if (!validateAccess(3)) {
                console.log('第三關存取被拒絕，重定向到第一關');
                showAccessDenied('請依序完成前面的關卡才能進入最終挑戰！');
                return false;
            }
        }

        return true;
    }

    /**
     * 顯示存取被拒絕訊息
     * @param {string} message - 警告訊息
     */
    function showAccessDenied(message) {
        const accessDeniedElement = document.getElementById('access-denied');
        const mainContentElement = document.getElementById('main-content');

        if (accessDeniedElement && mainContentElement) {
            accessDeniedElement.style.display = 'block';
            mainContentElement.style.display = 'none';
        } else {
            alert(message);
            setTimeout(function() {
                window.location.href = GameConfig.PAGES.INDEX;
            }, 1000);
        }
    }

    /**
     * 啟動存取監控
     */
    function startAccessMonitoring() {
        if (accessMonitorInterval) {
            clearInterval(accessMonitorInterval);
        }

        accessMonitorInterval = setInterval(function() {
            const currentPage = window.location.pathname;

            if (currentPage.includes('page2.html') && !validateAccess(2)) {
                console.log('偵測到無效存取第二關');
                window.location.href = GameConfig.PAGES.INDEX;
            } else if (currentPage.includes('page3.html') && !validateAccess(3)) {
                console.log('偵測到無效存取第三關');
                window.location.href = GameConfig.PAGES.INDEX;
            }
        }, GameConfig.TIMING.ACCESS_CHECK_INTERVAL);
    }

    /**
     * 停止存取監控
     */
    function stopAccessMonitoring() {
        if (accessMonitorInterval) {
            clearInterval(accessMonitorInterval);
            accessMonitorInterval = null;
        }
    }

    /**
     * 暫時禁用開發者工具檢查
     * @param {number} duration - 禁用時間（毫秒）
     */
    function temporaryDisableDevToolsCheck(duration) {
        isDevToolsCheckActive = false;

        setTimeout(function() {
            isDevToolsCheckActive = true;
        }, duration || 5000);
    }

    /**
     * 檢測是否在開發模式
     * @returns {boolean} 是否為開發模式
     */
    function isDevelopmentMode() {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.protocol === 'file:';
    }

    /**
     * 安全地執行函數
     * @param {Function} func - 要執行的函數
     * @param {*} defaultValue - 發生錯誤時的預設值
     * @returns {*} 函數執行結果或預設值
     */
    function safeExecute(func, defaultValue) {
        try {
            return func();
        } catch (error) {
            console.error('安全執行錯誤:', error);
            return defaultValue;
        }
    }

    /**
     * 清理安全模組
     */
    function cleanup() {
        stopAccessMonitoring();
        isDevToolsCheckActive = false;
    }

    // 公開介面
    return {
        // 初始化
        initSecurity: initSecurity,
        cleanup: cleanup,

        // 存取控制
        validateAccess: validateAccess,
        checkPageAccess: checkPageAccess,
        startAccessMonitoring: startAccessMonitoring,
        stopAccessMonitoring: stopAccessMonitoring,

        // 開發者工具
        temporaryDisableDevToolsCheck: temporaryDisableDevToolsCheck,
        isDevelopmentMode: isDevelopmentMode,

        // 工具函數
        safeExecute: safeExecute,
        showAccessDenied: showAccessDenied
    };
})();

console.log('SecurityModule 載入完成');