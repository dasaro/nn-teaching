// Internationalization system for Neural Network Visualization App

class I18n {
    constructor() {
        this.currentLanguage = 'en'; // Default language
        this.translations = {};
        this.fallbackLanguage = 'en';
    }
    
    // Initialize the i18n system
    async init() {
        // Get saved language preference or use default
        this.currentLanguage = localStorage.getItem('nn-app-language') || 'en';
        
        // Load translation files
        await this.loadTranslations();
        
        // Apply translations to the page
        this.translatePage();
        
        // Update language selector
        this.updateLanguageSelector();
    }
    
    // Load translation files dynamically
    async loadTranslations() {
        try {
            // Load translation files by including script tags
            const languages = ['en', 'it'];
            
            for (const lang of languages) {
                if (!window[lang]) {
                    // Create script tag to load language file
                    const script = document.createElement('script');
                    script.src = `locales/${lang}.js`;
                    script.async = false;
                    document.head.appendChild(script);
                    
                    // Wait for script to load
                    await new Promise((resolve, reject) => {
                        script.onload = resolve;
                        script.onerror = reject;
                    });
                }
                this.translations[lang] = window[lang];
            }
            
            console.log('✅ Translations loaded:', Object.keys(this.translations));
        } catch (error) {
            console.error('❌ Failed to load translations:', error);
            // Fallback to English if loading fails
            this.currentLanguage = 'en';
        }
    }
    
    // Get translated text for a key
    t(key, replacements = []) {
        const translation = this.translations[this.currentLanguage]?.[key] 
                         || this.translations[this.fallbackLanguage]?.[key] 
                         || key;
        
        // Handle string replacements (e.g., {0}, {1}, etc.)
        if (replacements.length > 0) {
            return this.replaceParameters(translation, replacements);
        }
        
        return translation;
    }
    
    // Replace parameters in translation strings
    replaceParameters(text, replacements) {
        let result = text;
        replacements.forEach((replacement, index) => {
            const placeholder = `{${index}}`;
            result = result.replace(new RegExp(placeholder, 'g'), replacement);
        });
        return result;
    }
    
    // Change language and update UI
    async setLanguage(language) {
        if (this.translations[language]) {
            this.currentLanguage = language;
            localStorage.setItem('nn-app-language', language);
            this.translatePage();
            this.updateLanguageSelector();
            
            // Emit language change event for other components to react
            document.dispatchEvent(new CustomEvent('languageChanged', { 
                detail: { language: language } 
            }));
            
            console.log(`🌐 Language changed to: ${language}`);
        } else {
            console.error(`❌ Language '${language}' not available`);
        }
    }
    
    // Apply translations to all elements with data-i18n attribute
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            // Handle different types of elements
            if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else if (element.getAttribute('title') !== null) {
                element.title = this.t(element.getAttribute('data-i18n-tooltip') || key);
            } else {
                // For most elements, set innerHTML to handle HTML in translations
                element.innerHTML = translation;
            }
        });
        
        // Handle tooltips separately
        const tooltipElements = document.querySelectorAll('[data-i18n-tooltip]');
        tooltipElements.forEach(element => {
            const key = element.getAttribute('data-i18n-tooltip');
            element.title = this.t(key);
        });
    }
    
    // Update language selector to show current selection
    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }
    
    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }
    
    // Get available languages
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await i18n.init();
    console.log('🌐 I18n system initialized');
});

// Language change handler
function changeLanguage(language) {
    i18n.setLanguage(language);
}