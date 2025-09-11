function drawPixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data from input canvas
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    // Draw 8x8 pixel grid with visible boundaries
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel from the scaled region (140x140 -> 8x8)
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Fill the cell with the pixel color
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

if (typeof window !== 'undefined') window.drawPixelGrid = drawPixelGrid;