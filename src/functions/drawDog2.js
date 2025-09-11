function drawDog2(ctx) {
    // Different dog - more square/bulldog style
    // Body
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(40, 110, 90, 40);
    
    // Head - more square
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(60, 50, 50, 50);
    
    // Ears - smaller, different position (floppy)
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(55, 45, 12, 18);
    ctx.fillRect(103, 45, 12, 18);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(72, 68, 5, 5);
    ctx.fillRect(93, 68, 5, 5);
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.fillRect(82, 85, 6, 3);
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(78, 95);
    ctx.lineTo(85, 98);
    ctx.lineTo(92, 95);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(50, 150, 10, 18);
    ctx.fillRect(68, 150, 10, 18);
    ctx.fillRect(92, 150, 10, 18);
    ctx.fillRect(110, 150, 10, 18);
    
    // Tail
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(135, 120, 12, 0, Math.PI);
    ctx.fill();
}

if (typeof window !== 'undefined') window.drawDog2 = drawDog2;