function highlightCorrespondingImageArea(gridX, gridY) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay for the corresponding area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

if (typeof window !== 'undefined') window.highlightCorrespondingImageArea = highlightCorrespondingImageArea;