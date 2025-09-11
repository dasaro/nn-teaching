function addImageHoverEffects() {
    const canvas = document.getElementById('originalImageCanvas');
    
    canvas.addEventListener('mouseenter', () => {
        canvas.style.filter = 'brightness(1.1)';
    });
    
    canvas.addEventListener('mouseleave', () => {
        canvas.style.filter = 'brightness(1)';
        clearAllHighlights();
    });
    
    // Add mousemove to track position and highlight corresponding pixel
    canvas.addEventListener('mousemove', (event) => {
        highlightCorrespondingPixel(event);
    });
    
    canvas.addEventListener('click', (event) => {
        highlightCorrespondingPixel(event, true); // true for persistent highlight
    });
}

if (typeof window !== 'undefined') window.addImageHoverEffects = addImageHoverEffects;