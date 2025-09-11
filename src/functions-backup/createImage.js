function createImage(imageType) {
    const canvas = document.getElementById('inputImage');
    // Optimize canvas for frequent getImageData operations
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with loading state
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, 140, 140);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', 70, 70);
    
    // Load stock photo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        console.log(`✅ Successfully loaded image: ${imageType} from ${img.src}`);
        
        // Clear canvas and draw the loaded image
        ctx.clearRect(0, 0, 140, 140);
        ctx.drawImage(img, 0, 0, 140, 140);
        
        // Add a subtle border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 138, 138);
        
        // Add success indicator
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('✓', 135, 15);
        
        // CRITICAL: Set visual features based on image type!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.onerror = function(error) {
        console.error(`❌ Failed to load image: ${imageType} from ${img.src}`, error);
        console.log(`Current page location: ${window.location.href}`);
        console.log(`Image path: ${img.src}`);
        
        // Fallback to solid color with emoji if image fails to load
        ctx.clearRect(0, 0, 140, 140);
        ctx.fillStyle = getImageColor(imageType);
        ctx.fillRect(0, 0, 140, 140);
        
        // Add error indicator in corner
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('IMG ERR', 5, 12);
        
        // Large emoji fallback
        ctx.fillStyle = '#333';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getImageEmoji(imageType), 70, 85);
        
        // CRITICAL: Set visual features even on fallback!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.src = imageUrls[imageType];
    
    // Set the visual features and labels based on image type
    setVisualFeaturesAndLabel(imageType);
}

if (typeof window !== 'undefined') window.createImage = createImage;