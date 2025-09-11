async function animateForwardPropagation() {
    // Enhanced pedagogical forward propagation with connection highlighting and math overlays
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        // First, highlight ALL connections TO this specific neuron
        highlightSubNetwork('input', 'hidden', h);
        await sleep(600);
        
        // Animate each connection individually with enhanced highlighting and flowing dots
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.input[i].x, positions.input[i].y, 
                                positions.hidden[h].x, positions.hidden[h].y, 
                                `conn-input-${i}-hidden-${h}`, 600);
                
                // Individual connection computation
                const contribution = activations.input[i] * weights.inputToHidden[h][i];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(500);
        
        // Apply Leaky ReLU activation (prevents dead neurons)
        activations.hidden[h] = leakyReLU(sum);
        
        // Update neuron
        const neuron = document.getElementById(`hidden-neuron-${h}`);
        const value = document.getElementById(`hidden-value-${h}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.hidden[h].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
        
        // Update visual properties
        updateNeuronColors();
        
        clearSubNetworkHighlights();
        await sleep(400);
    }
}

if (typeof window !== 'undefined') window.animateForwardPropagation = animateForwardPropagation;