async function animateOutputComputation() {
    // Enhanced output computation with pedagogical highlighting
    
    // Compute output layer
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputName = o === 0 ? 'DOG' : 'NOT-DOG';
        
        // First, highlight ALL connections TO this output neuron
        highlightSubNetwork('hidden', 'output', o);
        await sleep(600);
        
        // Animate each connection with enhanced highlighting and flowing dots
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.hidden[h].x, positions.hidden[h].y, 
                                positions.output[o].x, positions.output[o].y, 
                                `conn-hidden-${h}-output-${o}`, 600);
                
                const contribution = activations.hidden[h] * weights.hiddenToOutput[o][h];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(400);
        
        activations.output[o] = sum;
        clearSubNetworkHighlights();
        await sleep(300);
    }
    
    // Apply softmax
    activations.output = softmax(activations.output);
    
    // Update prediction column after output is computed
    updatePrediction();
    
    // Update output neurons
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const neuron = document.getElementById(`output-neuron-${o}`);
        const value = document.getElementById(`output-value-${o}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.output[o].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
    }
    
    // Final visual update
    updateNeuronColors();
}

if (typeof window !== 'undefined') window.animateOutputComputation = animateOutputComputation;