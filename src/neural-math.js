// ============================================================================
// NEURAL-MATH MODULE
// Neural network mathematical functions and utilities
// ============================================================================

function sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); // Prevent overflow
}

function sigmoidDerivative(x) {
    const s = sigmoid(x);
    return s * (1 - s);
}

function leakyReLU(x, alpha = 0.1) {
    return x > 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.1) {
    return x > 0 ? 1 : alpha;
}

function tanhActivation(x) {
    return Math.tanh(x);
}

function tanhDerivative(x) {
    const t = Math.tanh(x);
    return 1 - t * t;
}

function softmax(values) {
    const maxVal = Math.max(...values);
    const expVals = values.map(val => Math.exp(Math.min(val - maxVal, 700))); // Prevent overflow
    const sumExp = expVals.reduce((sum, val) => sum + val, 0);
    return expVals.map(val => val / sumExp);
}

function calculateBinaryAccuracy(predictedProbability, isDogActual) {
    const predictedIsDog = predictedProbability > 0.5;
    return predictedIsDog === isDogActual;
}

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
            weights.hiddenToOutput[o][h] = clampWeight(weights.hiddenToOutput[o][h], -3, 3);
            
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
            weights.inputToHidden[h][i] = clampWeight(weights.inputToHidden[h][i], -3, 3);
            
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
            weights.hiddenToOutput[o][h] = clampWeight(weights.hiddenToOutput[o][h], -5, 5);
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
            weights.inputToHidden[h][i] = clampWeight(weights.inputToHidden[h][i], -5, 5);
        }
    }
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
            weights.hiddenToOutput[o][h] = clampWeight(weights.hiddenToOutput[o][h], -8, 8);
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
            weights.inputToHidden[h][i] = clampWeight(weights.inputToHidden[h][i], -8, 8);
        }
    }
    
    // Update network config for display
    networkConfig.learningRate = trainingState.currentLearningRate;
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.sigmoid = sigmoid;
if (typeof window !== 'undefined') window.sigmoidDerivative = sigmoidDerivative;
if (typeof window !== 'undefined') window.leakyReLU = leakyReLU;
if (typeof window !== 'undefined') window.leakyReLUDerivative = leakyReLUDerivative;
if (typeof window !== 'undefined') window.tanhActivation = tanhActivation;
if (typeof window !== 'undefined') window.tanhDerivative = tanhDerivative;
if (typeof window !== 'undefined') window.softmax = softmax;
if (typeof window !== 'undefined') window.calculateBinaryAccuracy = calculateBinaryAccuracy;
if (typeof window !== 'undefined') window.calculateDatasetAccuracy = calculateDatasetAccuracy;
if (typeof window !== 'undefined') window.calculateFeatureDiversity = calculateFeatureDiversity;
if (typeof window !== 'undefined') window.calculateWeightStats = calculateWeightStats;
if (typeof window !== 'undefined') window.checkWeightSymmetry = checkWeightSymmetry;
if (typeof window !== 'undefined') window.forwardPropagationSilent = forwardPropagationSilent;
if (typeof window !== 'undefined') window.backpropagationSilent = backpropagationSilent;
if (typeof window !== 'undefined') window.initializeMomentum = initializeMomentum;
if (typeof window !== 'undefined') window.backpropagationWithMomentum = backpropagationWithMomentum;
if (typeof window !== 'undefined') window.advancedBackpropagation = advancedBackpropagation;
