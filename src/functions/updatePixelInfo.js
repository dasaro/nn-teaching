function updatePixelInfo(pixelIndex) {
    if (!pixelData || pixelIndex >= pixelData.length) return;
    
    const pixel = pixelData[pixelIndex];
    const pixelInfo = document.getElementById('pixelInfo');
    if (pixelInfo) {
        pixelInfo.innerHTML = `
            <strong>Selected: Pixel (${pixel.x}, ${pixel.y})</strong><br>
            Value: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#2563eb';
    }
}

if (typeof window !== 'undefined') window.updatePixelInfo = updatePixelInfo;