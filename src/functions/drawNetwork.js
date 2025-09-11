function drawNetwork() {
    const svg = document.getElementById('networkSvg');
    svg.innerHTML = '';
    
    // Draw connections first (so they appear behind neurons)
    drawConnections();
    
    // Draw neurons
    drawNeurons();
    
    // Draw layer labels
    drawLabels();
    
    // Draw prediction column
    drawPrediction();
    
    // Update visual properties based on current values
    updateNeuronColors();
    updatePrediction();
}

if (typeof window !== 'undefined') window.drawNetwork = drawNetwork;