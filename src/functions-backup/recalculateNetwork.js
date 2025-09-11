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

if (typeof window !== 'undefined') window.recalculateNetwork = recalculateNetwork;