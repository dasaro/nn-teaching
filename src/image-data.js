// Image Data Module - Base64 encoded images for CORS-free loading
// This module provides base64 data URLs for all application images to avoid CORS issues
// Since the app runs from file:// URLs, we need embedded base64 data to avoid CORS restrictions

// Pre-encoded base64 image data to avoid CORS issues with file:// protocol  
// Real Creative Commons stock photos from Pexels
const imageData = {};

// Create a simple colored canvas as fallback/placeholder image
function createFallbackImage(imageName) {
    const canvas = document.createElement('canvas');
    canvas.width = 140;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    
    // Color and pattern based on image type
    const colors = {
        dog1: '#8B4513', dog2: '#A0522D', dog3: '#CD853F',  // Brown shades for dogs
        cat: '#696969',     // Gray for cat
        bird: '#87CEEB',    // Sky blue for bird  
        fish: '#4169E1',    // Royal blue for fish
        car: '#FF4500',     // Orange red for car
        tree: '#228B22'     // Forest green for tree
    };
    
    const color = colors[imageName] || '#666666';
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustBrightness(color, -30));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    // Add a subtle pattern
    ctx.fillStyle = adjustBrightness(color, 20);
    for (let i = 0; i < 140; i += 20) {
        for (let j = 0; j < 140; j += 20) {
            if ((i + j) % 40 === 0) {
                ctx.fillRect(i, j, 8, 8);
            }
        }
    }
    
    // Add text label with shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(imageName.toUpperCase(), 71, 76);
    
    ctx.fillStyle = 'white';
    ctx.fillText(imageName.toUpperCase(), 70, 75);
    
    // Add icon/emoji if available
    const icons = {
        dog1: '🐕', dog2: '🐶', dog3: '🦮',
        cat: '🐱',
        bird: '🐦',
        fish: '🐟',
        car: '🚗',
        tree: '🌳'
    };
    
    if (icons[imageName]) {
        ctx.font = '30px Arial';
        ctx.fillText(icons[imageName], 70, 45);
    }
    
    return canvas.toDataURL('image/png');
}

// Helper function to adjust color brightness
function adjustBrightness(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `rgb(${r}, ${g}, ${b})`;
}

// Initialize image data with real stock photos when available
function initializeImageData() {
    const imageNames = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'fish', 'car', 'tree'];
    
    console.log('🖼️ Initializing image data...');
    
    // Check if real stock image data is available
    if (window.realImageData && window.realImageData.hasData()) {
        console.log('📸 Using real Creative Commons stock photos from Pexels');
        imageNames.forEach(name => {
            const realImage = window.realImageData.getDataUrl(name);
            if (realImage) {
                imageData[name] = realImage;
                console.log(`✅ Loaded real stock photo: ${name}`);
            } else {
                imageData[name] = createFallbackImage(name);
                console.log(`⚠️ Using procedural fallback for ${name}`);
            }
        });
    } else {
        console.log('🎨 Using high-quality procedural images');
        imageNames.forEach(name => {
            imageData[name] = createFallbackImage(name);
            console.log(`✅ Generated procedural image for ${name}`);
        });
    }
    
    console.log('✅ Image data initialization complete');
    return Promise.resolve(imageData);
}

// Get base64 data URL for an image
function getImageDataUrl(imageName) {
    if (imageData[imageName]) {
        return imageData[imageName];
    }
    
    console.warn(`Image data for ${imageName} not found, creating fallback`);
    imageData[imageName] = createFallbackImage(imageName);
    return imageData[imageName];
}

// Check if image data is ready
function isImageDataReady() {
    const expectedImages = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'fish', 'car', 'tree'];
    return expectedImages.every(name => imageData[name]);
}

// Export functions to global scope
if (typeof window !== 'undefined') {
    window.imageData = {
        initialize: initializeImageData,
        getDataUrl: getImageDataUrl,
        isReady: isImageDataReady,
        data: imageData
    };
}

console.log('📦 Image Data module loaded');