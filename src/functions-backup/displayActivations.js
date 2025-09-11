function displayActivations() {
    const display = document.getElementById('activationsDisplay');
    let html = '';
    
    html += `<strong>INPUT LAYER:</strong><br>[`;
    activations.input.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(0, ${intensity}, 255)">${val.toFixed(3)}</span>`;
        if (i < activations.input.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>HIDDEN LAYER:</strong><br>[`;
    activations.hidden.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(${intensity}, 255, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.hidden.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>OUTPUT LAYER:</strong><br>[`;
    activations.output.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(255, ${intensity}, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.output.length - 1) html += ', ';
    });
    html += ']';
    
    display.innerHTML = html;
}

if (typeof window !== 'undefined') window.displayActivations = displayActivations;