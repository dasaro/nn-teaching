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

if (typeof window !== 'undefined') window.backpropagationSilent = backpropagationSilent;