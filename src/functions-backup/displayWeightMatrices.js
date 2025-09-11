function displayWeightMatrices() {
    const display = document.getElementById('weightsDisplay');
    let html = '';
    
    html += '<div class="matrix-section"><strong>INPUT → HIDDEN WEIGHTS:</strong><br>';
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        html += `H${h}: [`;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weight = weights.inputToHidden[h][i];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (i < networkConfig.inputSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    
    html += '</div><br><div class="matrix-section"><strong>HIDDEN → OUTPUT WEIGHTS:</strong><br>';
    for (let o = 0; o < networkConfig.outputSize; o++) {
        html += `O${o}: [`;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weight = weights.hiddenToOutput[o][h];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (h < networkConfig.hiddenSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    html += '</div>';
    
    display.innerHTML = html;
}

if (typeof window !== 'undefined') window.displayWeightMatrices = displayWeightMatrices;