function closePixelViewer() {
    document.getElementById('pixelViewerModal').style.display = 'none';
}

if (typeof window !== 'undefined') window.closePixelViewer = closePixelViewer;