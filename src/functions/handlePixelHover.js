function handlePixelHover(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel is being hovered
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) {
            pixelInfo.innerHTML = `
                <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
                Value: ${pixel.value.toFixed(2)}
            `;
        }
        
        // Highlight corresponding area in original image
        highlightCorrespondingImageArea(pixelX, pixelY);
        
        // Highlight current pixel in grid
        highlightPixelInGrid(pixelX, pixelY, false);
    }
}

if (typeof window !== 'undefined') window.handlePixelHover = handlePixelHover;