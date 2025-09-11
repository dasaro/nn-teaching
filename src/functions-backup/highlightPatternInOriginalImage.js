function highlightPatternInOriginalImage(pattern) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8; // 8x8 grid
    
    // Redraw original image first
    drawOriginalImage();
    
    // Define the quadrant boundaries for each pattern
    const quadrantMap = {
        'A': { startX: 0, startY: 0, width: 4, height: 4 },     // Top-left
        'B': { startX: 4, startY: 0, width: 4, height: 4 },     // Top-right
        'C': { startX: 0, startY: 4, width: 4, height: 4 },     // Bottom-left
        'D': { startX: 4, startY: 4, width: 4, height: 4 }      // Bottom-right
    };
    
    const quadrant = quadrantMap[pattern];
    if (!quadrant) return;
    
    // Calculate pixel coordinates for the quadrant
    const startX = quadrant.startX * cellSize;
    const startY = quadrant.startY * cellSize;
    const width = quadrant.width * cellSize;
    const height = quadrant.height * cellSize;
    
    // Get pattern-specific color
    const patternColors = {
        'A': 'rgba(255, 107, 107, 0.4)', // Red (pattern-a color)
        'B': 'rgba(76, 205, 196, 0.4)',  // Teal (pattern-b color)
        'C': 'rgba(69, 183, 209, 0.4)',  // Blue (pattern-c color)
        'D': 'rgba(249, 202, 36, 0.4)'   // Yellow (pattern-d color)
    };
    
    const patternBorders = {
        'A': '#FF6B6B', // Red
        'B': '#4ECDC4', // Teal
        'C': '#45B7D1', // Blue
        'D': '#F9CA24'  // Yellow
    };
    
    // Add highlight overlay
    ctx.fillStyle = patternColors[pattern] || 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(startX, startY, width, height);
    
    // Add border
    ctx.strokeStyle = patternBorders[pattern] || '#FFC107';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, width, height);
    
    // Add pattern label overlay
    ctx.fillStyle = patternBorders[pattern] || '#FFC107';
    ctx.font = '14px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `Pattern ${pattern}`,
        startX + width / 2,
        startY + height / 2
    );
}

if (typeof window !== 'undefined') window.highlightPatternInOriginalImage = highlightPatternInOriginalImage;