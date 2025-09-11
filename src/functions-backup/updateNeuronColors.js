function updateNeuronColors() {
    console.log('=== UPDATING NEURON COLORS ===');
    
    // Function to get light orange to dark orange color based on activation
    function getActivationColor(activation) {
        // Light orange (low) to Dark orange (high) gradient
        // Low activation: Light orange rgb(255, 218, 185)
        // High activation: Dark orange rgb(204, 85, 0)
        const t = Math.max(0, Math.min(1, activation)); // Clamp to 0-1
        
        const red = Math.round(255 - t * 51);    // 255 -> 204
        const green = Math.round(218 - t * 133); // 218 -> 85  
        const blue = Math.round(185 - t * 185);  // 185 -> 0
        
        return `rgb(${red}, ${green}, ${blue})`;
    }
    
    // Update all neurons with same color scheme
    const layers = ['input', 'hidden', 'output'];
    const activationArrays = [activations.input, activations.hidden, activations.output];
    
    layers.forEach((layer, layerIndex) => {
        const layerActivations = activationArrays[layerIndex];
        for (let i = 0; i < layerActivations.length; i++) {
            const neuron = document.getElementById(`${layer}-neuron-${i}`);
            if (neuron) {
                const activation = layerActivations[i];
                const color = getActivationColor(activation);
                neuron.style.fill = color;
                console.log(`${layer} ${i}: activation=${activation.toFixed(2)}, color=${color}`);
            }
        }
    });
}

if (typeof window !== 'undefined') window.updateNeuronColors = updateNeuronColors;