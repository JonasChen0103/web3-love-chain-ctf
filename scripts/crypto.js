/**
 * 密碼學演算法模組
 * 包含凱撒密碼、維吉尼亞密碼等加解密功能
 */

window.CryptoModule = (function() {
    'use strict';

    /**
     * 凱撒密碼解密
     * @param {string} text - 要解密的文字
     * @param {number} shift - 位移量，預設為13（ROT13）
     * @returns {string} 解密後的文字
     */
    function caesarDecrypt(text, shift) {
        if (!shift) shift = GameConfig.CRYPTO.CAESAR_SHIFT;

        return text.replace(/[a-zA-Z]/g, function(char) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(
                ((char.charCodeAt(0) - start - shift + 26) % 26) + start
            );
        });
    }

    /**
     * 凱撒密碼加密
     * @param {string} text - 要加密的文字
     * @param {number} shift - 位移量，預設為13
     * @returns {string} 加密後的文字
     */
    function caesarEncrypt(text, shift) {
        if (!shift) shift = GameConfig.CRYPTO.CAESAR_SHIFT;

        return text.replace(/[a-zA-Z]/g, function(char) {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(
                ((char.charCodeAt(0) - start + shift) % 26) + start
            );
        });
    }

    /**
     * 維吉尼亞密碼解密
     * @param {string} ciphertext - 密文
     * @param {string} key - 密鑰
     * @returns {string} 解密後的明文
     */
    function vigenereDecrypt(ciphertext, key) {
        if (!key) key = GameConfig.CRYPTO.VIGENERE_KEY;

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

    /**
     * 維吉尼亞密碼加密
     * @param {string} plaintext - 明文
     * @param {string} key - 密鑰
     * @returns {string} 加密後的密文
     */
    function vigenereEncrypt(plaintext, key) {
        if (!key) key = GameConfig.CRYPTO.VIGENERE_KEY;

        key = key.toUpperCase();
        let result = '';
        let keyIndex = 0;

        for (let i = 0; i < plaintext.length; i++) {
            const char = plaintext[i];

            if (/[A-Za-z]/.test(char)) {
                const isUpperCase = char === char.toUpperCase();
                const base = isUpperCase ? 65 : 97;
                const keyShift = key[keyIndex % key.length].charCodeAt(0) - 65;

                const encryptedChar = String.fromCharCode(
                    ((char.charCodeAt(0) - base + keyShift) % 26) + base
                );

                result += encryptedChar;
                keyIndex++;
            } else {
                result += char;
            }
        }

        return result;
    }

    /**
     * 檢查答案是否正確
     * @param {string} userInput - 使用者輸入
     * @param {number} level - 關卡編號
     * @returns {boolean} 是否正確
     */
    function checkAnswer(userInput, level) {
        try {
            const answers = {
                1: atob(GameConfig.ENCRYPTED_ANSWERS.LEVEL_1),
                2: atob(GameConfig.ENCRYPTED_ANSWERS.LEVEL_2),
                3: atob(GameConfig.ENCRYPTED_ANSWERS.LEVEL_3)
            };

            const cleanInput = userInput.trim().toLowerCase();
            const correctAnswer = answers[level];

            return cleanInput === correctAnswer;
        } catch (error) {
            console.error('答案檢查錯誤:', error);
            return false;
        }
    }

    /**
     * Base64 安全解碼
     * @param {string} str - Base64 編碼的字串
     * @returns {string} 解碼後的字串
     */
    function safeBase64Decode(str) {
        try {
            return atob(str);
        } catch (error) {
            console.error('Base64 解碼錯誤:', error);
            return '';
        }
    }

    /**
     * 生成維吉尼亞密碼表
     * @returns {Array<Array<string>>} 26x26的密碼表
     */
    function generateVigenereTable() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const table = [];

        for (let i = 0; i < 26; i++) {
            const row = [];
            for (let j = 0; j < 26; j++) {
                row.push(alphabet[(i + j) % 26]);
            }
            table.push(row);
        }

        return table;
    }

    /**
     * 驗證密鑰格式
     * @param {string} key - 密鑰
     * @returns {boolean} 是否為有效密鑰
     */
    function validateKey(key) {
        return typeof key === 'string' &&
            key.length > 0 &&
            /^[A-Za-z]+$/.test(key);
    }

    /**
     * 清理輸入文字（移除非字母字符）
     * @param {string} text - 輸入文字
     * @returns {string} 清理後的文字
     */
    function cleanText(text) {
        return text.replace(/[^A-Za-z]/g, '');
    }

    // 公開介面
    return {
        // 加解密函數
        caesarDecrypt: caesarDecrypt,
        caesarEncrypt: caesarEncrypt,
        vigenereDecrypt: vigenereDecrypt,
        vigenereEncrypt: vigenereEncrypt,

        // 答案檢查
        checkAnswer: checkAnswer,

        // 工具函數
        safeBase64Decode: safeBase64Decode,
        generateVigenereTable: generateVigenereTable,
        validateKey: validateKey,
        cleanText: cleanText
    };
})();

console.log('CryptoModule 載入完成');