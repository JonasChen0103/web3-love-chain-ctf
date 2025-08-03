/**
 * 使用者介面模組
 * 處理UI互動、通知、結果顯示等功能
 */

window.GameUI = (function() {
    'use strict';

    /**
     * 顯示結果訊息
     * @param {string} elementId - 結果元素的ID
     * @param {string} message - 要顯示的訊息
     * @param {boolean} isSuccess - 是否為成功訊息
     */
    function showResult(elementId, message, isSuccess) {
        const resultElement = document.getElementById(elementId);
        if (!resultElement) {
            console.warn('找不到結果元素:', elementId);
            return;
        }

        resultElement.innerHTML = message;
        resultElement.className = 'result-display show ' + (isSuccess ? 'success' : 'error');

        // 確保元素可見
        resultElement.style.opacity = '1';

        // 滾動到結果位置
        setTimeout(function() {
            resultElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }

    /**
     * 顯示通知訊息
     * @param {string} message - 通知訊息
     * @param {string} type - 通知類型 (success, error, info, warning)
     */
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;

        // 設定樣式
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3',
            warning: '#ff9800'
        };

        const bgColor = colors[type] || colors.info;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            background-color: ${bgColor};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        document.body.appendChild(notification);

        // 滑入動畫
        setTimeout(function() {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自動移除
        setTimeout(function() {
            notification.style.transform = 'translateX(400px)';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, GameConfig.TIMING.NOTIFICATION_DURATION);
    }

    /**
     * 顯示提示訊息
     * @param {number} level - 關卡編號
     */
    function showHint(level) {
        const hint = GameConfig.HINTS[level];
        if (hint) {
            showNotification(hint, GameConfig.NOTIFICATION_TYPES.INFO);
            GameProgress.recordHintUsed();
        } else {
            showNotification('找不到該關卡的提示', GameConfig.NOTIFICATION_TYPES.ERROR);
        }
    }

    /**
     * 更新進度指示器
     */
    function updateProgressIndicator() {
        const progress = GameProgress.loadProgress();
        const steps = document.querySelectorAll('.progress-step');

        steps.forEach(function(step) {
            const level = parseInt(step.getAttribute('data-level'));

            // 移除所有狀態類別
            step.classList.remove('active', 'completed');

            if (progress.completed.includes(level)) {
                step.classList.add('completed');
            } else if (progress.level === level) {
                step.classList.add('active');
            }
        });
    }

    /**
     * 顯示載入動畫
     * @param {string} elementId - 要顯示載入動畫的元素ID
     */
    function showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading"></div>處理中...';
            element.className = 'result-display show';
        }
    }

    /**
     * 隱藏元素
     * @param {string} elementId - 要隱藏的元素ID
     */
    function hideElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(GameConfig.CSS_CLASSES.HIDDEN);
        }
    }

    /**
     * 顯示元素
     * @param {string} elementId - 要顯示的元素ID
     */
    function showElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(GameConfig.CSS_CLASSES.HIDDEN);
        }
    }

    /**
     * 切換元素顯示狀態
     * @param {string} elementId - 要切換的元素ID
     */
    function toggleElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle(GameConfig.CSS_CLASSES.HIDDEN);
        }
    }

    /**
     * 平滑滾動到元素
     * @param {string} elementId - 目標元素ID
     * @param {string} block - 滾動位置 ('start', 'center', 'end')
     */
    function scrollToElement(elementId, block) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: block || 'center'
            });
        }
    }

    /**
     * 設定按鈕狀態
     * @param {string} buttonId - 按鈕ID
     * @param {boolean} enabled - 是否啟用
     * @param {string} text - 按鈕文字（可選）
     */
    function setButtonState(buttonId, enabled, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !enabled;

            if (enabled) {
                button.classList.remove(GameConfig.CSS_CLASSES.DISABLED);
            } else {
                button.classList.add(GameConfig.CSS_CLASSES.DISABLED);
            }

            if (text) {
                button.textContent = text;
            }
        }
    }

    /**
     * 清空輸入框
     * @param {string} inputId - 輸入框ID
     */
    function clearInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
            input.focus();
        }
    }

    /**
     * 設定輸入框焦點
     * @param {string} inputId - 輸入框ID
     */
    function focusInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            setTimeout(function() {
                input.focus();
            }, 100);
        }
    }

    /**
     * 建立確認對話框
     * @param {string} message - 確認訊息
     * @param {Function} onConfirm - 確認回調函數
     * @param {Function} onCancel - 取消回調函數（可選）
     */
    function showConfirmDialog(message, onConfirm, onCancel) {
        if (confirm(message)) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
        } else {
            if (typeof onCancel === 'function') {
                onCancel();
            }
        }
    }

    /**
     * 創建下一關按鈕
     * @param {string} text - 按鈕文字
     * @param {string} href - 連結地址
     * @param {string} icon - 圖示（可選）
     * @returns {string} 按鈕HTML
     */
    function createNextLevelButton(text, href, icon) {
        const iconHtml = icon ? `<span class="btn-icon">${icon}</span>` : '';
        const arrowHtml = '<span class="btn-arrow">→</span>';

        return `<a class="next-level-btn" href="${href}">
                    ${iconHtml} ${text} ${arrowHtml}
                </a>`;
    }

    /**
     * 格式化時間顯示
     * @param {number} milliseconds - 毫秒數
     * @returns {string} 格式化的時間字串
     */
    function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
    }

    /**
     * 格式化倒數計時顯示
     * @param {number} remaining - 剩餘毫秒數
     * @returns {string} 格式化的倒數時間
     */
    function formatCountdown(remaining) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * 添加CSS類別
     * @param {string} elementId - 元素ID
     * @param {string} className - 類別名稱
     */
    function addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * 移除CSS類別
     * @param {string} elementId - 元素ID
     * @param {string} className - 類別名稱
     */
    function removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * 初始化頁面UI
     */
    function initPageUI() {
        // 更新進度指示器
        updateProgressIndicator();

        // 移除自動聚焦，讓使用者自行點擊輸入框
    }

    // 公開介面
    return {
        // 基本顯示
        showResult: showResult,
        showNotification: showNotification,
        showHint: showHint,
        showLoading: showLoading,

        // 元素控制
        hideElement: hideElement,
        showElement: showElement,
        toggleElement: toggleElement,
        scrollToElement: scrollToElement,

        // 按鈕和輸入
        setButtonState: setButtonState,
        clearInput: clearInput,
        focusInput: focusInput,

        // 對話框
        showConfirmDialog: showConfirmDialog,

        // 進度和狀態
        updateProgressIndicator: updateProgressIndicator,
        initPageUI: initPageUI,

        // 工具函數
        createNextLevelButton: createNextLevelButton,
        formatTime: formatTime,
        formatCountdown: formatCountdown,
        addClass: addClass,
        removeClass: removeClass
    };
})();

console.log('GameUI 載入完成');