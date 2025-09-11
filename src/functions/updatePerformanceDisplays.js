function updatePerformanceDisplays() {
    // These elements don't exist in compact interface - skip updates
    const epochCounter = document.getElementById('epochCounter');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const lossDisplay = document.getElementById('lossDisplay');
    const learningRateDisplay = document.getElementById('learningRateDisplay');
    
    if (epochCounter) epochCounter.textContent = performanceMetrics.epochCount;
    if (accuracyDisplay) accuracyDisplay.textContent = (performanceMetrics.lastAccuracy * 100).toFixed(1) + '%';
    if (lossDisplay) lossDisplay.textContent = performanceMetrics.lastLoss.toFixed(3);
    if (learningRateDisplay) learningRateDisplay.textContent = networkConfig.learningRate.toFixed(2);
    
    // Update neural metrics - check if elements exist first
    const forwardTime = document.getElementById('forwardTime');
    const backpropTime = document.getElementById('backpropTime');
    
    if (forwardTime) forwardTime.textContent = performanceMetrics.forwardPassTime + 'ms';
    if (backpropTime) backpropTime.textContent = performanceMetrics.backpropTime + 'ms';
    
    const weightUpdates = document.getElementById('weightUpdates');
    const totalOps = document.getElementById('totalOps');
    
    if (weightUpdates) weightUpdates.textContent = performanceMetrics.weightUpdates;
    if (totalOps) totalOps.textContent = performanceMetrics.totalOperations;
}

if (typeof window !== 'undefined') window.updatePerformanceDisplays = updatePerformanceDisplays;