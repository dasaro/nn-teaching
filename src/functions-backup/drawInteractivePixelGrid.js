function drawInteractivePixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    if (!pixelData) return;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Draw pixels with interactive highlighting
    pixelData.forEach((pixel, index) => {
        const x = pixel.x;
        const y = pixel.y;
        
        // Fill with pixel color
        ctx.fillStyle = pixel.color;
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add selection highlight
        if (selectedPixel === index) {
            ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add number overlay for brightness
        ctx.fillStyle = pixel.brightness > 127 ? '#000' : '#fff';
        ctx.font = '10px bold monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pixel.value.toFixed(1), 
            offsetX + x * cellSize + cellSize/2, 
            offsetY + y * cellSize + cellSize/2);
    });
    
    // Add click handler
    canvas.onclick = handlePixelClick;
    canvas.style.cursor = 'pointer';
    
    // Add hover effects for pixel grid
    canvas.addEventListener('mousemove', handlePixelHover);
    canvas.addEventListener('mouseleave', () => {
        clearAllHighlights();
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) pixelInfo.innerHTML = 'Hover over pixels!';
    });
}

if (typeof window !== 'undefined') window.drawInteractivePixelGrid = drawInteractivePixelGrid;