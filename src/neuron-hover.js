// Neuron hover tooltip functionality
// Shows calculation details when hovering over neurons

let neuronTooltip = null;

// Initialize the tooltip system
function initializeNeuronTooltips() {
    // Create tooltip element
    neuronTooltip = document.createElement('div');
    neuronTooltip.className = 'neuron-tooltip';
    document.body.appendChild(neuronTooltip);
}

// Add hover functionality to a neuron
function addNeuronHover(neuronElement, layerType, layerIndex, neuronIndex) {
    neuronElement.addEventListener('mouseenter', (e) => showNeuronTooltip(e, layerType, layerIndex, neuronIndex));
    neuronElement.addEventListener('mouseleave', hideNeuronTooltip);
    neuronElement.addEventListener('mousemove', updateTooltipPosition);
}

// Show tooltip with calculation details
function showNeuronTooltip(event, layerType, layerIndex, neuronIndex) {
    if (!neuronTooltip) return;
    
    const calculationData = getNeuronCalculation(layerType, layerIndex, neuronIndex);
    const content = generateTooltipContent(calculationData, layerType);
    
    neuronTooltip.innerHTML = content;
    neuronTooltip.classList.add('show');
    
    updateTooltipPosition(event);
}

// Hide tooltip
function hideNeuronTooltip() {
    if (neuronTooltip) {
        neuronTooltip.classList.remove('show');
    }
}

// Update tooltip position following mouse
function updateTooltipPosition(event) {
    if (!neuronTooltip) return;
    
    const rect = neuronTooltip.getBoundingClientRect();
    let x = event.clientX + 15;
    let y = event.clientY - rect.height - 10;
    
    // Keep tooltip within viewport
    if (x + rect.width > window.innerWidth) {
        x = event.clientX - rect.width - 15;
    }
    if (y < 0) {
        y = event.clientY + 15;
    }
    
    neuronTooltip.style.left = x + 'px';
    neuronTooltip.style.top = y + 'px';
}

// Get calculation data for a specific neuron
function getNeuronCalculation(layerType, layerIndex, neuronIndex) {
    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key; // Translation function
    
    try {
        if (layerType === 'input') {
            return {
                type: 'input',
                layerName: t('neuronHover.inputLayer'),
                value: activations.input ? activations.input[neuronIndex] : 0,
                explanation: t('neuronHover.directInput')
            };
        }
        
        if (layerType === 'output') {
            const outputValue = activations.output ? activations.output[neuronIndex] : 0;
            
            // Get inputs for output calculation
            let inputs, inputWeights;
            if (networkConfig.hiddenLayers.length === 0) {
                // Direct input -> output
                inputs = activations.input || [];
                inputWeights = weights.layers && weights.layers[0] && weights.layers[0][neuronIndex] ? weights.layers[0][neuronIndex] : [];
            } else {
                // Last hidden layer -> output
                const lastHiddenIndex = networkConfig.hiddenLayers.length - 1;
                inputs = activations.hiddenLayers && activations.hiddenLayers[lastHiddenIndex] ? activations.hiddenLayers[lastHiddenIndex] : [];
                const outputLayerIndex = networkConfig.hiddenLayers.length;
                inputWeights = weights.layers && weights.layers[outputLayerIndex] && weights.layers[outputLayerIndex][neuronIndex] ? weights.layers[outputLayerIndex][neuronIndex] : [];
            }
            
            // Calculate weighted sum
            let weightedSum = 0;
            const calculations = [];
            for (let i = 0; i < Math.min(inputs.length, inputWeights.length); i++) {
                const product = inputs[i] * inputWeights[i];
                weightedSum += product;
                calculations.push({
                    input: inputs[i],
                    weight: inputWeights[i],
                    product: product
                });
            }
            
            return {
                type: 'output',
                layerName: t('neuronHover.outputLayer'),
                value: outputValue,
                inputs: calculations,
                weightedSum: weightedSum,
                activationFunction: 'sigmoid'
            };
        }
        
        if (layerType === 'hidden') {
            const hiddenValue = activations.hiddenLayers && activations.hiddenLayers[layerIndex] ? activations.hiddenLayers[layerIndex][neuronIndex] : 0;
            
            // Get inputs for hidden layer calculation
            let inputs, inputWeights;
            if (layerIndex === 0) {
                // First hidden layer gets input from input layer
                inputs = activations.input || [];
                inputWeights = weights.layers && weights.layers[0] && weights.layers[0][neuronIndex] ? weights.layers[0][neuronIndex] : [];
            } else {
                // Other hidden layers get input from previous hidden layer
                inputs = activations.hiddenLayers && activations.hiddenLayers[layerIndex - 1] ? activations.hiddenLayers[layerIndex - 1] : [];
                inputWeights = weights.layers && weights.layers[layerIndex] && weights.layers[layerIndex][neuronIndex] ? weights.layers[layerIndex][neuronIndex] : [];
            }
            
            // Calculate weighted sum
            let weightedSum = 0;
            const calculations = [];
            for (let i = 0; i < Math.min(inputs.length, inputWeights.length); i++) {
                const product = inputs[i] * inputWeights[i];
                weightedSum += product;
                calculations.push({
                    input: inputs[i],
                    weight: inputWeights[i],
                    product: product
                });
            }
            
            return {
                type: 'hidden',
                layerName: t('neuronHover.hiddenLayer'),
                value: hiddenValue,
                inputs: calculations,
                weightedSum: weightedSum,
                activationFunction: 'leakyReLU'
            };
        }
        
    } catch (error) {
        console.warn('Error calculating neuron data:', error);
    }
    
    return {
        type: 'unknown',
        layerName: t('neuronHover.noCalculation'),
        value: 0
    };
}

// Generate HTML content for tooltip
function generateTooltipContent(data, layerType) {
    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;
    
    if (data.type === 'input') {
        return `
            <div class="tooltip-header">${data.layerName}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.inputValue')}:</div>
                <div class="tooltip-value">${data.value.toFixed(3)}</div>
            </div>
            <div class="tooltip-section">
                <div class="tooltip-step">${data.explanation}</div>
            </div>
        `;
    }
    
    if (data.type === 'unknown') {
        return `
            <div class="tooltip-header">${t('neuronHover.noCalculation')}</div>
        `;
    }
    
    // Hidden and output neurons
    let html = `<div class="tooltip-header">${data.layerName}</div>`;
    
    if (data.inputs && data.inputs.length > 0) {
        html += `
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.calculation')}:</div>
                <div class="tooltip-formula">
                    <div>${t('neuronHover.step1')}:</div>
                    <div class="tooltip-inputs">
                        <div style="grid-column: 1/-1; font-weight: bold; margin-bottom: 4px;">
                            Input × Weight = Product
                        </div>
        `;
        
        data.inputs.forEach((calc, i) => {
            html += `
                <div class="tooltip-input-label">Input ${i + 1}:</div>
                <div class="tooltip-input-value">${calc.input.toFixed(3)}</div>
                <div class="tooltip-input-weight">× ${calc.weight.toFixed(3)}</div>
            `;
        });
        
        html += `
                    </div>
                </div>
                <div class="tooltip-calculation">
                    ${t('neuronHover.step2')}: ${data.weightedSum.toFixed(3)}
                </div>
                <div class="tooltip-calculation">
                    ${t('neuronHover.step3')} (${data.activationFunction}): ${data.value.toFixed(3)}
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.finalValue')}:</div>
                <div class="tooltip-value">${data.value.toFixed(3)}</div>
            </div>
        `;
    }
    
    return html;
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.neuronHover = {
        initialize: initializeNeuronTooltips,
        addHover: addNeuronHover
    };
}