// Direct base64 image data - bypasses CORS issues
// This file directly defines the base64 image data as a JavaScript object

// First, let's load our base64 data
fetch('./base64-images-data.js')
    .then(response => response.text())
    .then(text => {
        // Execute the JavaScript to set window.base64ImageUrls
        eval(text);
        
        // Now update the global imageUrls object
        if (typeof window !== 'undefined' && window.base64ImageUrls) {
            // Update the existing imageUrls object with base64 data
            Object.assign(window.imageUrls, window.base64ImageUrls);
            console.log('✅ Base64 images loaded successfully:', Object.keys(window.base64ImageUrls));
            
            // Trigger an event to notify other parts of the app
            window.dispatchEvent(new CustomEvent('base64ImagesLoaded', { 
                detail: window.base64ImageUrls 
            }));
        }
    })
    .catch(error => {
        console.error('❌ Still having CORS issues, will embed images directly in globals');
        
        // As final fallback, let's update the globals file directly
        console.log('📁 Using direct embedded base64 images');
        
        // We'll need to embed the base64 data directly
        if (typeof updateImageUrlsDirectly === 'function') {
            updateImageUrlsDirectly();
        }
    });

// Load images when the script runs
if (typeof window !== 'undefined') {
    // Browser environment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Load base64 images after DOM is ready
            console.log('🚀 Loading base64 images...');
        });
    }
}