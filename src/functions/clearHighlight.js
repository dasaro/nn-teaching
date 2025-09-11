function clearHighlight() {
    // Redraw both canvases to clear all highlights
    drawInteractivePixelGrid();
    drawOriginalImage();
}

if (typeof window !== 'undefined') window.clearHighlight = clearHighlight;