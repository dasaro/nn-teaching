function clearAllHighlights() {
    // Redraw both canvases to clear all highlights
    drawOriginalImage();
    drawInteractivePixelGrid();
}

if (typeof window !== 'undefined') window.clearAllHighlights = clearAllHighlights;