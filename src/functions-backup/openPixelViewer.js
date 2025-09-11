function openPixelViewer() {
    const modal = document.getElementById('pixelViewerModal');
    modal.style.display = 'flex';
    
    // Initialize the pixel viewer with current image
    drawOriginalImage();
    drawInteractivePixelGrid();
    updatePatternValues();
    
    // Add hover effects to original image
    addImageHoverEffects();
}

if (typeof window !== 'undefined') window.openPixelViewer = openPixelViewer;