function drawNeurons() {
    const svg = document.getElementById('networkSvg');
    const layers = ['input', 'hidden', 'output'];
    const sizes = [networkConfig.inputSize, networkConfig.hiddenSize, networkConfig.outputSize];
    const labels = [['A', 'B', 'C', 'D'], ['H1', 'H2', 'H3', 'H4'], ['Dog', 'Not Dog']];
    
    layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < sizes[layerIndex]; i++) {
            const pos = positions[layer][i];
            
            // Draw neuron circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 30);
            circle.setAttribute('class', 'neuron');
            circle.setAttribute('id', `${layer}-neuron-${i}`);
            
            // Draw neuron label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y - 5);
            text.setAttribute('class', 'neuron-value');
            text.textContent = labels[layerIndex][i];
            
            // Draw activation value
            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueText.setAttribute('x', pos.x);
            valueText.setAttribute('y', pos.y + 8);
            valueText.setAttribute('class', 'neuron-value');
            valueText.setAttribute('id', `${layer}-value-${i}`);
            valueText.textContent = (activations[layer][i] !== undefined ? activations[layer][i] : 0).toFixed(2);
            
            svg.appendChild(circle);
            svg.appendChild(text);
            svg.appendChild(valueText);
        }
    });
}

if (typeof window !== 'undefined') window.drawNeurons = drawNeurons;