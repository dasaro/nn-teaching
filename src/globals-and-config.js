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
    t: t,
    
    // UI utilities
    updateAutoScrollButtonText: updateAutoScrollButtonText
};

window.neuralMath = {
    // Activation functions
    sigmoid: sigmoid,
    sigmoidDerivative: sigmoidDerivative,
    leakyReLU: leakyReLU,
    leakyReLUDerivative: leakyReLUDerivative,
    tanhActivation: tanhActivation,
    tanhDerivative: tanhDerivative,
    softmax: softmax,
    
    // Utility functions
    calculateBinaryAccuracy: calculateBinaryAccuracy,
    calculateDatasetAccuracy: calculateDatasetAccuracy,
    
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
const networkConfig = {
    inputSize: 4, // 4 abstract feature patterns: [Pattern_A, Pattern_B, Pattern_C, Pattern_D]
    hiddenSize: 4, // Optimal size: enough capacity without overfitting
    outputSize: 2,  // dog/not-dog
    learningRate: 0.1 // Conservative learning rate for better generalization
};

// Network weights
let weights = {
    inputToHidden: [],
    hiddenToOutput: []
};

// Network activations
let activations = {
    input: [1.0, 1.0, 1.0, 1.0], // Will be updated with abstract patterns: [Pattern_A, Pattern_B, Pattern_C, Pattern_D]
    hidden: [0, 0, 0, 0], // 4 hidden neurons - optimal for this task
    output: [0, 0]
};

// Network positions for SVG drawing - optimized spacing with more vertical room
const positions = {
    input: [{x: 80, y: 60}, {x: 80, y: 140}, {x: 80, y: 220}, {x: 80, y: 300}],
    hidden: [
        {x: 280, y: 80}, {x: 280, y: 160}, {x: 280, y: 240}, {x: 280, y: 320}
    ],
    output: [{x: 480, y: 120}, {x: 480, y: 280}],
    prediction: {x: 650, y: 200} // New prediction column with more space
};

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
    updateExpertConfig: updateExpertConfig,
    resetExpertDefaults: resetExpertDefaults,
    applyExpertConfig: applyExpertConfig
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
    // Core drawing functions
    drawNetwork: drawNetwork,
    drawConnections: drawConnections,
    drawNeurons: drawNeurons,
    drawLabels: drawLabels,
    drawPrediction: drawPrediction,
    updatePrediction: updatePrediction,
    
    // Visual effects
    highlightSubNetwork: highlightSubNetwork,
    clearSubNetworkHighlights: clearSubNetworkHighlights,
    createFlowingDots: createFlowingDots,
    
    // Label management
    setTrueLabel: setTrueLabel,
    
    // Animation and state
    highlightSection: highlightSection,
    sleep: sleep,
    updateNeuronColors: updateNeuronColors,
    getActivationColor: getActivationColor,
    
    // Weight visualization
    resetWeights: resetWeights,
    applyWeightVisualization: applyWeightVisualization,
    addWeightTooltip: addWeightTooltip,
    getCurrentWeightForConnection: getCurrentWeightForConnection,
    refreshAllConnectionVisuals: refreshAllConnectionVisuals,
    
    // Weight editing
    toggleWeightSliders: toggleWeightSliders,
    showWeightSliders: showWeightSliders,
    createWeightEditingPanel: createWeightEditingPanel,
    createWeightControl: createWeightControl,
    highlightConnection: highlightConnection,
    updateWeight: updateWeight,
    updateConnectionTooltip: updateConnectionTooltip,
    updateConnectionAppearance: updateConnectionAppearance,
    recalculateNetwork: recalculateNetwork,
    hideWeightSliders: hideWeightSliders,
    
    // Debug and analysis
    debugFeatureRepresentation: debugFeatureRepresentation,
    checkValueDuplication: checkValueDuplication,
    calculateFeatureDiversity: calculateFeatureDiversity,
    predictActivationPatterns: predictActivationPatterns
};

window.animationEngine = {
    // Demo coordination
    startFullDemo: startFullDemo,
    startDemo: startDemo,
    resetDemo: resetDemo,
    
    // Animation sequences
    animateInputActivation: animateInputActivation,
    animateForwardPropagation: animateForwardPropagation,
    animateOutputComputation: animateOutputComputation,
    animateBackpropagation: animateBackpropagation,
    
    // Training animations
    startTrainingAnimation: startTrainingAnimation,
    updateTrainingAnimation: updateTrainingAnimation,
    stopTrainingAnimation: stopTrainingAnimation,
    trainToPerfection: trainToPerfection,
    trainWithHyperparams: trainWithHyperparams,
    debugTraining: debugTraining,
    
    // Testing and optimization
    testOptimalLearningSequence: testOptimalLearningSequence,
    createOptimalLearningSequence: createOptimalLearningSequence,
    runLearningTest: runLearningTest,
    initializeOptimalWeights: initializeOptimalWeights
};