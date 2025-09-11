function drawInputNeuronVisualization() {
    const container = document.getElementById('inputNeurons');
    container.innerHTML = '';
    
    if (!pixelData) return;
    
    // Create 64 input neurons (8x8 grid)
    pixelData.forEach((pixel, index) => {
        const neuron = document.createElement('div');
        neuron.className = 'input-neuron';
        neuron.style.backgroundColor = `rgb(${pixel.brightness}, ${pixel.brightness}, ${pixel.brightness})`;
        neuron.textContent = pixel.value.toFixed(1);
        neuron.title = `Input #${index + 1}: ${pixel.value.toFixed(2)}`;
        
        // Add click handler
        neuron.onclick = () => {
            selectedPixel = index;
            drawInteractivePixelGrid();
            highlightInputNeuron(index);
            
            const pixelInfo = document.getElementById('pixelInfo');
            pixelInfo.innerHTML = `
                <strong>Input #${index + 1}</strong><br>
                From pixel (${pixel.x}, ${pixel.y}): ${pixel.value.toFixed(2)}
            `;
        };
        
        container.appendChild(neuron);
    });
}

if (typeof window !== 'undefined') window.drawInputNeuronVisualization = drawInputNeuronVisualization;