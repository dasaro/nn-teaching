function drawConnections() {
    const svg = document.getElementById('networkSvg');
    
    // Input to Hidden connections
    for (let i = 0; i < networkConfig.inputSize; i++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.hidden[h].x - 25);
            line.setAttribute('y2', positions.hidden[h].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-hidden-${h}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.inputToHidden[h][i];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            addWeightTooltip(line, weight, `Input ${['A', 'B', 'C', 'D'][i]} → Hidden H${h + 1}`);
            
            svg.appendChild(line);
        }
    }
    
    // Hidden to Output connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let o = 0; o < networkConfig.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.hidden[h].x + 25);
            line.setAttribute('y1', positions.hidden[h].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-hidden-${h}-output-${o}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.hiddenToOutput[o][h];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            const outputName = o === 0 ? 'Dog' : 'Not Dog';
            addWeightTooltip(line, weight, `Hidden H${h + 1} → ${outputName}`);
            
            svg.appendChild(line);
        }
    }
}

if (typeof window !== 'undefined') window.drawConnections = drawConnections;