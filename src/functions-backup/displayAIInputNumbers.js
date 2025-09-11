function displayAIInputNumbers() {
    const container = document.getElementById('aiInputNumbers');
    
    // Get normalized pixel values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const values = [];
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            values.push(gray.toFixed(2));
        }
    }
    
    // Display as a formatted array
    container.innerHTML = `
        <div class="number-array">
            <div class="array-label">Input array (64 numbers):</div>
            <div class="array-values">[${values.slice(0, 8).join(', ')}, ..., ${values.slice(-8).join(', ')}]</div>
            <div class="array-note">Each number represents the brightness of one pixel (0 = black, 1 = white)</div>
        </div>
    `;
}

if (typeof window !== 'undefined') window.displayAIInputNumbers = displayAIInputNumbers;