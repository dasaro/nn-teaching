function drawFish(ctx) {
    // Body - streamlined
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.ellipse(90, 100, 30, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head is part of body (no ears!)
    
    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(75, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(75, 95, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail - prominent
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(140, 85);
    ctx.lineTo(140, 115);
    ctx.fill();
    
    // Fins (not legs!)
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.ellipse(85, 115, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(95, 85, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Scales pattern
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(85, 100, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(95, 105, 4, 0, 2 * Math.PI);
    ctx.stroke();
}

if (typeof window !== 'undefined') window.drawFish = drawFish;