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

if (typeof window !== 'undefined') window.simpleBinaryBackward = simpleBinaryBackward;