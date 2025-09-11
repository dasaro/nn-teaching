function drawNumberGrid() {
    const canvas = document.getElementById('numberGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data and convert to normalized values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel and normalize
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Convert to grayscale and normalize (0-1)
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const normalized = gray.toFixed(1);
            
            // Color background based on brightness
            const brightness = gray * 255;
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw the normalized value
            ctx.fillStyle = brightness > 127 ? '#000' : '#fff';
            ctx.fillText(normalized, 
                offsetX + x * cellSize + cellSize/2, 
                offsetY + y * cellSize + cellSize/2);
            
            // Grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

if (typeof window !== 'undefined') window.drawNumberGrid = drawNumberGrid;