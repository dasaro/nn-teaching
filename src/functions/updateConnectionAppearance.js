function updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        applyWeightVisualization(connection, weight);
    }
}

if (typeof window !== 'undefined') window.updateConnectionAppearance = updateConnectionAppearance;