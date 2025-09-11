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

if (typeof window !== 'undefined') window.simpleBinaryForward = simpleBinaryForward;