// Base64 image loader - loads complete base64 image data
function loadBase64Images() {
    // Load the complete imageUrls object from base64_images.txt
    fetch('./base64_images.txt')
        .then(response => response.text())
        .then(text => {
            try {
                // Extract the imageUrls object from the file
                const match = text.match(/const imageUrls = (\{[\s\S]*?\});/);
                if (match) {
                    // Parse the JSON object
                    const base64ImageUrls = JSON.parse(match[1]);
                    
                    // Update the global imageUrls object
                    if (typeof window !== 'undefined') {
                        if (window.imageUrls) {
                            Object.assign(window.imageUrls, base64ImageUrls);
                        } else {
                            window.imageUrls = base64ImageUrls;
                        }
                        console.log('✅ Base64 images loaded successfully:', Object.keys(base64ImageUrls));
                        
                        // Trigger an event to notify other parts of the app
                        window.dispatchEvent(new CustomEvent('base64ImagesLoaded', { 
                            detail: base64ImageUrls 
                        }));
                    }
                } else {
                    console.error('❌ Could not parse imageUrls from base64_images.txt');
                }
            } catch (parseError) {
                console.error('❌ Error parsing base64 images:', parseError);
            }
        })
        .catch(error => {
            console.error('❌ Error loading base64 images:', error);
            console.log('📁 Using fallback image paths from images/ directory');
        });
}

// Load images when the script runs
if (typeof window !== 'undefined') {
    // Browser environment
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadBase64Images);
    } else {
        loadBase64Images();
    }
} else {
    // Node.js environment - just export the function
    module.exports = { loadBase64Images };
}