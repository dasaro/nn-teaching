// ============================================================================
// GLOBAL VARIABLES AND CONFIGURATION
// Extracted from script.js - preserving exact content and structure
// ============================================================================

// ============================================================================
// GLOBAL STATE VARIABLES
// ============================================================================
let animationSpeed = 5;
let isAnimating = false;
let trueLabel = null; // 'dog' or 'not-dog'
let currentImage = 'dog1';
let debugConsoleVisible = false;
let currentConsoleTab = 'weights';
let gradientHistory = [];

// Flag to prevent auto-labeling during restoration
let preventAutoLabeling = false;

// Expert view mode for detailed mathematical explanations
let expertViewMode = false;

// Message accumulation system (works for both student and expert modes)
let messageLog = [];
let messageLogActive = false;

// Auto-scroll functionality (enabled by default)
let autoScrollEnabled = true;

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Listen for language changes and update dynamic content
document.addEventListener('languageChanged', function(event) {
    // Update document title
    document.title = t('document.title');
    
    // Update view mode indicator when language changes
    const indicator = document.getElementById('viewModeIndicator');
    if (indicator) {
        indicator.textContent = expertViewMode ? t('system.viewMode.expert') : t('system.viewMode.student');
    }
    
    // Update current step message if it's the default ready message
    const currentStep = document.getElementById('currentStep');
    if (currentStep && (currentStep.textContent.includes('Ready!') || currentStep.textContent.includes('Pronto!'))) {
        currentStep.textContent = t('system.ready');
    }
    
    // Update auto-scroll button text
    updateAutoScrollButtonText();
    
    console.log(`🌐 Dynamic content updated for language: ${event.detail.language}`);
});

// Function to update auto-scroll button text
function updateAutoScrollButtonText() {
    const autoScrollBtn = document.querySelector('button[onclick="toggleAutoScroll()"]');
    if (autoScrollBtn && window.i18n) {
        autoScrollBtn.textContent = autoScrollEnabled ? window.i18n.t('system.autoScrollOn') : window.i18n.t('system.autoScrollOff');
        autoScrollBtn.title = autoScrollEnabled ? window.i18n.t('system.autoScrollDisable') : window.i18n.t('system.autoScrollEnable');
    }
}

// ============================================================================
// WINDOW OBJECT ASSIGNMENTS - MODULE INTERFACES
// ============================================================================

window.coreSystem = {
    // Global state
    get animationSpeed() { return animationSpeed; },
    set animationSpeed(value) { animationSpeed = value; },
    get isAnimating() { return isAnimating; },
    set isAnimating(value) { isAnimating = value; },
    get trueLabel() { return trueLabel; },
    set trueLabel(value) { trueLabel = value; },
    get currentImage() { return currentImage; },
    set currentImage(value) { currentImage = value; },
    get debugConsoleVisible() { return debugConsoleVisible; },
    set debugConsoleVisible(value) { debugConsoleVisible = value; },
    get currentConsoleTab() { return currentConsoleTab; },
    set currentConsoleTab(value) { currentConsoleTab = value; },
    get gradientHistory() { return gradientHistory; },
    set gradientHistory(value) { gradientHistory = value; },
    get preventAutoLabeling() { return preventAutoLabeling; },
    set preventAutoLabeling(value) { preventAutoLabeling = value; },
    get expertViewMode() { return expertViewMode; },
    set expertViewMode(value) { expertViewMode = value; },
    get messageLog() { return messageLog; },
    set messageLog(value) { messageLog = value; },
    get messageLogActive() { return messageLogActive; },
    set messageLogActive(value) { messageLogActive = value; },
    get autoScrollEnabled() { return autoScrollEnabled; },
    set autoScrollEnabled(value) { autoScrollEnabled = value; },
    
    // Internationalization
    t: (key, replacements = []) => window.i18n && window.i18n.t ? window.i18n.t(key, replacements) : key,
    
    // UI utilities
    updateAutoScrollButtonText: updateAutoScrollButtonText
};

// Initialize neuralMath object - functions will be populated later
window.neuralMath = {
    // Activation functions (populated after neural-math.js loads)
    sigmoid: null,
    sigmoidDerivative: null,
    leakyReLU: null,
    leakyReLUDerivative: null,
    tanhActivation: null,
    tanhDerivative: null,
    softmax: null,
    
    // Utility functions (populated after neural-math.js loads)
    calculateBinaryAccuracy: null,
    calculateDatasetAccuracy: null,
    
    // Propagation algorithms (defined later in file - lines 3767+)
    forwardPropagationSilent: null,
    backpropagationSilent: null,
    initializeMomentum: null,
    
    // Training and analysis functions (defined later - lines 4140+)
    analyzeConvergence: null,
    detectConvergenceIssues: null,
    checkPredictionDiversity: null,
    generateSimpleTrainingData: null,
    advancedBackpropagation: null,
    adaptLearningRate: null,
    applyAntiStagnationMeasures: null,
    applyConvergenceBoost: null,
    backpropagationWithMomentum: null,
    
    // Testing functions (defined later - lines 5473+)
    testDeadNeuronPrevention: null,
    testGeneralization: null,
    testWeightInitialization: null,
    runComprehensiveTests: null,
    test100PercentAccuracy: null,
    testBackAndForthLearning: null,
    testSimplifiedNetwork: null,
    simpleBinaryForward: null,
    simpleBinaryBackward: null,
    testSimpleBinaryAccuracy: null,
    testAccuracy: null,
    
    // Debug functions (defined later - lines 4022+)
    debugWeightChanges: null,
    enableConvergenceAnalysis: null,
    enableDeepDebugging: null,
    updateLastWeights: null,
    showWeightChanges: null
};

// ============================================================================
// EXPERT CONFIGURATION
// ============================================================================

// Expert-configurable parameters
const expertConfig = {
    // Activation functions
    hiddenActivation: 'leaky_relu', // 'leaky_relu', 'sigmoid', 'tanh'
    outputActivation: 'softmax',    // 'softmax', 'sigmoid'
    
    // Training parameters
    learningRate: 0.1,
    momentum: 0.0,
    l2Regularization: 0.0,
    
    // Network architecture (read-only for stability)
    inputSize: 4,
    hiddenSize: 4,
    outputSize: 2,
    
    // Activation function parameters
    leakyReLUAlpha: 0.1,
    
    // Training behavior
    adaptiveLearningRate: false,
    batchSize: 1, // For future batch training
    maxEpochs: 100,
};

// Expert panel state
let expertPanelVisible = false;

// ============================================================================
// NETWORK CONFIGURATION
// ============================================================================

// Network structure optimized for stable learning - VISUAL FEATURES
// Network configuration with variable layer support (0-3 hidden layers, max 8 neurons each)
const networkConfig = {
    inputSize: 4, // 4 abstract feature patterns: [Pattern_A, Pattern_B, Pattern_C, Pattern_D]
    outputSize: 2,  // dog/not-dog
    learningRate: 0.1, // Conservative learning rate for better generalization
    
    // Variable hidden layer architecture
    hiddenLayers: [4], // Array of hidden layer sizes. Examples:
                       // [] = no hidden layers (direct input->output)
                       // [4] = 1 hidden layer with 4 neurons (current)
                       // [6, 3] = 2 hidden layers with 6 and 3 neurons
                       // [8, 6, 4] = 3 hidden layers with 8, 6, and 4 neurons
    
    // Constraints
    maxHiddenLayers: 3,
    maxNeuronsPerLayer: 8,
    
    // Backward compatibility
    get hiddenSize() { 
        return this.hiddenLayers.length > 0 ? this.hiddenLayers[0] : 0; 
    },
    set hiddenSize(value) {
        this.hiddenLayers = value > 0 ? [value] : [];
    }
};

// Network weights - supports variable layer architecture
let weights = {
    // For backward compatibility, maintain these properties but make them dynamic
    get inputToHidden() { 
        return this.layers.length > 0 ? this.layers[0] : []; 
    },
    set inputToHidden(value) { 
        if (this.layers.length > 0) this.layers[0] = value; 
    },
    get hiddenToOutput() { 
        return this.layers.length > 0 ? this.layers[this.layers.length - 1] : []; 
    },
    set hiddenToOutput(value) { 
        if (this.layers.length > 0) this.layers[this.layers.length - 1] = value; 
    },
    
    // New structure: array of weight matrices between each layer pair
    layers: [] // Will be initialized based on networkConfig.hiddenLayers
    // layers[0] = input -> first hidden (or output if no hidden)
    // layers[1] = first hidden -> second hidden
    // layers[n] = last hidden -> output
};

// Network activations - supports variable layer architecture  
let activations = {
    input: [1.0, 1.0, 1.0, 1.0], // Will be updated with abstract patterns: [Pattern_A, Pattern_B, Pattern_C, Pattern_D]
    output: [0, 0],
    
    // For backward compatibility
    get hidden() { 
        return this.hiddenLayers.length > 0 ? this.hiddenLayers[0] : []; 
    },
    set hidden(value) { 
        if (this.hiddenLayers.length > 0) this.hiddenLayers[0] = value; 
    },
    
    // New structure: array of hidden layer activations
    hiddenLayers: [] // Will be initialized based on networkConfig.hiddenLayers
};

// ============================================================================
// VARIABLE LAYER ARCHITECTURE UTILITIES
// ============================================================================

// Initialize network structure based on current configuration
function initializeNetworkStructure() {
    const { inputSize, outputSize, hiddenLayers } = networkConfig;
    
    console.log(`🧠 Initializing network: ${inputSize} → [${hiddenLayers.join(', ')}] → ${outputSize}`);
    
    // Initialize hidden layer activations
    activations.hiddenLayers = hiddenLayers.map(size => new Array(size).fill(0));
    
    // Initialize weight matrices between each layer pair
    weights.layers = [];
    
    if (hiddenLayers.length === 0) {
        // Direct input -> output connection (no hidden layers)
        weights.layers[0] = initializeWeightMatrix(outputSize, inputSize);
    } else {
        // Input -> first hidden layer
        weights.layers[0] = initializeWeightMatrix(hiddenLayers[0], inputSize);
        
        // Hidden layer -> hidden layer connections
        for (let i = 1; i < hiddenLayers.length; i++) {
            weights.layers[i] = initializeWeightMatrix(hiddenLayers[i], hiddenLayers[i-1]);
        }
        
        // Last hidden layer -> output
        weights.layers[hiddenLayers.length] = initializeWeightMatrix(outputSize, hiddenLayers[hiddenLayers.length - 1]);
    }
    
    // Backward compatibility: maintain old weight structure references for UI
    if (networkConfig.hiddenLayers.length > 0) {
        // First hidden layer weights (input -> first hidden)
        weights.inputToHidden = weights.layers[0];
        
        // Last hidden layer to output weights
        const outputLayerIndex = networkConfig.hiddenLayers.length;
        weights.hiddenToOutput = weights.layers[outputLayerIndex];
    } else {
        // No hidden layers: direct input to output
        weights.inputToHidden = null;
        weights.hiddenToOutput = weights.layers[0]; // Direct input->output connection
    }
    
    console.log(`✅ Network structure initialized with ${weights.layers.length} weight matrices`);
}

// Initialize a weight matrix with random values
function initializeWeightMatrix(outputSize, inputSize) {
    const matrix = [];
    for (let i = 0; i < outputSize; i++) {
        matrix[i] = [];
        for (let j = 0; j < inputSize; j++) {
            // Xavier/Glorot initialization for better training stability
            const limit = Math.sqrt(6 / (inputSize + outputSize));
            matrix[i][j] = (Math.random() * 2 - 1) * limit;
        }
    }
    return matrix;
}

// Validate and set new network architecture
function setNetworkArchitecture(hiddenLayerSizes) {
    // Validate constraints - access properties directly to avoid temporal dead zone
    if (hiddenLayerSizes.length > networkConfig.maxHiddenLayers) {
        throw new Error(`Maximum ${networkConfig.maxHiddenLayers} hidden layers allowed`);
    }
    
    for (const size of hiddenLayerSizes) {
        if (size > networkConfig.maxNeuronsPerLayer || size < 1) {
            throw new Error(`Each hidden layer must have 1-${networkConfig.maxNeuronsPerLayer} neurons`);
        }
    }
    
    // Update configuration
    networkConfig.hiddenLayers = [...hiddenLayerSizes];
    
    // Reset activations structure to match new architecture
    activations.hiddenLayers = hiddenLayerSizes.map(layerSize => new Array(layerSize).fill(0));
    
    // Reinitialize network structure
    initializeNetworkStructure();
    
    console.log(`🔄 Network architecture updated to: [${hiddenLayerSizes.join(', ')}]`);
}

// Get current network architecture info
function getNetworkInfo() {
    const { inputSize, outputSize, hiddenLayers } = networkConfig;
    
    // Calculate total neurons and weights
    let totalNeurons = inputSize + outputSize;
    let totalWeights = 0;
    
    // Add hidden layer neurons
    hiddenLayers.forEach(size => totalNeurons += size);
    
    // Calculate weights safely
    if (weights.layers && weights.layers.length > 0) {
        totalWeights = weights.layers.reduce((sum, matrix) => {
            if (matrix && matrix.length > 0 && matrix[0] && matrix[0].length > 0) {
                return sum + matrix.length * matrix[0].length;
            }
            return sum;
        }, 0);
    } else {
        // Fallback calculation if weights not initialized
        if (hiddenLayers.length === 0) {
            totalWeights = inputSize * outputSize;
        } else {
            totalWeights += inputSize * hiddenLayers[0];
            for (let i = 1; i < hiddenLayers.length; i++) {
                totalWeights += hiddenLayers[i-1] * hiddenLayers[i];
            }
            totalWeights += hiddenLayers[hiddenLayers.length - 1] * outputSize;
        }
    }
    
    return {
        inputSize,
        hiddenLayers: [...hiddenLayers],
        outputSize,
        totalLayers: hiddenLayers.length + 2, // +2 for input and output
        totalNeurons: totalNeurons,
        totalWeights: totalWeights,
        totalConnections: totalWeights // Alias for backward compatibility
    };
}

// Note: Network positions are now dynamically calculated in network-visualizer.js
// This allows for flexible architectures with variable hidden layers

// Image URLs for different image types
// Note: These file URLs don't work due to CORS restrictions
// The actual image data is now handled by src/image-data.js module
const imageUrls = {
    dog1: 'images/dog1.jpg',
    dog2: 'images/dog2.jpg', 
    dog3: 'images/dog3.jpg',
    cat: 'images/cat.jpg',
    bird: 'images/bird.jpg',
    fish: 'images/fish.jpg',
    car: 'images/car.jpg',
    tree: 'images/tree.jpg'
};

// Tutorial related globals
let tutorialStep = 0;
let tutorialActive = false;
const tutorialSteps = [
    'Welcome to the Neural Network Visualization!',
    'Click on different images to see how the network processes them.',
    'Watch the demo to see forward propagation in action.',
    'Try training the network to see how it learns!',
    'Explore the expert panel for advanced features.'
];

// Performance metrics
let performanceMetrics = {
    accuracy: 0,
    loss: 0,
    epoch: 0,
    learningRate: 0.1,
    momentum: 0,
    totalTrainingExamples: 0,
    correctPredictions: 0,
    trainingTime: 0,
    lastUpdated: Date.now(),
    convergenceHistory: [],
    lossHistory: [],
    accuracyHistory: []
};

// Demo state
let demoState = {
    isRunning: false,
    currentStep: 'ready',
    stepProgress: 0,
    totalSteps: 5
};

// Weight sliders state
let weightSlidersActive = false;
let weightSliderElements = {};

// Momentum for training
let momentum = {
    inputToHidden: [],
    hiddenToOutput: []
};

// Weight changes tracking  
let weightChanges = {
    inputToHidden: [],
    hiddenToOutput: []
};

// Convergence analysis
let convergenceAnalysis = {
    enabled: false,
    history: [],
    currentLoss: null,
    improvementThreshold: 0.001,
    stagnationCount: 0
};

// ============================================================================
// ADDITIONAL WINDOW ASSIGNMENTS
// ============================================================================

window.networkConfig = {
    // Configuration object
    expertConfig: expertConfig,
    
    // Configuration functions
    getActivationFunction: getActivationFunction,
    getActivationDerivative: getActivationDerivative,
    syncExpertConfigToLegacy: syncExpertConfigToLegacy,
    updateExpertConfig: null, // populated after ui-controls.js loads
    resetExpertDefaults: resetExpertDefaults,
    applyExpertConfig: applyExpertConfig,
    
    // Variable architecture functions
    setNetworkArchitecture: setNetworkArchitecture,
    initializeNetworkStructure: initializeNetworkStructure,
    getNetworkInfo: getNetworkInfo
};

window.uiControls = {
    // Global state access
    get expertPanelVisible() { return expertPanelVisible; },
    set expertPanelVisible(value) { expertPanelVisible = value; },
    
    // Panel management
    toggleExpertPanel: toggleExpertPanel,
    openExpertPanel: openExpertPanel,
    closeExpertPanel: closeExpertPanel,
    initializeExpertPanelUI: initializeExpertPanelUI,
    
    // Configuration management
    updateExpertConfig: updateExpertConfig,
    resetExpertDefaults: resetExpertDefaults,
    applyExpertConfig: applyExpertConfig,
    toggleExpertViewMode: toggleExpertViewMode,
    
    // Message log system
    updateStepInfoDual: updateStepInfoDual,
    startMessageLog: startMessageLog,
    stopMessageLog: stopMessageLog,
    displayMessageLog: displayMessageLog,
    formatMatrix: formatMatrix,
    formatOperation: formatOperation,
    clearMessageLog: clearMessageLog,
    toggleAutoScroll: toggleAutoScroll,
    scrollToBottom: scrollToBottom,
    
    // Debug console
    updateDebugConsole: updateDebugConsole,
    displayWeightMatrices: displayWeightMatrices,
    displayActivations: displayActivations,
    displayGradients: displayGradients,
    displayPerformanceMetrics: displayPerformanceMetrics,
    updatePerformanceDisplays: updatePerformanceDisplays,
    
    // Quick test functions
    quickAccuracyTest: quickAccuracyTest,
    
    // Tutorial system (defined later)
    startTutorial: null,
    showTutorialStep: null,
    nextTutorialStep: null,
    skipTutorial: null,
    completeTutorial: null
};

window.imageProcessor = {
    // Image creation and management
    setVisualFeaturesAndLabel: setVisualFeaturesAndLabel,
    createImage: createImage,
    getImageColor: getImageColor,
    getImageEmoji: getImageEmoji,
    
    // Drawing functions
    drawDog1: drawDog1,
    drawDog2: drawDog2,
    drawDog3: drawDog3,
    drawCat: drawCat,
    drawCar: drawCar,
    drawBird: drawBird,
    drawFish: drawFish,
    drawTree: drawTree,
    
    // Input handling
    updateInputActivations: updateInputActivations,
    selectImage: selectImage,
    
    // UI utilities
    updateAutoScrollButtonText: updateAutoScrollButtonText,
    
    // Pixel viewer functionality (defined later)
    openPixelViewer: null,
    closePixelViewer: null,
    drawOriginalImage: null,
    addImageHoverEffects: null,
    highlightCorrespondingPixel: null,
    showImageAreaOverlay: null,
    extractPixelValues: null,
    drawInteractivePixelGrid: null,
    handlePixelClick: null,
    handlePixelHover: null,
    highlightPixelInGrid: null,
    highlightCorrespondingImageArea: null,
    updatePixelInfo: null,
    clearAllHighlights: null,
    drawInputNeuronVisualization: null,
    highlightInputNeuron: null,
    drawPixelGrid: null,
    drawNumberGrid: null,
    displayAIInputNumbers: null,
    updatePatternValues: null,
    highlightPixelRegions: null,
    highlightPatternInOriginalImage: null,
    clearHighlight: null
};

window.networkVisualizer = {
    // Core drawing functions (safe references)
    drawNetwork: () => typeof drawNetwork !== 'undefined' && drawNetwork(),
    drawConnections: () => typeof drawConnections !== 'undefined' && drawConnections(),
    drawNeurons: () => typeof drawNeurons !== 'undefined' && drawNeurons(),
    drawLabels: () => typeof drawLabels !== 'undefined' && drawLabels(),
    drawPrediction: () => typeof drawPrediction !== 'undefined' && drawPrediction(),
    updatePrediction: () => typeof updatePrediction !== 'undefined' && updatePrediction(),
    
    // Visual effects (safe references)
    highlightSubNetwork: (...args) => typeof highlightSubNetwork !== 'undefined' && highlightSubNetwork(...args),
    clearSubNetworkHighlights: () => typeof clearSubNetworkHighlights !== 'undefined' && clearSubNetworkHighlights(),
    createFlowingDots: (...args) => typeof createFlowingDots !== 'undefined' && createFlowingDots(...args),
    
    // Label management (safe reference)
    setTrueLabel: (label) => typeof setTrueLabel !== 'undefined' && setTrueLabel(label),
    
    // Animation and state (safe references)
    highlightSection: (section) => typeof highlightSection !== 'undefined' && highlightSection(section),
    sleep: (ms) => typeof sleep !== 'undefined' ? sleep(ms) : new Promise(resolve => setTimeout(resolve, ms)),
    updateNeuronColors: () => typeof updateNeuronColors !== 'undefined' && updateNeuronColors(),
    getActivationColor: (activation) => typeof getActivationColor !== 'undefined' ? getActivationColor(activation) : '#ccc',
    
    // Weight visualization (safe references)
    resetWeights: () => typeof resetWeights !== 'undefined' && resetWeights(),
    applyWeightVisualization: (...args) => typeof applyWeightVisualization !== 'undefined' && applyWeightVisualization(...args),
    addWeightTooltip: (...args) => typeof addWeightTooltip !== 'undefined' && addWeightTooltip(...args),
    getCurrentWeightForConnection: (label) => typeof getCurrentWeightForConnection !== 'undefined' ? getCurrentWeightForConnection(label) : 0,
    refreshAllConnectionVisuals: () => typeof refreshAllConnectionVisuals !== 'undefined' && refreshAllConnectionVisuals(),
    
    // Weight editing (safe references)
    toggleWeightSliders: () => typeof toggleWeightSliders !== 'undefined' && toggleWeightSliders(),
    showWeightSliders: () => typeof showWeightSliders !== 'undefined' && showWeightSliders(),
    createWeightEditingPanel: (...args) => typeof createWeightEditingPanel !== 'undefined' && createWeightEditingPanel(...args),
    createWeightControl: (...args) => typeof createWeightControl !== 'undefined' && createWeightControl(...args),
    highlightConnection: (...args) => typeof highlightConnection !== 'undefined' && highlightConnection(...args),
    updateWeight: (...args) => typeof updateWeight !== 'undefined' && updateWeight(...args),
    updateConnectionTooltip: (...args) => typeof updateConnectionTooltip !== 'undefined' && updateConnectionTooltip(...args),
    updateConnectionAppearance: (...args) => typeof updateConnectionAppearance !== 'undefined' && updateConnectionAppearance(...args),
    recalculateNetwork: () => typeof recalculateNetwork !== 'undefined' && recalculateNetwork(),
    hideWeightSliders: () => typeof hideWeightSliders !== 'undefined' && hideWeightSliders(),
    
    // Debug and analysis (safe references)
    debugFeatureRepresentation: (...args) => typeof debugFeatureRepresentation !== 'undefined' && debugFeatureRepresentation(...args),
    checkValueDuplication: (...args) => typeof checkValueDuplication !== 'undefined' && checkValueDuplication(...args),
    calculateFeatureDiversity: (...args) => typeof calculateFeatureDiversity !== 'undefined' && calculateFeatureDiversity(...args),
    predictActivationPatterns: (...args) => typeof predictActivationPatterns !== 'undefined' && predictActivationPatterns(...args)
};

window.animationEngine = {
    // Demo coordination (safe references)
    startFullDemo: () => typeof startFullDemo !== 'undefined' && startFullDemo(),
    startDemo: () => typeof startDemo !== 'undefined' && startDemo(),
    resetDemo: () => typeof resetDemo !== 'undefined' && resetDemo(),
    
    // Animation sequences (safe references)
    animateInputActivation: (...args) => typeof animateInputActivation !== 'undefined' && animateInputActivation(...args),
    animateForwardPropagation: (...args) => typeof animateForwardPropagation !== 'undefined' && animateForwardPropagation(...args),
    animateOutputComputation: (...args) => typeof animateOutputComputation !== 'undefined' && animateOutputComputation(...args),
    animateBackpropagation: (...args) => typeof animateBackpropagation !== 'undefined' && animateBackpropagation(...args),
    
    // Training animations (safe references)
    startTrainingAnimation: (...args) => typeof startTrainingAnimation !== 'undefined' && startTrainingAnimation(...args),
    updateTrainingAnimation: (...args) => typeof updateTrainingAnimation !== 'undefined' && updateTrainingAnimation(...args),
    stopTrainingAnimation: () => typeof stopTrainingAnimation !== 'undefined' && stopTrainingAnimation(),
    trainToPerfection: (...args) => typeof trainToPerfection !== 'undefined' && trainToPerfection(...args),
    trainWithHyperparams: (...args) => typeof trainWithHyperparams !== 'undefined' && trainWithHyperparams(...args),
    debugTraining: (...args) => typeof debugTraining !== 'undefined' && debugTraining(...args),
    
    // Testing and optimization (safe references)
    testOptimalLearningSequence: (...args) => typeof testOptimalLearningSequence !== 'undefined' && testOptimalLearningSequence(...args),
    createOptimalLearningSequence: (...args) => typeof createOptimalLearningSequence !== 'undefined' && createOptimalLearningSequence(...args),
    runLearningTest: (...args) => typeof runLearningTest !== 'undefined' && runLearningTest(...args),
    initializeOptimalWeights: () => typeof initializeOptimalWeights !== 'undefined' && initializeOptimalWeights()
};