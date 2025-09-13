// ============================================================================
// BOOTSTRAP - APPLICATION INITIALIZATION
// Contains the DOMContentLoaded listener and initializeNetwork function
// ============================================================================

// Initialize network with properly scaled random weights
function initializeNetwork() {
    console.log('🔧 ===== NETWORK INITIALIZATION DEBUG =====');
    console.log(`🎲 Random seed check: ${Math.random().toFixed(6)}, ${Math.random().toFixed(6)}, ${Math.random().toFixed(6)}`);
    
    // Use new variable architecture initialization if available
    if (typeof initializeNetworkStructure === 'function') {
        console.log('🔧 Using new variable architecture initialization');
        initializeNetworkStructure();
    } else if (typeof weights !== 'undefined' && typeof networkConfig !== 'undefined') {
        console.log('🔧 Falling back to legacy initialization');
        // Legacy initialization for backward compatibility
        const scale = 0.1; // Much smaller weights
        
        weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
            Array.from({length: networkConfig.inputSize}, () => 
                (Math.random() * 2 - 1) * scale)
        );
        
        // Initialize output weights even smaller
        weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, (_, i) =>
            Array.from({length: networkConfig.hiddenSize}, () => 
                (Math.random() * 2 - 1) * scale * 0.5) // Even smaller output weights
        );
    } else {
        console.error('❌ Cannot initialize network: required variables not available');
        console.log('Available globals:', {
            weights: typeof weights,
            networkConfig: typeof networkConfig,
            initializeNetworkStructure: typeof initializeNetworkStructure
        });
        return; // Exit early if we can't initialize
    }
    
    // DEBUG: Detailed weight analysis
    if (typeof debugWeightInitialization === 'function') {
        debugWeightInitialization();
    } else {
        console.log('⚠️ debugWeightInitialization not available, skipping weight analysis');
    }
    
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
        // Only assign functions that actually exist to prevent null assignments
        if (typeof forwardPropagationSilent !== 'undefined') {
            window.neuralMath.forwardPropagationSilent = forwardPropagationSilent;
        }
        if (typeof backpropagationSilent !== 'undefined') {
            window.neuralMath.backpropagationSilent = backpropagationSilent;
        }
        
        // Safe assignment of other neural math functions
        const neuralMathFunctions = [
            'initializeMomentum', 'analyzeConvergence', 'detectConvergenceIssues', 
            'checkPredictionDiversity', 'generateSimpleTrainingData', 'advancedBackpropagation',
            'adaptLearningRate', 'applyAntiStagnationMeasures', 'applyConvergenceBoost',
            'backpropagationWithMomentum', 'testDeadNeuronPrevention', 'testGeneralization',
            'testWeightInitialization', 'runComprehensiveTests', 'test100PercentAccuracy',
            'testBackAndForthLearning', 'testSimplifiedNetwork', 'simpleBinaryForward',
            'simpleBinaryBackward', 'testSimpleBinaryAccuracy', 'testAccuracy',
            'debugWeightChanges', 'enableConvergenceAnalysis', 'enableDeepDebugging',
            'updateLastWeights', 'showWeightChanges'
        ];
        
        neuralMathFunctions.forEach(funcName => {
            if (typeof window[funcName] !== 'undefined') {
                window.neuralMath[funcName] = window[funcName];
            }
        });
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

// Report module loading and use initialization system
if (typeof window !== 'undefined' && window.moduleLoaded) {
    window.moduleLoaded('bootstrap');
}

// Initialize module exports immediately and also schedule for when all modules are ready
console.log('🔧 Initializing module exports immediately for compatibility');
try {
    initializeModuleExports();
} catch (error) {
    console.warn('⚠️ Error in immediate module export initialization:', error);
}

// Also schedule for proper module system if available
if (typeof window !== 'undefined' && window.onAllModulesReady) {
    window.onAllModulesReady(() => {
        console.log('🎉 All modules ready - Running final initialization');
        try {
            initializeModuleExports();
            updateArchitectureDisplay();
        } catch (error) {
            console.warn('⚠️ Error in delayed initialization:', error);
        }
    });
} else {
    // Additional fallback for compatibility
    setTimeout(() => {
        try {
            updateArchitectureDisplay();
        } catch (error) {
            console.warn('⚠️ Error in fallback architecture display:', error);
        }
    }, 1000);
}

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
// DYNAMIC HTML UPDATES FOR VARIABLE ARCHITECTURE
// ============================================================================

/**
 * Update HTML elements to reflect current network architecture
 */
function updateArchitectureDisplay() {
    // Check if NetworkAPI is available and properly initialized
    if (typeof NetworkAPI === 'undefined' || typeof NetworkAPI.getArchitecture !== 'function') {
        console.warn('⚠️ NetworkAPI not available yet, scheduling retry in 100ms');
        setTimeout(updateArchitectureDisplay, 100);
        return;
    }
    
    try {
        const arch = NetworkAPI.getArchitecture();
        const stats = NetworkAPI.getStats();
        
        // Update expert panel displays
        const inputSizeDisplay = document.getElementById('inputSizeDisplay');
        const architectureDisplay = document.getElementById('architectureDisplay');
        const outputSizeDisplay = document.getElementById('outputSizeDisplay');
        const totalWeightsDisplay = document.getElementById('totalWeightsDisplay');
        
        if (inputSizeDisplay) inputSizeDisplay.textContent = arch.inputSize;
        if (outputSizeDisplay) outputSizeDisplay.textContent = arch.outputSize;
        if (totalWeightsDisplay) totalWeightsDisplay.textContent = stats.totalWeights;
        
        if (architectureDisplay) {
            // Format: 4→[6,3]→2 or 4→[]→2 (no hidden layers)
            const hiddenStr = arch.hiddenLayers.length > 0 ? 
                `[${arch.hiddenLayers.join(',')}]` : '[]';
            architectureDisplay.textContent = `${arch.inputSize}→${hiddenStr}→${arch.outputSize}`;
        }
        
        console.log(`🔄 Architecture display updated: ${arch.inputSize}→[${arch.hiddenLayers.join(',')}]→${arch.outputSize}`);
        
    } catch (error) {
        console.error('Error updating architecture display:', error);
    }
}

/**
 * Update connection editor with dynamic neuron labels
 * @param {string} fromLayer - Source layer ('input', 'hidden', etc.)
 * @param {string} fromNeuron - Source neuron label
 * @param {string} toLayer - Target layer ('hidden', 'output', etc.)
 * @param {string} toNeuron - Target neuron label
 */
function updateConnectionEditor(fromLayer, fromNeuron, toLayer, toNeuron) {
    const fromLayerElement = document.getElementById('connectionFromLayer');
    const fromNeuronElement = document.getElementById('connectionFromNeuron');
    const toLayerElement = document.getElementById('connectionToLayer');
    const toNeuronElement = document.getElementById('connectionToNeuron');
    
    if (fromLayerElement) fromLayerElement.textContent = fromLayer;
    if (fromNeuronElement) fromNeuronElement.textContent = fromNeuron;
    if (toLayerElement) toLayerElement.textContent = toLayer;
    if (toNeuronElement) toNeuronElement.textContent = toNeuron;
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.updateArchitectureDisplay = updateArchitectureDisplay;
    window.updateConnectionEditor = updateConnectionEditor;
}

// ============================================================================
// DOM CONTENT LOADED - MAIN APP INITIALIZATION
// ============================================================================

// Initialize the app when DOM is ready - with robust fallbacks
document.addEventListener('DOMContentLoaded', async function() {
    console.log("DOM Content Loaded - Starting app initialization");
    
    // Define the main initialization function
    const initializeApp = async () => {
        console.log("🚀 Initializing neural network application");
        
        // Initialize image data module first
        if (window.imageData) {
            await window.imageData.initialize();
            console.log("✅ Image data module initialized successfully");
            console.log("✅ Image data ready:", window.imageData.isReady());
        } else {
            console.error("❌ CRITICAL: Image data module not available in bootstrap!");
            console.log("Available on window:", Object.keys(window).filter(k => k.includes('image')));
        }
        
        // Use safe function calls with existence checks
        if (typeof initializeNetwork === 'function') {
            initializeNetwork();
        }
        if (typeof createImage === 'function' && typeof currentImage !== 'undefined') {
            createImage(currentImage);
            console.log("After createImage, trueLabel is:", trueLabel);
        }
        
        // Initialize neuron hover tooltips
        if (window.neuronHover && typeof window.neuronHover.initialize === 'function') {
            window.neuronHover.initialize();
            console.log("✅ Neuron hover tooltips initialized");
        }
        
        // Safe function calls for UI initialization
        if (typeof drawNetwork === 'function') {
            drawNetwork();
        }
        if (typeof setupEventListeners === 'function') {
            setupEventListeners();
        }
        if (typeof resetDemo === 'function') {
            resetDemo();
            console.log("After resetDemo, trueLabel is:", trueLabel);
        }
        
        // Initialize auto-scroll button text after i18n is loaded
        if (window.updateAutoScrollButtonText) {
            window.updateAutoScrollButtonText();
        }
        
        console.log("✅ App initialization complete!");
    };
    
    // Try to use module system but don't wait forever
    let initStarted = false;
    
    // Try module system approach
    if (typeof window !== 'undefined' && window.onAllModulesReady) {
        window.onAllModulesReady(async () => {
            if (!initStarted) {
                initStarted = true;
                console.log("🎉 All modules ready - Starting app");
                await initializeApp();
            }
        });
    }
    
    // Fallback timer - initialize after 3 seconds regardless
    setTimeout(async () => {
        if (!initStarted) {
            initStarted = true;
            console.log("⏰ Fallback timeout - Starting app anyway");
            await initializeApp();
        }
    }, 3000);
});