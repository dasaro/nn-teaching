function resetExpertDefaults() {
    expertConfig.hiddenActivation = 'leaky_relu';
    expertConfig.outputActivation = 'softmax';
    expertConfig.learningRate = 0.1;
    expertConfig.momentum = 0.0;
    expertConfig.l2Regularization = 0.0;
    expertConfig.leakyReLUAlpha = 0.1;
    expertConfig.adaptiveLearningRate = false;
    expertConfig.batchSize = 1;
    expertConfig.maxEpochs = 100;
    
    // Refresh UI
    initializeExpertPanelUI();
    
    console.log('Expert parameters reset to defaults');
}

if (typeof window !== 'undefined') window.resetExpertDefaults = resetExpertDefaults;