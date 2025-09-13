// ============================================================================
// INTERNATIONALIZATION UTILITIES
// Centralized translation functions to eliminate duplication across modules
// ============================================================================

/**
 * Centralized translation function that all modules should use
 * @param {string} key - Translation key
 * @param {Array} replacements - Array of replacement values for placeholders
 * @returns {string} Translated string or the key if translation not found
 */
function t(key, replacements = []) {
    if (window.i18n && window.i18n.t && typeof window.i18n.t === 'function') {
        return window.i18n.t(key, replacements);
    }
    
    // Fallback: return the key if i18n is not available
    console.warn(`i18n not available, returning key: ${key}`);
    return key;
}

/**
 * Check if i18n system is available and ready
 * @returns {boolean} True if i18n is available
 */
function isI18nReady() {
    return !!(window.i18n && window.i18n.t && typeof window.i18n.t === 'function');
}

/**
 * Wait for i18n system to be ready
 * @param {number} maxWaitMs - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} Promise that resolves when i18n is ready or times out
 */
function waitForI18n(maxWaitMs = 5000) {
    return new Promise((resolve) => {
        if (isI18nReady()) {
            resolve(true);
            return;
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            if (isI18nReady()) {
                clearInterval(checkInterval);
                resolve(true);
            } else if (Date.now() - startTime > maxWaitMs) {
                clearInterval(checkInterval);
                console.warn('i18n system not ready after timeout');
                resolve(false);
            }
        }, 100);
    });
}

/**
 * Initialize translation for a module
 * This function can be used by modules to get a configured translation function
 * @param {string} moduleName - Name of the module for debugging
 * @returns {Function} Translation function configured for this module
 */
function initModuleTranslation(moduleName) {
    return function(key, replacements = []) {
        if (!isI18nReady()) {
            console.warn(`Module ${moduleName}: i18n not ready for key: ${key}`);
            return key;
        }
        return window.i18n.t(key, replacements);
    };
}

// Export to global scope
if (typeof window !== 'undefined') {
    // Main translation function
    window.t = t;
    
    // I18n utilities namespace
    window.i18nUtils = {
        t: t,
        isReady: isI18nReady,
        waitForReady: waitForI18n,
        initModuleTranslation: initModuleTranslation
    };
    
    console.log('🌐 i18n utilities module loaded - Centralized translation available');
    
    // Report to module initialization system
    if (window.moduleLoaded) {
        window.moduleLoaded('i18n-utils');
    }
}