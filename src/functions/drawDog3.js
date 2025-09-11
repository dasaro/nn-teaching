function drawDog3(ctx) {
    // Spotted dog - dalmatian style
    // Body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(50, 100, 80, 50);
    
    // Head
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(90, 70, 28, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears - floppy
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(72, 55, 12, 20, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(108, 55, 12, 20, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(95, 60, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, 75, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 115, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 120, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(82, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 80, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(90, 85, 6, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, 150, 8, 16);
    ctx.fillRect(75, 150, 8, 16);
    ctx.fillRect(95, 150, 8, 16);
    ctx.fillRect(110, 150, 8, 16);
    
    // Tail - wagging upward
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(135, 110, 10, Math.PI, 0, false);
    ctx.fill();
}

if (typeof window !== 'undefined') window.drawDog3 = drawDog3;