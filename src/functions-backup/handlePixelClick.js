function handlePixelClick(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel was clicked
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        selectedPixel = pixelIndex;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        pixelInfo.innerHTML = `
            <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
            Brightness: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#333';
        
        // Redraw grid with highlight
        drawInteractivePixelGrid();
        
        // Highlight corresponding input neuron
        highlightInputNeuron(pixelIndex);
    }
}

if (typeof window !== 'undefined') window.handlePixelClick = handlePixelClick;