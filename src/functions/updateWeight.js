function updateWeight(fromLayer, fromIndex, toIndex, newWeight) {
    if (fromLayer === 'input') {
        weights.inputToHidden[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-input-${fromIndex}-hidden-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            // Update tooltip weight value
            updateConnectionTooltip(connection, newWeight, `Input ${['A', 'B', 'C', 'D'][fromIndex]} → Hidden H${toIndex + 1}`);
        }
    } else {
        weights.hiddenToOutput[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-hidden-${fromIndex}-output-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            const outputName = toIndex === 0 ? 'Dog' : 'Not Dog';
            updateConnectionTooltip(connection, newWeight, `Hidden H${fromIndex + 1} → ${outputName}`);
        }
    }
}

if (typeof window !== 'undefined') window.updateWeight = updateWeight;