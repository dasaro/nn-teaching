function updateInputActivations(values) {
    activations.input = values;
    // Update display
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const valueElement = document.getElementById(`input-value-${i}`);
        if (valueElement) {
            valueElement.textContent = activations.input[i].toFixed(2);
        }
    }
}

if (typeof window !== 'undefined') window.updateInputActivations = updateInputActivations;