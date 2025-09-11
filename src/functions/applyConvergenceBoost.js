function applyConvergenceBoost(trainingState, trainingConfig) {
    // Increase learning rate and apply focused training
    trainingState.currentLearningRate = trainingConfig.initialLearningRate * 0.8;
    
    // Reset momentum for fresh gradient flow
    trainingState.momentum.inputToHidden.forEach(row => row.fill(0));
    trainingState.momentum.hiddenToOutput.forEach(row => row.fill(0));
    
}

if (typeof window !== 'undefined') window.applyConvergenceBoost = applyConvergenceBoost;