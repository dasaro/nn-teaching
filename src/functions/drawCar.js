function drawCar(ctx) {
    // Car body
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(40, 130, 120, 40);
    
    // Car roof
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(60, 100, 80, 30);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(65, 105, 25, 20);
    ctx.fillRect(110, 105, 25, 20);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(65, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wheel centers
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(65, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Headlights
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(35, 145, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, 155, 5, 0, 2 * Math.PI);
    ctx.fill();
}

if (typeof window !== 'undefined') window.drawCar = drawCar;