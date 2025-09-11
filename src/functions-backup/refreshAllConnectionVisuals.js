function refreshAllConnectionVisuals() {
    // Update all input to hidden connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, weight);
            }
        }
    }
    
    // Update all hidden to output connections
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, weight);
            }
        }
    }
}

if (typeof window !== 'undefined') window.refreshAllConnectionVisuals = refreshAllConnectionVisuals;