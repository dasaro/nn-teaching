function drawDog1(ctx) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(60, 120, 80, 60);
    
    // Head
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.arc(100, 80, 35, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(80, 60, 15, 25, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(120, 60, 15, 25, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 90, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 95, 8, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(70, 180, 10, 20);
    ctx.fillRect(85, 180, 10, 20);
    ctx.fillRect(105, 180, 10, 20);
    ctx.fillRect(120, 180, 10, 20);
    
    // Tail
    ctx.beginPath();
    ctx.arc(150, 140, 15, 0, Math.PI);
    ctx.fill();
}

if (typeof window !== 'undefined') window.drawDog1 = drawDog1;