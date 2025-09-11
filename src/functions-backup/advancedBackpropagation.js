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

if (typeof window !== 'undefined') window.advancedBackpropagation = advancedBackpropagation;