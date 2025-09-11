function displayGradients() {
    const display = document.getElementById('gradientsDisplay');
    if (gradientHistory.length === 0) {
        display.innerHTML = `<em>${t('whatIf.noGradientData')}</em>`;
        return;
    }
    
    const latest = gradientHistory[gradientHistory.length - 1];
    let html = `<strong>LATEST GRADIENT UPDATE (Epoch ${performanceMetrics.epochCount}):</strong><br><br>`;
    
    if (latest.outputGradients) {
        html += '<strong>OUTPUT GRADIENTS:</strong><br>';
        latest.outputGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `O${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
        html += '<br>';
    }
    
    if (latest.hiddenGradients) {
        html += '<strong>HIDDEN GRADIENTS:</strong><br>';
        latest.hiddenGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `H${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
    }
    
    display.innerHTML = html;
}

if (typeof window !== 'undefined') window.displayGradients = displayGradients;