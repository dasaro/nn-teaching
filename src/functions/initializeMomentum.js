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

if (typeof window !== 'undefined') window.initializeMomentum = initializeMomentum;