function displayPerformanceMetrics() {
    const display = document.getElementById('performanceDisplay');
    
    let html = `
        <strong>SYSTEM PERFORMANCE:</strong><br>
        Total Operations: ${performanceMetrics.totalOperations}<br>
        Weight Updates: ${performanceMetrics.weightUpdates}<br>
        Training Epochs: ${performanceMetrics.epochCount}<br><br>
        
        <strong>TIMING METRICS:</strong><br>
        Forward Pass: ${performanceMetrics.forwardPassTime}ms<br>
        Backpropagation: ${performanceMetrics.backpropTime}ms<br><br>
        
        <strong>NETWORK STATUS:</strong><br>
        Last Accuracy: ${(performanceMetrics.lastAccuracy * 100).toFixed(1)}%<br>
        Last Loss: ${performanceMetrics.lastLoss.toFixed(4)}<br>
        Learning Rate: ${networkConfig.learningRate}<br><br>
        
        <strong>MEMORY USAGE:</strong><br>
        Weights: ${(weights.inputToHidden.length * weights.inputToHidden[0].length + 
                    weights.hiddenToOutput.length * weights.hiddenToOutput[0].length)} parameters<br>
        History Buffer: ${gradientHistory.length} entries
    `;
    
    display.innerHTML = html;
}

if (typeof window !== 'undefined') window.displayPerformanceMetrics = displayPerformanceMetrics;