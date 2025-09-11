function createWeightControl(fromLayer, fromIndex, toIndex, currentWeight) {
    const container = document.createElement('div');
    container.className = 'weight-control';
    
    // Label showing which connection this controls
    const label = document.createElement('label');
    const fromName = fromLayer === 'input' 
        ? ['A', 'B', 'C', 'D'][fromIndex] 
        : `H${fromIndex + 1}`;
    const toName = fromLayer === 'input' 
        ? `H${toIndex + 1}` 
        : (toIndex === 0 ? 'Dog' : 'Not Dog');
    
    label.textContent = `${fromName} → ${toName}`;
    label.className = 'weight-label';
    
    // Slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '-3';
    slider.max = '3';
    slider.step = '0.1';
    slider.value = currentWeight;
    slider.className = 'weight-control-slider';
    
    // Value display
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'weight-value-display';
    valueDisplay.textContent = currentWeight.toFixed(2);
    
    // Connection highlighting on hover
    container.addEventListener('mouseenter', () => {
        highlightConnection(fromLayer, fromIndex, toIndex, true);
    });
    
    container.addEventListener('mouseleave', () => {
        highlightConnection(fromLayer, fromIndex, toIndex, false);
    });
    
    // Update weight when slider changes
    slider.addEventListener('input', (e) => {
        const newWeight = parseFloat(e.target.value);
        updateWeight(fromLayer, fromIndex, toIndex, newWeight);
        valueDisplay.textContent = newWeight.toFixed(2);
        
        // Recalculate predictions in real-time
        if (activations.input.some(val => val > 0)) {
            recalculateNetwork();
        }
    });
    
    container.appendChild(label);
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    
    return container;
}

if (typeof window !== 'undefined') window.createWeightControl = createWeightControl;