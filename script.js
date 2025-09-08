// Simple Neural Network Learning Demo
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

// ============================================================================
// ACTIVATION FUNCTIONS - Centralized implementations
// ============================================================================

// Sigmoid activation function
function sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); // Prevent overflow
}

// Sigmoid derivative
function sigmoidDerivative(x) {
    const s = sigmoid(x);
    return s * (1 - s);
}

// Leaky ReLU activation function
function leakyReLU(x, alpha = 0.1) {
    return x > 0 ? x : alpha * x;
}

// Leaky ReLU derivative
function leakyReLUDerivative(x, alpha = 0.1) {
    return x > 0 ? 1 : alpha;
}

// Tanh activation function (wrapper for consistency)
function tanhActivation(x) {
    return Math.tanh(x);
}

// Tanh derivative
function tanhDerivative(x) {
    const t = Math.tanh(x);
    return 1 - t * t;
}

// Softmax activation function
function softmax(values) {
    const maxVal = Math.max(...values);
    const expVals = values.map(val => Math.exp(Math.min(val - maxVal, 700))); // Prevent overflow
    const sumExp = expVals.reduce((sum, val) => sum + val, 0);
    return expVals.map(val => val / sumExp);
}

// ============================================================================
// END ACTIVATION FUNCTIONS
// ============================================================================

// ============================================================================
// UTILITY FUNCTIONS - Centralized calculations
// ============================================================================

// Centralized accuracy calculation for binary classification
function calculateBinaryAccuracy(predictedProbability, isDogActual) {
    const predictedIsDog = predictedProbability > 0.5;
    return predictedIsDog === isDogActual;
}

// Calculate accuracy for a dataset
function calculateDatasetAccuracy(dataset, getOutputFunction) {
    let correct = 0;
    for (const example of dataset) {
        const output = getOutputFunction(example.input);
        const dogProb = Array.isArray(output) ? output[0] : output;
        if (calculateBinaryAccuracy(dogProb, example.isDog)) {
            correct++;
        }
    }
    return correct / dataset.length;
}

// ============================================================================
// END UTILITY FUNCTIONS
// ============================================================================

// ============================================================================
// CENTRALIZED PARAMETER CONFIGURATION
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

// Function to get activation function based on config
function getActivationFunction(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return leakyReLU;
            case 'sigmoid': return sigmoid;
            case 'tanh': return tanhActivation;
            default: return leakyReLU;
        }
    } else if (layer === 'output') {
        switch (expertConfig.outputActivation) {
            case 'softmax': return softmax;
            case 'sigmoid': return sigmoid;
            default: return softmax;
        }
    }
}

// Function to get activation derivative based on config
function getActivationDerivative(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
            case 'sigmoid': return sigmoidDerivative;
            case 'tanh': return tanhDerivative;
            default: return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
        }
    }
}

// Apply expert config to legacy networkConfig for compatibility
function syncExpertConfigToLegacy() {
    networkConfig.learningRate = expertConfig.learningRate;
    networkConfig.inputSize = expertConfig.inputSize;
    networkConfig.hiddenSize = expertConfig.hiddenSize;
    networkConfig.outputSize = expertConfig.outputSize;
}

// ============================================================================
// END PARAMETER CONFIGURATION
// ============================================================================

// ============================================================================
// EXPERT PANEL FUNCTIONALITY
// ============================================================================

// Expert panel state
let expertPanelVisible = false;

// Toggle Expert Panel
function toggleExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    if (expertPanelVisible) {
        closeExpertPanel();
    } else {
        openExpertPanel();
    }
}

// Open Expert Panel
function openExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'flex';
    expertPanelVisible = true;
    
    // Initialize UI with current expert config values
    initializeExpertPanelUI();
}

// Close Expert Panel
function closeExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'none';
    expertPanelVisible = false;
}

// Initialize Expert Panel UI with current values
function initializeExpertPanelUI() {
    // Activation functions
    document.getElementById('hiddenActivation').value = expertConfig.hiddenActivation;
    document.getElementById('outputActivation').value = expertConfig.outputActivation;
    
    // Training parameters
    document.getElementById('learningRateSlider').value = expertConfig.learningRate;
    document.getElementById('learningRateValue').textContent = expertConfig.learningRate.toFixed(3);
    
    document.getElementById('momentumSlider').value = expertConfig.momentum;
    document.getElementById('momentumValue').textContent = expertConfig.momentum.toFixed(2);
    
    document.getElementById('l2RegSlider').value = expertConfig.l2Regularization;
    document.getElementById('l2RegValue').textContent = expertConfig.l2Regularization.toFixed(4);
    
    document.getElementById('maxEpochsSlider').value = expertConfig.maxEpochs;
    document.getElementById('maxEpochsValue').textContent = expertConfig.maxEpochs;
    
    // Activation function parameters
    document.getElementById('leakyReLUAlpha').value = expertConfig.leakyReLUAlpha;
    document.getElementById('leakyReLUAlphaValue').textContent = expertConfig.leakyReLUAlpha.toFixed(2);
    
    // Advanced settings
    document.getElementById('adaptiveLearningRate').checked = expertConfig.adaptiveLearningRate;
    
    document.getElementById('batchSizeSlider').value = expertConfig.batchSize;
    document.getElementById('batchSizeValue').textContent = expertConfig.batchSize;
    
    // Network architecture (read-only)
    document.getElementById('inputSizeDisplay').textContent = expertConfig.inputSize;
    document.getElementById('hiddenSizeDisplay').textContent = expertConfig.hiddenSize;
    document.getElementById('outputSizeDisplay').textContent = expertConfig.outputSize;
}

// Update Expert Config
function updateExpertConfig(parameter, value) {
    expertConfig[parameter] = value;
    
    // Update corresponding display values
    switch (parameter) {
        case 'learningRate':
            document.getElementById('learningRateValue').textContent = value.toFixed(3);
            break;
        case 'momentum':
            document.getElementById('momentumValue').textContent = value.toFixed(2);
            break;
        case 'l2Regularization':
            document.getElementById('l2RegValue').textContent = value.toFixed(4);
            break;
        case 'maxEpochs':
            document.getElementById('maxEpochsValue').textContent = value;
            break;
        case 'leakyReLUAlpha':
            document.getElementById('leakyReLUAlphaValue').textContent = value.toFixed(2);
            break;
        case 'batchSize':
            document.getElementById('batchSizeValue').textContent = value;
            break;
    }
    
    console.log(`Expert parameter updated: ${parameter} = ${value}`);
}

// Reset Expert Panel to Defaults
function resetExpertDefaults() {
    expertConfig.hiddenActivation = 'leaky_relu';
    expertConfig.outputActivation = 'softmax';
    expertConfig.learningRate = 0.1;
    expertConfig.momentum = 0.0;
    expertConfig.l2Regularization = 0.0;
    expertConfig.leakyReLUAlpha = 0.1;
    expertConfig.adaptiveLearningRate = false;
    expertConfig.batchSize = 1;
    expertConfig.maxEpochs = 100;
    
    // Refresh UI
    initializeExpertPanelUI();
    
    console.log('Expert parameters reset to defaults');
}

// Apply Expert Configuration and Restart Network
function applyExpertConfig() {
    console.log('🔧 Applying expert configuration...');
    console.log('Expert Config:', expertConfig);
    
    // Enable expert view mode when expert panel is used
    expertViewMode = true;
    
    // Sync to legacy networkConfig for compatibility
    syncExpertConfigToLegacy();
    
    // Reset and reinitialize network with new parameters
    resetWeights();
    
    // Update step info to reflect new configuration
    updateStepInfo(`⚙️ Expert parameters applied! Network restarted with ${expertConfig.hiddenActivation.replace('_', ' ')} hidden activation and ${expertConfig.learningRate} learning rate. Expert view enabled for detailed mathematical explanations.`);
    
    // Close expert panel
    closeExpertPanel();
    
    console.log('✅ Expert configuration applied successfully');
}

// Toggle Expert View Mode
function toggleExpertViewMode() {
    expertViewMode = !expertViewMode;
    const status = expertViewMode ? 'enabled' : 'disabled';
    updateStepInfo(`🎓 Expert view ${status}! ${expertViewMode ? 'Detailed mathematical explanations will be shown.' : 'Simplified student explanations will be shown.'}`);
    console.log(`Expert view mode: ${status}`);
}

// ============================================================================
// END EXPERT PANEL FUNCTIONALITY
// ============================================================================

// ============================================================================
// DUAL-MODE MESSAGING SYSTEM
// ============================================================================

// Centralized message system for student vs expert explanations
function updateStepInfoDual(studentMessage, expertMessage = null) {
    const currentStep = document.getElementById('currentStep');
    if (!currentStep) return;
    
    if (expertViewMode && expertMessage) {
        currentStep.innerHTML = expertMessage;
    } else {
        currentStep.innerHTML = studentMessage;
    }
}

// Mathematical explanation helpers for expert mode
function formatMatrix(matrix, name) {
    let html = `<div class="math-matrix"><strong>${name}:</strong><br>`;
    if (Array.isArray(matrix[0])) {
        // 2D matrix
        html += '[';
        matrix.forEach((row, i) => {
            html += '[' + row.map(val => val.toFixed(3)).join(', ') + ']';
            if (i < matrix.length - 1) html += '<br> ';
        });
        html += ']';
    } else {
        // 1D vector
        html += '[' + matrix.map(val => val.toFixed(3)).join(', ') + ']';
    }
    html += '</div>';
    return html;
}

function formatOperation(operation, inputs, result, description) {
    return `
        <div class="math-operation">
            <div class="op-title">🔢 <strong>${operation}</strong></div>
            <div class="op-description">${description}</div>
            <div class="op-calculation">
                <strong>Input:</strong> ${inputs}<br>
                <strong>Result:</strong> <span class="result-highlight">${result}</span>
            </div>
        </div>
    `;
}

// ============================================================================
// END DUAL-MODE MESSAGING SYSTEM  
// ============================================================================

// Tutorial system
let tutorialStep = 0;
let tutorialActive = false;
const tutorialSteps = [
    {
        title: "🎯 Welcome to AI Learning!",
        text: "Let's learn how AI recognizes images! First, look at the picture on the left. The AI extracts abstract feature patterns from the pixels - like Pattern A, B, C, and D.",
        action: null
    },
    {
        title: "👀 Look at the Features",
        text: "The AI looks at 4 abstract features: A, B, C, and D. Dogs have HIGH values (0.7-0.9), while non-dogs have LOW values (0.1-0.3). This makes learning super easy!",
        action: "highlightInputs"
    },
    {
        title: "🔗 The AI's Memory",
        text: "See those numbers on the connections? Those are the AI's 'memory' - they're called weights. Strong connections (big numbers) have more influence on the decision!",
        action: "highlightWeights"
    },
    {
        title: "🧠 Let's Watch the AI Think!",
        text: "Now click 'Watch AI Think' to see how it multiplies the feature scores by the connection weights and adds them up to make a guess!",
        action: "enableThinking"
    }
];

// Simple performance tracking
let performanceMetrics = {
    epochCount: 0,
    totalOperations: 0,
    weightUpdates: 0,
    forwardPassTime: 0,
    backpropTime: 0,
    lastAccuracy: 0,
    lastLoss: 0
};

// DEBUG FUNCTION: Quick test for console - FULL 8 IMAGE TEST
function quickAccuracyTest() {
    console.log('🧪 FULL 8-IMAGE ACCURACY TEST');
    
    // Test with ALL 8 images exactly like training does
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const testData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        testData.push({
            input: [...activations.input], // Copy input array
            target: isDog ? [1, 0] : [0, 1],
            isDog: isDog,
            label: imageType
        });
    });
    
    console.log('📊 Current predictions for all 8 images:');
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        const isCorrect = (output[0] > output[1]) === ex.isDog;
        const status = isCorrect ? '✅' : '❌';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} (actual: ${ex.isDog ? 'DOG' : 'NOT-DOG'}) ${status}`);
    });
    
    const accuracy = testAccuracy(testData);
    console.log(`\n🎯 Total accuracy: ${(accuracy * 100).toFixed(1)}% (${accuracy * testData.length}/${testData.length} correct)`);
    
    // Check for bias
    let allPredictedDog = true;
    let allPredictedNotDog = true;
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1];
        if (predicted) allPredictedNotDog = false;
        if (!predicted) allPredictedDog = false;
    });
    
    if (allPredictedDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as DOG!');
    } else if (allPredictedNotDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as NOT-DOG!');
    }
    
    return accuracy;
}

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

// Network positions for SVG drawing - optimized for 4 hidden neurons
const positions = {
    input: [{x: 80, y: 80}, {x: 80, y: 150}, {x: 80, y: 220}, {x: 80, y: 290}],
    hidden: [
        {x: 250, y: 100}, {x: 250, y: 160}, {x: 250, y: 220}, {x: 250, y: 280}
    ],
    output: [{x: 420, y: 150}, {x: 420, y: 250}],
    prediction: {x: 580, y: 200} // New prediction column
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - Initializing app");
    initializeNetwork();
    createImage(currentImage);
    console.log("After createImage, trueLabel is:", trueLabel);
    drawNetwork();
    setupEventListeners();
    resetDemo();
    console.log("After resetDemo, trueLabel is:", trueLabel);
});


function updateDebugConsole() {
    if (!debugConsoleVisible) return;
    
    switch(currentConsoleTab) {
        case 'weights':
            displayWeightMatrices();
            break;
        case 'activations':
            displayActivations();
            break;
        case 'gradients':
            displayGradients();
            break;
        case 'performance':
            displayPerformanceMetrics();
            break;
    }
}

function displayWeightMatrices() {
    const display = document.getElementById('weightsDisplay');
    let html = '';
    
    html += '<div class="matrix-section"><strong>INPUT → HIDDEN WEIGHTS:</strong><br>';
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        html += `H${h}: [`;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weight = weights.inputToHidden[h][i];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (i < networkConfig.inputSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    
    html += '</div><br><div class="matrix-section"><strong>HIDDEN → OUTPUT WEIGHTS:</strong><br>';
    for (let o = 0; o < networkConfig.outputSize; o++) {
        html += `O${o}: [`;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weight = weights.hiddenToOutput[o][h];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (h < networkConfig.hiddenSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    html += '</div>';
    
    display.innerHTML = html;
}

function displayActivations() {
    const display = document.getElementById('activationsDisplay');
    let html = '';
    
    html += `<strong>INPUT LAYER:</strong><br>[`;
    activations.input.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(0, ${intensity}, 255)">${val.toFixed(3)}</span>`;
        if (i < activations.input.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>HIDDEN LAYER:</strong><br>[`;
    activations.hidden.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(${intensity}, 255, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.hidden.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>OUTPUT LAYER:</strong><br>[`;
    activations.output.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(255, ${intensity}, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.output.length - 1) html += ', ';
    });
    html += ']';
    
    display.innerHTML = html;
}

function displayGradients() {
    const display = document.getElementById('gradientsDisplay');
    if (gradientHistory.length === 0) {
        display.innerHTML = '<em>No gradient data available. Run training to see gradient flow.</em>';
        return;
    }
    
    const latest = gradientHistory[gradientHistory.length - 1];
    let html = `<strong>LATEST GRADIENT UPDATE (Epoch ${performanceMetrics.epochCount}):</strong><br><br>`;
    
    if (latest.outputGradients) {
        html += '<strong>OUTPUT GRADIENTS:</strong><br>';
        latest.outputGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `O${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
        html += '<br>';
    }
    
    if (latest.hiddenGradients) {
        html += '<strong>HIDDEN GRADIENTS:</strong><br>';
        latest.hiddenGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `H${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
    }
    
    display.innerHTML = html;
}

function displayPerformanceMetrics() {
    const display = document.getElementById('performanceDisplay');
    
    let html = `
        <strong>SYSTEM PERFORMANCE:</strong><br>
        Total Operations: ${performanceMetrics.totalOperations}<br>
        Weight Updates: ${performanceMetrics.weightUpdates}<br>
        Training Epochs: ${performanceMetrics.epochCount}<br><br>
        
        <strong>TIMING METRICS:</strong><br>
        Forward Pass: ${performanceMetrics.forwardPassTime}ms<br>
        Backpropagation: ${performanceMetrics.backpropTime}ms<br><br>
        
        <strong>NETWORK STATUS:</strong><br>
        Last Accuracy: ${(performanceMetrics.lastAccuracy * 100).toFixed(1)}%<br>
        Last Loss: ${performanceMetrics.lastLoss.toFixed(4)}<br>
        Learning Rate: ${networkConfig.learningRate}<br><br>
        
        <strong>MEMORY USAGE:</strong><br>
        Weights: ${(weights.inputToHidden.length * weights.inputToHidden[0].length + 
                    weights.hiddenToOutput.length * weights.hiddenToOutput[0].length)} parameters<br>
        History Buffer: ${gradientHistory.length} entries
    `;
    
    display.innerHTML = html;
}

function updatePerformanceDisplays() {
    // These elements don't exist in compact interface - skip updates
    const epochCounter = document.getElementById('epochCounter');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const lossDisplay = document.getElementById('lossDisplay');
    const learningRateDisplay = document.getElementById('learningRateDisplay');
    
    if (epochCounter) epochCounter.textContent = performanceMetrics.epochCount;
    if (accuracyDisplay) accuracyDisplay.textContent = (performanceMetrics.lastAccuracy * 100).toFixed(1) + '%';
    if (lossDisplay) lossDisplay.textContent = performanceMetrics.lastLoss.toFixed(3);
    if (learningRateDisplay) learningRateDisplay.textContent = networkConfig.learningRate.toFixed(2);
    
    // Update neural metrics - check if elements exist first
    const forwardTime = document.getElementById('forwardTime');
    const backpropTime = document.getElementById('backpropTime');
    
    if (forwardTime) forwardTime.textContent = performanceMetrics.forwardPassTime + 'ms';
    if (backpropTime) backpropTime.textContent = performanceMetrics.backpropTime + 'ms';
    
    const weightUpdates = document.getElementById('weightUpdates');
    const totalOps = document.getElementById('totalOps');
    
    if (weightUpdates) weightUpdates.textContent = performanceMetrics.weightUpdates;
    if (totalOps) totalOps.textContent = performanceMetrics.totalOperations;
}

function setupEventListeners() {
    document.getElementById('speedSlider').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
    });
}

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

// Comprehensive weight initialization debugging
function debugWeightInitialization() {
    console.log('📊 WEIGHT INITIALIZATION ANALYSIS:');
    
    // Analyze input->hidden weights
    console.log('\n🔗 Input → Hidden Layer Weights:');
    weights.inputToHidden.forEach((neuron, h) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Hidden[${h}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Analyze hidden->output weights  
    console.log('\n🔗 Hidden → Output Layer Weights:');
    weights.hiddenToOutput.forEach((neuron, o) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Output[${o}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Check for symmetry issues (major cause of convergence problems)
    const inputSymmetry = checkWeightSymmetry(weights.inputToHidden);
    const outputSymmetry = checkWeightSymmetry(weights.hiddenToOutput);
    console.log(`\n⚖️ Symmetry Analysis (lower = more diverse):`);
    console.log(`  Input layer symmetry: ${inputSymmetry.toFixed(6)}`);
    console.log(`  Output layer symmetry: ${outputSymmetry.toFixed(6)}`);
    
    // Check weight distribution
    const allInputWeights = weights.inputToHidden.flat();
    const allOutputWeights = weights.hiddenToOutput.flat();
    console.log(`\n📈 Overall Weight Distribution:`);
    console.log(`  Input weights: ${allInputWeights.length} values, range [${Math.min(...allInputWeights).toFixed(4)}, ${Math.max(...allInputWeights).toFixed(4)}]`);
    console.log(`  Output weights: ${allOutputWeights.length} values, range [${Math.min(...allOutputWeights).toFixed(4)}, ${Math.max(...allOutputWeights).toFixed(4)}]`);
    
    // Potential problem indicators
    console.log(`\n⚠️ Potential Issues Check:`);
    if (inputSymmetry < 0.01) console.log('  🚨 WARNING: Input weights may be too symmetric!');
    if (outputSymmetry < 0.01) console.log('  🚨 WARNING: Output weights may be too symmetric!');
    if (Math.abs(calculateWeightStats(allInputWeights).mean) > 0.02) console.log('  🚨 WARNING: Input weights have non-zero mean bias!');
    if (Math.abs(calculateWeightStats(allOutputWeights).mean) > 0.02) console.log('  🚨 WARNING: Output weights have non-zero mean bias!');
}

// Helper function to calculate comprehensive weight statistics
function calculateWeightStats(weightArray) {
    const mean = weightArray.reduce((sum, w) => sum + w, 0) / weightArray.length;
    const variance = weightArray.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / weightArray.length;
    const sortedWeights = [...weightArray].sort((a, b) => a - b);
    
    return {
        min: Math.min(...weightArray),
        max: Math.max(...weightArray),
        mean: mean,
        std: Math.sqrt(variance),
        median: sortedWeights[Math.floor(sortedWeights.length / 2)],
        range: Math.max(...weightArray) - Math.min(...weightArray)
    };
}

// Helper function to detect weight symmetry (major convergence issue indicator)
function checkWeightSymmetry(weightMatrix) {
    if (weightMatrix.length < 2) return 0;
    
    let totalDifference = 0;
    let comparisons = 0;
    
    // Compare each neuron's weights with every other neuron
    for (let i = 0; i < weightMatrix.length - 1; i++) {
        for (let j = i + 1; j < weightMatrix.length; j++) {
            for (let k = 0; k < weightMatrix[i].length; k++) {
                totalDifference += Math.abs(weightMatrix[i][k] - weightMatrix[j][k]);
                comparisons++;
            }
        }
    }
    
    return comparisons > 0 ? totalDifference / comparisons : 0;
}

// Base64 embedded images - works with file:// protocol
const imageUrls = {
    dog1: 'data:image/jpeg;base64,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',
    dog2: 'data:image/jpeg;base64,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',
    dog3: 'data:image/jpeg;base64,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',
    cat: 'data:image/jpeg;base64,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',
    bird: 'data:image/jpeg;base64,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',
    fish: 'data:image/jpeg;base64,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',
    car: 'data:image/jpeg;base64,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uTHriGqB+pBcmwIhSeTV9WFlMSfqAxJ9QMifEhkq9IbLV5oDQnO1jdXPqLCuzvempsq7XUtoq7JNpq61G1p0SMSKtemLUJbeTK1PObr2O8Nbx6p7LvHP2R9RnNrnDlTMMjh77DehHKfoWrdhNXOOMMyGN2OB+Vqs3OqXUH5cdwNJnPqQyua7/sdrf1w5CybhZ3TLL5WQMWe1C59qu1UgCyryj1KLitv14xsqei0GkyDkotMC6Wt4gdfIL3uBu56LogK9KffXpXj6d9bM7gW8cqWzfSWeiYOgmwWyQhwKXnQq1jlTXMjGjSJmf3nxuZm2HvDselywo/VSdm/ca7y12/Xtj2Ww9nh4YwJd1A2GMDIx0OjqQxelm3PH6J+Tb99A5J82JZyTZ/pgx+SHe3nOHofHpHt76k58RciuznAKawuukhswL8xu6wvIXMfp99gPNPjlZWJukPasRBqO0Qk27Zq871gvDamfTU11V0DdysYnGc9R2zVVg6xGO1a1xDPOxnNHl3QOhcp6ub6eEuvcNOj+nMm+o+bdEdIqQtteq9N9U53mTosRr9sXTy3SFwfT0iG7bjla7qQi4lwtsG2dhNTmva3EoeokQ9Bg2NzeW1vTj21TZOaxB0zfFc5d5vXYtKuRB304x7V/QJy31LKTlzu5stbI4b56hduRaOFHDHXbL9LVrnnxxyo7UlG9i/QPsg54z8Qq2lmWIEttLOvMD8aaj+sZtqcrY8Y3olHLjt4GfZkVWMlWkbYASdii97T/AA+4ax3bEZgWI3S8K8plVVPVfHA/CB2A3sDbUjGoO2oOmMH8aWX+gt7pl+UFezDZA/mmdIBC05VyIsdkSONhUbVUOOu/rG2ZhPHmw0u231MSR019Uo+S821KmlrxkkL0SHk0SHZckO2xIBH0SpbrjJVIYhhKu1FTIldtUqlUvBJW6v/EACMQAAEEAgMBAAMBAQAAAAAAABIBAgMEBQYAERMHEBQVFiD/2gAIAQEAAQICABEAAAAAAAAAAAAAEREREAABEQAAAAAAAAAAAAERERERERERERERERERERERERERERERERERARAAAAABEREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREeuuh666666666/56666511xXX7leeObhV5zfMi8luXvo1n6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',
    tree: 'data:image/jpeg;base64,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'
};

function setVisualFeaturesAndLabel(imageType) {
    // NUANCED feature patterns for better learning: [feature_A, feature_B, feature_C, feature_D]
    // Dogs use mixed HIGH/LOW patterns, Non-dogs use different mixed patterns
    // This gives 8 distinct, learnable combinations for 4 hidden units to distinguish
    
    switch(imageType) {
        case 'dog1':
            updateInputActivations([0.9, 0.9, 0.1, 0.1]); // Dog pattern: HIGH-HIGH-LOW-LOW
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog2':
            updateInputActivations([0.8, 0.7, 0.2, 0.3]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog3':
            updateInputActivations([0.7, 0.8, 0.3, 0.2]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'cat':
            updateInputActivations([0.1, 0.9, 0.1, 0.9]); // Non-dog pattern: LOW-HIGH-LOW-HIGH
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'bird':
            updateInputActivations([0.2, 0.8, 0.3, 0.7]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'car':
            updateInputActivations([0.3, 0.7, 0.2, 0.8]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'tree':
            updateInputActivations([0.9, 0.1, 0.9, 0.1]); // Non-dog pattern: HIGH-LOW-HIGH-LOW
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'fish':
            updateInputActivations([0.8, 0.2, 0.7, 0.3]); // Non-dog pattern: HIGH-LOW-HIGH-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        default:
            console.error('Unknown image type:', imageType);
            updateInputActivations([0.1, 0.1, 0.1, 0.1]);
            if (!preventAutoLabeling) setTrueLabel('not-dog');
    }
    console.log('🎯 Abstract patterns set for', imageType, '- [Pattern A, Pattern B, Pattern C, Pattern D]:', activations.input);
    console.log('🎯 Pattern type:', imageType.startsWith('dog') ? 'DOG (HIGH-HIGH-LOW-LOW variants)' : 'NON-DOG (alternating patterns)');
}

function createImage(imageType) {
    const canvas = document.getElementById('inputImage');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with loading state
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, 140, 140);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', 70, 70);
    
    // Load stock photo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        console.log(`✅ Successfully loaded image: ${imageType} from ${img.src}`);
        
        // Clear canvas and draw the loaded image
        ctx.clearRect(0, 0, 140, 140);
        ctx.drawImage(img, 0, 0, 140, 140);
        
        // Add a subtle border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 138, 138);
        
        // Add success indicator
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('✓', 135, 15);
        
        // CRITICAL: Set visual features based on image type!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.onerror = function(error) {
        console.error(`❌ Failed to load image: ${imageType} from ${img.src}`, error);
        console.log(`Current page location: ${window.location.href}`);
        console.log(`Image path: ${img.src}`);
        
        // Fallback to solid color with emoji if image fails to load
        ctx.clearRect(0, 0, 140, 140);
        ctx.fillStyle = getImageColor(imageType);
        ctx.fillRect(0, 0, 140, 140);
        
        // Add error indicator in corner
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('IMG ERR', 5, 12);
        
        // Large emoji fallback
        ctx.fillStyle = '#333';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getImageEmoji(imageType), 70, 85);
        
        // CRITICAL: Set visual features even on fallback!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.src = imageUrls[imageType];
    
    // Set the visual features and labels based on image type
    setVisualFeaturesAndLabel(imageType);
}

// Helper functions for fallback display
function getImageColor(imageType) {
    const colors = {
        dog1: '#8B4513', dog2: '#D2691E', dog3: '#FFFFFF',
        cat: '#696969', bird: '#FFD700', fish: '#1E90FF',
        car: '#FF6B6B', tree: '#228B22'
    };
    return colors[imageType] || '#f0f8ff';
}

function getImageEmoji(imageType) {
    const emojis = {
        dog1: '🐕', dog2: '🐕', dog3: '🐕',
        cat: '🐱', bird: '🐦', fish: '🐟',
        car: '🚗', tree: '🌳'
    };
    return emojis[imageType] || '❓';
}

function drawDog1(ctx) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(60, 120, 80, 60);
    
    // Head
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.arc(100, 80, 35, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(80, 60, 15, 25, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(120, 60, 15, 25, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 90, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 95, 8, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(70, 180, 10, 20);
    ctx.fillRect(85, 180, 10, 20);
    ctx.fillRect(105, 180, 10, 20);
    ctx.fillRect(120, 180, 10, 20);
    
    // Tail
    ctx.beginPath();
    ctx.arc(150, 140, 15, 0, Math.PI);
    ctx.fill();
}

function drawDog2(ctx) {
    // Different dog - more square/bulldog style
    // Body
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(40, 110, 90, 40);
    
    // Head - more square
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(60, 50, 50, 50);
    
    // Ears - smaller, different position (floppy)
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(55, 45, 12, 18);
    ctx.fillRect(103, 45, 12, 18);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(72, 68, 5, 5);
    ctx.fillRect(93, 68, 5, 5);
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.fillRect(82, 85, 6, 3);
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(78, 95);
    ctx.lineTo(85, 98);
    ctx.lineTo(92, 95);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(50, 150, 10, 18);
    ctx.fillRect(68, 150, 10, 18);
    ctx.fillRect(92, 150, 10, 18);
    ctx.fillRect(110, 150, 10, 18);
    
    // Tail
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(135, 120, 12, 0, Math.PI);
    ctx.fill();
}

function drawDog3(ctx) {
    // Spotted dog - dalmatian style
    // Body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(50, 100, 80, 50);
    
    // Head
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(90, 70, 28, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears - floppy
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(72, 55, 12, 20, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(108, 55, 12, 20, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(95, 60, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, 75, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 115, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 120, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(82, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 80, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(90, 85, 6, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, 150, 8, 16);
    ctx.fillRect(75, 150, 8, 16);
    ctx.fillRect(95, 150, 8, 16);
    ctx.fillRect(110, 150, 8, 16);
    
    // Tail - wagging upward
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(135, 110, 10, Math.PI, 0, false);
    ctx.fill();
}

function drawCat(ctx) {
    // Body
    ctx.fillStyle = '#696969';
    ctx.fillRect(70, 130, 60, 50);
    
    // Head
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(100, 85, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pointed ears
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(80, 65);
    ctx.lineTo(85, 45);
    ctx.lineTo(95, 60);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(120, 65);
    ctx.lineTo(115, 45);
    ctx.lineTo(105, 60);
    ctx.fill();
    
    // Eyes - cat-like
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(90, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(110, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(89, 78, 2, 4);
    ctx.fillRect(109, 78, 2, 4);
    
    // Nose - triangle
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(100, 88);
    ctx.lineTo(95, 95);
    ctx.lineTo(105, 95);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 85);
    ctx.lineTo(85, 87);
    ctx.moveTo(70, 90);
    ctx.lineTo(85, 90);
    ctx.moveTo(130, 85);
    ctx.lineTo(115, 87);
    ctx.moveTo(130, 90);
    ctx.lineTo(115, 90);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#696969';
    ctx.fillRect(75, 180, 8, 20);
    ctx.fillRect(90, 180, 8, 20);
    ctx.fillRect(102, 180, 8, 20);
    ctx.fillRect(117, 180, 8, 20);
    
    // Tail - long and curved
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(140, 150, 20, Math.PI, 0);
    ctx.stroke();
}

function drawCar(ctx) {
    // Car body
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(40, 130, 120, 40);
    
    // Car roof
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(60, 100, 80, 30);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(65, 105, 25, 20);
    ctx.fillRect(110, 105, 25, 20);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(65, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wheel centers
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(65, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Headlights
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(35, 145, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, 155, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function drawBird(ctx) {
    // Body - oval
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(90, 100, 25, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(90, 70, 18, 0, 2 * Math.PI);
    ctx.fill();
    
    // Beak - pointed (no ears!)
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(75, 70);
    ctx.lineTo(60, 68);
    ctx.lineTo(75, 75);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(85, 65, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(95, 95, 15, 8, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail feathers - small
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(115, 105, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Legs - thin (not four legs!)
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 115);
    ctx.lineTo(85, 130);
    ctx.moveTo(95, 115);
    ctx.lineTo(95, 130);
    ctx.stroke();
    
    // Feet
    ctx.beginPath();
    ctx.moveTo(82, 130);
    ctx.lineTo(88, 130);
    ctx.moveTo(92, 130);
    ctx.lineTo(98, 130);
    ctx.stroke();
}

function drawFish(ctx) {
    // Body - streamlined
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.ellipse(90, 100, 30, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head is part of body (no ears!)
    
    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(75, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(75, 95, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail - prominent
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(140, 85);
    ctx.lineTo(140, 115);
    ctx.fill();
    
    // Fins (not legs!)
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.ellipse(85, 115, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(95, 85, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Scales pattern
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(85, 100, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(95, 105, 4, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawTree(ctx) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(80, 100, 16, 60);
    
    // Tree crown - multiple circles
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(70, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(108, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 70, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 105, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Leaves details
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(80, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
}

function updateInputActivations(values) {
    activations.input = values;
    // Update display
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const valueElement = document.getElementById(`input-value-${i}`);
        if (valueElement) {
            valueElement.textContent = activations.input[i].toFixed(2);
        }
    }
}

function selectImage(imageType) {
    currentImage = imageType;
    
    // Update button states
    document.querySelectorAll('.img-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Create new image with new activations
    createImage(imageType);
    
    // IMPORTANT: Don't reset demo - preserve learned weights!
    // Only reset visual state, not the weights
    isAnimating = false;
    
    // Reset visual states only
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Reset activations display for new image (but keep weights!)
    activations.hidden = [0, 0, 0, 0, 0];
    activations.output = [0, 0];
    
    // Update neuron displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
    // Reset probability bars
    document.getElementById('dogProbBar').style.width = '0%';
    document.getElementById('notDogProbBar').style.width = '0%';
    document.getElementById('dogProbValue').textContent = '0%';
    document.getElementById('notDogProbValue').textContent = '0%';
    
    // True label is now pre-selected in createImage function, so don't clear it
    
    // Show weights to demonstrate learning persistence
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfo('🖼️ New image selected! The AI still remembers its previous lessons - notice the connection strength numbers didn\'t change. That\'s its "memory" from earlier learning!');
    // Button doesn't exist in compact interface
}

function drawNetwork() {
    const svg = document.getElementById('networkSvg');
    svg.innerHTML = '';
    
    // Draw connections first (so they appear behind neurons)
    drawConnections();
    
    // Draw neurons
    drawNeurons();
    
    // Draw layer labels
    drawLabels();
    
    // Draw prediction column
    drawPrediction();
    
    // Update visual properties based on current values
    updateNeuronColors();
    updatePrediction();
}

function drawConnections() {
    const svg = document.getElementById('networkSvg');
    
    // Input to Hidden connections
    for (let i = 0; i < networkConfig.inputSize; i++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.hidden[h].x - 25);
            line.setAttribute('y2', positions.hidden[h].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-hidden-${h}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.inputToHidden[h][i];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            addWeightTooltip(line, weight, `Input ${['A', 'B', 'C', 'D'][i]} → Hidden H${h + 1}`);
            
            svg.appendChild(line);
        }
    }
    
    // Hidden to Output connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let o = 0; o < networkConfig.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.hidden[h].x + 25);
            line.setAttribute('y1', positions.hidden[h].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-hidden-${h}-output-${o}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.hiddenToOutput[o][h];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            const outputName = o === 0 ? 'Dog' : 'Not Dog';
            addWeightTooltip(line, weight, `Hidden H${h + 1} → ${outputName}`);
            
            svg.appendChild(line);
        }
    }
}

function drawNeurons() {
    const svg = document.getElementById('networkSvg');
    const layers = ['input', 'hidden', 'output'];
    const sizes = [networkConfig.inputSize, networkConfig.hiddenSize, networkConfig.outputSize];
    const labels = [['A', 'B', 'C', 'D'], ['H1', 'H2', 'H3', 'H4'], ['Dog', 'Not Dog']];
    
    layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < sizes[layerIndex]; i++) {
            const pos = positions[layer][i];
            
            // Draw neuron circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 30);
            circle.setAttribute('class', 'neuron');
            circle.setAttribute('id', `${layer}-neuron-${i}`);
            
            // Draw neuron label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y - 5);
            text.setAttribute('class', 'neuron-value');
            text.textContent = labels[layerIndex][i];
            
            // Draw activation value
            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueText.setAttribute('x', pos.x);
            valueText.setAttribute('y', pos.y + 8);
            valueText.setAttribute('class', 'neuron-value');
            valueText.setAttribute('id', `${layer}-value-${i}`);
            valueText.textContent = (activations[layer][i] !== undefined ? activations[layer][i] : 0).toFixed(2);
            
            svg.appendChild(circle);
            svg.appendChild(text);
            svg.appendChild(valueText);
        }
    });
}

function drawLabels() {
    const svg = document.getElementById('networkSvg');
    const labels = [{x: 80, y: 40, text: 'Input Layer'}, 
                   {x: 250, y: 40, text: 'Hidden Layer'}, 
                   {x: 420, y: 40, text: 'Output Layer'},
                   {x: 580, y: 40, text: 'AI Prediction'}];
    
    labels.forEach(label => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', label.x);
        text.setAttribute('y', label.y);
        text.setAttribute('class', 'layer-label');
        text.textContent = label.text;
        svg.appendChild(text);
    });
}

function drawPrediction() {
    const svg = document.getElementById('networkSvg');
    const pos = positions.prediction;
    
    // Create prediction display circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 40);
    circle.setAttribute('fill', '#f8fafc');
    circle.setAttribute('stroke', '#3b82f6');
    circle.setAttribute('stroke-width', 3);
    circle.setAttribute('id', 'predictionCircle');
    svg.appendChild(circle);
    
    // Add emoji
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('x', pos.x);
    emoji.setAttribute('y', pos.y - 8);
    emoji.setAttribute('text-anchor', 'middle');
    emoji.setAttribute('dominant-baseline', 'middle');
    emoji.setAttribute('font-size', '20px');
    emoji.setAttribute('id', 'predictionEmoji');
    emoji.textContent = '🤔';
    svg.appendChild(emoji);
    
    // Add confidence/result text
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    result.setAttribute('x', pos.x);
    result.setAttribute('y', pos.y + 12);
    result.setAttribute('text-anchor', 'middle');
    result.setAttribute('dominant-baseline', 'middle');
    result.setAttribute('font-size', '10px');
    result.setAttribute('font-weight', '600');
    result.setAttribute('fill', '#475569');
    result.setAttribute('id', 'predictionResult');
    result.textContent = 'Thinking...';
    svg.appendChild(result);
}

function updatePrediction() {
    const dogProb = activations.output[0];
    const notDogProb = activations.output[1];
    const predicted = dogProb > 0.5;
    const confidence = Math.abs(dogProb - 0.5) * 2; // 0 to 1 scale
    
    // Determine if prediction is correct
    const expectedDog = trueLabel === 'dog';
    const isCorrect = predicted === expectedDog;
    
    // Update emoji based on prediction and correctness
    let emoji = '🤔'; // default thinking
    let circleColor = '#3b82f6'; // default blue
    
    if (dogProb > 0 || notDogProb > 0) { // Has made a prediction
        if (predicted) {
            emoji = isCorrect ? '🐕✅' : '🐕❌'; // Dog prediction
        } else {
            emoji = isCorrect ? '❌✅' : '❌🐕'; // Not-dog prediction  
        }
        
        // Color based on correctness
        circleColor = isCorrect ? '#10b981' : '#ef4444'; // green/red
    }
    
    // Update elements
    const predictionEmoji = document.getElementById('predictionEmoji');
    const predictionResult = document.getElementById('predictionResult');
    const predictionCircle = document.getElementById('predictionCircle');
    
    if (predictionEmoji) predictionEmoji.textContent = emoji;
    if (predictionCircle) predictionCircle.setAttribute('stroke', circleColor);
    
    if (predictionResult) {
        if (dogProb > 0 || notDogProb > 0) {
            const confidenceText = `${(confidence * 100).toFixed(0)}%`;
            const predictionText = predicted ? 'DOG' : 'NOT-DOG';
            predictionResult.textContent = `${predictionText} (${confidenceText})`;
        } else {
            predictionResult.textContent = 'Thinking...';
        }
    }
}

// Enhanced connection highlighting functions
function highlightSubNetwork(fromLayer, toLayer, targetNeuron = null) {
    // Clear previous highlights
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
    
    if (targetNeuron !== null) {
        // Highlight connections to specific target neuron and related neurons
        if (fromLayer === 'input' && toLayer === 'hidden') {
            // Highlight target hidden neuron
            const targetHiddenNeuron = document.getElementById(`hidden-neuron-${targetNeuron}`);
            if (targetHiddenNeuron) targetHiddenNeuron.classList.add('sub-network-highlight');
            
            for (let i = 0; i < networkConfig.inputSize; i++) {
                const line = document.getElementById(`conn-input-${i}-hidden-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                // Highlight contributing input neurons
                const inputNeuron = document.getElementById(`input-neuron-${i}`);
                if (inputNeuron) inputNeuron.classList.add('sub-network-highlight');
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            // Highlight target output neuron
            const targetOutputNeuron = document.getElementById(`output-neuron-${targetNeuron}`);
            if (targetOutputNeuron) targetOutputNeuron.classList.add('sub-network-highlight');
            
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                const line = document.getElementById(`conn-hidden-${h}-output-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                // Highlight contributing hidden neurons
                const hiddenNeuron = document.getElementById(`hidden-neuron-${h}`);
                if (hiddenNeuron) hiddenNeuron.classList.add('sub-network-highlight');
            }
        }
    } else {
        // Highlight all connections between layers
        if (fromLayer === 'input' && toLayer === 'hidden') {
            for (let i = 0; i < networkConfig.inputSize; i++) {
                for (let h = 0; h < networkConfig.hiddenSize; h++) {
                    const line = document.getElementById(`conn-input-${i}-hidden-${h}`);
                    if (line) line.classList.add('active-path');
                }
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                for (let o = 0; o < networkConfig.outputSize; o++) {
                    const line = document.getElementById(`conn-hidden-${h}-output-${o}`);
                    if (line) line.classList.add('active-path');
                }
            }
        }
    }
}

function clearSubNetworkHighlights() {
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
}


// Function to create flowing dots along connections using SVG path animation
function createFlowingDots(fromX, fromY, toX, toY, connectionId, duration = 800, direction = 'forward') {
    const svg = document.getElementById('networkSvg');
    const numDots = 3;
    const dots = [];
    
    // Calculate exact connection line endpoints to match the actual SVG lines
    const startX = fromX + 25;  // Right edge of source neuron
    const startY = fromY;       // Center Y of source neuron
    const endX = toX - 25;      // Left edge of target neuron  
    const endY = toY;           // Center Y of target neuron
    
    // Create an invisible path that matches the connection line exactly
    const pathId = `flow-path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create path data for straight line
    let pathData;
    if (direction === 'forward') {
        pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
        // Reverse the path for backward movement
        pathData = `M ${endX} ${endY} L ${startX} ${startY}`;
    }
    
    path.setAttribute('d', pathData);
    path.setAttribute('id', pathId);
    path.style.opacity = '0'; // Make path invisible
    svg.appendChild(path);
    
    // Create dots that will animate along the path
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('class', 'flow-dot');
        
        // Set color based on direction
        if (direction === 'forward') {
            dot.setAttribute('fill', '#10b981');
            dot.style.filter = 'drop-shadow(0 0 4px #10b981)';
        } else {
            dot.setAttribute('fill', '#ef4444');
            dot.style.filter = 'drop-shadow(0 0 4px #ef4444)';
        }
        
        // Position dot at the start of the path
        dot.setAttribute('cx', direction === 'forward' ? startX : endX);
        dot.setAttribute('cy', direction === 'forward' ? startY : endY);
        
        svg.appendChild(dot);
        dots.push(dot);
        
        // Animate dot along the path with staggered delay
        setTimeout(() => {
            const pathLength = path.getTotalLength();
            const animationDuration = duration;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // Get point along the path at current progress
                const point = path.getPointAtLength(progress * pathLength);
                
                dot.setAttribute('cx', point.x);
                dot.setAttribute('cy', point.y);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Remove dot when animation completes
                    if (dot.parentNode) {
                        dot.parentNode.removeChild(dot);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        }, i * 120); // Stagger each dot by 120ms
    }
    
    // Clean up path and any remaining dots after total duration
    setTimeout(() => {
        if (path.parentNode) {
            path.parentNode.removeChild(path);
        }
        dots.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
    }, duration + (numDots * 120) + 200);
}

function setTrueLabel(label) {
    console.log("setTrueLabel called with:", label);
    trueLabel = label;
    console.log("trueLabel is now:", trueLabel);
    
    // Update UI (with safety checks for DOM elements)
    const labelButtons = document.querySelectorAll('.label-btn');
    if (labelButtons.length > 0) {
        labelButtons.forEach(btn => btn.classList.remove('selected'));
        
        const targetButton = document.getElementById(label === 'dog' ? 'labelDog' : 'labelNotDog');
        if (targetButton) {
            targetButton.classList.add('selected');
        } else {
            console.warn("Target label button not found:", label === 'dog' ? 'labelDog' : 'labelNotDog');
        }
        
        const selectedLabel = document.getElementById('selectedLabel');
        if (selectedLabel) {
            selectedLabel.textContent = label === 'dog' ? 'Correct answer: Dog' : 'Correct answer: Not a Dog';
            selectedLabel.style.color = '#065f46';
        } else {
            console.warn("selectedLabel element not found");
        }
    } else {
        console.warn("Label buttons not found in DOM yet");
    }
}

// Global state for tracking demo progress
let demoState = {
    forwardCompleted: false,
    hasResults: false
};

async function runForwardPass() {
    if (isAnimating) return;
    
    console.log("=== FORWARD PASS ONLY ===");
    console.log("Current trueLabel:", trueLabel);
    console.log("Current image:", currentImage);
    
    // Failsafe: Ensure trueLabel is set based on current image
    if (!trueLabel) {
        console.log("trueLabel was null, setting it based on currentImage");
        const correctLabel = (currentImage === 'dog1' || currentImage === 'dog2') ? 'dog' : 'not-dog';
        setTrueLabel(correctLabel);
        console.log("trueLabel set to:", trueLabel);
    }
    
    isAnimating = true;
    document.getElementById('forwardBtn').disabled = true;
    document.getElementById('fullDemoBtn').disabled = true;
    performanceMetrics.totalOperations++;
    
    // Show current weight values at start
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfoDual(
        "🧠 Let's watch the AI think! It's about to multiply numbers and add them up to make its guess...",
        `🧠 <strong>Forward Propagation Started</strong><br>
         🔢 Computing network output using current weights:<br>
         ${formatMatrix(weights.inputToHidden, 'W₁ (Input→Hidden)')}<br>
         ${formatMatrix(weights.hiddenToOutput, 'W₂ (Hidden→Output)')}`
    );
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    const forwardStartTime = performance.now();
    updateStepInfoDual(
        "📥 STEP 1: Converting image features into numbers! Each feature (like size, friendliness) gets a score from 0 to 1.",
        `📥 <strong>Input Layer Activation</strong><br>
         ${formatMatrix(activations.input, 'Input Vector x')}
         <div class="op-description">Feature patterns: A=${activations.input[0].toFixed(3)}, B=${activations.input[1].toFixed(3)}, C=${activations.input[2].toFixed(3)}, D=${activations.input[3].toFixed(3)}</div>`
    );
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfoDual(
        "✖️ STEP 2: Now the magic happens! Each hidden neuron multiplies input numbers by connection strengths (weights), then adds them all up!",
        `✖️ <strong>Hidden Layer Computation</strong><br>
         ${formatOperation("Matrix Multiplication", "h = σ(W₁ᵀ × x)", 
           `[${activations.hidden.map(h => h.toFixed(3)).join(', ')}]`,
           `For each hidden neuron i: h[i] = ${expertConfig.hiddenActivation}(Σⱼ W₁[i,j] × x[j])`)}
         Current activation function: <strong>${expertConfig.hiddenActivation.replace('_', ' ').toUpperCase()}</strong>`
    );
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    updateStepInfoDual(
        "➕ STEP 3: The final decision! Output neurons add up signals from hidden neurons. The strongest signal wins!",
        `➕ <strong>Output Layer Computation</strong><br>
         ${formatOperation("Final Prediction", "y = σ(W₂ᵀ × h)", 
           `[${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]`,
           `For each output j: y[j] = ${expertConfig.outputActivation}(Σᵢ W₂[j,i] × h[i])`)}
         Output activation: <strong>${expertConfig.outputActivation.toUpperCase()}</strong>`
    );
    await animateOutputComputation();
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Update state
    demoState.forwardCompleted = true;
    demoState.hasResults = true;
    
    // Enable backward pass if we have the correct answer
    if (trueLabel) {
        document.getElementById('backwardBtn').disabled = false;
        updateStepInfoDual(
            "🎉 Thinking complete! The AI made its guess. Now click 'Learn' to see how it can improve from mistakes!",
            `🎯 <strong>Forward Pass Complete!</strong><br>
             ⏱️ Computation time: ${performanceMetrics.forwardPassTime}ms<br>
             📊 Final output: [${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]<br>
             🎯 Prediction: <strong>${activations.output[0] > activations.output[1] ? 'DOG' : 'NOT DOG'}</strong><br>
             📈 Confidence: ${Math.abs((activations.output[0] - activations.output[1]) * 100).toFixed(1)}%<br>
             🎓 Ready for backpropagation with target: <strong>${trueLabel.toUpperCase()}</strong>`
        );
    } else {
        updateStepInfoDual(
            "🎉 Thinking complete! Set the correct answer above, then click 'Learn' to see how the AI improves!",
            `🎯 <strong>Forward Pass Complete!</strong><br>
             📊 Network output: [${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]<br>
             ⚠️ Need target label for backpropagation training`
        );
    }
    
    highlightSection('none');
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('fullDemoBtn').disabled = false;
    isAnimating = false;
}

async function runBackwardPass() {
    if (isAnimating || !demoState.forwardCompleted || !trueLabel) {
        if (!demoState.forwardCompleted) {
            updateStepInfo("⚠️ First watch the AI think! Click 'Watch AI Think' to see the forward pass first.");
        } else if (!trueLabel) {
            updateStepInfo("⚠️ Please tell the AI what the correct answer is by clicking one of the teaching buttons above!");
        }
        return;
    }
    
    isAnimating = true;
    document.getElementById('backwardBtn').disabled = true;
    document.getElementById('fullDemoBtn').disabled = true;
    
    await sleep(1000);
    const backpropStartTime = performance.now();
    highlightSection('backward');
    
    updateStepInfo("📚 Time for the AI to learn! It's comparing its guess with the right answer and figuring out how to do better...");
    
    await animateBackpropagation();
    
    performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
    performanceMetrics.epochCount++;
    performanceMetrics.weightUpdates += (networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize);
    
    updateStepInfo("🎉 Learning complete! The AI has adjusted its connection strengths (weights). It should be smarter now! Try running 'Watch AI Think' again to see the difference!");
    
    // Keep weight values visible after training
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    // Make weight changes visible immediately
    refreshAllConnectionVisuals();
    
    // Reset state to allow another forward pass
    demoState.forwardCompleted = false;
    demoState.hasResults = false;
    document.getElementById('backwardBtn').disabled = true;
    
    highlightSection('none');
    document.getElementById('fullDemoBtn').disabled = false;
    isAnimating = false;
    
    // Update prediction column after forward pass completes
    updatePrediction();
}

async function startFullDemo() {
    await runForwardPass();
    if (trueLabel && !isAnimating) {
        await sleep(2000);
        await runBackwardPass();
    }
}

async function startDemo() {
    if (isAnimating) return;
    
    console.log("=== START DEMO CALLED ===");
    console.log("Current trueLabel:", trueLabel);
    console.log("Current image:", currentImage);
    
    // Failsafe: Ensure trueLabel is set based on current image
    if (!trueLabel) {
        console.log("trueLabel was null, setting it based on currentImage");
        const correctLabel = (currentImage === 'dog1' || currentImage === 'dog2') ? 'dog' : 'not-dog';
        setTrueLabel(correctLabel);
        console.log("trueLabel set to:", trueLabel);
    }
    
    const startTime = performance.now();
    isAnimating = true;
    // Button doesn't exist in compact interface
    performanceMetrics.totalOperations++;
    
    
    // Show current weight values at start
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfo("🚀 Let's watch how the AI brain processes this image step by step!");
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    const forwardStartTime = performance.now();
    updateStepInfo("📥 STEP 1: Converting the image into numbers the AI can understand. Each feature gets a score from 0 to 1.");
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfo("🧠 STEP 2: The hidden neurons are doing math! Each one multiplies input numbers by its connection weights, then adds them up.");
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    updateStepInfo("🎯 STEP 3: The output neurons make the final decision by combining all the hidden neuron signals!");
    await animateOutputComputation();
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Step 5: Backpropagation if true label is set
    console.log("Checking backpropagation condition: trueLabel =", trueLabel);
    if (trueLabel) {
        await sleep(2000);
        const backpropStartTime = performance.now();
        highlightSection('backward');
        updateStepInfo("📚 STEP 4: Time to learn! The AI compares its guess with the right answer and adjusts its connection weights to get better next time.");
        await animateBackpropagation();
        
        performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
        performanceMetrics.epochCount++;
        performanceMetrics.weightUpdates += (networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize);
        
        updateStepInfo("🎉 Learning complete! The AI has updated its 'memory' (connection weights) and should be smarter now. Try running it again!");
        
        // Keep weight values visible after training
        document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
        
        // Make weight changes visible immediately
        refreshAllConnectionVisuals();
    } else {
        updateStepInfo("💡 Tip: Select the correct answer above to see how the AI learns from its mistakes!");
    }
    
    highlightSection('none');
    
    // Button doesn't exist in compact interface
    isAnimating = false;
}

async function animateInputActivation() {
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const neuron = document.getElementById(`input-neuron-${i}`);
        const value = document.getElementById(`input-value-${i}`);
        
        neuron.classList.add('forward-active');
        value.textContent = activations.input[i].toFixed(2);
        
        await sleep(300);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
    }
    
    // Update visual properties based on activations
    updateNeuronColors();
}

async function animateForwardPropagation() {
    // Enhanced pedagogical forward propagation with connection highlighting and math overlays
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        // First, highlight ALL connections TO this specific neuron
        highlightSubNetwork('input', 'hidden', h);
        await sleep(600);
        
        // Animate each connection individually with enhanced highlighting and flowing dots
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.input[i].x, positions.input[i].y, 
                                positions.hidden[h].x, positions.hidden[h].y, 
                                `conn-input-${i}-hidden-${h}`, 600);
                
                // Individual connection computation
                const contribution = activations.input[i] * weights.inputToHidden[h][i];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(500);
        
        // Apply Leaky ReLU activation (prevents dead neurons)
        activations.hidden[h] = leakyReLU(sum);
        
        // Update neuron
        const neuron = document.getElementById(`hidden-neuron-${h}`);
        const value = document.getElementById(`hidden-value-${h}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.hidden[h].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
        
        // Update visual properties
        updateNeuronColors();
        
        clearSubNetworkHighlights();
        await sleep(400);
    }
}

async function animateOutputComputation() {
    // Enhanced output computation with pedagogical highlighting
    
    // Compute output layer
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputName = o === 0 ? 'DOG' : 'NOT-DOG';
        
        // First, highlight ALL connections TO this output neuron
        highlightSubNetwork('hidden', 'output', o);
        await sleep(600);
        
        // Animate each connection with enhanced highlighting and flowing dots
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.hidden[h].x, positions.hidden[h].y, 
                                positions.output[o].x, positions.output[o].y, 
                                `conn-hidden-${h}-output-${o}`, 600);
                
                const contribution = activations.hidden[h] * weights.hiddenToOutput[o][h];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(400);
        
        activations.output[o] = sum;
        clearSubNetworkHighlights();
        await sleep(300);
    }
    
    // Apply softmax
    activations.output = softmax(activations.output);
    
    // Update prediction column after output is computed
    updatePrediction();
    
    // Update output neurons
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const neuron = document.getElementById(`output-neuron-${o}`);
        const value = document.getElementById(`output-value-${o}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.output[o].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
    }
    
    // Final visual update
    updateNeuronColors();
}

async function displayResult() {
    const dogProb = activations.output[0] * 100;
    const notDogProb = activations.output[1] * 100;
    const confidence = Math.abs(dogProb - 50); // Distance from 50% = confidence
    
    // Update probability bars
    const dogBar = document.getElementById('dogProbBar');
    const notDogBar = document.getElementById('notDogProbBar');
    
    dogBar.style.width = `${dogProb}%`;
    notDogBar.style.width = `${notDogProb}%`;
    
    // Update confidence meter
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    confidenceFill.style.width = `${confidence * 2}%`; // Scale to 0-100%
    confidenceValue.textContent = `${confidence.toFixed(1)}%`;
    
    // Update percentage text
    document.getElementById('dogProbValue').textContent = `${dogProb.toFixed(1)}%`;
    document.getElementById('notDogProbValue').textContent = `${notDogProb.toFixed(1)}%`;
    
    const prediction = dogProb > notDogProb ? 'CANINE' : 'NON-CANINE';
    const isCorrect = (prediction === 'CANINE' && trueLabel === 'dog') || (prediction === 'NON-CANINE' && trueLabel === 'not-dog');
    
    // Calculate accuracy and loss
    const accuracy = isCorrect ? 1.0 : 0.0;
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    const loss = -target.reduce((sum, t, i) => sum + t * Math.log(Math.max(activations.output[i], 1e-15)), 0);
    
    performanceMetrics.lastAccuracy = accuracy;
    performanceMetrics.lastLoss = loss;
    
    const statusEmoji = isCorrect ? '✅' : '❌';
    const statusText = isCorrect ? 'Correct!' : 'Wrong!';
    
    updateStepInfo(`${statusEmoji} The AI's final answer: "${prediction}" with ${confidence.toFixed(1)}% confidence. ${statusText} ${isCorrect ? 'Great job!' : 'It will learn from this mistake!'}`);
    
    // Highlight the prediction result visually
    const predictionDisplay = document.getElementById('predictionDisplay');
    if (isCorrect) {
        predictionDisplay.style.borderColor = '#10b981';
        predictionDisplay.style.backgroundColor = '#ecfdf5';
    } else {
        predictionDisplay.style.borderColor = '#ef4444';
        predictionDisplay.style.backgroundColor = '#fef2f2';
    }
    
    // Update debug console if open
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
    
    await sleep(2000); // Longer pause to see result
}

async function animateBackpropagation() {
    if (!trueLabel) return;
    
    // Determine target values
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
    // Calculate output layer error (simplified cross-entropy derivative)
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = target[o] - activations.output[o];
    }
    
    // Store gradient information for debug console
    const gradientInfo = {
        outputGradients: [...outputErrors],
        hiddenGradients: [],
        timestamp: Date.now(),
        epoch: performanceMetrics.epochCount + 1
    };
    
    // PEDAGOGICAL MAGIC: Force learning even with dead neurons!
    const maxError = Math.max(...outputErrors.map(Math.abs));
    const prediction = activations.output[0] / (activations.output[0] + activations.output[1]);
    const isNearFiftyFifty = Math.abs(prediction - 0.5) < 0.15; // Within 15% of 50/50
    const hasSmallGradients = maxError < 0.3;
    
    // Check for dead/dying neurons (activations near zero)
    const deadHiddenNeurons = activations.hidden.filter(h => Math.abs(h) < 0.1).length;
    const hasDeadNeurons = deadHiddenNeurons > 0;
    
    // AGGRESSIVE pedagogical learning rate - make it ALWAYS learn!
    let adaptiveLearningRate = networkConfig.learningRate;
    let needsMagic = false;
    
    if (isNearFiftyFifty || hasSmallGradients || hasDeadNeurons) {
        // PEDAGOGICAL MAGIC: Force significant learning regardless of math
        adaptiveLearningRate = networkConfig.learningRate * 5.0; // Even more aggressive!
        needsMagic = true;
        
        if (hasDeadNeurons && isNearFiftyFifty) {
            updateStepInfo("⚡ SUPER LEARNING MODE! Dead neurons detected with 50/50 prediction. Using AI magic to force breakthrough learning!");
        } else if (hasDeadNeurons) {
            updateStepInfo("🔥 NEURON REVIVAL! Some neurons are 'sleeping' - waking them up with extra learning power!");
        } else if (isNearFiftyFifty) {
            updateStepInfo("🚀 CONFUSION BREAKER! 50/50 prediction detected - using teaching magic to push the AI toward a decision!");
        } else {
            updateStepInfo("💪 LEARNING BOOSTER! Small gradients detected - amplifying the learning signal!");
        }
    } else {
        updateStepInfo("🔄 The AI is like a detective working backwards! It's checking each connection: 'Did this connection help me get the right answer or make me more wrong?'");
    }
    
    // Update output to hidden weights with ROBUST gradients
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            connection.classList.add('backward-pass');
            
            // PEDAGOGICAL MAGIC gradient update - force learning!
            let weightUpdate = adaptiveLearningRate * outputErrors[o] * activations.hidden[h];
            
            // DEAD NEURON REVIVAL: Force strong updates regardless of activation
            if (needsMagic) {
                const currentWeight = weights.hiddenToOutput[o][h];
                
                // If this hidden neuron is dead (near zero activation)
                if (Math.abs(activations.hidden[h]) < 0.1) {
                    // FORCE a significant weight change toward the correct answer
                    const forceDirection = target[o] > 0.5 ? 1 : -1;
                    const forcedUpdate = forceDirection * 0.3 * (Math.random() * 0.5 + 0.5);
                    weightUpdate += forcedUpdate;
                }
                
                // Ensure minimum meaningful change
                if (Math.abs(weightUpdate) < 0.1) {
                    const direction = outputErrors[o] > 0 ? 1 : -1;
                    weightUpdate += direction * 0.15;
                }
            }
            
            // More generous clipping for pedagogical magic
            weightUpdate = Math.max(-1.2, Math.min(1.2, weightUpdate));
            
            weights.hiddenToOutput[o][h] += weightUpdate;
            
            // Update weight visualization with change amount
            const newWeight = weights.hiddenToOutput[o][h];
            if (connection) {
                applyWeightVisualization(connection, newWeight);
            }
            // Visual update already handled by applyWeightVisualization above
            
            // Color code the connection based on update
            if (Math.abs(weightUpdate) > 0.01) {
                connection.classList.add(weightUpdate > 0 ? 'positive' : 'negative');
            }
            
            await sleep(300);
            connection.classList.remove('backward-pass', 'positive', 'negative');
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // Leaky ReLU derivative: 1 if hidden activation > 0, 0.1 otherwise
        hiddenErrors[h] = error * leakyReLUDerivative(activations.hidden[h]);
    }
    
    gradientInfo.hiddenGradients = [...hiddenErrors];
    gradientHistory.push(gradientInfo);
    
    // Keep only last 20 gradient entries
    if (gradientHistory.length > 20) {
        gradientHistory.shift();
    }
    
    // Update input to hidden weights with proper gradients
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            connection.classList.add('backward-pass');
            
            // PEDAGOGICAL MAGIC gradient update - force learning here too!
            let weightUpdate = adaptiveLearningRate * hiddenErrors[h] * activations.input[i];
            
            // DEAD NEURON INPUT REVIVAL: Force input connections to wake up neurons
            if (needsMagic) {
                const currentWeight = weights.inputToHidden[h][i];
                
                // If this hidden neuron is dead, boost its input connections
                if (Math.abs(activations.hidden[h]) < 0.1) {
                    // FORCE a significant weight change to help activate the neuron
                    const forceDirection = hiddenErrors[h] > 0 ? 1 : -1;
                    const forcedUpdate = forceDirection * 0.2 * (Math.random() * 0.5 + 0.5);
                    weightUpdate += forcedUpdate;
                }
                
                // Ensure minimum meaningful change
                if (Math.abs(weightUpdate) < 0.08) {
                    const direction = hiddenErrors[h] > 0 ? 1 : -1;
                    weightUpdate += direction * 0.1;
                }
            }
            
            // More generous clipping for pedagogical magic
            weightUpdate = Math.max(-1.0, Math.min(1.0, weightUpdate));
            
            weights.inputToHidden[h][i] += weightUpdate;
            
            // Update weight visualization with change amount
            const newWeight = weights.inputToHidden[h][i];
            if (connection) {
                applyWeightVisualization(connection, newWeight);
            }
            // Visual update already handled by applyWeightVisualization above
            
            // Color code the connection
            if (Math.abs(weightUpdate) > 0.02) {
                connection.classList.add(weightUpdate > 0 ? 'positive' : 'negative');
            }
            
            await sleep(200);
            connection.classList.remove('backward-pass', 'positive', 'negative');
        }
    }
}

function resetDemo() {
    isAnimating = false;
    
    // Reset demo state
    demoState.forwardCompleted = false;
    demoState.hasResults = false;
    
    // Properly reset all button states
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('fullDemoBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true;
    
    // Reset all neuron states
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    
    // Reset all connections
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Don't hide weight values - keep them visible to show learning
    // document.querySelectorAll('.weight-value').forEach(w => w.classList.remove('show'));
    
    // Reset activations display (but keep learned weights!) - using NEW feature system!
    setVisualFeaturesAndLabel(currentImage);
    activations.hidden = [0, 0, 0];
    activations.output = [0, 0];
    
    // Update displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
    // Reset probability bars and confidence
    document.getElementById('dogProbBar').style.width = '0%';
    document.getElementById('notDogProbBar').style.width = '0%';
    document.getElementById('dogProbValue').textContent = '0%';
    document.getElementById('notDogProbValue').textContent = '0%';
    document.getElementById('confidenceFill').style.width = '0%';
    document.getElementById('confidenceValue').textContent = '0%';
    
    // Reset prediction display styling
    const predictionDisplay = document.getElementById('predictionDisplay');
    predictionDisplay.style.borderColor = '#00ccff';
    predictionDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    
    updateStepInfo('🎮 Ready to explore! Choose "Watch AI Think" to see multiplication and addition, or "Watch AI Learn" to see how it improves. Or try the full demo!');
    
    // Enable forward pass button
    document.getElementById('forwardBtn').disabled = false;
    // Button doesn't exist in compact interface
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
}

function updateStepInfo(message) {
    document.getElementById('currentStep').innerHTML = message;
    
}


function highlightSection(phase) {
    // Remove any existing highlights
    document.querySelectorAll('.layer-highlight').forEach(el => {
        el.classList.remove('layer-highlight');
    });
    
    if (phase === 'forward') {
        // Subtle highlighting for forward pass
        document.body.style.setProperty('--current-phase', '"Forward Pass"');
    } else if (phase === 'backward') {
        // Subtle highlighting for backward pass
        document.body.style.setProperty('--current-phase', '"Backward Pass"');
    } else {
        document.body.style.setProperty('--current-phase', '""');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * (11 - animationSpeed) / 10));
}


function updateNeuronColors() {
    console.log('=== UPDATING NEURON COLORS ===');
    
    // Function to get light orange to dark orange color based on activation
    function getActivationColor(activation) {
        // Light orange (low) to Dark orange (high) gradient
        // Low activation: Light orange rgb(255, 218, 185)
        // High activation: Dark orange rgb(204, 85, 0)
        const t = Math.max(0, Math.min(1, activation)); // Clamp to 0-1
        
        const red = Math.round(255 - t * 51);    // 255 -> 204
        const green = Math.round(218 - t * 133); // 218 -> 85  
        const blue = Math.round(185 - t * 185);  // 185 -> 0
        
        return `rgb(${red}, ${green}, ${blue})`;
    }
    
    // Update all neurons with same color scheme
    const layers = ['input', 'hidden', 'output'];
    const activationArrays = [activations.input, activations.hidden, activations.output];
    
    layers.forEach((layer, layerIndex) => {
        const layerActivations = activationArrays[layerIndex];
        for (let i = 0; i < layerActivations.length; i++) {
            const neuron = document.getElementById(`${layer}-neuron-${i}`);
            if (neuron) {
                const activation = layerActivations[i];
                const color = getActivationColor(activation);
                neuron.style.fill = color;
                console.log(`${layer} ${i}: activation=${activation.toFixed(2)}, color=${color}`);
            }
        }
    });
}

function resetWeights() {
    
    // Reinitialize random weights
    initializeNetwork();
    
    // Properly reset activations to match network configuration
    activations = {
        input: new Array(networkConfig.inputSize).fill(0),
        hidden: new Array(networkConfig.hiddenSize).fill(0), 
        output: new Array(networkConfig.outputSize).fill(0)
    };
    
    // Set default input pattern for the current image
    const currentImageElement = document.querySelector('.img-btn.selected');
    if (currentImageElement) {
        const currentImage = currentImageElement.onclick.toString().match(/'([^']+)'/)?.[1] || 'dog1';
        setVisualFeaturesAndLabel(currentImage);
    }
    
    // Reset performance metrics
    performanceMetrics.epochCount = 0;
    performanceMetrics.weightUpdates = 0;
    performanceMetrics.lastAccuracy = 0;
    performanceMetrics.lastLoss = 0;
    gradientHistory = [];
    activationHistory = [];
    weightHistory = [];
    
    // Redraw network with new weights and proper activations
    drawNetwork();
    
    // Reset demo
    resetDemo();
    
    updateStepInfo('🔄 Network has been reset! Ready to learn from scratch.');
    
    // Auto-select appropriate label based on current image
    const currentImageId = document.querySelector('.img-btn.selected').onclick.toString().match(/'([^']+)'/)[1];
    const isDogImage = ['dog1', 'dog2', 'dog3'].includes(currentImageId);
    setTrueLabel(isDogImage ? 'dog' : 'not-dog');
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
    
    // Make weight changes visible immediately
    refreshAllConnectionVisuals();
}

// Standard neural network weight visualization
function applyWeightVisualization(lineElement, weight) {
    const absWeight = Math.abs(weight);
    const maxWeight = 3; // Our slider range
    
    // Red-Gray-Green color scheme: Red for negative, Gray for minimal, Green for positive
    let color;
    if (Math.abs(weight) < 0.05) {
        // Very weak connections - visible medium gray
        color = '#9ca3af';
    } else if (weight > 0) {
        // Positive weights: Gray to Green gradient (lighter to darker based on strength)
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (34 - 156)); // From #9ca3af to #22c55e
        const greenValue = Math.floor(163 + intensity * (197 - 163));
        const blueValue = Math.floor(175 + intensity * (94 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    } else {
        // Negative weights: Gray to Red gradient (lighter to darker based on strength)  
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (220 - 156)); // From #9ca3af to #dc2626
        const greenValue = Math.floor(163 + intensity * (38 - 163));
        const blueValue = Math.floor(175 + intensity * (38 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    }
    
    // Moderate thickness variation for clear visual feedback
    const baseThickness = 1.5;
    const maxThicknessFactor = 3; // More noticeable range: 1.5px to 4.5px
    const thickness = baseThickness + (absWeight / maxWeight) * maxThicknessFactor;
    
    // Opacity as primary importance indicator
    const minOpacity = 0.4;
    const maxOpacity = 0.95;
    const opacity = minOpacity + (absWeight / maxWeight) * (maxOpacity - minOpacity);
    
    // Apply visual properties using inline styles for higher CSS specificity
    lineElement.style.stroke = color;
    lineElement.style.strokeWidth = thickness.toFixed(1) + 'px';
    lineElement.style.opacity = opacity.toFixed(2);
    lineElement.style.strokeDasharray = 'none'; // Always solid lines
}

function addWeightTooltip(lineElement, initialWeight, connectionLabel) {
    // Store connection info in data attributes for dynamic lookup
    const connectionInfo = connectionLabel.split(' → ');
    const fromPart = connectionInfo[0];
    const toPart = connectionInfo[1];
    
    lineElement.setAttribute('data-connection-label', connectionLabel);
    lineElement.setAttribute('data-from', fromPart);
    lineElement.setAttribute('data-to', toPart);
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('weightTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'weightTooltip';
        tooltip.className = 'weight-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Add mouse event listeners
    lineElement.addEventListener('mouseenter', (e) => {
        // Get current weight value from the weights object
        const currentWeight = getCurrentWeightForConnection(connectionLabel);
        
        tooltip.innerHTML = `
            <div class="tooltip-connection">${connectionLabel}</div>
            <div class="tooltip-weight">Weight: <strong>${currentWeight.toFixed(2)}</strong></div>
            <div class="tooltip-effect">${currentWeight > 0 ? '✓ Positive influence' : currentWeight < -0.1 ? '✗ Negative influence' : '○ Minimal effect'}</div>
        `;
        tooltip.style.display = 'block';
        
        // Position tooltip near mouse
        const rect = document.getElementById('networkSvg').getBoundingClientRect();
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
    
    lineElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
    // Update tooltip position on mouse move
    lineElement.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
}

// Helper function to get current weight for a connection based on its label
function getCurrentWeightForConnection(connectionLabel) {
    // Parse the connection label to extract indices
    // Format examples: "Input A → Hidden H1", "Hidden H1 → Dog", "Hidden H2 → Not Dog"
    
    if (connectionLabel.includes('Input') && connectionLabel.includes('Hidden')) {
        // Input to Hidden connection
        const inputMatch = connectionLabel.match(/Input ([ABCD])/);
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        
        if (inputMatch && hiddenMatch) {
            const inputIndex = ['A', 'B', 'C', 'D'].indexOf(inputMatch[1]);
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            return weights.inputToHidden[hiddenIndex][inputIndex];
        }
    } else if (connectionLabel.includes('Hidden') && (connectionLabel.includes('Dog') || connectionLabel.includes('Not Dog'))) {
        // Hidden to Output connection
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        const isDogOutput = connectionLabel.includes('Dog') && !connectionLabel.includes('Not Dog');
        
        if (hiddenMatch) {
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            const outputIndex = isDogOutput ? 0 : 1;
            return weights.hiddenToOutput[outputIndex][hiddenIndex];
        }
    }
    
    // Fallback: return 0 if parsing fails
    console.warn(`Could not parse connection label: ${connectionLabel}`);
    return 0;
}

// Helper function to refresh all connection visuals immediately
function refreshAllConnectionVisuals() {
    // Update all input to hidden connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, weight);
            }
        }
    }
    
    // Update all hidden to output connections
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, weight);
            }
        }
    }
}

// Weight slider functionality
let weightSlidersActive = false;
let weightSliderElements = {};

function toggleWeightSliders() {
    weightSlidersActive = !weightSlidersActive;
    const btn = document.getElementById('whatIfBtn');
    
    if (weightSlidersActive) {
        btn.textContent = '🔧 Exit What If?';
        btn.classList.add('active');
        showWeightSliders();
        updateStepInfo('🔧 Weight Exploration Mode: Drag sliders to see how different weights affect the AI\'s predictions in real-time!');
    } else {
        btn.textContent = '🔧 What If?';
        btn.classList.remove('active');
        hideWeightSliders();
        updateStepInfo('🎮 Ready! Pick "Think", "Learn", or "Full Demo"');
    }
}

function showWeightSliders() {
    // Create and show the weight editing panel instead of inline sliders
    createWeightEditingPanel();
}

function createWeightEditingPanel() {
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'weightEditingPanel';
    panel.className = 'weight-editing-panel';
    
    // Panel header
    const header = document.createElement('div');
    header.className = 'weight-panel-header';
    header.innerHTML = `
        <h3>🔧 Weight Explorer</h3>
        <p>Adjust connection weights to see how they affect predictions</p>
    `;
    
    // Content container
    const content = document.createElement('div');
    content.className = 'weight-panel-content';
    
    // Input to Hidden section
    const inputSection = document.createElement('div');
    inputSection.className = 'weight-section';
    inputSection.innerHTML = '<h4>📥 Input → Hidden Connections</h4>';
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const hiddenGroup = document.createElement('div');
        hiddenGroup.className = 'weight-group';
        hiddenGroup.innerHTML = `<h5>To Hidden Neuron H${h + 1}</h5>`;
        
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weightControl = createWeightControl('input', i, h, weights.inputToHidden[h][i]);
            hiddenGroup.appendChild(weightControl);
        }
        
        inputSection.appendChild(hiddenGroup);
    }
    
    // Hidden to Output section
    const outputSection = document.createElement('div');
    outputSection.className = 'weight-section';
    outputSection.innerHTML = '<h4>📤 Hidden → Output Connections</h4>';
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputGroup = document.createElement('div');
        outputGroup.className = 'weight-group';
        outputGroup.innerHTML = `<h5>To ${o === 0 ? 'Dog' : 'Not Dog'} Output</h5>`;
        
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weightControl = createWeightControl('hidden', h, o, weights.hiddenToOutput[o][h]);
            outputGroup.appendChild(weightControl);
        }
        
        outputSection.appendChild(outputGroup);
    }
    
    content.appendChild(inputSection);
    content.appendChild(outputSection);
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    // Add panel to the page
    document.body.appendChild(panel);
}

function createWeightControl(fromLayer, fromIndex, toIndex, currentWeight) {
    const container = document.createElement('div');
    container.className = 'weight-control';
    
    // Label showing which connection this controls
    const label = document.createElement('label');
    const fromName = fromLayer === 'input' 
        ? ['A', 'B', 'C', 'D'][fromIndex] 
        : `H${fromIndex + 1}`;
    const toName = fromLayer === 'input' 
        ? `H${toIndex + 1}` 
        : (toIndex === 0 ? 'Dog' : 'Not Dog');
    
    label.textContent = `${fromName} → ${toName}`;
    label.className = 'weight-label';
    
    // Slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-3';
    slider.max = '3';
    slider.step = '0.1';
    slider.value = currentWeight;
    slider.className = 'weight-control-slider';
    
    // Value display
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'weight-value-display';
    valueDisplay.textContent = currentWeight.toFixed(2);
    
    // Connection highlighting on hover
    container.addEventListener('mouseenter', () => {
        highlightConnection(fromLayer, fromIndex, toIndex, true);
    });
    
    container.addEventListener('mouseleave', () => {
        highlightConnection(fromLayer, fromIndex, toIndex, false);
    });
    
    // Update weight when slider changes
    slider.addEventListener('input', (e) => {
        const newWeight = parseFloat(e.target.value);
        updateWeight(fromLayer, fromIndex, toIndex, newWeight);
        valueDisplay.textContent = newWeight.toFixed(2);
        
        // Recalculate predictions in real-time
        if (activations.input.some(val => val > 0)) {
            recalculateNetwork();
        }
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    
    return container;
}

function highlightConnection(fromLayer, fromIndex, toIndex, highlight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        if (highlight) {
            connection.style.stroke = '#FFD700';
            connection.style.strokeWidth = '4px';
            connection.style.opacity = '1';
        } else {
            // Reset to weight-based appearance
            const weight = fromLayer === 'input' 
                ? weights.inputToHidden[toIndex][fromIndex]
                : weights.hiddenToOutput[toIndex][fromIndex];
            updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight);
        }
    }
}

function updateWeight(fromLayer, fromIndex, toIndex, newWeight) {
    if (fromLayer === 'input') {
        weights.inputToHidden[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-input-${fromIndex}-hidden-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            // Update tooltip weight value
            updateConnectionTooltip(connection, newWeight, `Input ${['A', 'B', 'C', 'D'][fromIndex]} → Hidden H${toIndex + 1}`);
        }
    } else {
        weights.hiddenToOutput[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-hidden-${fromIndex}-output-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            const outputName = toIndex === 0 ? 'Dog' : 'Not Dog';
            updateConnectionTooltip(connection, newWeight, `Hidden H${fromIndex + 1} → ${outputName}`);
        }
    }
}

function updateConnectionTooltip(lineElement, weight, connectionLabel) {
    // Update the tooltip data for this connection
    lineElement.setAttribute('data-weight', weight);
    lineElement.setAttribute('data-label', connectionLabel);
}

function updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        applyWeightVisualization(connection, weight);
    }
}

function recalculateNetwork() {
    // Recalculate hidden layer activations using expert-configured activation function
    const hiddenActivationFn = getActivationFunction('hidden');
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += activations.input[i] * weights.inputToHidden[h][i];
        }
        activations.hidden[h] = hiddenActivationFn(sum);
    }
    
    // Recalculate output layer activations based on expert configuration
    if (expertConfig.outputActivation === 'softmax') {
        // Calculate raw outputs first, then apply softmax
        const rawOutputs = [];
        for (let o = 0; o < networkConfig.outputSize; o++) {
            let sum = 0;
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
            }
            rawOutputs[o] = sum;
        }
        // Apply softmax activation
        activations.output = softmax(rawOutputs);
    } else {
        // Use sigmoid for each output independently
        for (let o = 0; o < networkConfig.outputSize; o++) {
            let sum = 0;
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
            }
            activations.output[o] = sigmoid(sum);
        }
    }
    
    // Update visual displays
    updateNeuronColors();
    updatePrediction();
}

function hideWeightSliders() {
    // Remove the weight editing panel
    const panel = document.getElementById('weightEditingPanel');
    if (panel) {
        panel.remove();
    }
    
    // Reset connections to proper weight-based visualization
    refreshAllConnectionVisuals();
}

// Comprehensive feature representation debugging
function debugFeatureRepresentation(inputValues, context = '') {
    console.log(`\n🔍 ===== FEATURE REPRESENTATION DEBUG ${context} =====`);
    
    // Input analysis
    console.log('📊 INPUT ANALYSIS:');
    const inputStats = calculateWeightStats(inputValues);
    console.log(`  Values: [${inputValues.slice(0, 8).map(v => v.toFixed(3)).join(', ')}${inputValues.length > 8 ? '...' : ''}]`);
    console.log(`  Stats: min=${inputStats.min.toFixed(4)}, max=${inputStats.max.toFixed(4)}, mean=${inputStats.mean.toFixed(4)}, std=${inputStats.std.toFixed(4)}`);
    
    // Check for problematic patterns
    const zeroCount = inputValues.filter(v => Math.abs(v) < 1e-10).length;
    const duplicateCount = checkValueDuplication(inputValues);
    console.log(`  Zero values: ${zeroCount}/${inputValues.length} (${(100*zeroCount/inputValues.length).toFixed(1)}%)`);
    console.log(`  Duplicate rate: ${(duplicateCount*100).toFixed(1)}% (potential lack of diversity)`);
    
    // Feature diversity analysis
    const diversity = calculateFeatureDiversity(inputValues);
    console.log(`  Feature diversity score: ${diversity.toFixed(4)} (higher = more diverse)`);
    
    // Activation pattern prediction
    console.log('\n🔮 ACTIVATION PREDICTION:');
    predictActivationPatterns(inputValues);
    
    console.log('🔍 ==========================================');
}

// Helper function to check feature duplication
function checkValueDuplication(values) {
    const uniqueValues = new Set(values.map(v => Math.round(v * 1000) / 1000));
    return 1 - (uniqueValues.size / values.length);
}

// Helper function to calculate feature diversity
function calculateFeatureDiversity(values) {
    if (values.length < 2) return 0;
    
    let totalVariation = 0;
    for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
            totalVariation += Math.abs(values[i] - values[j]);
        }
    }
    
    const maxPossibleVariation = values.length * (values.length - 1) / 2;
    return totalVariation / maxPossibleVariation;
}

// Function to predict activation patterns based on inputs and current weights
function predictActivationPatterns(inputValues) {
    // Predict hidden layer activations
    const predictedHidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += inputValues[i] * weights.inputToHidden[h][i];
        }
        predictedHidden[h] = leakyReLU(sum); // Leaky ReLU
    }
    
    console.log(`  Predicted hidden activations: [${predictedHidden.map(v => v.toFixed(3)).join(', ')}]`);
    
    const hiddenStats = calculateWeightStats(predictedHidden);
    console.log(`  Hidden stats: min=${hiddenStats.min.toFixed(4)}, max=${hiddenStats.max.toFixed(4)}, mean=${hiddenStats.mean.toFixed(4)}`);
    
    // Check for dead neurons
    const deadNeurons = predictedHidden.filter(v => Math.abs(v) < 1e-6).length;
    if (deadNeurons > 0) {
        console.log(`  ⚠️ WARNING: ${deadNeurons} potentially dead neurons detected!`);
    }
    
    // Predict output layer
    const predictedOutputs = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += predictedHidden[h] * weights.hiddenToOutput[o][h];
        }
        predictedOutputs[o] = sum;
    }
    
    console.log(`  Predicted raw outputs: [${predictedOutputs.map(v => v.toFixed(3)).join(', ')}]`);
    
    // Apply softmax for final prediction
    const softmaxOutputs = softmax(predictedOutputs);
    
    console.log(`  Final probabilities: [${softmaxOutputs.map(v => (v*100).toFixed(1) + '%').join(', ')}]`);
    
    // Convergence warning
    const maxProb = Math.max(...softmaxOutputs);
    const minProb = Math.min(...softmaxOutputs);
    if (maxProb - minProb < 0.1) {
        console.log('  ⚠️ WARNING: Predictions are very close - possible convergence issue!');
    }
}

// Unit testing functions for network learning
function forwardPropagationSilent(inputValues, debugMode = false) {
    // Set input activations
    activations.input = inputValues;
    
    // DEBUG: Feature representation analysis
    if (debugMode) {
        debugFeatureRepresentation(inputValues, 'FORWARD_PROP');
    }
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += activations.input[i] * weights.inputToHidden[h][i];
        }
        activations.hidden[h] = leakyReLU(sum); // Leaky ReLU activation
        
        // Check for NaN
        if (isNaN(activations.hidden[h])) {
            console.error('NaN in hidden activation!');
            activations.hidden[h] = 0;
        }
    }
    
    // Compute output layer (raw logits)
    const rawOutputs = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
        }
        rawOutputs[o] = sum;
        
        // Check for NaN
        if (isNaN(rawOutputs[o])) {
            console.error('NaN in output activation!');
            rawOutputs[o] = 0;
        }
    }
    
    // Apply softmax with numerical stability
    const maxVal = Math.max(...rawOutputs);
    const expVals = rawOutputs.map(val => {
        const expVal = Math.exp(Math.min(val - maxVal, 700)); // Prevent overflow
        return isNaN(expVal) ? 0.5 : expVal;
    });
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    
    if (sumExp === 0) {
        // Fallback if all exponentials are 0
        activations.output = [0.5, 0.5];
    } else {
        activations.output = expVals.map(val => val / sumExp);
    }
    
    // Final NaN check
    for (let o = 0; o < networkConfig.outputSize; o++) {
        if (isNaN(activations.output[o])) {
            console.error('NaN in final output!');
            activations.output[o] = 0.5;
        }
    }
    
    return activations.output;
}

// Global momentum storage
let momentum = {
    inputToHidden: null,
    hiddenToOutput: null
};

// Weight change tracking for pedagogical visualization
let weightChanges = {
    inputToHidden: null,
    hiddenToOutput: null,
    lastWeights: {
        inputToHidden: null,
        hiddenToOutput: null
    }
};

// Global convergence analysis tracker
let convergenceAnalysis = {
    enabled: false,
    epochCount: 0,
    lossHistory: [],
    accuracyHistory: [],
    weightMagnitudeHistory: [],
    gradientMagnitudeHistory: [],
    convergenceDetected: false,
    convergenceEpoch: -1,
    maxHistoryLength: 50
};

// Initialize momentum arrays and weight change tracking
function initializeMomentum() {
    if (!momentum.inputToHidden) {
        momentum.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
            Array.from({length: networkConfig.inputSize}, () => 0)
        );
    }
    if (!momentum.hiddenToOutput) {
        momentum.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
            Array.from({length: networkConfig.hiddenSize}, () => 0)
        );
    }
    
    // Initialize weight change tracking
    if (!weightChanges.inputToHidden) {
        weightChanges.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
            Array.from({length: networkConfig.inputSize}, () => 0)
        );
        weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(weights.inputToHidden));
    }
    if (!weightChanges.hiddenToOutput) {
        weightChanges.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
            Array.from({length: networkConfig.hiddenSize}, () => 0)
        );
        weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(weights.hiddenToOutput));
    }
}

function backpropagationSilent(target, debugMode = false) {
    initializeMomentum();
    
    // DEBUG: Store initial weights for change monitoring
    let initialWeights = null;
    if (debugMode) {
        initialWeights = {
            inputToHidden: weights.inputToHidden.map(row => [...row]),
            hiddenToOutput: weights.hiddenToOutput.map(row => [...row])
        };
    }
    
    // Calculate cross-entropy loss for better training
    let loss = 0;
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        // Cross-entropy loss derivative
        outputErrors[o] = target[o] - activations.output[o];
        
        // Accumulate loss (cross-entropy)
        if (target[o] > 0) {
            loss -= target[o] * Math.log(Math.max(activations.output[o], 1e-15));
        }
        
        // Check for NaN
        if (isNaN(outputErrors[o])) {
            console.error('NaN in output error!');
            return;
        }
    }
    
    // Update output to hidden weights with gradient clipping
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            let gradient = outputErrors[o] * activations.hidden[h];
            
            // Add L2 regularization (weight decay) to prevent overfitting
            const l2Lambda = 0.001; // Very light regularization for better generalization
            gradient -= l2Lambda * weights.hiddenToOutput[o][h] / networkConfig.learningRate;
            
            // Gradient clipping to prevent explosion
            gradient = Math.max(-5, Math.min(5, gradient));
            
            // Simple momentum update with lower momentum for better generalization
            const momentumFactor = 0.5; // Reduced momentum for stability
            momentum.hiddenToOutput[o][h] = momentumFactor * momentum.hiddenToOutput[o][h] + 
                                           networkConfig.learningRate * gradient;
            
            const weightUpdate = momentum.hiddenToOutput[o][h];
            
            // Check for NaN
            if (isNaN(weightUpdate)) {
                console.error('NaN in weight update!');
                continue;
            }
            
            // Store weight change for pedagogical visualization
            const oldWeight = weights.hiddenToOutput[o][h];
            weights.hiddenToOutput[o][h] += weightUpdate;
            
            // Ensure weight stays within reasonable bounds
            weights.hiddenToOutput[o][h] = Math.max(-3, Math.min(3, weights.hiddenToOutput[o][h]));
            
            // Track the actual change that occurred
            weightChanges.hiddenToOutput[o][h] = weights.hiddenToOutput[o][h] - weightChanges.lastWeights.hiddenToOutput[o][h];
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // Leaky ReLU derivative: 1 if hidden activation > 0, 0.1 otherwise
        hiddenErrors[h] = error * leakyReLUDerivative(activations.hidden[h]);
        
        // Check for NaN
        if (isNaN(hiddenErrors[h])) {
            console.error('NaN in hidden error!');
            hiddenErrors[h] = 0;
        }
    }
    
    // Update input to hidden weights with gradient clipping
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            let gradient = hiddenErrors[h] * activations.input[i];
            
            // Add L2 regularization (weight decay) to prevent overfitting
            const l2Lambda = 0.001; // Very light regularization for better generalization
            gradient -= l2Lambda * weights.inputToHidden[h][i] / networkConfig.learningRate;
            
            // Gradient clipping to prevent explosion
            gradient = Math.max(-5, Math.min(5, gradient));
            
            // Simple momentum update with lower momentum for better generalization
            const momentumFactor = 0.5; // Reduced momentum for stability
            momentum.inputToHidden[h][i] = momentumFactor * momentum.inputToHidden[h][i] + 
                                          networkConfig.learningRate * gradient;
            
            const weightUpdate = momentum.inputToHidden[h][i];
            
            // Check for NaN
            if (isNaN(weightUpdate)) {
                console.error('NaN in input weight update!');
                continue;
            }
            
            // Store weight change for pedagogical visualization
            const oldWeight = weights.inputToHidden[h][i];
            weights.inputToHidden[h][i] += weightUpdate;
            
            // Ensure weight stays within reasonable bounds
            weights.inputToHidden[h][i] = Math.max(-3, Math.min(3, weights.inputToHidden[h][i]));
            
            // Track the actual change that occurred
            weightChanges.inputToHidden[h][i] = weights.inputToHidden[h][i] - weightChanges.lastWeights.inputToHidden[h][i];
        }
    }
    
    // DEBUG: Weight change analysis
    if (debugMode && initialWeights) {
        debugWeightChanges(initialWeights, target);
    }
    
    // Update last weights for next comparison
    updateLastWeights();
}

// Comprehensive weight change debugging
function debugWeightChanges(initialWeights, target) {
    console.log('\n⚖️ ===== WEIGHT CHANGE ANALYSIS =====');
    
    // Calculate weight changes
    const inputWeightChanges = [];
    const outputWeightChanges = [];
    
    // Analyze input->hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const change = weights.inputToHidden[h][i] - initialWeights.inputToHidden[h][i];
            inputWeightChanges.push(change);
        }
    }
    
    // Analyze hidden->output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const change = weights.hiddenToOutput[o][h] - initialWeights.hiddenToOutput[o][h];
            outputWeightChanges.push(change);
        }
    }
    
    // Statistics on weight changes
    const inputChangeStats = calculateWeightStats(inputWeightChanges);
    const outputChangeStats = calculateWeightStats(outputWeightChanges);
    
    console.log('📊 WEIGHT UPDATE STATISTICS:');
    console.log(`  Input→Hidden changes: ${inputWeightChanges.length} weights`);
    console.log(`    Range: [${inputChangeStats.min.toFixed(6)}, ${inputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${inputChangeStats.mean.toFixed(6)}, Std: ${inputChangeStats.std.toFixed(6)}`);
    
    console.log(`  Hidden→Output changes: ${outputWeightChanges.length} weights`);
    console.log(`    Range: [${outputChangeStats.min.toFixed(6)}, ${outputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${outputChangeStats.mean.toFixed(6)}, Std: ${outputChangeStats.std.toFixed(6)}`);
    
    // Check for problematic patterns
    console.log('\n⚠️ CONVERGENCE ISSUE DETECTION:');
    
    // Check for very small changes (possible convergence)
    const smallInputChanges = inputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    const smallOutputChanges = outputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    
    console.log(`  Tiny changes (<1e-6): Input ${smallInputChanges}/${inputWeightChanges.length} (${(100*smallInputChanges/inputWeightChanges.length).toFixed(1)}%)`);
    console.log(`  Tiny changes (<1e-6): Output ${smallOutputChanges}/${outputWeightChanges.length} (${(100*smallOutputChanges/outputWeightChanges.length).toFixed(1)}%)`);
    
    if (smallInputChanges > inputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most input weights barely changing - possible convergence!');
    }
    if (smallOutputChanges > outputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most output weights barely changing - possible convergence!');
    }
    
    // Check for symmetry in weight changes
    const inputChangeSymmetry = checkWeightSymmetry([inputWeightChanges]);
    const outputChangeSymmetry = checkWeightSymmetry([outputWeightChanges]);
    
    console.log(`  Weight change symmetry: Input=${inputChangeSymmetry.toFixed(6)}, Output=${outputChangeSymmetry.toFixed(6)}`);
    if (inputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Input weight changes are too symmetric!');
    }
    if (outputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Output weight changes are too symmetric!');
    }
    
    // Gradient magnitude analysis
    const inputGradMagnitude = Math.sqrt(inputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    const outputGradMagnitude = Math.sqrt(outputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    
    console.log(`\n📈 GRADIENT ANALYSIS:`);
    console.log(`  Input gradient magnitude: ${inputGradMagnitude.toFixed(6)}`);
    console.log(`  Output gradient magnitude: ${outputGradMagnitude.toFixed(6)}`);
    
    if (inputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in input layer!');
    }
    if (outputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in output layer!');
    }
    if (inputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in input layer!');
    }
    if (outputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in output layer!');
    }
    
    // Target analysis
    console.log(`\n🎯 TARGET ANALYSIS:`);
    console.log(`  Target: [${target.map(t => t.toFixed(3)).join(', ')}]`);
    console.log(`  Current output: [${activations.output.map(o => o.toFixed(3)).join(', ')}]`);
    
    const error = target.map((t, i) => t - activations.output[i]);
    const errorMagnitude = Math.sqrt(error.reduce((sum, e) => sum + e*e, 0));
    console.log(`  Error: [${error.map(e => e.toFixed(3)).join(', ')}]`);
    console.log(`  Error magnitude: ${errorMagnitude.toFixed(6)}`);
    
    if (errorMagnitude < 0.01) {
        console.log('  ✅ Very low error - network converging well');
    } else if (errorMagnitude > 1.0) {
        console.log('  ⚠️ High error - network struggling to learn');
    }
    
    console.log('⚖️ ====================================');
}

// Comprehensive convergence analysis system
function enableConvergenceAnalysis() {
    convergenceAnalysis.enabled = true;
    convergenceAnalysis.epochCount = 0;
    convergenceAnalysis.lossHistory = [];
    convergenceAnalysis.accuracyHistory = [];
    convergenceAnalysis.weightMagnitudeHistory = [];
    convergenceAnalysis.gradientMagnitudeHistory = [];
    convergenceAnalysis.convergenceDetected = false;
    convergenceAnalysis.convergenceEpoch = -1;
    console.log('🔍 CONVERGENCE ANALYSIS ENABLED');
}

function analyzeConvergence(loss, accuracy, trainingData) {
    if (!convergenceAnalysis.enabled) return;
    
    convergenceAnalysis.epochCount++;
    
    // Record metrics
    convergenceAnalysis.lossHistory.push(loss);
    convergenceAnalysis.accuracyHistory.push(accuracy);
    
    // Calculate weight magnitude
    const allWeights = [
        ...weights.inputToHidden.flat(),
        ...weights.hiddenToOutput.flat()
    ];
    const weightMagnitude = Math.sqrt(allWeights.reduce((sum, w) => sum + w*w, 0));
    convergenceAnalysis.weightMagnitudeHistory.push(weightMagnitude);
    
    // Keep only recent history
    if (convergenceAnalysis.lossHistory.length > convergenceAnalysis.maxHistoryLength) {
        convergenceAnalysis.lossHistory.shift();
        convergenceAnalysis.accuracyHistory.shift();
        convergenceAnalysis.weightMagnitudeHistory.shift();
        convergenceAnalysis.gradientMagnitudeHistory.shift();
    }
    
    // Check for convergence every 5 epochs
    if (convergenceAnalysis.epochCount % 5 === 0) {
        detectConvergenceIssues(trainingData);
    }
}

function detectConvergenceIssues(trainingData) {
    const recentCount = Math.min(10, convergenceAnalysis.lossHistory.length);
    if (recentCount < 5) return; // Need at least 5 data points
    
    console.log(`\n📈 ===== CONVERGENCE ANALYSIS (Epoch ${convergenceAnalysis.epochCount}) =====`);
    
    const recentLoss = convergenceAnalysis.lossHistory.slice(-recentCount);
    const recentAccuracy = convergenceAnalysis.accuracyHistory.slice(-recentCount);
    const recentWeightMag = convergenceAnalysis.weightMagnitudeHistory.slice(-recentCount);
    
    // Loss trend analysis
    const lossChange = recentLoss[recentLoss.length - 1] - recentLoss[0];
    const lossVariance = calculateWeightStats(recentLoss).std;
    console.log(`📊 Loss Analysis:`);
    console.log(`  Current loss: ${recentLoss[recentLoss.length - 1].toFixed(6)}`);
    console.log(`  Change over last ${recentCount} epochs: ${lossChange.toFixed(6)}`);
    console.log(`  Loss variance: ${lossVariance.toFixed(6)}`);
    
    // Accuracy trend analysis
    const accuracyChange = recentAccuracy[recentAccuracy.length - 1] - recentAccuracy[0];
    console.log(`🎯 Accuracy Analysis:`);
    console.log(`  Current accuracy: ${(recentAccuracy[recentAccuracy.length - 1] * 100).toFixed(1)}%`);
    console.log(`  Change over last ${recentCount} epochs: ${(accuracyChange * 100).toFixed(1)}%`);
    
    // Weight magnitude analysis
    const weightChange = recentWeightMag[recentWeightMag.length - 1] - recentWeightMag[0];
    console.log(`⚖️ Weight Analysis:`);
    console.log(`  Current weight magnitude: ${recentWeightMag[recentWeightMag.length - 1].toFixed(6)}`);
    console.log(`  Weight magnitude change: ${weightChange.toFixed(6)}`);
    
    // Convergence detection
    let issuesDetected = [];
    
    // Plateau detection
    if (Math.abs(lossChange) < 1e-6 && lossVariance < 1e-6) {
        issuesDetected.push('Loss plateau - network stopped learning');
        if (!convergenceAnalysis.convergenceDetected) {
            convergenceAnalysis.convergenceDetected = true;
            convergenceAnalysis.convergenceEpoch = convergenceAnalysis.epochCount;
        }
    }
    
    // Accuracy plateau
    if (Math.abs(accuracyChange) < 0.01 && recentAccuracy[recentAccuracy.length - 1] < 0.9) {
        issuesDetected.push('Accuracy plateau - may have reached local minimum');
    }
    
    // Weight stagnation
    if (Math.abs(weightChange) < 1e-6) {
        issuesDetected.push('Weight stagnation - weights barely changing');
    }
    
    // Same prediction issue
    const predictionDiversity = checkPredictionDiversity(trainingData);
    if (predictionDiversity < 0.1) {
        issuesDetected.push('Prediction uniformity - all inputs produce similar outputs');
    }
    
    // Report issues
    if (issuesDetected.length > 0) {
        console.log('\n🚨 CONVERGENCE ISSUES DETECTED:');
        issuesDetected.forEach(issue => console.log(`  ⚠️ ${issue}`));
        
        console.log('\n💡 DEBUGGING SUGGESTIONS:');
        console.log('  • Check feature representation with debugFeatureRepresentation()');
        console.log('  • Verify weight initialization with debugWeightInitialization()');
        console.log('  • Enable weight change monitoring in training loops');
        console.log('  • Consider adjusting learning rate or adding regularization');
    } else {
        console.log('\n✅ No major convergence issues detected');
    }
    
    console.log('📈 =============================================');
}

function checkPredictionDiversity(trainingData) {
    const predictions = [];
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        predictions.push(output[0]); // Just check first output
    });
    
    const predictionStats = calculateWeightStats(predictions);
    return predictionStats.std; // Higher std = more diverse predictions
}

// Function to enable deep debugging mode
function enableDeepDebugging() {
    console.log('🔧 ===== ENABLING DEEP DEBUGGING MODE =====');
    enableConvergenceAnalysis();
    
    // Override forwardPropagationSilent and backpropagationSilent to always use debug mode
    const originalForward = window.forwardPropagationSilent;
    const originalBackward = window.backpropagationSilent;
    
    window.forwardPropagationSilent = function(inputValues, debugMode = true) {
        return originalForward.call(this, inputValues, debugMode);
    };
    
    window.backpropagationSilent = function(target, debugMode = true) {
        return originalBackward.call(this, target, debugMode);
    };
    
    console.log('✅ Deep debugging enabled - all training will show detailed logs');
    console.log('🔧 ==========================================');
}

// Update the baseline weights for change tracking
function updateLastWeights() {
    weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(weights.inputToHidden));
    weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(weights.hiddenToOutput));
}

// Function to display weight changes on the network visualization
function showWeightChanges() {
    if (!weightChanges.inputToHidden || !weightChanges.hiddenToOutput) return;
    
    // Show input-to-hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
    
    // Show hidden-to-output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
}

function generateSimpleTrainingData() {
    // Generate simple, well-separated training data for better generalization
    const trainingData = [];
    
    // Generate 12 dog examples with clear patterns
    for (let i = 0; i < 12; i++) {
        // Dogs: medium-large, friendly, bark, domestic
        const size = 0.6 + Math.random() * 0.3; // Dogs: medium to large (0.6-0.9)
        const friendliness = 0.8 + Math.random() * 0.2; // Dogs: friendly (0.8-1.0)
        const bark = 0.9 + Math.random() * 0.1; // Dogs: bark a lot (0.9-1.0)
        const domestic = 0.9 + Math.random() * 0.1; // Dogs: highly domestic (0.9-1.0)
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [1, 0],
            label: `Dog${i+1}`,
            isDog: true
        });
    }
    
    // Generate 12 non-dog examples with clear separation
    for (let i = 0; i < 12; i++) {
        let size, friendliness, bark, domestic, label;
        
        if (i < 6) {
            // Cats - clearly different from dogs
            size = 0.2 + Math.random() * 0.2; // Small (0.2-0.4)
            friendliness = 0.4 + Math.random() * 0.3; // Moderate (0.4-0.7)
            bark = 0.0 + Math.random() * 0.1; // Don't bark (0.0-0.1)
            domestic = 0.6 + Math.random() * 0.2; // Somewhat domestic (0.6-0.8)
            label = `Cat${i+1}`;
        } else {
            // Objects - very different from biological entities
            size = Math.random() * 0.6; // Variable size (0.0-0.6)
            friendliness = 0.0 + Math.random() * 0.1; // No friendliness (0.0-0.1)
            bark = 0.0 + Math.random() * 0.1; // No barking (0.0-0.1)
            domestic = 0.0 + Math.random() * 0.1; // No domestication (0.0-0.1)
            label = `Object${i-5}`;
        }
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [0, 1],
            label: label,
            isDog: false
        });
    }
    
    // Simple shuffling without normalization for better interpretability
    
    // Shuffle the data
    for (let i = trainingData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trainingData[i], trainingData[j]] = [trainingData[j], trainingData[i]];
    }
    
    return trainingData;
}

// Test optimal learning sequence for back-and-forth learning
function testOptimalLearningSequence() {
    console.log('=== TESTING OPTIMAL 4-EXAMPLE LEARNING SEQUENCE ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    console.log('\nLearning Examples:');
    examples.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] -> ${ex.isDog ? 'Dog' : 'Not Dog'}`);
        console.log(`  ${ex.description}`);
    });
    
    // Test initial predictions
    console.log('\n--- BEFORE TRAINING ---');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Simple training with reduced learning rate
    const originalLR = networkConfig.learningRate;
    networkConfig.learningRate = 0.05; // Even more conservative
    
    console.log('\n--- TRAINING (Conservative Learning) ---');
    let epoch = 0;
    const maxEpochs = 30;
    
    while (epoch < maxEpochs) {
        // Single pass through examples
        examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
        
        epoch++;
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            console.log(`\nEpoch ${epoch} results:`);
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
                console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${isCorrect ? 'CORRECT' : 'WRONG'}`);
            });
            
            const accuracy = correct / examples.length;
            console.log(`Accuracy: ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy === 1.0) {
                console.log(`Perfect accuracy achieved at epoch ${epoch}!`);
                break;
            }
        }
    }
    
    // Restore original learning rate
    networkConfig.learningRate = originalLR;
    
    return {
        examples: examples,
        epochsNeeded: epoch,
        finalAccuracy: examples.map(ex => {
            const output = forwardPropagationSilent(ex.input);
            const dogProb = output[0];
            return (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        }).reduce((sum, correct) => sum + (correct ? 1 : 0), 0) / examples.length
    };
}

// Create optimal 3-4 learning examples with clear decision boundaries
function createOptimalLearningSequence() {
    return [
        // Example 1: Clear Dog - maximally dog-like features
        {
            input: [0.8, 0.9, 1.0, 0.95], // large, very friendly, always barks, highly domestic
            target: [1, 0],
            label: 'PrototypeDog',
            isDog: true,
            description: 'Large, very friendly dog that barks and is highly domesticated'
        },
        
        // Example 2: Clear Non-Dog (Cat) - maximally different from dogs
        {
            input: [0.3, 0.6, 0.05, 0.75], // small, moderately friendly, rarely barks, somewhat domestic
            target: [0, 1],
            label: 'PrototypeCat',
            isDog: false,
            description: 'Small, moderately friendly cat that rarely makes noise'
        },
        
        // Example 3: Another Dog - different but clearly dog
        {
            input: [0.65, 0.85, 0.9, 0.9], // medium-large, friendly, barks often, domestic
            target: [1, 0],
            label: 'FamilyDog',
            isDog: true,
            description: 'Medium family dog that is friendly and barks'
        },
        
        // Example 4: Non-Dog Object - completely non-biological
        {
            input: [0.4, 0.05, 0.0, 0.0], // medium size, no friendliness, no barking, not domestic
            target: [0, 1],
            label: 'Object',
            isDog: false,
            description: 'Inanimate object with no biological properties'
        }
    ];
}

function runLearningTest() {
    console.log('=== STARTING LEARNING TEST ===');
    
    // Generate simple training data
    const testCases = generateSimpleTrainingData();
    console.log(`Generated ${testCases.length} simple training examples (${testCases.filter(t => t.isDog).length} dogs, ${testCases.filter(t => !t.isDog).length} non-dogs)`);
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions (before training)
    console.log('--- BEFORE TRAINING ---');
    const initialResults = [];
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
        initialResults.push({ correct, confidence: Math.abs(dogProb - 0.5) });
    });
    
    // Simple, stable training approach
    const maxEpochs = 50;
    console.log(`--- TRAINING FOR UP TO ${maxEpochs} EPOCHS (simple approach) ---`);
    
    let epoch = 0;
    let perfectAccuracyCount = 0;
    
    while (epoch < maxEpochs && perfectAccuracyCount < 3) {
        // Simple training: one pass through all examples
        testCases.forEach(testCase => {
            forwardPropagationSilent(testCase.input);
            backpropagationSilent(testCase.target);
        });
        epoch++;
        
        // Test accuracy every epoch
        let correct = 0;
        testCases.forEach(testCase => {
            const output = forwardPropagationSilent(testCase.input);
            const dogProb = output[0];
            const isCorrect = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
            if (isCorrect) correct++;
        });
        
        const accuracy = correct / testCases.length;
        console.log(`Epoch ${epoch}: Accuracy = ${correct}/${testCases.length} (${(accuracy*100).toFixed(1)}%)`);
        
        // Early stopping if perfect accuracy achieved 3 times in a row
        if (accuracy === 1.0) {
            perfectAccuracyCount++;
            console.log(`Perfect accuracy achieved ${perfectAccuracyCount}/3 times`);
        } else {
            perfectAccuracyCount = 0;
        }
        
        // Stop if converged
        if (perfectAccuracyCount >= 3) {
            console.log(`🎉 CONVERGED! Perfect accuracy maintained for 3 epochs. Total training: ${epoch} epochs`);
            break;
        }
    }
    
    // Test final predictions (after training)
    console.log('--- AFTER TRAINING ---');
    let finalCorrect = 0;
    let totalConfidence = 0;
    
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        const confidence = Math.abs(dogProb - 0.5);
        
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'} (confidence: ${(confidence*100).toFixed(1)}%)`);
        
        if (correct) finalCorrect++;
        totalConfidence += confidence;
    });
    
    const finalAccuracy = finalCorrect / testCases.length;
    const avgConfidence = totalConfidence / testCases.length;
    
    console.log('=== LEARNING TEST RESULTS ===');
    console.log(`Final Accuracy: ${finalCorrect}/${testCases.length} (${(finalAccuracy*100).toFixed(1)}%)`);
    console.log(`Average Confidence: ${(avgConfidence*100).toFixed(1)}%`);
    console.log(`Training Epochs Used: ${epoch} epochs`);
    console.log(`Learning Success: ${finalAccuracy === 1.0 ? 'PERFECT! 🎉' : finalAccuracy >= 0.8 ? 'GOOD ✅' : 'NEEDS WORK ❌'}`);
    
    // Calculate training rounds needed for users
    const trainingRoundsNeeded = Math.ceil(epoch / 2); // Each user demo = ~2 epochs worth of training
    console.log(`📊 USER TRAINING ESTIMATE: Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times to reach 100% accuracy`);
    
    // Update UI with test results  
    updateStepInfo(`🧪 Test Results: ${(finalAccuracy*100).toFixed(1)}% accuracy after ${epoch} epochs. Estimated: Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times for 100% accuracy! ${finalAccuracy === 1.0 ? '🎉 PERFECT' : finalAccuracy >= 0.8 ? '✅ GOOD' : '❌ POOR'}`);
    
    // Redraw network with updated weights
    drawNetwork();
    
    return { 
        accuracy: finalAccuracy, 
        confidence: avgConfidence, 
        epochs: epoch,
        userTrainingRounds: trainingRoundsNeeded,
        passed: finalAccuracy === 1.0 
    };
}

// Advanced training support functions
function initializeOptimalWeights() {
    // Xavier/Glorot initialization for better convergence
    const inputFanIn = networkConfig.inputSize;
    const hiddenFanIn = networkConfig.hiddenSize;
    
    // Input to hidden weights
    const inputToHiddenVariance = Math.sqrt(2.0 / (inputFanIn + networkConfig.hiddenSize));
    weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
        Array.from({length: networkConfig.inputSize}, () => 
            (Math.random() * 2 - 1) * inputToHiddenVariance)
    );
    
    // Hidden to output weights
    const hiddenToOutputVariance = Math.sqrt(2.0 / (hiddenFanIn + networkConfig.outputSize));
    weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
        Array.from({length: networkConfig.hiddenSize}, () => 
            (Math.random() * 2 - 1) * hiddenToOutputVariance)
    );
    
}

function advancedBackpropagation(target, sampleWeight = 1.0, trainingState) {
    // Calculate output layer errors
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = (target[o] - activations.output[o]) * sampleWeight;
    }
    
    // Update output to hidden weights with momentum and weight decay
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const gradient = outputErrors[o] * activations.hidden[h];
            
            // Apply momentum
            trainingState.momentum.hiddenToOutput[o][h] = 
                trainingState.momentum.hiddenToOutput[o][h] * 0.9 + 
                gradient * trainingState.currentLearningRate;
            
            // Weight update with decay
            const weightDecay = weights.hiddenToOutput[o][h] * 0.0001;
            weights.hiddenToOutput[o][h] += trainingState.momentum.hiddenToOutput[o][h] - weightDecay;
            
            // Gradient clipping
            weights.hiddenToOutput[o][h] = Math.max(-8, Math.min(8, weights.hiddenToOutput[o][h]));
        }
    }
    
    // Calculate hidden layer errors
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        hiddenErrors[h] = activations.hidden[h] > 0 ? error : 0; // ReLU derivative
    }
    
    // Update input to hidden weights with momentum
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const gradient = hiddenErrors[h] * activations.input[i];
            
            // Apply momentum
            trainingState.momentum.inputToHidden[h][i] = 
                trainingState.momentum.inputToHidden[h][i] * 0.9 + 
                gradient * trainingState.currentLearningRate;
            
            // Weight update with decay
            const weightDecay = weights.inputToHidden[h][i] * 0.0001;
            weights.inputToHidden[h][i] += trainingState.momentum.inputToHidden[h][i] - weightDecay;
            
            // Gradient clipping
            weights.inputToHidden[h][i] = Math.max(-8, Math.min(8, weights.inputToHidden[h][i]));
        }
    }
    
    // Update network config for display
    networkConfig.learningRate = trainingState.currentLearningRate;
}

function adaptLearningRate(trainingState, trainingConfig, accuracy, loss) {
    const history = trainingState.convergenceHistory;
    
    if (history.length < 5) return; // Need some history
    
    const recent = history.slice(-5);
    const improvementRate = (recent[4].accuracy - recent[0].accuracy) / 5;
    
    // Adaptive learning rate based on progress
    if (accuracy >= trainingConfig.adaptiveThreshold) {
        // Fine-tuning phase - reduce learning rate
        trainingState.currentLearningRate *= 0.95;
    } else if (improvementRate < 0.01 && trainingState.stagnationCounter > 5) {
        // Stagnation detected - boost learning rate temporarily
        trainingState.currentLearningRate = Math.min(
            trainingState.currentLearningRate * 1.2, 
            trainingConfig.initialLearningRate
        );
    } else if (accuracy < 0.7) {
        // Early training - maintain higher learning rate
        trainingState.currentLearningRate = Math.max(
            trainingState.currentLearningRate,
            trainingConfig.initialLearningRate * 0.8
        );
    } else {
        // Normal decay
        trainingState.currentLearningRate *= trainingConfig.learningRateDecay;
    }
    
    // Enforce bounds
    trainingState.currentLearningRate = Math.max(
        trainingConfig.minLearningRate,
        Math.min(trainingConfig.initialLearningRate, trainingState.currentLearningRate)
    );
}

function applyAntiStagnationMeasures(trainingState, trainingConfig) {
    // Add small random noise to weights
    const noiseScale = 0.01;
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            weights.inputToHidden[h][i] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            weights.hiddenToOutput[o][h] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    // Boost learning rate temporarily
    trainingState.currentLearningRate = Math.min(
        trainingState.currentLearningRate * 1.5,
        trainingConfig.initialLearningRate
    );
    
}

function applyConvergenceBoost(trainingState, trainingConfig) {
    // Increase learning rate and apply focused training
    trainingState.currentLearningRate = trainingConfig.initialLearningRate * 0.8;
    
    // Reset momentum for fresh gradient flow
    trainingState.momentum.inputToHidden.forEach(row => row.fill(0));
    trainingState.momentum.hiddenToOutput.forEach(row => row.fill(0));
    
}

// COMPLETELY NEW SIMPLE TRAINING ALGORITHM
async function trainToPerfection() {
    if (isAnimating) return;
    console.log('🔄 NEW SIMPLE TRAINING ALGORITHM');
    updateStepInfo('🎯 Starting simple training algorithm...');
    
    // IMPORTANT: Save current user's image and label state before training
    const originalCurrentImage = currentImage;
    const originalTrueLabel = trueLabel;
    const originalInputActivations = [...activations.input];
    
    console.log(`💾 Saved original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    
    // Create training dataset with all 8 image types
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? 1 : 0, // Simple binary target: 1 = dog, 0 = not-dog
            label: imageType,
            isDog: isDog
        });
    });
    
    console.log(`📊 Training data created:`);
    trainingData.forEach((example, i) => {
        console.log(`${i+1}. ${example.label}: [${example.input.join(', ')}] → target: ${example.target}`);
    });
    
    // Initialize network with very simple weights
    initializeNetwork();
    
    // EXTREMELY SIMPLE TRAINING: Just use gradient descent without complex momentum
    const learningRate = 0.3; // Moderate learning rate
    const maxEpochs = 100;
    let bestAccuracy = 0;
    
    for (let epoch = 1; epoch <= maxEpochs; epoch++) {
        let totalError = 0;
        
        // Shuffle data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        for (const example of shuffled) {
            // Forward pass - get single output (probability of being a dog)
            const output = simpleBinaryForward(example.input);
            const error = output - example.target;
            totalError += error * error;
            
            // Simple backward pass - update weights directly
            simpleBinaryBackward(example.input, output, example.target, learningRate);
        }
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0 || epoch === 1) {
            const accuracy = testSimpleBinaryAccuracy(trainingData);
            console.log(`Epoch ${epoch}: Accuracy ${(accuracy*100).toFixed(1)}%, Error ${(totalError/trainingData.length).toFixed(4)}`);
            
            // Show predictions for all examples
            console.log('Predictions:');
            trainingData.forEach(ex => {
                const output = simpleBinaryForward(ex.input);
                const predicted = output > 0.5 ? 'DOG' : 'NOT-DOG';
                const actual = ex.isDog ? 'DOG' : 'NOT-DOG';
                const correct = (output > 0.5) === ex.isDog ? '✅' : '❌';
                console.log(`  ${ex.label}: ${output.toFixed(3)} → ${predicted} (${actual}) ${correct}`);
            });
            
            updateStepInfo(`🔄 Epoch ${epoch}: ${(accuracy*100).toFixed(1)}% accuracy`);
            
            // Update visual representation of weights during training
            refreshAllConnectionVisuals();
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
            }
            
            if (accuracy >= 1.0) {
                console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
                updateStepInfo(`🏆 Training Complete! 100% accuracy in ${epoch} epochs`);
                
                // IMPORTANT: Restore user's original image and label state after early completion
                console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
                currentImage = originalCurrentImage;
                trueLabel = originalTrueLabel;
                activations.input = originalInputActivations;
                
                // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
                preventAutoLabeling = true;
                
                // Update UI to reflect restored state
                selectImage(originalCurrentImage);
                
                // Wait a moment for async image loading, then restore label and re-enable auto-labeling
                setTimeout(() => {
                    if (originalTrueLabel) {
                        setTrueLabel(originalTrueLabel);
                    }
                    preventAutoLabeling = false;
                    console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
                }, 100);
                
                refreshAllConnectionVisuals(); // Make weight changes visible immediately
                return;
            }
        }
        
        await sleep(100); // Small delay for visualization
    }
    
    const finalAccuracy = testSimpleBinaryAccuracy(trainingData);
    updateStepInfo(`✅ Training Complete: ${(finalAccuracy*100).toFixed(1)}% accuracy`);
    console.log(`Final accuracy: ${(finalAccuracy*100).toFixed(1)}%`);
    
    // IMPORTANT: Restore user's original image and label state after training
    console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    currentImage = originalCurrentImage;
    trueLabel = originalTrueLabel;
    activations.input = originalInputActivations;
    
    // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
    preventAutoLabeling = true;
    
    // Update UI to reflect restored state
    selectImage(originalCurrentImage);
    
    // Wait a moment for async image loading, then restore label and re-enable auto-labeling
    setTimeout(() => {
        if (originalTrueLabel) {
            setTrueLabel(originalTrueLabel);
        }
        preventAutoLabeling = false;
        console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
    }, 100);
    
    refreshAllConnectionVisuals(); // Make weight changes visible immediately
}

// Simple binary forward propagation (single output: probability of being a dog)
function simpleBinaryForward(input) {
    // Input to hidden
    const hidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += input[i] * weights.inputToHidden[h][i];
        }
        hidden[h] = tanhActivation(sum); // Use tanh activation (-1 to 1)
    }
    
    // Hidden to output (single output)
    let outputSum = 0;
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        outputSum += hidden[h] * weights.hiddenToOutput[0][h]; // Just use first output neuron
    }
    
    // Sigmoid activation for binary classification
    const output = 1 / (1 + Math.exp(-outputSum));
    
    // Store activations for backward pass
    activations.input = input;
    activations.hidden = hidden;
    activations.output = [output, 1 - output]; // For compatibility with existing code
    
    return output;
}

// Simple binary backward propagation
function simpleBinaryBackward(input, output, target, learningRate) {
    // Output error
    const outputError = output - target;
    
    // Update hidden to output weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const gradient = outputError * activations.hidden[h] * learningRate;
        weights.hiddenToOutput[0][h] -= gradient; // Only update first output neuron
    }
    
    // Calculate hidden errors
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const error = outputError * weights.hiddenToOutput[0][h];
        // tanh derivative: 1 - tanh²(x)
        hiddenErrors[h] = error * tanhDerivative(activations.hidden[h]);
    }
    
    // Update input to hidden weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const gradient = hiddenErrors[h] * input[i] * learningRate;
            weights.inputToHidden[h][i] -= gradient;
        }
    }
}

// Test accuracy for simple binary classification
function testSimpleBinaryAccuracy(dataset) {
    let correct = 0;
    dataset.forEach(example => {
        const output = simpleBinaryForward(example.input);
        const predicted = output > 0.5;
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}

// Helper function for backpropagation with momentum
function backpropagationWithMomentum(target, learningRate, momentum, momentumInputToHidden, momentumHiddenToOutput) {
    // Calculate output errors for softmax + cross-entropy
    // For softmax + cross-entropy, the gradient is simply: predicted - target
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = activations.output[o] - target[o]; // Note: prediction - target (not target - prediction)
    }
    
    // Update hidden-to-output weights with momentum
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const gradient = learningRate * outputErrors[o] * activations.hidden[h];
            momentumHiddenToOutput[o][h] = momentum * momentumHiddenToOutput[o][h] + gradient;
            weights.hiddenToOutput[o][h] -= momentumHiddenToOutput[o][h]; // Note: SUBTRACT since error = pred - target
            
            // Clip weights to prevent explosion
            weights.hiddenToOutput[o][h] = Math.max(-5, Math.min(5, weights.hiddenToOutput[o][h]));
        }
    }
    
    // Calculate hidden errors
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // Leaky ReLU derivative
        hiddenErrors[h] = error * leakyReLUDerivative(activations.hidden[h]);
    }
    
    // Update input-to-hidden weights with momentum
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const gradient = learningRate * hiddenErrors[h] * activations.input[i];
            momentumInputToHidden[h][i] = momentum * momentumInputToHidden[h][i] + gradient;
            weights.inputToHidden[h][i] -= momentumInputToHidden[h][i]; // Note: SUBTRACT to match output layer
            
            // Clip weights to prevent explosion
            weights.inputToHidden[h][i] = Math.max(-5, Math.min(5, weights.inputToHidden[h][i]));
        }
    }
}

// Helper function to test accuracy
function testAccuracy(dataset) {
    let correct = 0;
    let debugLog = [];
    
    dataset.forEach((example, idx) => {
        const output = forwardPropagationSilent(example.input);
        // With softmax outputs, compare probabilities: output[0] = dog prob, output[1] = not-dog prob
        const predicted = output[0] > output[1]; // True if dog probability > not-dog probability
        const isCorrect = predicted === example.isDog;
        if (isCorrect) correct++;
        
        debugLog.push(`${example.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted ? 'DOG' : 'NOT-DOG'} (actual: ${example.isDog ? 'DOG' : 'NOT-DOG'}) ${isCorrect ? '✅' : '❌'}`);
    });
    
    // Debug: Log all predictions if accuracy is exactly 50%
    const accuracy = correct / dataset.length;
    if (Math.abs(accuracy - 0.5) < 0.001) {
        console.log('🚨 DEBUG: Exactly 50% accuracy detected! Full predictions:');
        debugLog.forEach(log => console.log('  ' + log));
    }
    
    return accuracy;
}

// Hyperparameter tuning function
async function tuneHyperparameters() {
    console.log('🔬 HYPERPARAMETER TUNING EXPERIMENT');
    console.log('Testing different combinations for optimal convergence...\n');
    
    // Create training dataset
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? [1, 0] : [0, 1],
            label: imageType,
            isDog: isDog
        });
    });
    
    // Hyperparameter combinations to test
    const hyperparamSets = [
        // Format: [learningRate, initialMomentum, maxEpochs, description]
        [0.5, 0.8, 150, "High LR, High Momentum"],
        [0.4, 0.7, 150, "Medium-High LR, Med-High Momentum"],
        [0.3, 0.7, 150, "Medium LR, Medium Momentum (Current)"],
        [0.25, 0.8, 150, "Med-Low LR, High Momentum"],
        [0.2, 0.9, 150, "Low LR, Very High Momentum"],
        [0.6, 0.5, 150, "Very High LR, Low Momentum"],
        [0.35, 0.6, 150, "Med LR, Med-Low Momentum"],
        [0.45, 0.85, 120, "High LR, Very High Momentum, Early Stop"],
        [0.3, 0.75, 200, "Medium LR, Med-High Momentum, Extended"],
        [0.4, 0.9, 100, "Med-High LR, Max Momentum, Quick Stop"]
    ];
    
    const results = [];
    
    for (let i = 0; i < hyperparamSets.length; i++) {
        const [learningRate, momentum, maxEpochs, description] = hyperparamSets[i];
        
        console.log(`\n--- Test ${i+1}/${hyperparamSets.length}: ${description} ---`);
        console.log(`LR: ${learningRate}, Momentum: ${momentum}, Max Epochs: ${maxEpochs}`);
        
        // Reset network for fair comparison
        initializeNetwork();
        
        // Run training with these hyperparameters
        const result = await trainWithHyperparams(trainingData, learningRate, momentum, maxEpochs);
        
        results.push({
            index: i + 1,
            description,
            learningRate,
            momentum,
            maxEpochs,
            ...result
        });
        
        // Log result
        const status = result.accuracy === 1.0 ? '🏆 PERFECT' : result.accuracy >= 0.9 ? '🎯 EXCELLENT' : '📈 GOOD';
        console.log(`Result: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
    }
    
    // Analyze results
    console.log('\n🏆 HYPERPARAMETER TUNING RESULTS:');
    console.log('=' .repeat(80));
    
    // Sort by performance (accuracy first, then speed)
    results.sort((a, b) => {
        if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
        return a.epochs - b.epochs;
    });
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        const perfLabel = result.accuracy === 1.0 ? 'PERFECT' : `${(result.accuracy*100).toFixed(1)}%`;
        
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Mom=${result.momentum} → ${perfLabel} in ${result.epochs} epochs`);
        console.log(`     Avg Confidence: ${(result.avgConfidence*100).toFixed(1)}%, Efficiency: ${result.efficiency.toFixed(2)}`);
        console.log('');
    });
    
    // Recommend best hyperparameters
    const best = results[0];
    console.log('🎯 RECOMMENDATION:');
    console.log(`Best hyperparameters: LR=${best.learningRate}, Momentum=${best.momentum}`);
    console.log(`Expected performance: ${(best.accuracy*100).toFixed(1)}% accuracy in ~${best.epochs} epochs`);
    
    return best;
}

// Quick hyperparameter test with multiple trials for statistical validity
async function quickHyperparamTest() {
    console.log('🚀 QUICK HYPERPARAMETER TEST (Multiple Trials)');
    
    // Create training dataset once
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? [1, 0] : [0, 1],
            label: imageType,
            isDog: isDog
        });
    });
    
    // Test promising hyperparameter combinations (5 trials each)
    const testSets = [
        [0.4, 0.8, "High LR + High Momentum"],
        [0.5, 0.7, "Very High LR + Med Momentum"],  
        [0.35, 0.85, "Med-High LR + Very High Momentum"],
        [0.45, 0.75, "High LR + Med-High Momentum"],
        [0.3, 0.9, "Med LR + Max Momentum"]
    ];
    
    const results = [];
    
    for (let setIdx = 0; setIdx < testSets.length; setIdx++) {
        const [lr, mom, desc] = testSets[setIdx];
        console.log(`\n📊 Testing: ${desc} (LR=${lr}, Mom=${mom})`);
        
        const trials = [];
        
        // Run 5 trials for statistical validity
        for (let trial = 0; trial < 5; trial++) {
            initializeNetwork(); // Fresh start each trial
            const result = await trainWithHyperparams(trainingData, lr, mom, 100);
            trials.push(result);
            
            const status = result.accuracy === 1.0 ? '🏆' : result.accuracy >= 0.9 ? '🎯' : '📈';
            console.log(`  Trial ${trial+1}: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
        }
        
        // Calculate statistics
        const accuracies = trials.map(t => t.accuracy);
        const epochs = trials.map(t => t.epochs);
        const perfectTrials = trials.filter(t => t.accuracy === 1.0).length;
        
        const avgAccuracy = accuracies.reduce((a,b) => a+b, 0) / 5;
        const avgEpochs = epochs.reduce((a,b) => a+b, 0) / 5;
        const bestEpochs = Math.min(...epochs);
        const worstEpochs = Math.max(...epochs);
        
        results.push({
            description: desc,
            learningRate: lr,
            momentum: mom,
            avgAccuracy,
            avgEpochs,
            bestEpochs,
            worstEpochs,
            perfectTrials,
            consistency: 1 - (worstEpochs - bestEpochs) / avgEpochs // Lower variation = more consistent
        });
        
        console.log(`  📊 Stats: ${(avgAccuracy*100).toFixed(1)}% avg, ${avgEpochs.toFixed(1)} avg epochs, ${perfectTrials}/5 perfect`);
    }
    
    // Rank results by success rate, then speed
    results.sort((a, b) => {
        if (a.perfectTrials !== b.perfectTrials) return b.perfectTrials - a.perfectTrials;
        if (a.avgAccuracy !== b.avgAccuracy) return b.avgAccuracy - a.avgAccuracy;
        return a.avgEpochs - b.avgEpochs;
    });
    
    console.log('\n🏆 FINAL HYPERPARAMETER RANKINGS:');
    console.log('=' .repeat(70));
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Momentum=${result.momentum}`);
        console.log(`     Success: ${result.perfectTrials}/5 perfect (${(result.avgAccuracy*100).toFixed(1)}% avg)`);
        console.log(`     Speed: ${result.avgEpochs.toFixed(1)} avg epochs (best: ${result.bestEpochs}, worst: ${result.worstEpochs})`);
        console.log(`     Consistency: ${(result.consistency*100).toFixed(1)}%`);
        console.log('');
    });
    
    const winner = results[0];
    console.log('🎯 RECOMMENDED HYPERPARAMETERS:');
    console.log(`Learning Rate: ${winner.learningRate}`);
    console.log(`Momentum: ${winner.momentum}`);
    console.log(`Expected: ${winner.perfectTrials}/5 chance of 100%, avg ${winner.avgEpochs.toFixed(1)} epochs`);
    
    return winner;
}

// Training function with specific hyperparameters (no UI updates for testing)
async function trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs) {
    const targetAccuracy = 1.0;
    let epoch = 0;
    let bestAccuracy = 0;
    let patience = 0;
    const maxPatience = 15;
    
    let momentum = initialMomentum;
    
    // Initialize momentum buffers
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    // Training loop
    while (epoch < maxEpochs) {
        epoch++;
        let epochLoss = 0;
        
        // Shuffle training data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        shuffled.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            
            // Calculate loss
            const loss = -example.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            epochLoss += loss;
            
            // Backward pass
            backpropagationWithMomentum(example.target, learningRate, momentum, 
                                      momentumInputToHidden, momentumHiddenToOutput);
        });
        
        // Test accuracy every 5 epochs
        if (epoch % 5 === 0 || epoch === 1) {
            const accuracy = testAccuracy(trainingData);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                patience = 0;
                
                if (accuracy >= targetAccuracy) {
                    break; // Perfect accuracy achieved
                }
            } else {
                patience++;
                
                if (patience >= 5) {
                    learningRate *= 0.85; // Slightly less aggressive reduction
                    momentum = Math.min(0.95, momentum + 0.03);
                }
                
                if (patience >= maxPatience) {
                    break; // Early stopping
                }
            }
        }
    }
    
    // Final test
    const finalAccuracy = testAccuracy(trainingData);
    let avgConfidence = 0;
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const confidence = Math.max(output[0], output[1]);
        avgConfidence += confidence;
    });
    avgConfidence /= trainingData.length;
    
    return {
        accuracy: finalAccuracy,
        epochs: epoch,
        avgConfidence: avgConfidence,
        efficiency: epoch <= 30 ? 1.0 : Math.max(0.3, 30/epoch),
        converged: finalAccuracy >= targetAccuracy
    };
}

// Tutorial System Functions
function startTutorial() {
    tutorialActive = true;
    tutorialStep = 0;
    
    // Hide tutorial button, show tutorial step
    document.getElementById('startTutorialBtn').style.display = 'none';
    document.getElementById('tutorialStep').style.display = 'block';
    
    showTutorialStep();
}

function showTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    
    // Update navigation buttons
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (tutorialStep === tutorialSteps.length - 1) {
        nextBtn.textContent = 'Start Learning! 🚀';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

function nextTutorialStep() {
    tutorialStep++;
    
    if (tutorialStep >= tutorialSteps.length) {
        skipTutorial();
    } else {
        showTutorialStep();
    }
}

function skipTutorial() {
    tutorialActive = false;
    document.getElementById('tutorialStep').style.display = 'none';
    document.getElementById('startTutorialBtn').style.display = 'inline-block';
}

function completeTutorial() {
    tutorialActive = false;
    tutorialStep = 0;
    
    // Hide tutorial, show tutorial button again
    document.getElementById('tutorialStep').style.display = 'none';
    document.getElementById('startTutorialBtn').style.display = 'block';
    document.getElementById('startTutorialBtn').textContent = '🔄 Restart Tutorial';
    
    // Clear highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    // Enable all controls
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true; // Will be enabled after forward pass
    document.getElementById('fullDemoBtn').disabled = false;
    
    updateStepInfo('🎓 Tutorial complete! You can now explore on your own. Try the "Watch AI Think" button to see the magic happen!');
}

function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial? It helps you understand how AI learning works!')) {
        completeTutorial();
    }
}

// ==================== COMPREHENSIVE NEURAL NETWORK TESTS ====================

function testDeadNeuronPrevention() {
    console.log('=== TESTING DEAD NEURON PREVENTION ===');
    
    initializeNetwork();
    
    // Create a scenario that would cause dead neurons with regular ReLU
    // Set some weights to very negative values
    weights.inputToHidden[0][0] = -10;
    weights.inputToHidden[1][1] = -8;
    
    // Test with different inputs
    const testInputs = [
        [0.5, 0.5, 0.5, 0.5],
        [0.1, 0.9, 0.3, 0.7],
        [0.8, 0.2, 0.6, 0.4]
    ];
    
    let deadNeuronCount = 0;
    let totalActivations = 0;
    
    testInputs.forEach((input, idx) => {
        const output = forwardPropagationSilent(input);
        
        activations.hidden.forEach((activation, neuronIdx) => {
            if (Math.abs(activation) < 1e-10) {
                deadNeuronCount++;
            }
            totalActivations++;
        });
        
        console.log(`Test ${idx + 1}: Hidden=[${activations.hidden.map(a => a.toFixed(3)).join(', ')}] Output=[${output.map(o => o.toFixed(3)).join(', ')}]`);
    });
    
    const deadNeuronRate = deadNeuronCount / totalActivations;
    console.log(`Dead Neuron Rate: ${(deadNeuronRate * 100).toFixed(1)}% (${deadNeuronCount}/${totalActivations})`);
    
    return {
        passed: deadNeuronRate < 0.3, // Less than 30% dead neurons is acceptable
        deadNeuronRate: deadNeuronRate,
        message: deadNeuronRate < 0.3 ? '✅ PASS: Leaky ReLU prevents most dead neurons' : '❌ FAIL: Too many dead neurons detected'
    };
}

function testGeneralization() {
    console.log('=== TESTING GENERALIZATION ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split data: 70% training, 30% testing
    const splitIdx = Math.floor(trainingData.length * 0.7);
    const trainSet = trainingData.slice(0, splitIdx);
    const testSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, testing on ${testSet.length} examples`);
    
    // Train the network
    for (let epoch = 0; epoch < 50; epoch++) {
        trainSet.forEach(example => {
            forwardPropagationSilent(example.input);
            backpropagationSilent(example.target);
        });
    }
    
    // Test on training set
    let trainCorrect = 0;
    trainSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        if (predicted === actual) trainCorrect++;
    });
    
    // Test on test set
    let testCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    testSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) testCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const trainAccuracy = trainCorrect / trainSet.length;
    const testAccuracy = testCorrect / testSet.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Training Accuracy: ${(trainAccuracy * 100).toFixed(1)}%`);
    console.log(`Test Accuracy: ${(testAccuracy * 100).toFixed(1)}%`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const generalizationGap = trainAccuracy - testAccuracy;
    const balancedAccuracy = (dogAccuracy + nonDogAccuracy) / 2;
    
    console.log(`Generalization Gap: ${(generalizationGap * 100).toFixed(1)}%`);
    console.log(`Balanced Accuracy: ${(balancedAccuracy * 100).toFixed(1)}%`);
    
    // Good generalization: small gap, high balanced accuracy
    const goodGeneralization = generalizationGap < 0.15 && balancedAccuracy > 0.7;
    
    return {
        passed: goodGeneralization,
        trainAccuracy: trainAccuracy,
        testAccuracy: testAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        generalizationGap: generalizationGap,
        balancedAccuracy: balancedAccuracy,
        message: goodGeneralization ? '✅ PASS: Network generalizes well to both classes' : '❌ FAIL: Poor generalization detected'
    };
}

function testWeightInitialization() {
    console.log('=== TESTING WEIGHT INITIALIZATION ===');
    
    const numTests = 10;
    const results = [];
    
    for (let test = 0; test < numTests; test++) {
        initializeNetwork();
        
        // Check weight distribution
        const allWeights = [
            ...weights.inputToHidden.flat(),
            ...weights.hiddenToOutput.flat()
        ];
        
        const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
        const variance = allWeights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / allWeights.length;
        const std = Math.sqrt(variance);
        
        // Test initial forward pass - shouldn't have extreme activations
        const testInput = [0.5, 0.5, 0.5, 0.5];
        const output = forwardPropagationSilent(testInput);
        
        const maxHiddenActivation = Math.max(...activations.hidden.map(Math.abs));
        const outputSum = output.reduce((sum, val) => sum + val, 0);
        
        results.push({
            mean: mean,
            std: std,
            maxHiddenActivation: maxHiddenActivation,
            outputSum: outputSum
        });
    }
    
    // Analyze results
    const avgMean = results.reduce((sum, r) => sum + Math.abs(r.mean), 0) / results.length;
    const avgStd = results.reduce((sum, r) => sum + r.std, 0) / results.length;
    const avgMaxHidden = results.reduce((sum, r) => sum + r.maxHiddenActivation, 0) / results.length;
    
    console.log(`Average weight mean: ${avgMean.toFixed(4)} (should be close to 0)`);
    console.log(`Average weight std: ${avgStd.toFixed(4)} (should be reasonable for He init)`);
    console.log(`Average max hidden activation: ${avgMaxHidden.toFixed(3)} (shouldn't be extreme)`);
    
    // Good initialization: mean near 0, reasonable std, no extreme activations
    const goodInit = avgMean < 0.1 && avgStd > 0.1 && avgStd < 1.0 && avgMaxHidden < 10;
    
    return {
        passed: goodInit,
        avgMean: avgMean,
        avgStd: avgStd,
        avgMaxHidden: avgMaxHidden,
        message: goodInit ? '✅ PASS: Weight initialization is good' : '❌ FAIL: Poor weight initialization'
    };
}

function runComprehensiveTests() {
    console.log('🧪 RUNNING COMPREHENSIVE NEURAL NETWORK TESTS...\n');
    
    const tests = [
        { name: 'Dead Neuron Prevention', fn: testDeadNeuronPrevention },
        { name: 'Weight Initialization', fn: testWeightInitialization },
        { name: 'Generalization', fn: testGeneralization },
        { name: '100% Accuracy Achievement', fn: test100PercentAccuracy }
    ];
    
    const results = [];
    
    tests.forEach(test => {
        console.log(`\n--- ${test.name.toUpperCase()} ---`);
        const result = test.fn();
        result.testName = test.name;
        results.push(result);
        console.log(result.message);
    });
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
        console.log(`${result.testName}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    console.log(`\nOverall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 ALL TESTS PASSED! The neural network is working properly.');
    } else {
        console.log('⚠️ Some tests failed. Check the issues above.');
    }
    
    return {
        passed: passed,
        total: total,
        results: results,
        success: passed === total
    };
}

// Enhanced test for 100% accuracy
function test100PercentAccuracy() {
    console.log('=== TESTING 100% ACCURACY TARGET ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split into train/validation sets
    const splitIdx = Math.floor(trainingData.length * 0.8);
    const trainSet = trainingData.slice(0, splitIdx);
    const validSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, validating on ${validSet.length} examples`);
    
    // Train with advanced techniques
    let epoch = 0;
    let bestAccuracy = 0;
    let perfectEpochs = 0;
    const maxEpochs = 200;
    
    while (epoch < maxEpochs && perfectEpochs < 10) {
        // Curriculum learning with increasing difficulty
        const curriculumSize = Math.min(20 + epoch * 2, trainSet.length);
        const currentSet = trainSet.slice(0, curriculumSize);
        
        // Adaptive learning rate
        networkConfig.learningRate = Math.max(0.01, 0.3 * Math.exp(-epoch * 0.015));
        
        // Multiple passes per epoch
        const passes = epoch < 50 ? 8 : epoch < 100 ? 5 : 3;
        for (let pass = 0; pass < passes; pass++) {
            currentSet.forEach(example => {
                forwardPropagationSilent(example.input);
                backpropagationSilent(example.target);
            });
        }
        
        epoch++;
        
        // Test on validation set every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            validSet.forEach(example => {
                const output = forwardPropagationSilent(example.input);
                const predicted = output[0] > output[1];
                if (predicted === example.isDog) correct++;
            });
            
            const accuracy = correct / validSet.length;
            console.log(`Epoch ${epoch}: Validation Accuracy = ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                perfectEpochs = 0;
            }
            
            if (accuracy === 1.0) {
                perfectEpochs++;
                console.log(`Perfect accuracy achieved! (${perfectEpochs}/10 confirmations)`);
            }
        }
    }
    
    // Final comprehensive test on all data
    let totalCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) totalCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const overallAccuracy = totalCorrect / trainingData.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Final Results after ${epoch} epochs:`);
    console.log(`Overall Accuracy: ${(overallAccuracy * 100).toFixed(1)}% (${totalCorrect}/${trainingData.length})`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const achieved100Percent = overallAccuracy === 1.0 && dogAccuracy === 1.0 && nonDogAccuracy === 1.0;
    
    return {
        passed: achieved100Percent,
        overallAccuracy: overallAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        epochsUsed: epoch,
        message: achieved100Percent ? '🎉 PERFECT! 100% accuracy achieved on all classes!' : 
                `❌ Failed to reach 100% accuracy. Best: ${(Math.max(overallAccuracy, dogAccuracy, nonDogAccuracy) * 100).toFixed(1)}%`
    };
}

// Test back-and-forth learning stability
function testBackAndForthLearning() {
    console.log('=== TESTING BACK-AND-FORTH LEARNING STABILITY ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    // Train on first two examples (one dog, one cat)
    console.log('\n--- PHASE 1: Learning Dog vs Cat ---');
    const phase1Examples = [examples[0], examples[1]]; // PrototypeDog, PrototypeCat
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 1
    console.log('\nAfter learning Dog vs Cat:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Train on next two examples (another dog, an object)
    console.log('\n--- PHASE 2: Adding Family Dog vs Object ---');
    const phase2Examples = [examples[2], examples[3]]; // FamilyDog, Object
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase2Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 2
    console.log('\nAfter adding more examples:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Go back to training on original examples to test stability
    console.log('\n--- PHASE 3: Returning to Dog vs Cat (stability test) ---');
    
    for (let epoch = 0; epoch < 10; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Final test
    console.log('\nFinal results after back-and-forth learning:');
    let finalCorrect = 0;
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        if (correct) finalCorrect++;
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    const finalAccuracy = finalCorrect / examples.length;
    const stable = finalAccuracy >= 0.75; // At least 3/4 correct
    
    console.log(`\nStability Test: ${stable ? 'PASSED' : 'FAILED'} (${(finalAccuracy * 100).toFixed(1)}% accuracy)`);
    
    return {
        passed: stable,
        finalAccuracy: finalAccuracy,
        examples: examples,
        message: stable ? '✅ Network maintains learning stability' : '❌ Network shows instability in back-and-forth learning'
    };
}

// Simplified network capacity test
function testSimplifiedNetwork() {
    console.log('=== TESTING 4-NEURON NETWORK SUFFICIENCY ===');
    
    const examples = createOptimalLearningSequence();
    const results = [];
    
    // Test multiple random initializations
    for (let trial = 0; trial < 5; trial++) {
        initializeNetwork();
        
        let epoch = 0;
        const maxEpochs = 50;
        let finalAccuracy = 0;
        
        while (epoch < maxEpochs) {
            examples.forEach(ex => {
                forwardPropagationSilent(ex.input);
                backpropagationSilent(ex.target);
            });
            epoch++;
            
            // Check accuracy
            let correct = 0;
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
            });
            
            finalAccuracy = correct / examples.length;
            if (finalAccuracy === 1.0) break; // Early stopping
        }
        
        results.push({
            trial: trial + 1,
            epochs: epoch,
            accuracy: finalAccuracy
        });
        
        console.log(`Trial ${trial + 1}: ${(finalAccuracy * 100).toFixed(1)}% accuracy in ${epoch} epochs`);
    }
    
    const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
    const perfectTrials = results.filter(r => r.accuracy === 1.0).length;
    const avgEpochs = results.reduce((sum, r) => sum + r.epochs, 0) / results.length;
    
    console.log(`\nSummary: ${perfectTrials}/5 trials achieved 100% accuracy`);
    console.log(`Average accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`Average epochs needed: ${avgEpochs.toFixed(1)}`);
    
    const sufficient = avgAccuracy >= 0.9; // 90% average accuracy
    
    return {
        passed: sufficient,
        avgAccuracy: avgAccuracy,
        perfectTrials: perfectTrials,
        avgEpochs: avgEpochs,
        message: sufficient ? '✅ 4 neurons are sufficient for this task' : '❌ 4 neurons may be insufficient'
    };
}

// Pixel Viewer Functions
let pixelData = null;
let selectedPixel = null;

function openPixelViewer() {
    const modal = document.getElementById('pixelViewerModal');
    modal.style.display = 'flex';
    
    // Initialize the pixel viewer with current image
    drawOriginalImage();
    drawInteractivePixelGrid();
    updatePatternValues();
    
    // Add hover effects to original image
    addImageHoverEffects();
}

function closePixelViewer() {
    document.getElementById('pixelViewerModal').style.display = 'none';
}

function drawOriginalImage() {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    // Get current input image data
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    
    // Scale and draw the current image with smooth scaling to fit perfectly
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(inputCanvas, 0, 0, 140, 140, 0, 0, 140, 140);
    
    // Store pixel data for interactive use
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    pixelData = extractPixelValues(imageData);
}

function addImageHoverEffects() {
    const canvas = document.getElementById('originalImageCanvas');
    
    canvas.addEventListener('mouseenter', () => {
        canvas.style.filter = 'brightness(1.1)';
    });
    
    canvas.addEventListener('mouseleave', () => {
        canvas.style.filter = 'brightness(1)';
        clearAllHighlights();
    });
    
    // Add mousemove to track position and highlight corresponding pixel
    canvas.addEventListener('mousemove', (event) => {
        highlightCorrespondingPixel(event);
    });
    
    canvas.addEventListener('click', (event) => {
        highlightCorrespondingPixel(event, true); // true for persistent highlight
    });
}

function highlightCorrespondingPixel(event, persistent = false) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert mouse position to pixel grid coordinates (8x8)
    const gridX = Math.floor((x / 140) * 8);
    const gridY = Math.floor((y / 140) * 8);
    
    // Ensure coordinates are within bounds
    if (gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 8) {
        const pixelIndex = gridY * 8 + gridX;
        
        if (persistent) {
            selectedPixel = pixelIndex;
            updatePixelInfo(pixelIndex);
        }
        
        // Highlight the corresponding pixel in the grid
        highlightPixelInGrid(gridX, gridY, persistent);
        
        // Show overlay on original image
        showImageAreaOverlay(x, y);
    }
}

function showImageAreaOverlay(x, y) {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate the pixel area bounds
    const cellSize = 140 / 8;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay
    ctx.fillStyle = 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#FFC107';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function extractPixelValues(imageData) {
    const gridSize = 8;
    const values = [];
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            values.push({
                x, y,
                value: gray,
                color: `rgb(${r}, ${g}, ${b})`,
                brightness: Math.round(gray * 255)
            });
        }
    }
    return values;
}

function drawInteractivePixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    if (!pixelData) return;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Draw pixels with interactive highlighting
    pixelData.forEach((pixel, index) => {
        const x = pixel.x;
        const y = pixel.y;
        
        // Fill with pixel color
        ctx.fillStyle = pixel.color;
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add selection highlight
        if (selectedPixel === index) {
            ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add number overlay for brightness
        ctx.fillStyle = pixel.brightness > 127 ? '#000' : '#fff';
        ctx.font = '10px bold monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pixel.value.toFixed(1), 
            offsetX + x * cellSize + cellSize/2, 
            offsetY + y * cellSize + cellSize/2);
    });
    
    // Add click handler
    canvas.onclick = handlePixelClick;
    canvas.style.cursor = 'pointer';
    
    // Add hover effects for pixel grid
    canvas.addEventListener('mousemove', handlePixelHover);
    canvas.addEventListener('mouseleave', () => {
        clearAllHighlights();
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) pixelInfo.innerHTML = 'Hover over pixels!';
    });
}

function handlePixelClick(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel was clicked
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        selectedPixel = pixelIndex;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        pixelInfo.innerHTML = `
            <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
            Brightness: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#333';
        
        // Redraw grid with highlight
        drawInteractivePixelGrid();
        
        // Highlight corresponding input neuron
        highlightInputNeuron(pixelIndex);
    }
}

function handlePixelHover(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel is being hovered
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) {
            pixelInfo.innerHTML = `
                <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
                Value: ${pixel.value.toFixed(2)}
            `;
        }
        
        // Highlight corresponding area in original image
        highlightCorrespondingImageArea(pixelX, pixelY);
        
        // Highlight current pixel in grid
        highlightPixelInGrid(pixelX, pixelY, false);
    }
}

function highlightPixelInGrid(gridX, gridY, persistent = false) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    // Redraw the grid first
    drawInteractivePixelGrid();
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Add highlight overlay
    ctx.fillStyle = persistent ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = persistent ? '#3B82F6' : '#FFC107';
    ctx.lineWidth = persistent ? 3 : 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function highlightCorrespondingImageArea(gridX, gridY) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay for the corresponding area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function updatePixelInfo(pixelIndex) {
    if (!pixelData || pixelIndex >= pixelData.length) return;
    
    const pixel = pixelData[pixelIndex];
    const pixelInfo = document.getElementById('pixelInfo');
    if (pixelInfo) {
        pixelInfo.innerHTML = `
            <strong>Selected: Pixel (${pixel.x}, ${pixel.y})</strong><br>
            Value: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#2563eb';
    }
}

function clearAllHighlights() {
    // Redraw both canvases to clear all highlights
    drawOriginalImage();
    drawInteractivePixelGrid();
}

function drawInputNeuronVisualization() {
    const container = document.getElementById('inputNeurons');
    container.innerHTML = '';
    
    if (!pixelData) return;
    
    // Create 64 input neurons (8x8 grid)
    pixelData.forEach((pixel, index) => {
        const neuron = document.createElement('div');
        neuron.className = 'input-neuron';
        neuron.style.backgroundColor = `rgb(${pixel.brightness}, ${pixel.brightness}, ${pixel.brightness})`;
        neuron.textContent = pixel.value.toFixed(1);
        neuron.title = `Input #${index + 1}: ${pixel.value.toFixed(2)}`;
        
        // Add click handler
        neuron.onclick = () => {
            selectedPixel = index;
            drawInteractivePixelGrid();
            highlightInputNeuron(index);
            
            const pixelInfo = document.getElementById('pixelInfo');
            pixelInfo.innerHTML = `
                <strong>Input #${index + 1}</strong><br>
                From pixel (${pixel.x}, ${pixel.y}): ${pixel.value.toFixed(2)}
            `;
        };
        
        container.appendChild(neuron);
    });
}

function highlightInputNeuron(index) {
    // Remove previous highlights
    document.querySelectorAll('.input-neuron').forEach(neuron => {
        neuron.classList.remove('neuron-active');
    });
    
    // Highlight selected neuron
    const neurons = document.querySelectorAll('.input-neuron');
    if (neurons[index]) {
        neurons[index].classList.add('neuron-active');
    }
}

function drawPixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data from input canvas
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    // Draw 8x8 pixel grid with visible boundaries
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel from the scaled region (140x140 -> 8x8)
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Fill the cell with the pixel color
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

function drawNumberGrid() {
    const canvas = document.getElementById('numberGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data and convert to normalized values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel and normalize
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Convert to grayscale and normalize (0-1)
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const normalized = gray.toFixed(1);
            
            // Color background based on brightness
            const brightness = gray * 255;
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw the normalized value
            ctx.fillStyle = brightness > 127 ? '#000' : '#fff';
            ctx.fillText(normalized, 
                offsetX + x * cellSize + cellSize/2, 
                offsetY + y * cellSize + cellSize/2);
            
            // Grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

function displayAIInputNumbers() {
    const container = document.getElementById('aiInputNumbers');
    
    // Get normalized pixel values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const values = [];
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            values.push(gray.toFixed(2));
        }
    }
    
    // Display as a formatted array
    container.innerHTML = `
        <div class="number-array">
            <div class="array-label">Input array (64 numbers):</div>
            <div class="array-values">[${values.slice(0, 8).join(', ')}, ..., ${values.slice(-8).join(', ')}]</div>
            <div class="array-note">Each number represents the brightness of one pixel (0 = black, 1 = white)</div>
        </div>
    `;
}



// Make test functions available globally for console testing
window.runComprehensiveTests = runComprehensiveTests;
window.testDeadNeuronPrevention = testDeadNeuronPrevention;
window.testGeneralization = testGeneralization;
window.testWeightInitialization = testWeightInitialization;
window.runLearningTest = runLearningTest;
window.test100PercentAccuracy = test100PercentAccuracy;
window.showWeightChanges = showWeightChanges;
window.testOptimalLearningSequence = testOptimalLearningSequence;
window.testBackAndForthLearning = testBackAndForthLearning;
window.testSimplifiedNetwork = testSimplifiedNetwork;
window.createOptimalLearningSequence = createOptimalLearningSequence;
window.tuneHyperparameters = tuneHyperparameters;
window.quickHyperparamTest = quickHyperparamTest;
window.debugTraining = debugTraining;

// Debug function to test the training manually
async function debugTraining() {
    console.log('🔬 MANUAL TRAINING DEBUG');
    
    // Create a simple 2-example dataset manually
    const debugData = [
        {
            input: [0.9, 0.8, 0.9, 0.8], // Clear DOG pattern
            target: [1, 0], // Should predict DOG
            label: 'test_dog',
            isDog: true
        },
        {
            input: [0.2, 0.1, 0.2, 0.3], // Clear NOT-DOG pattern  
            target: [0, 1], // Should predict NOT-DOG
            label: 'test_not_dog',
            isDog: false
        }
    ];
    
    console.log('🎯 Debug dataset:');
    debugData.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] → target: [${ex.target.join(', ')}]`);
    });
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions
    console.log('\n📊 INITIAL PREDICTIONS (before training):');
    debugData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted}`);
    });
    
    // Train for a few epochs manually
    const lr = 0.5; // High learning rate for debugging
    const mom = 0.9;
    
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    for (let epoch = 1; epoch <= 10; epoch++) {
        let totalLoss = 0;
        
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            
            // Calculate loss
            const loss = -ex.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            totalLoss += loss;
            
            // Backprop
            backpropagationWithMomentum(ex.target, lr, mom, momentumInputToHidden, momentumHiddenToOutput);
        });
        
        const avgLoss = totalLoss / debugData.length;
        let correct = 0;
        
        console.log(`\n--- Epoch ${epoch} (Loss: ${avgLoss.toFixed(4)}) ---`);
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
            const isCorrect = (output[0] > output[1]) === ex.isDog;
            if (isCorrect) correct++;
            
            const status = isCorrect ? '✅' : '❌';
            console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} ${status}`);
        });
        
        const accuracy = correct / debugData.length;
        console.log(`Accuracy: ${(accuracy*100).toFixed(1)}%`);
        
        if (accuracy === 1.0) {
            console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
            break;
        }
    }
}

// Function to update pattern values in pixel viewer
function updatePatternValues() {
    // Get current input activation values
    const patternA = activations.input[0];
    const patternB = activations.input[1];
    const patternC = activations.input[2];
    const patternD = activations.input[3];
    
    // Update the HTML elements if they exist
    const patternAElement = document.getElementById('patternAValue');
    const patternBElement = document.getElementById('patternBValue');
    const patternCElement = document.getElementById('patternCValue');
    const patternDElement = document.getElementById('patternDValue');
    
    if (patternAElement) patternAElement.textContent = patternA.toFixed(2);
    if (patternBElement) patternBElement.textContent = patternB.toFixed(2);
    if (patternCElement) patternCElement.textContent = patternC.toFixed(2);
    if (patternDElement) patternDElement.textContent = patternD.toFixed(2);
    
    // Update pattern calculation descriptions
    const patternACalc = document.getElementById('patternACalc');
    const patternBCalc = document.getElementById('patternBCalc');
    const patternCCalc = document.getElementById('patternCCalc');
    const patternDCalc = document.getElementById('patternDCalc');
    
    if (patternACalc) patternACalc.textContent = `Top-left region → ${patternA.toFixed(2)}`;
    if (patternBCalc) patternBCalc.textContent = `Top-right region → ${patternB.toFixed(2)}`;
    if (patternCCalc) patternCCalc.textContent = `Bottom-left region → ${patternC.toFixed(2)}`;
    if (patternDCalc) patternDCalc.textContent = `Bottom-right region → ${patternD.toFixed(2)}`;
}

// Pattern region highlighting functions for pixel viewer
function highlightPixelRegions(pattern) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    const ctx = canvas.getContext('2d');
    
    // Define which pixels belong to each pattern region (8x8 grid)
    const regionMap = {
        'A': [], // Top-left quadrant
        'B': [], // Top-right quadrant  
        'C': [], // Bottom-left quadrant
        'D': []  // Bottom-right quadrant
    };
    
    // Fill region maps based on 8x8 grid quadrants
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const index = y * 8 + x;
            if (x < 4 && y < 4) regionMap['A'].push(index);        // Top-left
            else if (x >= 4 && y < 4) regionMap['B'].push(index);  // Top-right
            else if (x < 4 && y >= 4) regionMap['C'].push(index);  // Bottom-left
            else if (x >= 4 && y >= 4) regionMap['D'].push(index); // Bottom-right
        }
    }
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Highlight the specific pattern region in pixel grid
    const highlightPixels = regionMap[pattern] || [];
    
    highlightPixels.forEach(pixelIndex => {
        const pixel = pixelData[pixelIndex];
        const x = pixel.x;
        const y = pixel.y;
        
        // Add highlight overlay
        ctx.fillStyle = 'rgba(255, 193, 7, 0.6)';
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add thicker border
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
    });
    
    // Also highlight corresponding area in original image
    highlightPatternInOriginalImage(pattern);
}

function highlightPatternInOriginalImage(pattern) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8; // 8x8 grid
    
    // Redraw original image first
    drawOriginalImage();
    
    // Define the quadrant boundaries for each pattern
    const quadrantMap = {
        'A': { startX: 0, startY: 0, width: 4, height: 4 },     // Top-left
        'B': { startX: 4, startY: 0, width: 4, height: 4 },     // Top-right
        'C': { startX: 0, startY: 4, width: 4, height: 4 },     // Bottom-left
        'D': { startX: 4, startY: 4, width: 4, height: 4 }      // Bottom-right
    };
    
    const quadrant = quadrantMap[pattern];
    if (!quadrant) return;
    
    // Calculate pixel coordinates for the quadrant
    const startX = quadrant.startX * cellSize;
    const startY = quadrant.startY * cellSize;
    const width = quadrant.width * cellSize;
    const height = quadrant.height * cellSize;
    
    // Get pattern-specific color
    const patternColors = {
        'A': 'rgba(255, 107, 107, 0.4)', // Red (pattern-a color)
        'B': 'rgba(76, 205, 196, 0.4)',  // Teal (pattern-b color)
        'C': 'rgba(69, 183, 209, 0.4)',  // Blue (pattern-c color)
        'D': 'rgba(249, 202, 36, 0.4)'   // Yellow (pattern-d color)
    };
    
    const patternBorders = {
        'A': '#FF6B6B', // Red
        'B': '#4ECDC4', // Teal
        'C': '#45B7D1', // Blue
        'D': '#F9CA24'  // Yellow
    };
    
    // Add highlight overlay
    ctx.fillStyle = patternColors[pattern] || 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(startX, startY, width, height);
    
    // Add border
    ctx.strokeStyle = patternBorders[pattern] || '#FFC107';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, width, height);
    
    // Add pattern label overlay
    ctx.fillStyle = patternBorders[pattern] || '#FFC107';
    ctx.font = '14px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `Pattern ${pattern}`,
        startX + width / 2,
        startY + height / 2
    );
}

function clearHighlight() {
    // Redraw both canvases to clear all highlights
    drawInteractivePixelGrid();
    drawOriginalImage();
}

// ===== GLOBAL DEBUGGING COMMANDS =====
// Expose debugging functions to global scope for console access
window.enableDeepDebugging = enableDeepDebugging;
window.debugFeatureRepresentation = debugFeatureRepresentation;
window.debugWeightInitialization = debugWeightInitialization;
window.enableConvergenceAnalysis = enableConvergenceAnalysis;
window.checkPredictionDiversity = checkPredictionDiversity;
window.analyzeConvergence = analyzeConvergence;

// Convenient debugging starter function
window.startDeepDebug = function() {
    console.log('\n🚀 ===== STARTING DEEP DEBUG SESSION =====');
    enableDeepDebugging();
    console.log('\n📊 Current network state:');
    debugWeightInitialization();
    console.log('\n🔍 Feature analysis of current input:');
    debugFeatureRepresentation(activations.input, 'CURRENT_STATE');
    console.log('\n✅ Deep debugging session initialized!');
    console.log('💡 Now run any training function to see detailed analysis.');
    console.log('🚀 =========================================\n');
};

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
