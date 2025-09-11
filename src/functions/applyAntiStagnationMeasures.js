function applyAntiStagnationMeasures(trainingState, trainingConfig) {
    // Add small random noise to weights
    const noiseScale = 0.01;
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            weights.inputToHidden[h][i] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            weights.hiddenToOutput[o][h] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    // Boost learning rate temporarily
    trainingState.currentLearningRate = Math.min(
        trainingState.currentLearningRate * 1.5,
        trainingConfig.initialLearningRate
    );
    
}

if (typeof window !== 'undefined') window.applyAntiStagnationMeasures = applyAntiStagnationMeasures;