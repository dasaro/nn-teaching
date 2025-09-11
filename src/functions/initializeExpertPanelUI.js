function initializeExpertPanelUI() {
    // Activation functions
    document.getElementById('hiddenActivation').value = expertConfig.hiddenActivation;
    document.getElementById('outputActivation').value = expertConfig.outputActivation;
    
    // Training parameters
    document.getElementById('learningRateSlider').value = expertConfig.learningRate;
    document.getElementById('learningRateValue').textContent = expertConfig.learningRate.toFixed(3);
    
    document.getElementById('momentumSlider').value = expertConfig.momentum;
    document.getElementById('momentumValue').textContent = expertConfig.momentum.toFixed(2);
    
    document.getElementById('l2RegSlider').value = expertConfig.l2Regularization;
    document.getElementById('l2RegValue').textContent = expertConfig.l2Regularization.toFixed(4);
    
    document.getElementById('maxEpochsSlider').value = expertConfig.maxEpochs;
    document.getElementById('maxEpochsValue').textContent = expertConfig.maxEpochs;
    
    // Activation function parameters
    document.getElementById('leakyReLUAlpha').value = expertConfig.leakyReLUAlpha;
    document.getElementById('leakyReLUAlphaValue').textContent = expertConfig.leakyReLUAlpha.toFixed(2);
    
    // Advanced settings
    document.getElementById('adaptiveLearningRate').checked = expertConfig.adaptiveLearningRate;
    
    document.getElementById('batchSizeSlider').value = expertConfig.batchSize;
    document.getElementById('batchSizeValue').textContent = expertConfig.batchSize;
    
    // Network architecture (read-only)
    document.getElementById('inputSizeDisplay').textContent = expertConfig.inputSize;
    document.getElementById('hiddenSizeDisplay').textContent = expertConfig.hiddenSize;
    document.getElementById('outputSizeDisplay').textContent = expertConfig.outputSize;
}

if (typeof window !== 'undefined') window.initializeExpertPanelUI = initializeExpertPanelUI;