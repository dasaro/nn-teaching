function drawTree(ctx) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(80, 100, 16, 60);
    
    // Tree crown - multiple circles
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(70, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(108, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 70, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 105, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Leaves details
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(80, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
}

if (typeof window !== 'undefined') window.drawTree = drawTree;