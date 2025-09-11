function drawPrediction() {
    const svg = document.getElementById('networkSvg');
    const pos = positions.prediction;
    
    // Create prediction display circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 40);
    circle.setAttribute('fill', '#f8fafc');
    circle.setAttribute('stroke', '#3b82f6');
    circle.setAttribute('stroke-width', 3);
    circle.setAttribute('id', 'predictionCircle');
    svg.appendChild(circle);
    
    // Add emoji
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('x', pos.x);
    emoji.setAttribute('y', pos.y - 8);
    emoji.setAttribute('text-anchor', 'middle');
    emoji.setAttribute('dominant-baseline', 'middle');
    emoji.setAttribute('font-size', '20px');
    emoji.setAttribute('id', 'predictionEmoji');
    emoji.textContent = '🤔';
    svg.appendChild(emoji);
    
    // Add confidence/result text
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    result.setAttribute('x', pos.x);
    result.setAttribute('y', pos.y + 12);
    result.setAttribute('text-anchor', 'middle');
    result.setAttribute('dominant-baseline', 'middle');
    result.setAttribute('font-size', '10px');
    result.setAttribute('font-weight', '600');
    result.setAttribute('fill', '#475569');
    result.setAttribute('id', 'predictionResult');
    result.textContent = 'Thinking...';
    svg.appendChild(result);
}

if (typeof window !== 'undefined') window.drawPrediction = drawPrediction;