// ============================================================================
// BUTTON STATE MANAGER - Prevents flickering and provides better UX
// Manages button states with debouncing and clear user feedback
// ============================================================================

/**
 * ButtonStateManager - Prevents button flickering and provides clear feedback
 */
class ButtonStateManager {
    constructor() {
        this.debounceTimeouts = new Map();
        this.originalTexts = new Map();
        this.initialized = false;
    }

    /**
     * Initialize button manager - store original button texts
     */
    init() {
        if (this.initialized) return;
        
        // Store original button texts for restoration
        const buttons = ['forwardBtn', 'backwardBtn', 'fullDemoBtn'];
        buttons.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                this.originalTexts.set(btnId, btn.textContent);
            }
        });
        
        this.initialized = true;
        console.log('🎛️ Button State Manager initialized');
    }

    /**
     * Set button state with debouncing to prevent flickering
     * @param {string} buttonId - Button element ID
     * @param {boolean} disabled - Whether button should be disabled
     * @param {string} text - Optional: new button text
     * @param {string} tooltip - Optional: new tooltip text
     * @param {number} debounceMs - Debounce delay in milliseconds
     */
    setButtonState(buttonId, disabled, text = null, tooltip = null, debounceMs = 50) {
        // Clear any pending timeout for this button
        if (this.debounceTimeouts.has(buttonId)) {
            clearTimeout(this.debounceTimeouts.get(buttonId));
        }

        // Set new timeout
        const timeout = setTimeout(() => {
            const button = document.getElementById(buttonId);
            if (!button) return;

            // Update disabled state
            button.disabled = disabled;

            // Update text if provided
            if (text !== null) {
                button.textContent = text;
            }

            // Update tooltip if provided
            if (tooltip !== null) {
                button.title = tooltip;
            }

            // Remove timeout from map
            this.debounceTimeouts.delete(buttonId);
            
            console.log(`🎛️ Button ${buttonId}: ${disabled ? 'disabled' : 'enabled'}${text ? ` - "${text}"` : ''}`);
        }, debounceMs);

        this.debounceTimeouts.set(buttonId, timeout);
    }

    /**
     * Immediately set button state without debouncing (for critical updates)
     * @param {string} buttonId - Button element ID
     * @param {boolean} disabled - Whether button should be disabled
     * @param {string} text - Optional: new button text
     * @param {string} tooltip - Optional: new tooltip text
     */
    setButtonStateImmediate(buttonId, disabled, text = null, tooltip = null) {
        // Clear any pending timeout for this button
        if (this.debounceTimeouts.has(buttonId)) {
            clearTimeout(this.debounceTimeouts.get(buttonId));
            this.debounceTimeouts.delete(buttonId);
        }

        const button = document.getElementById(buttonId);
        if (!button) return;

        // Update disabled state
        button.disabled = disabled;

        // Update text if provided
        if (text !== null) {
            button.textContent = text;
        }

        // Update tooltip if provided
        if (tooltip !== null) {
            button.title = tooltip;
        }
        
        console.log(`🎛️ Button ${buttonId} (immediate): ${disabled ? 'disabled' : 'enabled'}${text ? ` - "${text}"` : ''}`);
    }

    /**
     * Restore button to original text
     * @param {string} buttonId - Button element ID
     */
    restoreButtonText(buttonId) {
        const originalText = this.originalTexts.get(buttonId);
        if (originalText) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.textContent = originalText;
            }
        }
    }

    /**
     * Set Learn button state with contextual feedback
     * @param {string} state - 'ready', 'disabled', 'thinking-required', 'learning'
     * @param {boolean} immediate - Use immediate update (no debouncing)
     */
    setLearnButtonState(state, immediate = false) {
        const t = window.i18nUtils ? window.i18nUtils.t : ((key) => key);
        const setState = immediate ? this.setButtonStateImmediate.bind(this) : this.setButtonState.bind(this);
        
        switch (state) {
            case 'ready':
                setState('backwardBtn', false, 
                    t('buttons.learn'), 
                    t('buttons.learn.tooltip'));
                break;
                
            case 'disabled':
                setState('backwardBtn', true,
                    t('buttons.learn'),
                    t('buttons.learn.tooltip'));
                break;
                
            case 'thinking-required':
                setState('backwardBtn', true,
                    '🧠 Think First',
                    'Run forward pass first to see how the AI improved after learning');
                break;
                
            case 'learning':
                setState('backwardBtn', true,
                    '📚 Learning...',
                    'AI is currently learning from its mistake');
                break;
                
            default:
                console.warn(`Unknown Learn button state: ${state}`);
        }
    }

    /**
     * Set Think button state with contextual feedback
     * @param {string} state - 'ready', 'thinking', 'disabled'
     */
    setThinkButtonState(state) {
        const t = window.i18nUtils ? window.i18nUtils.t : ((key) => key);
        
        switch (state) {
            case 'ready':
                this.setButtonState('forwardBtn', false,
                    t('buttons.think'),
                    t('buttons.think.tooltip'));
                break;
                
            case 'thinking':
                this.setButtonState('forwardBtn', true,
                    '🧠 Thinking...',
                    'AI is currently processing the image');
                break;
                
            case 'disabled':
                this.setButtonState('forwardBtn', true,
                    t('buttons.think'),
                    t('buttons.think.tooltip'));
                break;
                
            default:
                console.warn(`Unknown Think button state: ${state}`);
        }
    }

    /**
     * Update all button states based on current demo state
     * @param {Object} demoState - Current demo state
     * @param {boolean} isAnimating - Whether animation is running
     * @param {string} trueLabel - True label if set
     */
    updateAllButtonStates(demoState, isAnimating, trueLabel) {
        if (isAnimating) {
            // During animation, disable all action buttons
            this.setThinkButtonState('thinking');
            this.setLearnButtonState('learning');
            this.setButtonState('fullDemoBtn', true);
        } else {
            // Animation complete - set states based on demo progress
            this.setThinkButtonState('ready');
            this.setButtonState('fullDemoBtn', false);
            
            if (demoState.forwardCompleted && trueLabel) {
                this.setLearnButtonState('ready');
            } else if (!demoState.forwardCompleted) {
                this.setLearnButtonState('thinking-required');
            } else {
                this.setLearnButtonState('disabled');
            }
        }
    }

    /**
     * Reset all buttons to initial state
     */
    resetAll() {
        this.setThinkButtonState('ready');
        this.setLearnButtonState('disabled');
        this.setButtonState('fullDemoBtn', false);
        
        // Restore original texts
        this.originalTexts.forEach((text, buttonId) => {
            this.restoreButtonText(buttonId);
        });
    }

    /**
     * Clear all pending timeouts
     */
    cleanup() {
        this.debounceTimeouts.forEach(timeout => clearTimeout(timeout));
        this.debounceTimeouts.clear();
    }

    /**
     * Override native getElementById to intercept button state changes
     * This prevents other modules from bypassing the button state manager
     */
    interceptDirectButtonAccess() {
        const originalGetElementById = document.getElementById;
        const buttonManager = this;
        
        document.getElementById = function(id) {
            const element = originalGetElementById.call(document, id);
            
            // Only intercept button elements we manage
            if (element && ['forwardBtn', 'backwardBtn', 'fullDemoBtn'].includes(id)) {
                // Create a proxy to intercept property changes
                return new Proxy(element, {
                    set(target, property, value) {
                        if (property === 'disabled') {
                            // Instead of directly setting disabled, use button manager
                            console.warn(`⚠️ Direct button access intercepted for ${id}.disabled = ${value}`);
                            console.warn('  Use window.buttonStateManager instead for better UX');
                            
                            // Apply the change immediately to prevent conflicts
                            target.disabled = value;
                            return true;
                        }
                        
                        // For other properties, set normally
                        target[property] = value;
                        return true;
                    }
                });
            }
            
            return element;
        };
        
        console.log('🛡️ Button access interception enabled');
    }

    /**
     * Disable interception (for testing or debugging)
     */
    disableInterception() {
        // Restore original getElementById if we have a reference
        if (this.originalGetElementById) {
            document.getElementById = this.originalGetElementById;
            console.log('🛡️ Button access interception disabled');
        }
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.buttonStateManager = new ButtonStateManager();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.buttonStateManager.init();
        });
    } else {
        window.buttonStateManager.init();
    }
    
    console.log('🎛️ Button State Manager loaded');
    
    // Register with module system
    if (window.moduleLoaded) {
        window.moduleLoaded('button-state-manager');
    }
}