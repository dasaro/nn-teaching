function drawOriginalImage() {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    // Get current input image data
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    
    // Scale and draw the current image with smooth scaling to fit perfectly
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(inputCanvas, 0, 0, 140, 140, 0, 0, 140, 140);
    
    // Store pixel data for interactive use
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    pixelData = extractPixelValues(imageData);
}

if (typeof window !== 'undefined') window.drawOriginalImage = drawOriginalImage;