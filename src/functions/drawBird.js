function drawBird(ctx) {
    // Body - oval
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(90, 100, 25, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(90, 70, 18, 0, 2 * Math.PI);
    ctx.fill();
    
    // Beak - pointed (no ears!)
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(75, 70);
    ctx.lineTo(60, 68);
    ctx.lineTo(75, 75);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(85, 65, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(95, 95, 15, 8, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail feathers - small
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(115, 105, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Legs - thin (not four legs!)
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 115);
    ctx.lineTo(85, 130);
    ctx.moveTo(95, 115);
    ctx.lineTo(95, 130);
    ctx.stroke();
    
    // Feet
    ctx.beginPath();
    ctx.moveTo(82, 130);
    ctx.lineTo(88, 130);
    ctx.moveTo(92, 130);
    ctx.lineTo(98, 130);
    ctx.stroke();
}

if (typeof window !== 'undefined') window.drawBird = drawBird;