function highlightSubNetwork(fromLayer, toLayer, targetNeuron = null) {
    // Clear previous highlights
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
    
    if (targetNeuron !== null) {
        // Highlight connections to specific target neuron and related neurons
        if (fromLayer === 'input' && toLayer === 'hidden') {
            // Highlight target hidden neuron
            const targetHiddenNeuron = document.getElementById(`hidden-neuron-${targetNeuron}`);
            if (targetHiddenNeuron) targetHiddenNeuron.classList.add('sub-network-highlight');
            
            for (let i = 0; i < networkConfig.inputSize; i++) {
                const line = document.getElementById(`conn-input-${i}-hidden-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                // Highlight contributing input neurons
                const inputNeuron = document.getElementById(`input-neuron-${i}`);
                if (inputNeuron) inputNeuron.classList.add('sub-network-highlight');
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            // Highlight target output neuron
            const targetOutputNeuron = document.getElementById(`output-neuron-${targetNeuron}`);
            if (targetOutputNeuron) targetOutputNeuron.classList.add('sub-network-highlight');
            
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                const line = document.getElementById(`conn-hidden-${h}-output-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                // Highlight contributing hidden neurons
                const hiddenNeuron = document.getElementById(`hidden-neuron-${h}`);
                if (hiddenNeuron) hiddenNeuron.classList.add('sub-network-highlight');
            }
        }
    } else {
        // Highlight all connections between layers
        if (fromLayer === 'input' && toLayer === 'hidden') {
            for (let i = 0; i < networkConfig.inputSize; i++) {
                for (let h = 0; h < networkConfig.hiddenSize; h++) {
                    const line = document.getElementById(`conn-input-${i}-hidden-${h}`);
                    if (line) line.classList.add('active-path');
                }
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                for (let o = 0; o < networkConfig.outputSize; o++) {
                    const line = document.getElementById(`conn-hidden-${h}-output-${o}`);
                    if (line) line.classList.add('active-path');
                }
            }
        }
    }
}

if (typeof window !== 'undefined') window.highlightSubNetwork = highlightSubNetwork;