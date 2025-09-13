// ============================================================================
// MODULE INITIALIZATION SYSTEM
// Manages proper loading order and dependency resolution
// ============================================================================

/**
 * Module initialization system to handle dependencies and loading order
 */
class ModuleInitializer {
    constructor() {
        this.modules = new Map();
        this.loadedModules = new Set();
        this.initCallbacks = [];
        this.isInitializing = false;
    }

    /**
     * Register a module with its dependencies
     * @param {string} name - Module name
     * @param {Array<string>} dependencies - Array of dependency module names
     * @param {Function} initFunction - Function to call when dependencies are ready
     */
    registerModule(name, dependencies = [], initFunction = null) {
        this.modules.set(name, {
            name,
            dependencies,
            initFunction,
            isLoaded: false,
            isInitialized: false
        });
        
        console.log(`📦 Module registered: ${name} (deps: [${dependencies.join(', ')}])`);
    }

    /**
     * Mark a module as loaded (script has executed)
     * @param {string} name - Module name
     */
    markModuleLoaded(name) {
        if (this.modules.has(name)) {
            this.modules.get(name).isLoaded = true;
            this.loadedModules.add(name);
            console.log(`✅ Module loaded: ${name}`);
            
            // Try to initialize modules that are now ready
            this.tryInitializeModules();
        } else {
            // Auto-register unknown modules with no dependencies for compatibility
            console.log(`📦 Auto-registering module: ${name}`);
            this.registerModule(name, []);
            this.modules.get(name).isLoaded = true;
            this.modules.get(name).isInitialized = true; // Mark as initialized immediately
            this.loadedModules.add(name);
            console.log(`✅ Module auto-registered and loaded: ${name}`);
        }
    }

    /**
     * Check if all dependencies for a module are satisfied
     * @param {Object} module - Module object
     * @returns {boolean} True if all dependencies are ready
     */
    areDependenciesReady(module) {
        return module.dependencies.every(dep => {
            const depModule = this.modules.get(dep);
            return depModule && depModule.isInitialized;
        });
    }

    /**
     * Try to initialize all ready modules
     */
    tryInitializeModules() {
        if (this.isInitializing) return;
        
        this.isInitializing = true;
        let initialized = true;
        
        while (initialized) {
            initialized = false;
            
            for (const [name, module] of this.modules) {
                if (module.isLoaded && !module.isInitialized && this.areDependenciesReady(module)) {
                    try {
                        if (module.initFunction) {
                            console.log(`🔧 Initializing module: ${name}`);
                            module.initFunction();
                        }
                        module.isInitialized = true;
                        initialized = true;
                        console.log(`✅ Module initialized: ${name}`);
                    } catch (error) {
                        console.error(`❌ Failed to initialize module ${name}:`, error);
                    }
                }
            }
        }
        
        this.isInitializing = false;
        
        // Check if all modules are ready
        this.checkAllModulesReady();
    }

    /**
     * Check if all registered modules are ready and run completion callbacks
     */
    checkAllModulesReady() {
        const allReady = Array.from(this.modules.values()).every(module => module.isInitialized);
        
        if (allReady && this.initCallbacks.length > 0) {
            console.log('🎉 All modules initialized, running completion callbacks');
            this.initCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error('❌ Error in init callback:', error);
                }
            });
            this.initCallbacks = [];
        }
    }

    /**
     * Add a callback to run when all modules are initialized
     * @param {Function} callback - Function to call when all modules are ready
     */
    onAllModulesReady(callback) {
        const allReady = Array.from(this.modules.values()).every(module => module.isInitialized);
        
        if (allReady) {
            // Already ready, run immediately
            try {
                callback();
            } catch (error) {
                console.error('❌ Error in immediate init callback:', error);
            }
        } else {
            // Add to queue
            this.initCallbacks.push(callback);
        }
    }

    /**
     * Get initialization status
     * @returns {Object} Status information
     */
    getStatus() {
        const modules = Array.from(this.modules.values());
        return {
            totalModules: modules.length,
            loadedModules: modules.filter(m => m.isLoaded).length,
            initializedModules: modules.filter(m => m.isInitialized).length,
            allReady: modules.every(m => m.isInitialized),
            modules: modules.map(m => ({
                name: m.name,
                loaded: m.isLoaded,
                initialized: m.isInitialized,
                dependencies: m.dependencies
            }))
        };
    }

    /**
     * Get detailed diagnostic information for debugging
     * @returns {Object} Diagnostic information
     */
    getDiagnostics() {
        const status = this.getStatus();
        const pendingCallbacks = this.initCallbacks.length;
        
        return {
            ...status,
            pendingCallbacks,
            readyPercentage: status.totalModules > 0 ? 
                Math.round((status.initializedModules / status.totalModules) * 100) : 100,
            isInitializing: this.isInitializing,
            loadingIssues: status.modules.filter(m => m.loaded && !m.initialized),
            unloadedModules: status.modules.filter(m => !m.loaded)
        };
    }

    /**
     * Log current status to console for debugging
     */
    logStatus() {
        const diag = this.getDiagnostics();
        
        console.log('📊 Module Initialization Status:');
        console.log(`  Ready: ${diag.initializedModules}/${diag.totalModules} (${diag.readyPercentage}%)`);
        console.log(`  Pending callbacks: ${diag.pendingCallbacks}`);
        
        if (diag.unloadedModules.length > 0) {
            console.log(`  ⏳ Unloaded: ${diag.unloadedModules.map(m => m.name).join(', ')}`);
        }
        if (diag.loadingIssues.length > 0) {
            console.log(`  ⚠️ Loading issues: ${diag.loadingIssues.map(m => m.name).join(', ')}`);
        }
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.moduleInitializer = new ModuleInitializer();
    
    // Helper functions for easier use
    window.registerModule = (name, deps, initFn) => window.moduleInitializer.registerModule(name, deps, initFn);
    window.moduleLoaded = (name) => window.moduleInitializer.markModuleLoaded(name);
    window.onAllModulesReady = (callback) => window.moduleInitializer.onAllModulesReady(callback);
    
    console.log('🚀 Module initialization system ready');
}

// Smart module initialization with optimized fallback
if (typeof window !== 'undefined') {
    let timeoutId = null;
    let hasTriggeredFallback = false;
    
    /**
     * Trigger initialization callbacks (either when all modules ready or on timeout)
     */
    function triggerInitializationCallbacks(reason = 'unknown') {
        if (hasTriggeredFallback) return; // Prevent double-triggering
        
        hasTriggeredFallback = true;
        if (timeoutId) clearTimeout(timeoutId);
        
        console.log(`🚀 App initialization triggered: ${reason}`);
        
        if (window.moduleInitializer && window.moduleInitializer.initCallbacks) {
            const callbackCount = window.moduleInitializer.initCallbacks.length;
            if (callbackCount > 0) {
                console.log(`📞 Running ${callbackCount} initialization callback(s)`);
                
                window.moduleInitializer.initCallbacks.forEach((callback, index) => {
                    try {
                        callback();
                        console.log(`✅ Callback ${index + 1}/${callbackCount} completed`);
                    } catch (error) {
                        console.error(`❌ Callback ${index + 1} failed:`, error);
                    }
                });
                window.moduleInitializer.initCallbacks = [];
            }
        }
    }
    
    // Enhanced module readiness detection with smart timing
    let checkInterval;
    let startTime = Date.now();
    let lastProgressTime = startTime;
    let progressStallCount = 0;
    let lastModuleCount = 0;
    
    checkInterval = setInterval(() => {
        if (!window.moduleInitializer) return;
        
        const status = window.moduleInitializer.getStatus();
        const now = Date.now();
        const elapsed = now - startTime;
        
        // Track progress stalling (no new modules in last 200ms)
        if (status.initializedModules === lastModuleCount) {
            progressStallCount++;
        } else {
            progressStallCount = 0;
            lastProgressTime = now;
        }
        lastModuleCount = status.initializedModules;
        
        // Log progress less frequently but with more detail
        if (elapsed > 300 && (now - window._lastProgressLog > 800 || !window._lastProgressLog)) {
            console.log(`📊 Module initialization: ${status.initializedModules}/${status.totalModules} ready (${Math.round(elapsed/1000*10)/10}s)`);
            window._lastProgressLog = now;
        }
        
        // Optimal case: All modules truly ready
        if (status.allReady && status.totalModules > 0) {
            clearInterval(checkInterval);
            console.log(`🎉 All ${status.totalModules} modules initialized successfully in ${Math.round(elapsed/1000*10)/10}s`);
            triggerInitializationCallbacks('all modules ready');
            return;
        }
        
        // Smart early completion conditions (avoid unnecessary waiting)
        const shouldCompleteEarly = (
            // Condition 1: Most modules ready and progress stalled
            (status.totalModules >= 3 && status.initializedModules >= status.totalModules * 0.85 && progressStallCount >= 5) ||
            
            // Condition 2: Reasonable progress after sufficient time
            (elapsed >= 800 && status.initializedModules >= Math.max(3, status.totalModules * 0.7)) ||
            
            // Condition 3: Minimal modules but they're working
            (status.totalModules <= 2 && status.initializedModules >= 1 && elapsed >= 400) ||
            
            // Condition 4: No modules registered but DOM is ready
            (status.totalModules === 0 && elapsed >= 200 && document.readyState === 'complete')
        );
        
        if (shouldCompleteEarly) {
            clearInterval(checkInterval);
            const reason = status.totalModules === 0 ? 
                'DOM ready, no modules registered' : 
                `${status.initializedModules}/${status.totalModules} modules ready (smart completion)`;
            console.log(`✅ Module initialization complete: ${reason} (${Math.round(elapsed/1000*10)/10}s)`);
            triggerInitializationCallbacks(reason);
            return;
        }
    }, 50); // Faster polling for more responsive detection
    
    // Extended fallback timeout - should rarely be needed with smart detection
    timeoutId = setTimeout(() => {
        clearInterval(checkInterval);
        
        const elapsed = Date.now() - startTime;
        
        if (window.moduleInitializer) {
            const status = window.moduleInitializer.getStatus();
            const diag = window.moduleInitializer.getDiagnostics();
            
            console.log(`⏰ Module initialization timeout reached after ${Math.round(elapsed/1000*10)/10}s`);
            console.log(`📊 Final status: ${status.initializedModules}/${status.totalModules} modules ready`);
            
            if (status.totalModules === 0) {
                console.log('ℹ️ No modules registered - initialization completed successfully');
            } else if (diag.unloadedModules.length > 0) {
                console.log(`⚠️ Unloaded modules: ${diag.unloadedModules.map(m => m.name).join(', ')}`);
            } else if (diag.loadingIssues.length > 0) {
                console.log(`⚠️ Modules with loading issues: ${diag.loadingIssues.map(m => m.name).join(', ')}`);
            } else {
                console.log('✅ Most modules ready - proceeding with initialization');
            }
        }
        
        triggerInitializationCallbacks(`timeout fallback after ${Math.round(elapsed/1000*10)/10}s`);
    }, 3000); // Extended to 3s since smart detection should catch most cases earlier
}