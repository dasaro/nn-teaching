function initializeOptimalWeights() {
    // Xavier/Glorot initialization for better convergence
    const inputFanIn = networkConfig.inputSize;
    const hiddenFanIn = networkConfig.hiddenSize;
    
    // Input to hidden weights
    const inputToHiddenVariance = Math.sqrt(2.0 / (inputFanIn + networkConfig.hiddenSize));
    weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
        Array.from({length: networkConfig.inputSize}, () => 
            (Math.random() * 2 - 1) * inputToHiddenVariance)
    );
    
    // Hidden to output weights
    const hiddenToOutputVariance = Math.sqrt(2.0 / (hiddenFanIn + networkConfig.outputSize));
    weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
        Array.from({length: networkConfig.hiddenSize}, () => 
            (Math.random() * 2 - 1) * hiddenToOutputVariance)
    );
    
}

if (typeof window !== 'undefined') window.initializeOptimalWeights = initializeOptimalWeights;