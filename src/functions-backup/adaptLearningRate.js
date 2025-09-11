function adaptLearningRate(trainingState, trainingConfig, accuracy, loss) {
    const history = trainingState.convergenceHistory;
    
    if (history.length < 5) return; // Need some history
    
    const recent = history.slice(-5);
    const improvementRate = (recent[4].accuracy - recent[0].accuracy) / 5;
    
    // Adaptive learning rate based on progress
    if (accuracy >= trainingConfig.adaptiveThreshold) {
        // Fine-tuning phase - reduce learning rate
        trainingState.currentLearningRate *= 0.95;
    } else if (improvementRate < 0.01 && trainingState.stagnationCounter > 5) {
        // Stagnation detected - boost learning rate temporarily
        trainingState.currentLearningRate = Math.min(
            trainingState.currentLearningRate * 1.2, 
            trainingConfig.initialLearningRate
        );
    } else if (accuracy < 0.7) {
        // Early training - maintain higher learning rate
        trainingState.currentLearningRate = Math.max(
            trainingState.currentLearningRate,
            trainingConfig.initialLearningRate * 0.8
        );
    } else {
        // Normal decay
        trainingState.currentLearningRate *= trainingConfig.learningRateDecay;
    }
    
    // Enforce bounds
    trainingState.currentLearningRate = Math.max(
        trainingConfig.minLearningRate,
        Math.min(trainingConfig.initialLearningRate, trainingState.currentLearningRate)
    );
}

if (typeof window !== 'undefined') window.adaptLearningRate = adaptLearningRate;