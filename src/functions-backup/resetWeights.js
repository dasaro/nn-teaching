function resetWeights() {
    
    // Reinitialize random weights
    initializeNetwork();
    
    // Properly reset activations to match network configuration
    activations = {
        input: new Array(networkConfig.inputSize).fill(0),
        hidden: new Array(networkConfig.hiddenSize).fill(0), 
        output: new Array(networkConfig.outputSize).fill(0)
    };
    
    // Set default input pattern for the current image
    const currentImageElement = document.querySelector('.img-btn.selected');
    if (currentImageElement) {
        const currentImage = currentImageElement.onclick.toString().match(/'([^']+)'/)?.[1] || 'dog1';
        setVisualFeaturesAndLabel(currentImage);
    }
    
    // Reset performance metrics
    performanceMetrics.epochCount = 0;
    performanceMetrics.weightUpdates = 0;
    performanceMetrics.lastAccuracy = 0;
    performanceMetrics.lastLoss = 0;
    gradientHistory = [];
    activationHistory = [];
    weightHistory = [];
    
    // Redraw network with new weights and proper activations
    drawNetwork();
    
    // Reset demo
    resetDemo();
    
    updateStepInfoDual(
        '🔄 <strong>Network Reset Complete!</strong><br>🌟 The AI\'s brain is now completely fresh and ready to learn! All connections have been randomized and it\'s like having a brand new student ready for their first lesson.',
        '🔄 <strong>Network Reinitialized</strong><br>📊 All weights randomized to initial state. Ready to begin training from scratch with fresh parameters.'
    );
    
    // Auto-select appropriate label based on current image
    const currentImageId = document.querySelector('.img-btn.selected').onclick.toString().match(/'([^']+)'/)[1];
    const isDogImage = ['dog1', 'dog2', 'dog3'].includes(currentImageId);
    setTrueLabel(isDogImage ? 'dog' : 'not-dog');
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
    
    // Make weight changes visible immediately
    refreshAllConnectionVisuals();
}

if (typeof window !== 'undefined') window.resetWeights = resetWeights;