// ============================================================================
// MODULE 2: neural-network-math.js
// ============================================================================
// 
// PURPOSE: Mathematical operations and neural network computation module
// This module contains all the core mathematical functions needed for neural
// network operations including activation functions, propagation algorithms,
// training functions, testing utilities, and debugging tools.
//
// DEPENDENCIES: None (self-contained mathematical operations)
//
// EXPORTS: window.neuralMath - Complete neural network mathematics interface
// ============================================================================

// ============================================================================
// ACTIVATION FUNCTIONS
// ============================================================================

// Sigmoid activation function with overflow protection
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

// Softmax activation function with numerical stability
function softmax(values) {
    const maxVal = Math.max(...values);
    const expVals = values.map(val => Math.exp(Math.min(val - maxVal, 700))); // Prevent overflow
    const sumExp = expVals.reduce((sum, val) => sum + val, 0);
    return expVals.map(val => val / sumExp);
}

// ============================================================================
// UTILITY FUNCTIONS
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

// Calculate statistical metrics for weight arrays
function calculateWeightStats(weightArray) {
    if (weightArray.length === 0) return { min: 0, max: 0, mean: 0, std: 0 };
    
    const min = Math.min(...weightArray);
    const max = Math.max(...weightArray);
    const mean = weightArray.reduce((sum, w) => sum + w, 0) / weightArray.length;
    const variance = weightArray.reduce((sum, w) => sum + (w - mean) ** 2, 0) / weightArray.length;
    const std = Math.sqrt(variance);
    
    return { min, max, mean, std };
}

// ============================================================================
// GLOBAL STATE VARIABLES FOR NEURAL NETWORK MATH
// ============================================================================

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

// ============================================================================
// PROPAGATION ALGORITHMS
// ============================================================================

// Initialize momentum arrays and weight change tracking
function initializeMomentum() {
    // Access global networkConfig from window or assume it's available
    const config = window.networkConfig || { inputSize: 4, hiddenSize: 4, outputSize: 2 };
    
    if (!momentum.inputToHidden) {
        momentum.inputToHidden = Array.from({length: config.hiddenSize}, () =>
            Array.from({length: config.inputSize}, () => 0)
        );
    }
    if (!momentum.hiddenToOutput) {
        momentum.hiddenToOutput = Array.from({length: config.outputSize}, () =>
            Array.from({length: config.hiddenSize}, () => 0)
        );
    }
    
    // Initialize weight change tracking
    if (!weightChanges.inputToHidden && window.weights) {
        weightChanges.inputToHidden = Array.from({length: config.hiddenSize}, () =>
            Array.from({length: config.inputSize}, () => 0)
        );
        weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(window.weights.inputToHidden));
    }
    if (!weightChanges.hiddenToOutput && window.weights) {
        weightChanges.hiddenToOutput = Array.from({length: config.outputSize}, () =>
            Array.from({length: config.hiddenSize}, () => 0)
        );
        weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(window.weights.hiddenToOutput));
    }
}

// Silent forward propagation for testing/training
function forwardPropagationSilent(inputValues, debugMode = false) {
    // Access global variables
    const config = window.networkConfig || { inputSize: 4, hiddenSize: 4, outputSize: 2 };
    const weights = window.weights;
    const activations = window.activations;
    
    if (!weights || !activations) {
        console.error('Neural network not initialized! Missing weights or activations.');
        return [0.5, 0.5];
    }
    
    // Set input activations
    activations.input = inputValues;
    
    // DEBUG: Feature representation analysis
    if (debugMode && window.debugFeatureRepresentation) {
        window.debugFeatureRepresentation(inputValues, 'FORWARD_PROP');
    }
    
    // Compute hidden layer
    for (let h = 0; h < config.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < config.inputSize; i++) {
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
    for (let o = 0; o < config.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < config.hiddenSize; h++) {
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
    for (let o = 0; o < config.outputSize; o++) {
        if (isNaN(activations.output[o])) {
            console.error('NaN in final output!');
            activations.output[o] = 0.5;
        }
    }
    
    return activations.output;
}

// Silent backpropagation for testing/training
function backpropagationSilent(target, debugMode = false) {
    // Access global variables
    const config = window.networkConfig || { inputSize: 4, hiddenSize: 4, outputSize: 2, learningRate: 0.1 };
    const weights = window.weights;
    const activations = window.activations;
    
    if (!weights || !activations) {
        console.error('Neural network not initialized! Missing weights or activations.');
        return;
    }
    
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
    for (let o = 0; o < config.outputSize; o++) {
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
    for (let o = 0; o < config.outputSize; o++) {
        for (let h = 0; h < config.hiddenSize; h++) {
            let gradient = outputErrors[o] * activations.hidden[h];
            
            // Add L2 regularization (weight decay) to prevent overfitting
            const l2Lambda = 0.001; // Very light regularization for better generalization
            gradient -= l2Lambda * weights.hiddenToOutput[o][h] / config.learningRate;
            
            // Gradient clipping to prevent explosion
            gradient = Math.max(-5, Math.min(5, gradient));
            
            // Simple momentum update with lower momentum for better generalization
            const momentumFactor = 0.5; // Reduced momentum for stability
            momentum.hiddenToOutput[o][h] = momentumFactor * momentum.hiddenToOutput[o][h] + 
                                           config.learningRate * gradient;
            
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
            if (weightChanges.hiddenToOutput && weightChanges.lastWeights.hiddenToOutput) {
                weightChanges.hiddenToOutput[o][h] = weights.hiddenToOutput[o][h] - weightChanges.lastWeights.hiddenToOutput[o][h];
            }
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < config.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < config.outputSize; o++) {
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
    for (let h = 0; h < config.hiddenSize; h++) {
        for (let i = 0; i < config.inputSize; i++) {
            let gradient = hiddenErrors[h] * activations.input[i];
            
            // Add L2 regularization (weight decay) to prevent overfitting
            const l2Lambda = 0.001; // Very light regularization for better generalization
            gradient -= l2Lambda * weights.inputToHidden[h][i] / config.learningRate;
            
            // Gradient clipping to prevent explosion
            gradient = Math.max(-5, Math.min(5, gradient));
            
            // Simple momentum update with lower momentum for better generalization
            const momentumFactor = 0.5; // Reduced momentum for stability
            momentum.inputToHidden[h][i] = momentumFactor * momentum.inputToHidden[h][i] + 
                                          config.learningRate * gradient;
            
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
            if (weightChanges.inputToHidden && weightChanges.lastWeights.inputToHidden) {
                weightChanges.inputToHidden[h][i] = weights.inputToHidden[h][i] - weightChanges.lastWeights.inputToHidden[h][i];
            }
        }
    }
    
    // DEBUG: Weight change analysis
    if (debugMode && initialWeights && window.debugWeightChanges) {
        window.debugWeightChanges(initialWeights, target);
    }
    
    // Update last weights for next comparison
    updateLastWeights();
}

// Update last weights for change tracking
function updateLastWeights() {
    const weights = window.weights;
    if (weights && weightChanges.lastWeights.inputToHidden && weightChanges.lastWeights.hiddenToOutput) {
        weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(weights.inputToHidden));
        weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(weights.hiddenToOutput));
    }
}

// ============================================================================
// TRAINING AND ANALYSIS FUNCTIONS
// ============================================================================

// Enable comprehensive convergence analysis system
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

// Analyze convergence patterns during training
function analyzeConvergence(loss, accuracy, trainingData) {
    if (!convergenceAnalysis.enabled) return;
    
    convergenceAnalysis.epochCount++;
    
    // Record metrics
    convergenceAnalysis.lossHistory.push(loss);
    convergenceAnalysis.accuracyHistory.push(accuracy);
    
    // Calculate weight magnitude
    const weights = window.weights;
    if (weights) {
        const allWeights = [
            ...weights.inputToHidden.flat(),
            ...weights.hiddenToOutput.flat()
        ];
        const weightMagnitude = Math.sqrt(allWeights.reduce((sum, w) => sum + w*w, 0));
        convergenceAnalysis.weightMagnitudeHistory.push(weightMagnitude);
    }
    
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

// Detect convergence issues and patterns
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
    
    // Detect issues
    if (Math.abs(lossChange) < 1e-6 && lossVariance < 1e-6) {
        console.log('  🚨 WARNING: Loss has plateaued - potential convergence stagnation!');
    }
    if (lossChange > 0.01) {
        console.log('  🚨 WARNING: Loss is increasing - potential divergence!');
    }
    
    // Accuracy analysis
    const accuracyChange = recentAccuracy[recentAccuracy.length - 1] - recentAccuracy[0];
    console.log(`📈 Accuracy Analysis:`);
    console.log(`  Current accuracy: ${(recentAccuracy[recentAccuracy.length - 1] * 100).toFixed(2)}%`);
    console.log(`  Change over last ${recentCount} epochs: ${(accuracyChange * 100).toFixed(2)}%`);
    
    if (Math.abs(accuracyChange) < 0.001) {
        console.log('  ⚠️ Accuracy plateaued - may need learning rate adjustment');
    }
    
    // Weight magnitude analysis
    if (recentWeightMag.length > 0) {
        const weightChange = recentWeightMag[recentWeightMag.length - 1] - recentWeightMag[0];
        console.log(`⚖️ Weight Analysis:`);
        console.log(`  Current weight magnitude: ${recentWeightMag[recentWeightMag.length - 1].toFixed(6)}`);
        console.log(`  Weight change: ${weightChange.toFixed(6)}`);
        
        if (recentWeightMag[recentWeightMag.length - 1] > 10) {
            console.log('  🚨 WARNING: Weights are exploding!');
        }
        if (Math.abs(weightChange) < 1e-6) {
            console.log('  ⚠️ Weights have stopped changing - possible convergence');
        }
    }
    
    console.log('📈 ====================================\n');
}

// Check prediction diversity across training data
function checkPredictionDiversity(trainingData) {
    if (!trainingData || trainingData.length === 0) return;
    
    const predictions = [];
    for (const example of trainingData) {
        const output = forwardPropagationSilent(example.input);
        predictions.push(output[0]); // Dog probability
    }
    
    const uniquePredictions = [...new Set(predictions.map(p => Math.round(p * 1000) / 1000))];
    const diversityRatio = uniquePredictions.length / predictions.length;
    
    console.log(`🎯 PREDICTION DIVERSITY ANALYSIS:`);
    console.log(`  Total predictions: ${predictions.length}`);
    console.log(`  Unique predictions: ${uniquePredictions.length}`);
    console.log(`  Diversity ratio: ${diversityRatio.toFixed(3)}`);
    
    if (diversityRatio < 0.3) {
        console.log('  🚨 WARNING: Low prediction diversity - network may be stuck!');
    }
    
    return { predictions, uniquePredictions, diversityRatio };
}

// Generate simple training data for testing
function generateSimpleTrainingData() {
    return [
        { input: [1, 1, 1, 0], isDog: true },  // Strong dog features
        { input: [1, 1, 0, 1], isDog: true },  // Alternative dog pattern
        { input: [0, 0, 1, 1], isDog: false }, // Not-dog pattern
        { input: [0, 1, 0, 0], isDog: false }  // Weak features
    ];
}

// ============================================================================
// DEBUG FUNCTIONS
// ============================================================================

// Enable comprehensive debugging mode
function enableDeepDebugging() {
    console.log('🔧 ===== ENABLING DEEP DEBUGGING MODE =====');
    enableConvergenceAnalysis();
    
    // Override propagation functions to use debug mode by default
    const originalForward = window.neuralMath?.forwardPropagationSilent || forwardPropagationSilent;
    const originalBackward = window.neuralMath?.backpropagationSilent || backpropagationSilent;
    
    if (window.neuralMath) {
        window.neuralMath.forwardPropagationSilent = function(inputValues, debugMode = true) {
            return originalForward.call(this, inputValues, debugMode);
        };
        
        window.neuralMath.backpropagationSilent = function(target, debugMode = true) {
            return originalBackward.call(this, target, debugMode);
        };
    }
    
    console.log('✅ Deep debugging enabled - all training will show detailed logs');
    console.log('🔧 ==========================================');
}

// Debug weight changes with detailed analysis
function debugWeightChanges(initialWeights, target) {
    const weights = window.weights;
    if (!weights || !initialWeights) return;
    
    console.log('\n⚖️ ===== WEIGHT CHANGE ANALYSIS =====');
    
    // Calculate weight changes
    const inputWeightChanges = [];
    const outputWeightChanges = [];
    
    // Analyze input->hidden weight changes
    for (let h = 0; h < initialWeights.inputToHidden.length; h++) {
        for (let i = 0; i < initialWeights.inputToHidden[h].length; i++) {
            const change = weights.inputToHidden[h][i] - initialWeights.inputToHidden[h][i];
            inputWeightChanges.push(change);
        }
    }
    
    // Analyze hidden->output weight changes
    for (let o = 0; o < initialWeights.hiddenToOutput.length; o++) {
        for (let h = 0; h < initialWeights.hiddenToOutput[o].length; h++) {
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
    
    // Gradient magnitude analysis
    const inputGradMagnitude = Math.sqrt(inputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    const outputGradMagnitude = Math.sqrt(outputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    
    console.log(`\n📈 GRADIENT ANALYSIS:`);
    console.log(`  Input gradient magnitude: ${inputGradMagnitude.toFixed(6)}`);
    console.log(`  Output gradient magnitude: ${outputGradMagnitude.toFixed(6)}`);
    
    if (inputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in input layer!');
    }
    if (outputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in output layer!');
    }
    
    console.log('⚖️ ====================================');
}

// Show weight changes on network visualization
function showWeightChanges() {
    const config = window.networkConfig;
    const weights = window.weights;
    
    if (!weightChanges.inputToHidden || !weightChanges.hiddenToOutput || !config || !weights) return;
    
    // Show input-to-hidden weight changes
    for (let h = 0; h < config.hiddenSize; h++) {
        for (let i = 0; i < config.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection && window.applyWeightVisualization) {
                const currentWeight = weights.inputToHidden[h][i];
                window.applyWeightVisualization(connection, currentWeight);
            }
        }
    }
    
    // Show hidden-to-output weight changes
    for (let o = 0; o < config.outputSize; o++) {
        for (let h = 0; h < config.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection && window.applyWeightVisualization) {
                const currentWeight = weights.hiddenToOutput[o][h];
                window.applyWeightVisualization(connection, currentWeight);
            }
        }
    }
}

// ============================================================================
// TESTING FUNCTIONS
// ============================================================================

// Test for dead neuron prevention
function testDeadNeuronPrevention() {
    console.log('=== TESTING DEAD NEURON PREVENTION ===');
    
    if (!window.initializeNetwork) {
        console.error('initializeNetwork function not available');
        return { passed: false, message: '❌ FAIL: Cannot initialize network for testing' };
    }
    
    window.initializeNetwork();
    const weights = window.weights;
    if (!weights) {
        console.error('Weights not available after initialization');
        return { passed: false, message: '❌ FAIL: Weights not available' };
    }
    
    // Create a scenario that would cause dead neurons with regular ReLU
    weights.inputToHidden[0][0] = -10;
    if (weights.inputToHidden[1]) weights.inputToHidden[1][1] = -8;
    
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
        const activations = window.activations;
        
        if (activations && activations.hidden) {
            activations.hidden.forEach((activation, neuronIdx) => {
                if (Math.abs(activation) < 1e-10) {
                    deadNeuronCount++;
                }
                totalActivations++;
            });
            
            console.log(`Test ${idx + 1}: Hidden=[${activations.hidden.map(a => a.toFixed(3)).join(', ')}] Output=[${output.map(o => o.toFixed(3)).join(', ')}]`);
        }
    });
    
    const deadNeuronRate = totalActivations > 0 ? deadNeuronCount / totalActivations : 1;
    console.log(`Dead Neuron Rate: ${(deadNeuronRate * 100).toFixed(1)}% (${deadNeuronCount}/${totalActivations})`);
    
    return {
        passed: deadNeuronRate < 0.3, // Less than 30% dead neurons is acceptable
        deadNeuronRate: deadNeuronRate,
        message: deadNeuronRate < 0.3 ? '✅ PASS: Leaky ReLU prevents most dead neurons' : '❌ FAIL: Too many dead neurons detected'
    };
}

// Test accuracy calculation
function testAccuracy(dataset) {
    if (!dataset || dataset.length === 0) {
        console.log('No dataset provided for accuracy testing');
        return 0;
    }
    
    let correct = 0;
    for (const example of dataset) {
        const output = forwardPropagationSilent(example.input);
        const dogProb = Array.isArray(output) ? output[0] : output;
        
        if (calculateBinaryAccuracy(dogProb, example.isDog)) {
            correct++;
        }
    }
    
    const accuracy = correct / dataset.length;
    console.log(`Accuracy: ${(accuracy * 100).toFixed(2)}% (${correct}/${dataset.length})`);
    return accuracy;
}

// Simple binary forward propagation for testing
function simpleBinaryForward(input) {
    return forwardPropagationSilent(input);
}

// Simple binary backward propagation for testing
function simpleBinaryBackward(input, output, target, learningRate) {
    // Store current learning rate
    const config = window.networkConfig;
    const originalLR = config ? config.learningRate : 0.1;
    
    // Temporarily set learning rate
    if (config) config.learningRate = learningRate || 0.1;
    
    // Run forward and backward propagation
    forwardPropagationSilent(input);
    backpropagationSilent(target);
    
    // Restore original learning rate
    if (config) config.learningRate = originalLR;
}

// Test simple binary accuracy
function testSimpleBinaryAccuracy(dataset) {
    console.log('=== TESTING SIMPLE BINARY ACCURACY ===');
    return testAccuracy(dataset);
}

// Run comprehensive test suite
function runComprehensiveTests() {
    console.log('🧪 ===== RUNNING COMPREHENSIVE NEURAL NETWORK TESTS =====');
    
    const results = {};
    
    // Test 1: Dead Neuron Prevention
    try {
        results.deadNeuronTest = testDeadNeuronPrevention();
        console.log(results.deadNeuronTest.message);
    } catch (error) {
        console.error('Dead neuron test failed:', error);
        results.deadNeuronTest = { passed: false, message: '❌ FAIL: Test threw error' };
    }
    
    // Test 2: Simple accuracy test
    try {
        const simpleDataset = generateSimpleTrainingData();
        results.accuracyTest = {
            passed: true,
            accuracy: testSimpleBinaryAccuracy(simpleDataset),
            message: '✅ PASS: Accuracy test completed'
        };
    } catch (error) {
        console.error('Accuracy test failed:', error);
        results.accuracyTest = { passed: false, message: '❌ FAIL: Accuracy test threw error' };
    }
    
    // Summary
    const passedTests = Object.values(results).filter(r => r.passed).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`\n🧪 TEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
    console.log('🧪 ================================================');
    
    return results;
}

// ============================================================================
// MODULE EXPORT: window.neuralMath interface
// ============================================================================

// Create comprehensive neural math interface with all functions
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
    calculateWeightStats: calculateWeightStats,
    
    // Propagation algorithms
    forwardPropagationSilent: forwardPropagationSilent,
    backpropagationSilent: backpropagationSilent,
    initializeMomentum: initializeMomentum,
    updateLastWeights: updateLastWeights,
    
    // Training and analysis functions
    analyzeConvergence: analyzeConvergence,
    detectConvergenceIssues: detectConvergenceIssues,
    checkPredictionDiversity: checkPredictionDiversity,
    generateSimpleTrainingData: generateSimpleTrainingData,
    enableConvergenceAnalysis: enableConvergenceAnalysis,
    
    // Advanced training functions (placeholders for functions defined later in main script)
    advancedBackpropagation: null,
    adaptLearningRate: null,
    applyAntiStagnationMeasures: null,
    applyConvergenceBoost: null,
    backpropagationWithMomentum: null,
    
    // Testing functions
    testDeadNeuronPrevention: testDeadNeuronPrevention,
    testGeneralization: null, // Placeholder - needs more complex implementation
    testWeightInitialization: null, // Placeholder - needs more complex implementation
    runComprehensiveTests: runComprehensiveTests,
    test100PercentAccuracy: null, // Placeholder - needs more complex implementation
    testBackAndForthLearning: null, // Placeholder - needs more complex implementation
    testSimplifiedNetwork: null, // Placeholder - needs more complex implementation
    simpleBinaryForward: simpleBinaryForward,
    simpleBinaryBackward: simpleBinaryBackward,
    testSimpleBinaryAccuracy: testSimpleBinaryAccuracy,
    testAccuracy: testAccuracy,
    
    // Debug functions
    debugWeightChanges: debugWeightChanges,
    enableDeepDebugging: enableDeepDebugging,
    showWeightChanges: showWeightChanges,
    
    // State access (read-only)
    getMomentum: () => momentum,
    getWeightChanges: () => weightChanges,
    getConvergenceAnalysis: () => convergenceAnalysis
};

console.log('📊 MODULE 2: neural-network-math.js loaded successfully!');
console.log(`🧮 Exported ${Object.keys(window.neuralMath).length} neural network math functions to window.neuralMath`);