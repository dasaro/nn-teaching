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
            console.warn(`⚠️ Unknown module marked as loaded: ${name}`);
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

// Auto-register core modules
if (typeof window !== 'undefined') {
    // Register modules in dependency order
    window.registerModule('i18n-utils', []);
    window.registerModule('image-data', []);
    window.registerModule('real-image-data', []);
    window.registerModule('globals-and-config', ['i18n-utils']);
    window.registerModule('network-api', ['globals-and-config']);
    window.registerModule('neural-math', ['globals-and-config']);
    window.registerModule('utilities', ['globals-and-config', 'network-api']);
    window.registerModule('network-visualizer', ['globals-and-config', 'network-api']);
    window.registerModule('animation-engine', ['globals-and-config', 'network-api', 'neural-math']);
    window.registerModule('ui-controls', ['globals-and-config', 'network-api']);
    window.registerModule('training-engine', ['globals-and-config', 'network-api', 'neural-math']);
    window.registerModule('image-processor', ['globals-and-config', 'image-data']);
    window.registerModule('neuron-hover', ['globals-and-config', 'network-api', 'i18n-utils']);
    window.registerModule('activation-visualizer', ['i18n-utils']);
    window.registerModule('bootstrap', ['globals-and-config', 'network-api', 'neural-math'], () => {
        // Bootstrap initialization
        if (typeof initializeNetwork === 'function') {
            initializeNetwork();
        }
        if (typeof initializeModuleExports === 'function') {
            initializeModuleExports();
        }
    });
}