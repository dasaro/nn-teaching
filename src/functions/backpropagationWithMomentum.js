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

if (typeof window !== 'undefined') window.backpropagationWithMomentum = backpropagationWithMomentum;