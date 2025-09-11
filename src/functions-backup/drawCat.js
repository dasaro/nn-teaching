function drawCat(ctx) {
    // Body
    ctx.fillStyle = '#696969';
    ctx.fillRect(70, 130, 60, 50);
    
    // Head
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(100, 85, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pointed ears
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(80, 65);
    ctx.lineTo(85, 45);
    ctx.lineTo(95, 60);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(120, 65);
    ctx.lineTo(115, 45);
    ctx.lineTo(105, 60);
    ctx.fill();
    
    // Eyes - cat-like
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(90, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(110, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(89, 78, 2, 4);
    ctx.fillRect(109, 78, 2, 4);
    
    // Nose - triangle
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(100, 88);
    ctx.lineTo(95, 95);
    ctx.lineTo(105, 95);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 85);
    ctx.lineTo(85, 87);
    ctx.moveTo(70, 90);
    ctx.lineTo(85, 90);
    ctx.moveTo(130, 85);
    ctx.lineTo(115, 87);
    ctx.moveTo(130, 90);
    ctx.lineTo(115, 90);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#696969';
    ctx.fillRect(75, 180, 8, 20);
    ctx.fillRect(90, 180, 8, 20);
    ctx.fillRect(102, 180, 8, 20);
    ctx.fillRect(117, 180, 8, 20);
    
    // Tail - long and curved
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(140, 150, 20, Math.PI, 0);
    ctx.stroke();
}

if (typeof window !== 'undefined') window.drawCat = drawCat;