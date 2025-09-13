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
    // Use centralized translation function
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('neuron-hover') : (key) => key;
    
    try {
        if (layerType === 'input') {
            // Defensive checks for input neurons
            if (!activations || !activations.input || isNaN(neuronIndex) || neuronIndex < 0 || neuronIndex >= activations.input.length) {
                throw new Error(`Invalid input neuron access: neuronIndex=${neuronIndex}, activations.input available=${!!(activations && activations.input)}`);
            }
            
            return {
                type: 'input',
                layerName: t('neuronHover.inputLayer'),
                value: activations.input[neuronIndex],
                explanation: t('neuronHover.directInput')
            };
        }
        
        if (layerType === 'output') {
            // Defensive checks for output neurons
            if (!activations || !activations.output || !networkConfig || isNaN(neuronIndex) || neuronIndex < 0 || neuronIndex >= activations.output.length) {
                throw new Error(`Invalid output neuron access: neuronIndex=${neuronIndex}, activations.output available=${!!(activations && activations.output)}, networkConfig available=${!!networkConfig}`);
            }
            
            const outputValue = activations.output[neuronIndex];
            
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
            // Defensive checks for hidden neurons
            if (!activations || !activations.hiddenLayers || !activations.hiddenLayers[layerIndex] || 
                isNaN(neuronIndex) || neuronIndex < 0 || neuronIndex >= activations.hiddenLayers[layerIndex].length) {
                throw new Error(`Invalid hidden neuron access: layerIndex=${layerIndex}, neuronIndex=${neuronIndex}, hiddenLayers available=${!!(activations && activations.hiddenLayers)}`);
            }
            
            const hiddenValue = activations.hiddenLayers[layerIndex][neuronIndex];
            
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
        console.error('Error calculating neuron data for', { neuronId, layerType }, error);
        console.error('Current state:', {
            activations: typeof activations !== 'undefined' ? 'available' : 'undefined',
            weights: typeof weights !== 'undefined' ? 'available' : 'undefined',
            networkConfig: typeof networkConfig !== 'undefined' ? 'available' : 'undefined'
        });
        
        return {
            type: 'error',
            layerName: t('neuronHover.error'),
            message: `Calculation error: ${error.message}`,
            value: 0
        };
    }
    
    return {
        type: 'unknown',
        layerName: t('neuronHover.noCalculation'),
        value: 0
    };
}

// Generate HTML content for tooltip
function generateTooltipContent(data, layerType) {
    // Use centralized translation function
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('neuron-hover') : (key) => key;
    
    // Helper function to safely format numbers
    const formatNumber = (value, decimals = 3) => {
        if (typeof value === 'number' && !isNaN(value)) {
            return value.toFixed(decimals);
        }
        return 'N/A';
    };
    
    if (data.type === 'input') {
        return `
            <div class="tooltip-header">${data.layerName}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.inputValue')}:</div>
                <div class="tooltip-value">${formatNumber(data.value)}</div>
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
    
    if (data.type === 'error') {
        return `
            <div class="tooltip-header" style="color: #dc3545;">${data.layerName}</div>
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.errorMessage')}:</div>
                <div class="tooltip-value" style="color: #dc3545;">${data.message}</div>
            </div>
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
                <div class="tooltip-input-value">${formatNumber(calc.input)}</div>
                <div class="tooltip-input-weight">× ${formatNumber(calc.weight)}</div>
            `;
        });
        
        html += `
                    </div>
                </div>
                <div class="tooltip-calculation">
                    ${t('neuronHover.step2')}: ${formatNumber(data.weightedSum)}
                </div>
                <div class="tooltip-calculation">
                    ${t('neuronHover.step3')} (${data.activationFunction}): ${formatNumber(data.value)}
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="tooltip-section">
                <div class="tooltip-label">${t('neuronHover.finalValue')}:</div>
                <div class="tooltip-value">${formatNumber(data.value)}</div>
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