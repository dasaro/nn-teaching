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

// Auto-register core modules with fallback loading detection
if (typeof window !== 'undefined') {
    // Simpler approach - just use a timeout fallback to start the app
    setTimeout(() => {
        console.log('🎉 Module initialization timeout - starting app anyway');
        
        // Trigger any waiting callbacks
        if (window.moduleInitializer && window.moduleInitializer.initCallbacks) {
            window.moduleInitializer.initCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (error) {
                    console.error('❌ Error in delayed init callback:', error);
                }
            });
            window.moduleInitializer.initCallbacks = [];
        }
    }, 2000); // 2 second fallback
}