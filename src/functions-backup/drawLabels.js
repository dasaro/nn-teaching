function drawLabels() {
    const svg = document.getElementById('networkSvg');
    const labels = [{x: 80, y: 15, text: 'Input Layer'}, 
                   {x: 280, y: 15, text: 'Hidden Layer'}, 
                   {x: 480, y: 15, text: 'Output Layer'},
                   {x: 650, y: 15, text: 'AI Prediction'}];
    
    labels.forEach(label => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', label.x);
        text.setAttribute('y', label.y);
        text.setAttribute('class', 'layer-label');
        text.textContent = label.text;
        svg.appendChild(text);
    });
}

if (typeof window !== 'undefined') window.drawLabels = drawLabels;