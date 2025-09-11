function showWeightChanges() {
    if (!weightChanges.inputToHidden || !weightChanges.hiddenToOutput) return;
    
    // Show input-to-hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
    
    // Show hidden-to-output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
}

if (typeof window !== 'undefined') window.showWeightChanges = showWeightChanges;