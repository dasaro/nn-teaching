function highlightPixelRegions(pattern) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    const ctx = canvas.getContext('2d');
    
    // Define which pixels belong to each pattern region (8x8 grid)
    const regionMap = {
        'A': [], // Top-left quadrant
        'B': [], // Top-right quadrant  
        'C': [], // Bottom-left quadrant
        'D': []  // Bottom-right quadrant
    };
    
    // Fill region maps based on 8x8 grid quadrants
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const index = y * 8 + x;
            if (x < 4 && y < 4) regionMap['A'].push(index);        // Top-left
            else if (x >= 4 && y < 4) regionMap['B'].push(index);  // Top-right
            else if (x < 4 && y >= 4) regionMap['C'].push(index);  // Bottom-left
            else if (x >= 4 && y >= 4) regionMap['D'].push(index); // Bottom-right
        }
    }
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Highlight the specific pattern region in pixel grid
    const highlightPixels = regionMap[pattern] || [];
    
    highlightPixels.forEach(pixelIndex => {
        const pixel = pixelData[pixelIndex];
        const x = pixel.x;
        const y = pixel.y;
        
        // Add highlight overlay
        ctx.fillStyle = 'rgba(255, 193, 7, 0.6)';
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add thicker border
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
    });
    
    // Also highlight corresponding area in original image
    highlightPatternInOriginalImage(pattern);
}

if (typeof window !== 'undefined') window.highlightPixelRegions = highlightPixelRegions;