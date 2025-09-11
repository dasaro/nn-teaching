function highlightCorrespondingPixel(event, persistent = false) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert mouse position to pixel grid coordinates (8x8)
    const gridX = Math.floor((x / 140) * 8);
    const gridY = Math.floor((y / 140) * 8);
    
    // Ensure coordinates are within bounds
    if (gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 8) {
        const pixelIndex = gridY * 8 + gridX;
        
        if (persistent) {
            selectedPixel = pixelIndex;
            updatePixelInfo(pixelIndex);
        }
        
        // Highlight the corresponding pixel in the grid
        highlightPixelInGrid(gridX, gridY, persistent);
        
        // Show overlay on original image
        showImageAreaOverlay(x, y);
    }
}

if (typeof window !== 'undefined') window.highlightCorrespondingPixel = highlightCorrespondingPixel;