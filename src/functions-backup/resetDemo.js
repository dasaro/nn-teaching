function resetDemo() {
    isAnimating = false;
    
    // Clear any accumulated messages to prevent old messages from showing
    if (messageLogActive) {
        messageLogActive = false;
    }
    messageLog = [];
    
    // Reset demo state
    demoState.forwardCompleted = false;
    demoState.hasResults = false;
    
    // Properly reset all button states
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('fullDemoBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true;
    
    // Reset all neuron states
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    
    // Reset all connections
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Don't hide weight values - keep them visible to show learning
    // document.querySelectorAll('.weight-value').forEach(w => w.classList.remove('show'));
    
    // Reset activations display (but keep learned weights!) - using NEW feature system!
    setVisualFeaturesAndLabel(currentImage);
    activations.hidden = [0, 0, 0];
    activations.output = [0, 0];
    
    // Update displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
    // Reset probability bars and confidence (with null checks)
    const dogProbBar = document.getElementById('dogProbBar');
    const notDogProbBar = document.getElementById('notDogProbBar');
    const dogProbValue = document.getElementById('dogProbValue');
    const notDogProbValue = document.getElementById('notDogProbValue');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (dogProbBar) dogProbBar.style.width = '0%';
    if (notDogProbBar) notDogProbBar.style.width = '0%';
    if (dogProbValue) dogProbValue.textContent = '0%';
    if (notDogProbValue) notDogProbValue.textContent = '0%';
    if (confidenceFill) confidenceFill.style.width = '0%';
    if (confidenceValue) confidenceValue.textContent = '0%';
    
    // Reset prediction display styling (if element exists)
    const predictionDisplay = document.getElementById('predictionDisplay');
    if (predictionDisplay) {
        predictionDisplay.style.borderColor = '#00ccff';
        predictionDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    }
    
    updateStepInfoDual(
        '🎮 <strong>Ready to Explore!</strong><br>🚀 Choose "Watch AI Think" to see how the AI makes decisions, or "Watch AI Learn" to see how it gets smarter. Try the full demo for the complete experience!',
        '🎮 <strong>System Ready</strong><br>📊 All network parameters initialized. Ready to demonstrate forward propagation, backpropagation, or full training cycle.'
    );
    
    // Enable forward pass button
    document.getElementById('forwardBtn').disabled = false;
    // Button doesn't exist in compact interface
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
}

if (typeof window !== 'undefined') window.resetDemo = resetDemo;