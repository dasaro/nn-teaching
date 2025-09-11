async function animateInputActivation() {
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const neuron = document.getElementById(`input-neuron-${i}`);
        const value = document.getElementById(`input-value-${i}`);
        
        neuron.classList.add('forward-active');
        value.textContent = activations.input[i].toFixed(2);
        
        await sleep(300);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
    }
    
    // Update visual properties based on activations
    updateNeuronColors();
}

if (typeof window !== 'undefined') window.animateInputActivation = animateInputActivation;