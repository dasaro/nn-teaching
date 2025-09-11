function showImageAreaOverlay(x, y) {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate the pixel area bounds
    const cellSize = 140 / 8;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay
    ctx.fillStyle = 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#FFC107';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

if (typeof window !== 'undefined') window.showImageAreaOverlay = showImageAreaOverlay;