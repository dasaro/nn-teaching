function extractPixelValues(imageData) {
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
            values.push({
                x, y,
                value: gray,
                color: `rgb(${r}, ${g}, ${b})`,
                brightness: Math.round(gray * 255)
            });
        }
    }
    return values;
}

if (typeof window !== 'undefined') window.extractPixelValues = extractPixelValues;