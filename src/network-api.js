// ============================================================================
// NETWORK API - Clean abstraction layer for network access
// Decouples UI modules from internal network data structures
// ============================================================================

/**
 * Network API - Provides clean, stable interfaces for accessing network data
 * This abstraction layer prevents UI modules from directly accessing global state
 * and allows for easier refactoring of internal data structures.
 */

// ============================================================================
// NETWORK STRUCTURE ACCESS
// ============================================================================

/**
 * Get network architecture information
 * @returns {Object} Architecture details
 */
function getNetworkArchitecture() {
    return {
        inputSize: networkConfig.inputSize,
        outputSize: networkConfig.outputSize,
        hiddenLayers: [...networkConfig.hiddenLayers], // Defensive copy
        totalLayers: networkConfig.hiddenLayers.length + 2, // +2 for input and output layers
        
        // Backward compatibility
        hiddenSize: networkConfig.hiddenSize,
        hasHiddenLayers: networkConfig.hiddenLayers.length > 0
    };
}

/**
 * Get network statistics
 * @returns {Object} Network statistics
 */
function getNetworkStats() {
    // Calculate stats directly instead of relying on missing getNetworkInfo
    const { inputSize, outputSize, hiddenLayers } = networkConfig;
    
    // Calculate total connections/weights
    let totalWeights = 0;
    let totalNeurons = inputSize + outputSize;
    
    if (hiddenLayers.length === 0) {
        // Direct input -> output
        totalWeights = inputSize * outputSize;
    } else {
        // Input -> first hidden
        totalWeights += inputSize * hiddenLayers[0];
        totalNeurons += hiddenLayers[0];
        
        // Hidden -> hidden connections
        for (let i = 1; i < hiddenLayers.length; i++) {
            totalWeights += hiddenLayers[i-1] * hiddenLayers[i];
            totalNeurons += hiddenLayers[i];
        }
        
        // Last hidden -> output
        totalWeights += hiddenLayers[hiddenLayers.length - 1] * outputSize;
    }
    
    return {
        totalLayers: hiddenLayers.length + 2, // +2 for input and output layers
        totalWeights: totalWeights,
        totalNeurons: totalNeurons,
        parameters: totalWeights
    };
}

// ============================================================================
// WEIGHT ACCESS
// ============================================================================

/**
 * Get weight between two specific neurons
 * @param {string} fromLayer - 'input', 'hidden', or layer index
 * @param {number} fromIndex - Source neuron index
 * @param {string} toLayer - 'hidden', 'output', or layer index  
 * @param {number} toIndex - Target neuron index
 * @returns {number} Weight value
 */
function getWeight(fromLayer, fromIndex, toLayer, toIndex) {
    // Handle legacy layer names
    if (fromLayer === 'input' && toLayer === 'hidden') {
        if (weights.inputToHidden && weights.inputToHidden[toIndex] && 
            typeof weights.inputToHidden[toIndex][fromIndex] === 'number') {
            return weights.inputToHidden[toIndex][fromIndex];
        }
        return 0;
    }
    if (fromLayer === 'hidden' && toLayer === 'output') {
        if (weights.hiddenToOutput && weights.hiddenToOutput[toIndex] && 
            typeof weights.hiddenToOutput[toIndex][fromIndex] === 'number') {
            return weights.hiddenToOutput[toIndex][fromIndex];
        }
        return 0;
    }
    
    // Handle variable architecture with bounds checking
    if (typeof fromLayer === 'number' && typeof toLayer === 'number') {
        if (weights.layers && weights.layers[toLayer] && 
            weights.layers[toLayer][toIndex] && 
            typeof weights.layers[toLayer][toIndex][fromIndex] === 'number') {
            return weights.layers[toLayer][toIndex][fromIndex];
        }
    }
    
    return 0;
}

/**
 * Get all weights from one layer to another
 * @param {string} fromLayer - Source layer identifier
 * @param {string} toLayer - Target layer identifier
 * @returns {Array<Array<number>>} Weight matrix
 */
function getLayerWeights(fromLayer, toLayer) {
    if (fromLayer === 'input' && toLayer === 'hidden') {
        return weights.inputToHidden ? weights.inputToHidden.map(row => [...row]) : [];
    }
    if (fromLayer === 'hidden' && toLayer === 'output') {
        return weights.hiddenToOutput ? weights.hiddenToOutput.map(row => [...row]) : [];
    }
    return [];
}

/**
 * Get weight statistics for a layer connection
 * @param {string} fromLayer - Source layer
 * @param {string} toLayer - Target layer
 * @returns {Object} Weight statistics
 */
function getWeightStats(fromLayer, toLayer) {
    const weightMatrix = getLayerWeights(fromLayer, toLayer);
    if (weightMatrix.length === 0) return { min: 0, max: 0, mean: 0, std: 0 };
    
    const allWeights = weightMatrix.flat();
    const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
    const variance = allWeights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / allWeights.length;
    
    return {
        min: Math.min(...allWeights),
        max: Math.max(...allWeights),
        mean: mean,
        std: Math.sqrt(variance),
        count: allWeights.length
    };
}

// ============================================================================
// ACTIVATION ACCESS
// ============================================================================

/**
 * Get current activations for a layer
 * @param {string} layer - 'input', 'hidden', 'output', or layer index
 * @returns {Array<number>} Layer activations
 */
function getLayerActivations(layer) {
    switch (layer) {
        case 'input':
            return activations.input ? [...activations.input] : [];
        case 'hidden':
            return activations.hidden ? [...activations.hidden] : [];
        case 'output':
            return activations.output ? [...activations.output] : [];
        default:
            // Handle variable architecture
            if (typeof layer === 'number' && activations.hiddenLayers && activations.hiddenLayers[layer]) {
                return [...activations.hiddenLayers[layer]];
            }
            return [];
    }
}

/**
 * Get all network activations
 * @returns {Object} All current activations
 */
function getAllActivations() {
    return {
        input: getLayerActivations('input'),
        hidden: getLayerActivations('hidden'),
        hiddenLayers: activations.hiddenLayers ? activations.hiddenLayers.map(layer => [...layer]) : [],
        output: getLayerActivations('output')
    };
}

// ============================================================================
// NETWORK OPERATIONS
// ============================================================================

/**
 * Perform forward propagation with given input
 * @param {Array<number>} input - Input values
 * @param {boolean} debugMode - Enable debug output
 * @returns {Array<number>} Output activations
 */
function forwardPropagate(input, debugMode = false) {
    return forwardPropagationSilent(input, debugMode);
}

/**
 * Perform backpropagation with given target
 * @param {Array<number>} target - Target values
 * @param {boolean} debugMode - Enable debug output
 */
function backPropagate(target, debugMode = false) {
    backpropagationSilent(target, debugMode);
}

/**
 * Get network configuration parameters
 * @returns {Object} Configuration parameters
 */
function getNetworkConfig() {
    return {
        learningRate: networkConfig.learningRate,
        inputSize: networkConfig.inputSize,
        outputSize: networkConfig.outputSize,
        hiddenLayers: [...networkConfig.hiddenLayers],
        maxHiddenLayers: networkConfig.maxHiddenLayers,
        maxNeuronsPerLayer: networkConfig.maxNeuronsPerLayer
    };
}

/**
 * Update network configuration
 * @param {Object} config - Configuration updates
 */
function updateNetworkConfig(config) {
    if (config.learningRate !== undefined) {
        networkConfig.learningRate = config.learningRate;
    }
    // Add other safe config updates as needed
}

// ============================================================================
// ARCHITECTURE MANAGEMENT
// ============================================================================

/**
 * Set new network architecture
 * @param {Array<number>} hiddenLayerSizes - Sizes of hidden layers
 */
function setArchitecture(hiddenLayerSizes) {
    setNetworkArchitecture(hiddenLayerSizes);
    initializeNetworkStructure();
}

/**
 * Reset network to default architecture
 */
function resetToDefaultArchitecture() {
    setArchitecture([4]); // Default single hidden layer with 4 neurons
}

/**
 * Check if architecture change is valid
 * @param {Array<number>} hiddenLayerSizes - Proposed architecture
 * @returns {Object} Validation result
 */
function validateArchitecture(hiddenLayerSizes) {
    try {
        if (!Array.isArray(hiddenLayerSizes)) {
            return { valid: false, error: 'Architecture must be an array' };
        }
        
        if (hiddenLayerSizes.length > networkConfig.maxHiddenLayers) {
            return { valid: false, error: `Cannot exceed ${networkConfig.maxHiddenLayers} hidden layers` };
        }
        
        for (const size of hiddenLayerSizes) {
            if (size <= 0 || size > networkConfig.maxNeuronsPerLayer) {
                return { valid: false, error: `Layer size must be 1-${networkConfig.maxNeuronsPerLayer}` };
            }
        }
        
        return { valid: true };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export to global scope for module access
if (typeof window !== 'undefined') {
    window.NetworkAPI = {
        // Architecture
        getArchitecture: getNetworkArchitecture,
        getStats: getNetworkStats,
        setArchitecture: setArchitecture,
        resetToDefault: resetToDefaultArchitecture,
        validateArchitecture: validateArchitecture,
        
        // Weights
        getWeight: getWeight,
        getLayerWeights: getLayerWeights,
        getWeightStats: getWeightStats,
        
        // Activations  
        getLayerActivations: getLayerActivations,
        getAllActivations: getAllActivations,
        
        // Operations
        forwardPropagate: forwardPropagate,
        backPropagate: backPropagate,
        
        // Configuration
        getConfig: getNetworkConfig,
        updateConfig: updateNetworkConfig
    };
}

console.log('📡 Network API module loaded - Abstraction layer ready');

// Report to module initialization system
if (typeof window !== 'undefined' && window.moduleLoaded) {
    window.moduleLoaded('network-api');
}