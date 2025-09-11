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

if (typeof window !== 'undefined') window.forwardPropagationSilent = forwardPropagationSilent;