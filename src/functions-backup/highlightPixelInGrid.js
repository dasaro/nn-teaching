function highlightPixelInGrid(gridX, gridY, persistent = false) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    // Redraw the grid first
    drawInteractivePixelGrid();
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Add highlight overlay
    ctx.fillStyle = persistent ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = persistent ? '#3B82F6' : '#FFC107';
    ctx.lineWidth = persistent ? 3 : 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

if (typeof window !== 'undefined') window.highlightPixelInGrid = highlightPixelInGrid;