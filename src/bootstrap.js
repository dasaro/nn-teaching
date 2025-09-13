// ============================================================================
// BOOTSTRAP - APPLICATION INITIALIZATION
// Contains the DOMContentLoaded listener and initializeNetwork function
// ============================================================================

// Initialize network with properly scaled random weights
function initializeNetwork() {
    // Very small random weights to prevent bias
    const scale = 0.1; // Much smaller weights
    
    console.log('🔧 ===== NETWORK INITIALIZATION DEBUG =====');
    console.log(`🎲 Random seed check: ${Math.random().toFixed(6)}, ${Math.random().toFixed(6)}, ${Math.random().toFixed(6)}`);
    
    weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
        Array.from({length: networkConfig.inputSize}, () => 
            (Math.random() * 2 - 1) * scale)
    );
    
    // Initialize output weights even smaller and with slight bias toward balanced prediction
    weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, (_, i) =>
        Array.from({length: networkConfig.hiddenSize}, () => 
            (Math.random() * 2 - 1) * scale * 0.5) // Even smaller output weights
    );
    
    // DEBUG: Detailed weight analysis
    debugWeightInitialization();
    
    console.log('✅ Network initialized with small random weights for stable learning');
    console.log('🔧 ==========================================');
    
    // Make new weights visible immediately (if network is already drawn)
    if (document.getElementById('networkSvg').children.length > 0) {
        refreshAllConnectionVisuals();
    }
}

if (typeof window !== 'undefined') window.initializeNetwork = initializeNetwork;

// Initialize module exports - update window objects with late-bound functions
function initializeModuleExports() {
    // Update neural math exports with functions defined later in the file
    if (window.neuralMath) {
        window.neuralMath.forwardPropagationSilent = forwardPropagationSilent;
        window.neuralMath.backpropagationSilent = backpropagationSilent;
        window.neuralMath.initializeMomentum = initializeMomentum;
        window.neuralMath.analyzeConvergence = analyzeConvergence;
        window.neuralMath.detectConvergenceIssues = detectConvergenceIssues;
        window.neuralMath.checkPredictionDiversity = checkPredictionDiversity;
        window.neuralMath.generateSimpleTrainingData = generateSimpleTrainingData;
        window.neuralMath.advancedBackpropagation = advancedBackpropagation;
        window.neuralMath.adaptLearningRate = adaptLearningRate;
        window.neuralMath.applyAntiStagnationMeasures = applyAntiStagnationMeasures;
        window.neuralMath.applyConvergenceBoost = applyConvergenceBoost;
        window.neuralMath.backpropagationWithMomentum = backpropagationWithMomentum;
        window.neuralMath.testDeadNeuronPrevention = testDeadNeuronPrevention;
        window.neuralMath.testGeneralization = testGeneralization;
        window.neuralMath.testWeightInitialization = testWeightInitialization;
        window.neuralMath.runComprehensiveTests = runComprehensiveTests;
        window.neuralMath.test100PercentAccuracy = test100PercentAccuracy;
        window.neuralMath.testBackAndForthLearning = testBackAndForthLearning;
        window.neuralMath.testSimplifiedNetwork = testSimplifiedNetwork;
        window.neuralMath.simpleBinaryForward = simpleBinaryForward;
        window.neuralMath.simpleBinaryBackward = simpleBinaryBackward;
        window.neuralMath.testSimpleBinaryAccuracy = testSimpleBinaryAccuracy;
        window.neuralMath.testAccuracy = testAccuracy;
        window.neuralMath.debugWeightChanges = debugWeightChanges;
        window.neuralMath.enableConvergenceAnalysis = enableConvergenceAnalysis;
        window.neuralMath.enableDeepDebugging = enableDeepDebugging;
        window.neuralMath.updateLastWeights = updateLastWeights;
        window.neuralMath.showWeightChanges = showWeightChanges;
    }
    
    // Update animation engine exports with functions defined later
    if (window.animationEngine) {
        window.animationEngine.startFullDemo = startFullDemo;
        // startDemo is defined in animation-engine.js
        window.animationEngine.resetDemo = resetDemo;
        window.animationEngine.animateInputActivation = animateInputActivation;
        window.animationEngine.animateForwardPropagation = animateForwardPropagation;
        window.animationEngine.animateOutputComputation = animateOutputComputation;
        window.animationEngine.animateBackpropagation = animateBackpropagation;
        window.animationEngine.startTrainingAnimation = startTrainingAnimation;
        window.animationEngine.updateTrainingAnimation = updateTrainingAnimation;
        window.animationEngine.stopTrainingAnimation = stopTrainingAnimation;
        window.animationEngine.trainToPerfection = trainToPerfection;
        window.animationEngine.trainWithHyperparams = trainWithHyperparams;
        window.animationEngine.debugTraining = debugTraining;
        window.animationEngine.testOptimalLearningSequence = testOptimalLearningSequence;
        window.animationEngine.createOptimalLearningSequence = createOptimalLearningSequence;
        window.animationEngine.runLearningTest = runLearningTest;
        window.animationEngine.initializeOptimalWeights = initializeOptimalWeights;
    }
    
    // Update UI controls exports with functions defined later
    if (window.uiControls) {
        window.uiControls.startTutorial = startTutorial;
        window.uiControls.showTutorialStep = showTutorialStep;
        window.uiControls.nextTutorialStep = nextTutorialStep;
        window.uiControls.skipTutorial = skipTutorial;
        window.uiControls.completeTutorial = completeTutorial;
    }
    
    // Update image processor exports with functions defined later
    if (window.imageProcessor) {
        window.imageProcessor.openPixelViewer = openPixelViewer;
        window.imageProcessor.closePixelViewer = closePixelViewer;
        window.imageProcessor.drawOriginalImage = drawOriginalImage;
        window.imageProcessor.addImageHoverEffects = addImageHoverEffects;
        window.imageProcessor.highlightCorrespondingPixel = highlightCorrespondingPixel;
        window.imageProcessor.showImageAreaOverlay = showImageAreaOverlay;
        window.imageProcessor.extractPixelValues = extractPixelValues;
        window.imageProcessor.drawInteractivePixelGrid = drawInteractivePixelGrid;
        window.imageProcessor.handlePixelClick = handlePixelClick;
        window.imageProcessor.handlePixelHover = handlePixelHover;
        window.imageProcessor.highlightPixelInGrid = highlightPixelInGrid;
        window.imageProcessor.highlightCorrespondingImageArea = highlightCorrespondingImageArea;
        window.imageProcessor.updatePixelInfo = updatePixelInfo;
        window.imageProcessor.clearAllHighlights = clearAllHighlights;
        window.imageProcessor.drawInputNeuronVisualization = drawInputNeuronVisualization;
        window.imageProcessor.highlightInputNeuron = highlightInputNeuron;
        window.imageProcessor.drawPixelGrid = drawPixelGrid;
        window.imageProcessor.drawNumberGrid = drawNumberGrid;
        window.imageProcessor.displayAIInputNumbers = displayAIInputNumbers;
        window.imageProcessor.updatePatternValues = updatePatternValues;
        window.imageProcessor.highlightPixelRegions = highlightPixelRegions;
        window.imageProcessor.highlightPatternInOriginalImage = highlightPatternInOriginalImage;
        window.imageProcessor.clearHighlight = clearHighlight;
    }
    
    // Add any additional functions that need to be exposed globally for HTML
    window.selectImage = selectImage;
    // startDemo is exported by animation-engine.js
    window.resetDemo = resetDemo;
    window.trainToPerfection = trainToPerfection;
    window.toggleExpertPanel = toggleExpertPanel;
    window.setTrueLabel = setTrueLabel;
    
    console.log('✅ Module exports initialized successfully');
}

if (typeof window !== 'undefined') window.initializeModuleExports = initializeModuleExports;

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

// Add initial debug message
console.log('\n🔧 ===== NEURAL NETWORK DEBUGGING TOOLS LOADED =====');
console.log('🚀 Quick start: Run startDeepDebug() in console to begin comprehensive analysis');
console.log('📚 Available commands:');
console.log('   • startDeepDebug() - Initialize complete debugging session');
console.log('   • enableDeepDebugging() - Enable detailed logging for all training');
console.log('   • debugFeatureRepresentation(inputs, "context") - Analyze feature patterns');
console.log('   • debugWeightInitialization() - Check weight initialization issues');
console.log('   • enableConvergenceAnalysis() - Track convergence during training');
console.log('🔧 ===================================================\n');

// Initialize all module exports now that all functions are defined
initializeModuleExports();

// Verify module exports are working
console.log('🔍 Module verification:');
console.log('  - coreSystem:', typeof window.coreSystem);
console.log('  - neuralMath:', typeof window.neuralMath, `(${Object.keys(window.neuralMath || {}).length} functions)`);
console.log('  - networkConfig:', typeof window.networkConfig, `(${Object.keys(window.networkConfig || {}).length} functions)`);
console.log('  - uiControls:', typeof window.uiControls, `(${Object.keys(window.uiControls || {}).length} functions)`);
console.log('  - imageProcessor:', typeof window.imageProcessor, `(${Object.keys(window.imageProcessor || {}).length} functions)`);
console.log('  - networkVisualizer:', typeof window.networkVisualizer, `(${Object.keys(window.networkVisualizer || {}).length} functions)`);
console.log('  - animationEngine:', typeof window.animationEngine, `(${Object.keys(window.animationEngine || {}).length} functions)`);
console.log('🎯 All 7 modules initialized and ready for extraction!');

// ============================================================================
// DOM CONTENT LOADED - MAIN APP INITIALIZATION
// ============================================================================

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing app");
    initializeNetwork();
    createImage(currentImage);
    console.log("After createImage, trueLabel is:", trueLabel);
    drawNetwork();
    setupEventListeners();
    resetDemo();
    
    // Initialize auto-scroll button text after i18n is loaded
    setTimeout(() => {
        if (window.updateAutoScrollButtonText) {
            window.updateAutoScrollButtonText();
        }
    }, 100);
    
    console.log("After resetDemo, trueLabel is:", trueLabel);
});