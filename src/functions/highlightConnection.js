function highlightConnection(fromLayer, fromIndex, toIndex, highlight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        if (highlight) {
            connection.style.stroke = '#FFD700';
            connection.style.strokeWidth = '4px';
            connection.style.opacity = '1';
        } else {
            // Reset to weight-based appearance
            const weight = fromLayer === 'input' 
                ? weights.inputToHidden[toIndex][fromIndex]
                : weights.hiddenToOutput[toIndex][fromIndex];
            updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight);
        }
    }
}

if (typeof window !== 'undefined') window.highlightConnection = highlightConnection;