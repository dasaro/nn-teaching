function highlightInputNeuron(index) {
    // Remove previous highlights
    document.querySelectorAll('.input-neuron').forEach(neuron => {
        neuron.classList.remove('neuron-active');
    });
    
    // Highlight selected neuron
    const neurons = document.querySelectorAll('.input-neuron');
    if (neurons[index]) {
        neurons[index].classList.add('neuron-active');
    }
}

if (typeof window !== 'undefined') window.highlightInputNeuron = highlightInputNeuron;