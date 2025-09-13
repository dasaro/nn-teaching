// ============================================================================
// MODULE INTERFACES - Standard interfaces for decoupled components
// Defines clean APIs that modules should use instead of direct global access
// ============================================================================

/**
 * Standard interfaces for neural network modules to prevent tight coupling
 * This file documents the expected interfaces for each module type.
 */

// ============================================================================
// NETWORK DATA INTERFACES
// ============================================================================

/**
 * INetworkReader - Interface for reading network state
 * Modules that need to READ network data should use these methods
 */
const INetworkReader = {
    // Architecture info
    getArchitecture: () => NetworkAPI.getArchitecture(),
    getStats: () => NetworkAPI.getStats(),
    
    // Weight access
    getWeight: (fromLayer, fromIndex, toLayer, toIndex) => NetworkAPI.getWeight(fromLayer, fromIndex, toLayer, toIndex),
    getLayerWeights: (fromLayer, toLayer) => NetworkAPI.getLayerWeights(fromLayer, toLayer),
    getWeightStats: (fromLayer, toLayer) => NetworkAPI.getWeightStats(fromLayer, toLayer),
    
    // Activation access
    getLayerActivations: (layer) => NetworkAPI.getLayerActivations(layer),
    getAllActivations: () => NetworkAPI.getAllActivations(),
    
    // Configuration
    getConfig: () => NetworkAPI.getConfig()
};

/**
 * INetworkWriter - Interface for modifying network state
 * Modules that need to WRITE network data should use these methods
 */
const INetworkWriter = {
    // Architecture changes
    setArchitecture: (hiddenLayerSizes) => NetworkAPI.setArchitecture(hiddenLayerSizes),
    resetToDefault: () => NetworkAPI.resetToDefault(),
    validateArchitecture: (hiddenLayerSizes) => NetworkAPI.validateArchitecture(hiddenLayerSizes),
    
    // Network operations
    forwardPropagate: (input, debug) => NetworkAPI.forwardPropagate(input, debug),
    backPropagate: (target, debug) => NetworkAPI.backPropagate(target, debug),
    
    // Configuration
    updateConfig: (config) => NetworkAPI.updateConfig(config)
};

// ============================================================================
// MODULE TYPE INTERFACES
// ============================================================================

/**
 * IVisualizationModule - Interface for visualization components
 * These modules display network state but should not modify it
 */
const IVisualizationModule = {
    extends: INetworkReader,
    
    // Standard methods all visualization modules should implement
    draw: () => { throw new Error('draw() method must be implemented'); },
    refresh: () => { throw new Error('refresh() method must be implemented'); },
    clear: () => { throw new Error('clear() method must be implemented'); },
    
    // Event handling
    onNetworkChange: (callback) => { throw new Error('onNetworkChange() method must be implemented'); }
};

/**
 * IAnimationModule - Interface for animation components
 * These modules orchestrate visual changes over time
 */
const IAnimationModule = {
    extends: INetworkReader,
    
    // Standard methods all animation modules should implement
    start: () => { throw new Error('start() method must be implemented'); },
    stop: () => { throw new Error('stop() method must be implemented'); },
    pause: () => { throw new Error('pause() method must be implemented'); },
    setSpeed: (speed) => { throw new Error('setSpeed() method must be implemented'); },
    
    // State queries
    isRunning: () => { throw new Error('isRunning() method must be implemented'); },
    getProgress: () => { throw new Error('getProgress() method must be implemented'); }
};

/**
 * ITrainingModule - Interface for training components
 * These modules modify network weights and state
 */
const ITrainingModule = {
    extends: INetworkWriter,
    
    // Standard methods all training modules should implement
    train: (input, target) => { throw new Error('train() method must be implemented'); },
    trainBatch: (batch) => { throw new Error('trainBatch() method must be implemented'); },
    reset: () => { throw new Error('reset() method must be implemented'); },
    
    // Training state
    getLoss: () => { throw new Error('getLoss() method must be implemented'); },
    getAccuracy: () => { throw new Error('getAccuracy() method must be implemented'); }
};

/**
 * IUtilityModule - Interface for utility components
 * These modules provide helper functions and should minimize network access
 */
const IUtilityModule = {
    // Utilities should primarily work with data passed to them
    // rather than directly accessing global state
    
    // Standard methods for processing data
    processData: (data) => { throw new Error('processData() method must be implemented'); },
    validateInput: (input) => { throw new Error('validateInput() method must be implemented'); }
};

// ============================================================================
// DEPENDENCY INJECTION HELPERS
// ============================================================================

/**
 * Creates a network reader dependency for modules that only need read access
 */
function createNetworkReader() {
    return {
        getArchitecture: NetworkAPI.getArchitecture,
        getWeight: NetworkAPI.getWeight,
        getLayerActivations: NetworkAPI.getLayerActivations,
        getAllActivations: NetworkAPI.getAllActivations,
        getConfig: NetworkAPI.getConfig,
        getStats: NetworkAPI.getStats,
        getLayerWeights: NetworkAPI.getLayerWeights,
        getWeightStats: NetworkAPI.getWeightStats
    };
}

/**
 * Creates a network writer dependency for modules that need write access
 */
function createNetworkWriter() {
    return {
        ...createNetworkReader(),
        setArchitecture: NetworkAPI.setArchitecture,
        forwardPropagate: NetworkAPI.forwardPropagate,
        backPropagate: NetworkAPI.backPropagate,
        updateConfig: NetworkAPI.updateConfig,
        resetToDefault: NetworkAPI.resetToDefault,
        validateArchitecture: NetworkAPI.validateArchitecture
    };
}

// ============================================================================
// LEGACY COMPATIBILITY LAYER
// ============================================================================

/**
 * Provides legacy-compatible accessors for gradual migration
 * These should be used temporarily while refactoring modules
 */
const LegacyCompat = {
    // Simulates old global access patterns for easier migration
    get networkConfig() {
        const arch = NetworkAPI.getArchitecture();
        const config = NetworkAPI.getConfig();
        return {
            inputSize: arch.inputSize,
            outputSize: arch.outputSize,
            hiddenSize: arch.hiddenSize,
            hiddenLayers: arch.hiddenLayers,
            learningRate: config.learningRate,
            maxHiddenLayers: config.maxHiddenLayers,
            maxNeuronsPerLayer: config.maxNeuronsPerLayer
        };
    },
    
    get weights() {
        return {
            inputToHidden: NetworkAPI.getLayerWeights('input', 'hidden'),
            hiddenToOutput: NetworkAPI.getLayerWeights('hidden', 'output')
        };
    },
    
    get activations() {
        return NetworkAPI.getAllActivations();
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') {
    window.ModuleInterfaces = {
        INetworkReader,
        INetworkWriter,
        IVisualizationModule,
        IAnimationModule,
        ITrainingModule,
        IUtilityModule,
        createNetworkReader,
        createNetworkWriter,
        LegacyCompat
    };
}

console.log('📋 Module Interfaces loaded - Clean APIs available');