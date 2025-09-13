// ============================================================================
// NETWORK-VISUALIZER MODULE - Variable Architecture Support
// Dynamic network visualization for 0-3 hidden layers with 1-8 neurons each
// ============================================================================

// Global positions object - dynamically calculated for current architecture
let positions = {};

function drawNetwork() {
    const svg = document.getElementById('networkSvg');
    svg.innerHTML = '';
    
    // Calculate positions for current architecture
    calculatePositions();
    
    // Draw connections first (so they appear behind neurons)
    drawConnections();
    
    // Draw neurons
    drawNeurons();
    
    // Draw layer labels
    drawLabels();
    
    // Draw prediction column
    drawPrediction();
    
    // Update visual properties based on current values
    updateNeuronColors();
    updatePrediction();
}

/**
 * Calculate positions for all neurons based on current architecture
 * Supports 0-3 hidden layers with proper spacing and alignment
 */
function calculatePositions() {
    const arch = NetworkAPI.getArchitecture();
    const svgHeight = 480;
    const layerMargin = 120; // Minimum space between layers
    const neuronRadius = 30;
    
    positions = {
        input: [],
        hidden: [], // For backward compatibility
        hiddenLayers: [], // Array of hidden layer positions
        output: []
    };
    
    // Calculate total sections (input + hidden layers + output + prediction)
    const totalLayers = 2 + arch.hiddenLayers.length; // input + hidden layers + output
    const totalSections = totalLayers + 1; // +1 for prediction area
    
    // Dynamic SVG width based on architecture
    const minSvgWidth = Math.max(800, totalSections * 150 + 200); // Ensure enough space
    const svgElement = document.getElementById('networkSvg');
    if (svgElement) {
        svgElement.setAttribute('width', minSvgWidth);
    }
    
    const availableWidth = minSvgWidth - 200; // Leave margins
    const layerSpacing = availableWidth / totalSections;
    
    let currentX = 100; // Start position
    
    // Input layer positions
    const inputY = svgHeight / 2;
    for (let i = 0; i < arch.inputSize; i++) {
        const y = inputY + (i - (arch.inputSize - 1) / 2) * 60;
        positions.input.push({ x: currentX, y });
    }
    currentX += layerSpacing;
    
    // Hidden layers positions
    arch.hiddenLayers.forEach((layerSize, layerIndex) => {
        const hiddenLayerPositions = [];
        const hiddenY = svgHeight / 2;
        
        for (let i = 0; i < layerSize; i++) {
            const y = hiddenY + (i - (layerSize - 1) / 2) * 50; // Slightly tighter spacing
            hiddenLayerPositions.push({ x: currentX, y });
        }
        
        positions.hiddenLayers.push(hiddenLayerPositions);
        
        // Backward compatibility: first hidden layer
        if (layerIndex === 0) {
            positions.hidden = hiddenLayerPositions;
        }
        
        currentX += layerSpacing;
    });
    
    // Handle case with no hidden layers
    if (arch.hiddenLayers.length === 0) {
        positions.hidden = [];
        positions.hiddenLayers = [];
    }
    
    // Output layer positions
    const outputY = svgHeight / 2;
    for (let i = 0; i < arch.outputSize; i++) {
        const y = outputY + (i - (arch.outputSize - 1) / 2) * 80;
        positions.output.push({ x: currentX, y });
    }
    
    // Prediction position (to the right of output)
    currentX += layerSpacing;
    positions.prediction = { x: currentX, y: svgHeight / 2 };
    
    console.log(`📐 Positions calculated for architecture: ${arch.inputSize}→[${arch.hiddenLayers.join(',')}]→${arch.outputSize}`);
}

function drawConnections() {
    const svg = document.getElementById('networkSvg');
    const arch = NetworkAPI.getArchitecture();
    
    if (arch.hiddenLayers.length === 0) {
        // No hidden layers: direct input to output connections
        drawDirectConnections(svg, arch);
    } else {
        // With hidden layers: draw layer-by-layer connections
        drawLayeredConnections(svg, arch);
    }
}

/**
 * Draw direct input->output connections (no hidden layers)
 */
function drawDirectConnections(svg, arch) {
    for (let i = 0; i < arch.inputSize; i++) {
        for (let o = 0; o < arch.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-output-${o}`);
            
            // Get weight from layer 0 (direct connection)
            const weight = NetworkAPI.getWeight(0, i, 0, o); // layer-based access
            applyWeightVisualization(line, weight);
            
            const outputName = o === 0 ? 'Dog' : 'Not Dog';
            addWeightTooltip(line, weight, `Input ${['A', 'B', 'C', 'D'][i]} → ${outputName}`);
            
            svg.appendChild(line);
        }
    }
}

/**
 * Draw connections for networks with hidden layers
 */
function drawLayeredConnections(svg, arch) {
    // Input to first hidden layer
    const firstHiddenSize = arch.hiddenLayers[0];
    for (let i = 0; i < arch.inputSize; i++) {
        for (let h = 0; h < firstHiddenSize; h++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.hiddenLayers[0][h].x - 25);
            line.setAttribute('y2', positions.hiddenLayers[0][h].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-hidden-0-${h}`);
            
            const weight = NetworkAPI.getWeight('input', i, 'hidden', h);
            applyWeightVisualization(line, weight);
            
            addWeightTooltip(line, weight, `Input ${['A', 'B', 'C', 'D'][i]} → Hidden H${h + 1}`);
            
            svg.appendChild(line);
        }
    }
    
    // Hidden layer to hidden layer connections
    for (let layer = 0; layer < arch.hiddenLayers.length - 1; layer++) {
        const currentLayerSize = arch.hiddenLayers[layer];
        const nextLayerSize = arch.hiddenLayers[layer + 1];
        
        for (let h1 = 0; h1 < currentLayerSize; h1++) {
            for (let h2 = 0; h2 < nextLayerSize; h2++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', positions.hiddenLayers[layer][h1].x + 25);
                line.setAttribute('y1', positions.hiddenLayers[layer][h1].y);
                line.setAttribute('x2', positions.hiddenLayers[layer + 1][h2].x - 25);
                line.setAttribute('y2', positions.hiddenLayers[layer + 1][h2].y);
                line.setAttribute('class', 'connection-line');
                line.setAttribute('id', `conn-hidden-${layer}-${h1}-hidden-${layer + 1}-${h2}`);
                
                // Get weight using layer indices
                const weight = NetworkAPI.getWeight(layer, h1, layer + 1, h2);
                applyWeightVisualization(line, weight);
                
                addWeightTooltip(line, weight, `H${layer + 1}.${h1 + 1} → H${layer + 2}.${h2 + 1}`);
                
                svg.appendChild(line);
            }
        }
    }
    
    // Last hidden layer to output
    const lastHiddenIndex = arch.hiddenLayers.length - 1;
    const lastHiddenSize = arch.hiddenLayers[lastHiddenIndex];
    
    for (let h = 0; h < lastHiddenSize; h++) {
        for (let o = 0; o < arch.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.hiddenLayers[lastHiddenIndex][h].x + 25);
            line.setAttribute('y1', positions.hiddenLayers[lastHiddenIndex][h].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-hidden-${lastHiddenIndex}-${h}-output-${o}`);
            
            const weight = NetworkAPI.getWeight('hidden', h, 'output', o);
            applyWeightVisualization(line, weight);
            
            const outputName = o === 0 ? 'Dog' : 'Not Dog';
            addWeightTooltip(line, weight, `Hidden H${h + 1} → ${outputName}`);
            
            svg.appendChild(line);
        }
    }
}

function drawNeurons() {
    const svg = document.getElementById('networkSvg');
    const arch = NetworkAPI.getArchitecture();
    const inputLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const outputLabels = ['Dog', 'Not Dog'];
    
    // Draw input neurons
    for (let i = 0; i < arch.inputSize; i++) {
        const pos = positions.input[i];
        const activationValue = NetworkAPI.getLayerActivations('input')[i] || 0;
        
        drawSingleNeuron(svg, pos, `input-neuron-${i}`, inputLabels[i], activationValue, `input-value-${i}`, 'input', 0, i);
    }
    
    // Draw hidden layer neurons
    for (let layerIndex = 0; layerIndex < arch.hiddenLayers.length; layerIndex++) {
        const layerSize = arch.hiddenLayers[layerIndex];
        const layerActivations = NetworkAPI.getLayerActivations(layerIndex) || [];
        
        for (let neuronIndex = 0; neuronIndex < layerSize; neuronIndex++) {
            const pos = positions.hiddenLayers[layerIndex][neuronIndex];
            const label = `H${layerIndex + 1}.${neuronIndex + 1}`;
            const activationValue = layerActivations[neuronIndex] || 0;
            const neuronId = `hidden-${layerIndex}-neuron-${neuronIndex}`;
            const valueId = `hidden-${layerIndex}-value-${neuronIndex}`;
            
            drawSingleNeuron(svg, pos, neuronId, label, activationValue, valueId, 'hidden', layerIndex, neuronIndex);
        }
    }
    
    // Draw output neurons
    for (let i = 0; i < arch.outputSize; i++) {
        const pos = positions.output[i];
        const activationValue = NetworkAPI.getLayerActivations('output')[i] || 0;
        
        drawSingleNeuron(svg, pos, `output-neuron-${i}`, outputLabels[i], activationValue, `output-value-${i}`, 'output', 0, i);
    }
}

function drawSingleNeuron(svg, pos, neuronId, label, activationValue, valueId, layerType, layerIndex, neuronIndex) {
    // Draw neuron circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 30);
    circle.setAttribute('class', 'neuron');
    circle.setAttribute('id', neuronId);
    
    // Add hover functionality for calculation details
    if (window.neuronHover && typeof layerType !== 'undefined') {
        window.neuronHover.addHover(circle, layerType, layerIndex || 0, neuronIndex || 0);
    }
    
    // Draw neuron label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x);
    text.setAttribute('y', pos.y - 5);
    text.setAttribute('class', 'neuron-value');
    text.textContent = label;
    
    // Draw activation value
    const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valueText.setAttribute('x', pos.x);
    valueText.setAttribute('y', pos.y + 8);
    valueText.setAttribute('class', 'neuron-value');
    valueText.setAttribute('id', valueId);
    valueText.textContent = activationValue.toFixed(2);
    
    svg.appendChild(circle);
    svg.appendChild(text);
    svg.appendChild(valueText);
}

function drawLabels() {
    const svg = document.getElementById('networkSvg');
    const arch = NetworkAPI.getArchitecture();
    const t = (key, params) => {
        if (window.i18n && window.i18n.t) {
            return params ? window.i18n.t(key, params) : window.i18n.t(key);
        }
        // Fallback for keys with placeholders
        if (key === 'network.hiddenLayerN' && params) {
            return `Hidden Layer ${params[0]}`;
        }
        const fallbacks = {
            'network.inputLayer': 'Input Layer',
            'network.hiddenLayer': 'Hidden Layer',
            'network.outputLayer': 'Output Layer',
            'network.aiPrediction': 'AI Prediction'
        };
        return fallbacks[key] || key;
    };
    
    // Use dynamic positioning based on calculated positions
    const labels = [];
    
    // Input layer label - use actual position
    if (positions.input && positions.input.length > 0) {
        labels.push({x: positions.input[0].x, y: 15, text: t('network.inputLayer')});
    }
    
    // Hidden layer labels - use actual positions
    for (let i = 0; i < arch.hiddenLayers.length; i++) {
        if (positions.hiddenLayers[i] && positions.hiddenLayers[i].length > 0) {
            const x = positions.hiddenLayers[i][0].x;
            const text = arch.hiddenLayers.length === 1 
                ? t('network.hiddenLayer')
                : t('network.hiddenLayerN', [i + 1]);
            labels.push({x: x, y: 15, text: text});
        }
    }
    
    // Output layer label - use actual position
    if (positions.output && positions.output.length > 0) {
        labels.push({x: positions.output[0].x, y: 15, text: t('network.outputLayer')});
    }
    
    // Prediction label - use actual position
    if (positions.prediction) {
        labels.push({x: positions.prediction.x, y: 15, text: t('network.aiPrediction')});
    }
    
    labels.forEach(label => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', label.x);
        text.setAttribute('y', label.y);
        text.setAttribute('class', 'layer-label');
        text.setAttribute('text-anchor', 'middle'); // Center the labels
        text.textContent = label.text;
        svg.appendChild(text);
    });
}

function drawPrediction() {
    const svg = document.getElementById('networkSvg');
    const pos = positions.prediction;
    
    // Create prediction display circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', 40);
    circle.setAttribute('fill', '#f8fafc');
    circle.setAttribute('stroke', '#3b82f6');
    circle.setAttribute('stroke-width', 3);
    circle.setAttribute('id', 'predictionCircle');
    svg.appendChild(circle);
    
    // Add emoji
    const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    emoji.setAttribute('x', pos.x);
    emoji.setAttribute('y', pos.y - 8);
    emoji.setAttribute('text-anchor', 'middle');
    emoji.setAttribute('dominant-baseline', 'middle');
    emoji.setAttribute('font-size', '20px');
    emoji.setAttribute('id', 'predictionEmoji');
    emoji.textContent = '🤔';
    svg.appendChild(emoji);
    
    // Add confidence/result text
    const result = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    result.setAttribute('x', pos.x);
    result.setAttribute('y', pos.y + 12);
    result.setAttribute('text-anchor', 'middle');
    result.setAttribute('dominant-baseline', 'middle');
    result.setAttribute('font-size', '10px');
    result.setAttribute('font-weight', '600');
    result.setAttribute('fill', '#475569');
    result.setAttribute('id', 'predictionResult');
    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : (key === 'ui.thinking' ? 'Thinking...' : key);
    result.textContent = t('ui.thinking');
    svg.appendChild(result);
    
    // Add confidence degree display below the circle
    const confidenceDisplay = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    confidenceDisplay.setAttribute('x', pos.x);
    confidenceDisplay.setAttribute('y', pos.y + 60); // Position below the circle
    confidenceDisplay.setAttribute('text-anchor', 'middle');
    confidenceDisplay.setAttribute('dominant-baseline', 'middle');
    confidenceDisplay.setAttribute('font-size', '14px');
    confidenceDisplay.setAttribute('font-weight', 'bold');
    confidenceDisplay.setAttribute('fill', '#1f2937');
    confidenceDisplay.setAttribute('id', 'predictionConfidence');
    confidenceDisplay.textContent = '—'; // Initial placeholder
    svg.appendChild(confidenceDisplay);
    
    // Add hover tooltip for confidence calculation explanation
    const hoverArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hoverArea.setAttribute('cx', pos.x);
    hoverArea.setAttribute('cy', pos.y + 60);
    hoverArea.setAttribute('r', 25); // Larger hover area
    hoverArea.setAttribute('fill', 'transparent');
    hoverArea.setAttribute('stroke', 'none');
    hoverArea.setAttribute('id', 'confidenceHoverArea');
    hoverArea.style.cursor = 'help';
    
    // Add hover events for confidence explanation
    hoverArea.addEventListener('mouseenter', showConfidenceTooltip);
    hoverArea.addEventListener('mouseleave', hideConfidenceTooltip);
    hoverArea.addEventListener('mousemove', updateConfidenceTooltipPosition);
    
    svg.appendChild(hoverArea);
}

function updatePrediction() {
    // Get output activations from NetworkAPI
    const outputActivations = NetworkAPI.getLayerActivations('output');
    const dogProb = outputActivations[0] || 0;
    const notDogProb = outputActivations[1] || 0;
    const predicted = dogProb > notDogProb; // Changed to compare probabilities directly
    const maxProb = Math.max(dogProb, notDogProb);
    const confidence = maxProb; // Use the max probability as confidence
    
    // Determine if prediction is correct (if we have a true label)
    const expectedDog = window.trueLabel === 'dog';
    const isCorrect = predicted === expectedDog;
    
    // Update emoji based on prediction and correctness
    let emoji = '🤔'; // default thinking
    let circleColor = '#3b82f6'; // default blue
    
    if (maxProb > 0.01) { // Has made a meaningful prediction
        if (predicted) {
            emoji = isCorrect ? '🐕' : '🐕'; // Dog prediction - always show dog emoji
        } else {
            emoji = isCorrect ? '🚫' : '🚫'; // Not-dog prediction - use prohibition sign
        }
        
        // Color based on correctness
        circleColor = isCorrect ? '#ef4444' : '#10b981'; // red for correct, green for incorrect
    }
    
    // Update elements
    const predictionEmoji = document.getElementById('predictionEmoji');
    const predictionResult = document.getElementById('predictionResult');
    const predictionCircle = document.getElementById('predictionCircle');
    
    if (predictionEmoji) predictionEmoji.textContent = emoji;
    if (predictionCircle) predictionCircle.setAttribute('stroke', circleColor);
    
    if (predictionResult) {
        if (maxProb > 0.01) {
            const confidenceText = `${(confidence * 100).toFixed(0)}%`;
            const predictionText = predicted ? 'DOG' : 'NOT-DOG';
            predictionResult.textContent = `${predictionText} (${confidenceText})`;
        } else {
            const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : (key === 'ui.thinking' ? 'Thinking...' : key);
            predictionResult.textContent = t('ui.thinking');
        }
    }
    
    // Update confidence degree display
    const predictionConfidence = document.getElementById('predictionConfidence');
    if (predictionConfidence) {
        if (maxProb > 0.01) {
            // Calculate confidence as the difference between highest and lowest probability
            const confidenceDegree = Math.abs(dogProb - notDogProb) * 100;
            predictionConfidence.textContent = `${confidenceDegree.toFixed(1)}%`;
            predictionConfidence.setAttribute('fill', confidenceDegree > 70 ? '#059669' : confidenceDegree > 40 ? '#d97706' : '#dc2626');
        } else {
            predictionConfidence.textContent = '—';
            predictionConfidence.setAttribute('fill', '#6b7280');
        }
    }
}

function updateNeuronColors() {
    console.log('=== UPDATING NEURON COLORS ===');
    const arch = NetworkAPI.getArchitecture();
    
    // Update input neurons
    const inputActivations = NetworkAPI.getLayerActivations('input');
    for (let i = 0; i < inputActivations.length; i++) {
        const neuron = document.getElementById(`input-neuron-${i}`);
        if (neuron) {
            const activation = inputActivations[i];
            const color = getActivationColor(activation);
            neuron.style.fill = color;
            console.log(`input ${i}: activation=${activation.toFixed(2)}, color=${color}`);
        }
    }
    
    // Update hidden layer neurons
    for (let layerIndex = 0; layerIndex < arch.hiddenLayers.length; layerIndex++) {
        const layerActivations = NetworkAPI.getLayerActivations(layerIndex);
        for (let neuronIndex = 0; neuronIndex < layerActivations.length; neuronIndex++) {
            const neuron = document.getElementById(`hidden-${layerIndex}-neuron-${neuronIndex}`);
            if (neuron) {
                const activation = layerActivations[neuronIndex];
                const color = getActivationColor(activation);
                neuron.style.fill = color;
                console.log(`hidden ${layerIndex}-${neuronIndex}: activation=${activation.toFixed(2)}, color=${color}`);
            }
        }
    }
    
    // Update output neurons
    const outputActivations = NetworkAPI.getLayerActivations('output');
    for (let i = 0; i < outputActivations.length; i++) {
        const neuron = document.getElementById(`output-neuron-${i}`);
        if (neuron) {
            const activation = outputActivations[i];
            const color = getActivationColor(activation);
            neuron.style.fill = color;
            console.log(`output ${i}: activation=${activation.toFixed(2)}, color=${color}`);
        }
    }
}

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

function highlightSubNetwork(fromLayer, toLayer, targetNeuron = null) {
    // Clear previous highlights
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
    
    const arch = NetworkAPI.getArchitecture();
    
    if (targetNeuron !== null) {
        // Highlight connections to specific target neuron
        if (fromLayer === 'input' && toLayer === 'hidden') {
            // Highlight target hidden neuron (assuming first hidden layer)
            const targetHiddenNeuron = document.getElementById(`hidden-0-neuron-${targetNeuron}`);
            if (targetHiddenNeuron) targetHiddenNeuron.classList.add('sub-network-highlight');
            
            for (let i = 0; i < arch.inputSize; i++) {
                const line = document.getElementById(`conn-input-${i}-hidden-0-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                const inputNeuron = document.getElementById(`input-neuron-${i}`);
                if (inputNeuron) inputNeuron.classList.add('sub-network-highlight');
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            // Highlight target output neuron
            const targetOutputNeuron = document.getElementById(`output-neuron-${targetNeuron}`);
            if (targetOutputNeuron) targetOutputNeuron.classList.add('sub-network-highlight');
            
            // Use last hidden layer
            const lastHiddenIndex = arch.hiddenLayers.length - 1;
            const lastHiddenSize = arch.hiddenLayers[lastHiddenIndex];
            
            for (let h = 0; h < lastHiddenSize; h++) {
                const line = document.getElementById(`conn-hidden-${lastHiddenIndex}-${h}-output-${targetNeuron}`);
                if (line) line.classList.add('computing-path');
                
                const hiddenNeuron = document.getElementById(`hidden-${lastHiddenIndex}-neuron-${h}`);
                if (hiddenNeuron) hiddenNeuron.classList.add('sub-network-highlight');
            }
        }
    } else {
        // Highlight all connections between layers
        if (fromLayer === 'input' && toLayer === 'hidden') {
            for (let i = 0; i < arch.inputSize; i++) {
                for (let h = 0; h < arch.hiddenLayers[0]; h++) {
                    const line = document.getElementById(`conn-input-${i}-hidden-0-${h}`);
                    if (line) line.classList.add('active-path');
                }
            }
        } else if (fromLayer === 'hidden' && toLayer === 'output') {
            const lastHiddenIndex = arch.hiddenLayers.length - 1;
            const lastHiddenSize = arch.hiddenLayers[lastHiddenIndex];
            
            for (let h = 0; h < lastHiddenSize; h++) {
                for (let o = 0; o < arch.outputSize; o++) {
                    const line = document.getElementById(`conn-hidden-${lastHiddenIndex}-${h}-output-${o}`);
                    if (line) line.classList.add('active-path');
                }
            }
        }
    }
}

function clearSubNetworkHighlights() {
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
}

function createFlowingDots(fromX, fromY, toX, toY, connectionId, duration = 800, direction = 'forward') {
    const svg = document.getElementById('networkSvg');
    const numDots = 3;
    const dots = [];
    
    // Calculate exact connection line endpoints to match the actual SVG lines
    const startX = fromX + 25;  // Right edge of source neuron
    const startY = fromY;       // Center Y of source neuron
    const endX = toX - 25;      // Left edge of target neuron  
    const endY = toY;           // Center Y of target neuron
    
    // Create an invisible path that matches the connection line exactly
    const pathId = `flow-path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create path data for straight line
    let pathData;
    if (direction === 'forward') {
        pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
        // Reverse the path for backward movement
        pathData = `M ${endX} ${endY} L ${startX} ${startY}`;
    }
    
    path.setAttribute('d', pathData);
    path.setAttribute('id', pathId);
    path.style.opacity = '0'; // Make path invisible
    svg.appendChild(path);
    
    // Create dots that will animate along the path
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('class', 'flow-dot');
        
        // Set color based on direction
        if (direction === 'forward') {
            dot.setAttribute('fill', '#10b981');
            dot.style.filter = 'drop-shadow(0 0 4px #10b981)';
        } else {
            dot.setAttribute('fill', '#ef4444');
            dot.style.filter = 'drop-shadow(0 0 4px #ef4444)';
        }
        
        // Position dot at the start of the path
        dot.setAttribute('cx', direction === 'forward' ? startX : endX);
        dot.setAttribute('cy', direction === 'forward' ? startY : endY);
        
        svg.appendChild(dot);
        dots.push(dot);
        
        // Animate dot along the path with staggered delay
        setTimeout(() => {
            const pathLength = path.getTotalLength();
            const animationDuration = duration;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // Get point along the path at current progress
                const point = path.getPointAtLength(progress * pathLength);
                
                dot.setAttribute('cx', point.x);
                dot.setAttribute('cy', point.y);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Remove dot when animation completes
                    if (dot.parentNode) {
                        dot.parentNode.removeChild(dot);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        }, i * 120); // Stagger each dot by 120ms
    }
    
    // Clean up path and any remaining dots after total duration
    setTimeout(() => {
        if (path.parentNode) {
            path.parentNode.removeChild(path);
        }
        dots.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
    }, duration + (numDots * 120) + 200);
}

function applyWeightVisualization(lineElement, weight) {
    const absWeight = Math.abs(weight);
    const maxWeight = 3; // Our slider range
    
    // Red-Gray-Green color scheme: Red for negative, Gray for minimal, Green for positive
    let color;
    if (Math.abs(weight) < 0.05) {
        // Very weak connections - visible medium gray
        color = '#9ca3af';
    } else if (weight > 0) {
        // Positive weights: Gray to Green gradient (lighter to darker based on strength)
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (34 - 156)); // From #9ca3af to #22c55e
        const greenValue = Math.floor(163 + intensity * (197 - 163));
        const blueValue = Math.floor(175 + intensity * (94 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    } else {
        // Negative weights: Gray to Red gradient (lighter to darker based on strength)  
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (220 - 156)); // From #9ca3af to #dc2626
        const greenValue = Math.floor(163 + intensity * (38 - 163));
        const blueValue = Math.floor(175 + intensity * (38 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    }
    
    // Moderate thickness variation for clear visual feedback
    const baseThickness = 1.5;
    const maxThicknessFactor = 3; // More noticeable range: 1.5px to 4.5px
    const thickness = baseThickness + (absWeight / maxWeight) * maxThicknessFactor;
    
    // Opacity as primary importance indicator
    const minOpacity = 0.4;
    const maxOpacity = 0.95;
    const opacity = minOpacity + (absWeight / maxWeight) * (maxOpacity - minOpacity);
    
    // Apply visual properties using inline styles for higher CSS specificity
    lineElement.style.stroke = color;
    lineElement.style.strokeWidth = thickness.toFixed(1) + 'px';
    lineElement.style.opacity = opacity.toFixed(2);
    lineElement.style.strokeDasharray = 'none'; // Always solid lines
}

function addWeightTooltip(lineElement, initialWeight, connectionLabel) {
    // Store connection info in data attributes for dynamic lookup
    const connectionInfo = connectionLabel.split(' → ');
    const fromPart = connectionInfo[0];
    const toPart = connectionInfo[1];
    
    lineElement.setAttribute('data-connection-label', connectionLabel);
    lineElement.setAttribute('data-from', fromPart);
    lineElement.setAttribute('data-to', toPart);
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('weightTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'weightTooltip';
        tooltip.className = 'weight-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Store original stroke style
    lineElement.setAttribute('data-original-stroke', lineElement.style.stroke || '#94a3b8');
    
    // Add mouse event listeners
    lineElement.addEventListener('mouseenter', (e) => {
        // Get current weight value from the weights object
        const currentWeight = getCurrentWeightForConnection(connectionLabel);
        
        // Highlight the edge in yellow
        lineElement.style.stroke = '#FFD700'; // Gold/Yellow color
        lineElement.style.strokeWidth = '3px'; // Make it slightly thicker
        lineElement.style.filter = 'drop-shadow(0 0 3px #FFD700)'; // Add glow effect
        
        tooltip.innerHTML = `
            <div class="tooltip-connection">${connectionLabel}</div>
            <div class="tooltip-weight">Weight: <strong>${currentWeight.toFixed(2)}</strong></div>
            <div class="tooltip-effect">${currentWeight > 0 ? '✓ Positive influence' : currentWeight < -0.1 ? '✗ Negative influence' : '○ Minimal effect'}</div>
        `;
        tooltip.style.display = 'block';
        
        // Position tooltip near mouse
        const rect = document.getElementById('networkSvg').getBoundingClientRect();
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
    
    lineElement.addEventListener('mouseleave', () => {
        // Restore original appearance
        const originalStroke = lineElement.getAttribute('data-original-stroke');
        lineElement.style.stroke = originalStroke;
        lineElement.style.filter = 'none';
        
        // Re-apply weight visualization to restore proper thickness
        const currentWeight = getCurrentWeightForConnection(connectionLabel);
        applyWeightVisualization(lineElement, currentWeight);
        
        tooltip.style.display = 'none';
    });
    
    // Update tooltip position on mouse move
    lineElement.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
    
    // Add click event to open connection editor
    lineElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openConnectionEditor(connectionLabel);
    });
    
    // Make connection clickable with cursor pointer
    lineElement.style.cursor = 'pointer';
}

function getCurrentWeightForConnection(connectionLabel) {
    // Parse the connection label to extract indices
    // Format examples: 
    // - "Input A → Hidden H1" (input to first hidden layer)
    // - "Hidden H1 → Dog" (last hidden layer to output)
    // - "H1.4 → H2.3" (hidden layer 1 neuron 4 to hidden layer 2 neuron 3)
    
    if (connectionLabel.includes('Input') && connectionLabel.includes('Hidden')) {
        // Input to Hidden connection
        const inputMatch = connectionLabel.match(/Input ([ABCDEFGH])/);
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        
        if (inputMatch && hiddenMatch) {
            const inputIndex = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].indexOf(inputMatch[1]);
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            return NetworkAPI.getWeight('input', inputIndex, 'hidden', hiddenIndex);
        }
    } else if (connectionLabel.includes('Hidden') && (connectionLabel.includes('Dog') || connectionLabel.includes('Not Dog'))) {
        // Hidden to Output connection
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        const isDogOutput = connectionLabel.includes('Dog') && !connectionLabel.includes('Not Dog');
        
        if (hiddenMatch) {
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            const outputIndex = isDogOutput ? 0 : 1;
            return NetworkAPI.getWeight('hidden', hiddenIndex, 'output', outputIndex);
        }
    } else if (connectionLabel.includes('H') && connectionLabel.includes('→')) {
        // Hidden layer to hidden layer connection (H1.4 → H2.3)
        const layerToLayerMatch = connectionLabel.match(/H(\d+)\.(\d+) → H(\d+)\.(\d+)/);
        
        if (layerToLayerMatch) {
            const fromLayer = parseInt(layerToLayerMatch[1]) - 1; // Convert to 0-based layer index
            const fromNeuron = parseInt(layerToLayerMatch[2]) - 1; // Convert to 0-based neuron index
            const toLayer = parseInt(layerToLayerMatch[3]) - 1; // Convert to 0-based layer index  
            const toNeuron = parseInt(layerToLayerMatch[4]) - 1; // Convert to 0-based neuron index
            
            return NetworkAPI.getWeight(fromLayer, fromNeuron, toLayer, toNeuron);
        }
    }
    
    // Fallback: return 0 if parsing fails
    console.warn(`Could not parse connection label: ${connectionLabel}`);
    return 0;
}

function refreshAllConnectionVisuals() {
    const arch = NetworkAPI.getArchitecture();
    
    if (arch.hiddenLayers.length === 0) {
        // Direct input to output connections
        for (let i = 0; i < arch.inputSize; i++) {
            for (let o = 0; o < arch.outputSize; o++) {
                const connectionId = `conn-input-${i}-output-${o}`;
                const connection = document.getElementById(connectionId);
                if (connection) {
                    const weight = NetworkAPI.getWeight(0, i, 0, o);
                    applyWeightVisualization(connection, weight);
                }
            }
        }
    } else {
        // Input to first hidden layer
        for (let i = 0; i < arch.inputSize; i++) {
            for (let h = 0; h < arch.hiddenLayers[0]; h++) {
                const connectionId = `conn-input-${i}-hidden-0-${h}`;
                const connection = document.getElementById(connectionId);
                if (connection) {
                    const weight = NetworkAPI.getWeight('input', i, 'hidden', h);
                    applyWeightVisualization(connection, weight);
                }
            }
        }
        
        // Hidden layer to hidden layer connections
        for (let layer = 0; layer < arch.hiddenLayers.length - 1; layer++) {
            for (let h1 = 0; h1 < arch.hiddenLayers[layer]; h1++) {
                for (let h2 = 0; h2 < arch.hiddenLayers[layer + 1]; h2++) {
                    const connectionId = `conn-hidden-${layer}-${h1}-hidden-${layer + 1}-${h2}`;
                    const connection = document.getElementById(connectionId);
                    if (connection) {
                        const weight = NetworkAPI.getWeight(layer, h1, layer + 1, h2);
                        applyWeightVisualization(connection, weight);
                    }
                }
            }
        }
        
        // Last hidden layer to output connections
        const lastHiddenIndex = arch.hiddenLayers.length - 1;
        for (let h = 0; h < arch.hiddenLayers[lastHiddenIndex]; h++) {
            for (let o = 0; o < arch.outputSize; o++) {
                const connectionId = `conn-hidden-${lastHiddenIndex}-${h}-output-${o}`;
                const connection = document.getElementById(connectionId);
                if (connection) {
                    const weight = NetworkAPI.getWeight('hidden', h, 'output', o);
                    applyWeightVisualization(connection, weight);
                }
            }
        }
    }
}

function updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        applyWeightVisualization(connection, weight);
    }
}

function updateConnectionTooltip(lineElement, weight, connectionLabel) {
    // Update the tooltip data for this connection
    lineElement.setAttribute('data-weight', weight);
    lineElement.setAttribute('data-label', connectionLabel);
}

function updateNeuronValues() {
    const arch = NetworkAPI.getArchitecture();
    
    // Update input neuron values
    const inputActivations = NetworkAPI.getLayerActivations('input');
    for (let i = 0; i < inputActivations.length; i++) {
        const valueElement = document.getElementById(`input-value-${i}`);
        if (valueElement) {
            valueElement.textContent = inputActivations[i].toFixed(2);
        }
    }
    
    // Update hidden layer neuron values
    for (let layerIndex = 0; layerIndex < arch.hiddenLayers.length; layerIndex++) {
        const layerActivations = NetworkAPI.getLayerActivations(layerIndex);
        for (let neuronIndex = 0; neuronIndex < layerActivations.length; neuronIndex++) {
            const valueElement = document.getElementById(`hidden-${layerIndex}-value-${neuronIndex}`);
            if (valueElement) {
                valueElement.textContent = layerActivations[neuronIndex].toFixed(2);
            }
        }
    }
    
    // Update output neuron values
    const outputActivations = NetworkAPI.getLayerActivations('output');
    for (let i = 0; i < outputActivations.length; i++) {
        const valueElement = document.getElementById(`output-value-${i}`);
        if (valueElement) {
            valueElement.textContent = outputActivations[i].toFixed(2);
        }
    }
}

function refreshVisualization() {
    // Complete refresh of the entire network visualization
    updateNeuronColors();
    updateNeuronValues();
    refreshAllConnectionVisuals();
    updatePrediction();
}

// ============================================================================
// CONFIDENCE TOOLTIP FUNCTIONALITY
// ============================================================================

let confidenceTooltip = null;

function showConfidenceTooltip(event) {
    // Create tooltip if it doesn't exist
    if (!confidenceTooltip) {
        confidenceTooltip = document.createElement('div');
        confidenceTooltip.className = 'confidence-tooltip';
        confidenceTooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            font-family: monospace;
            max-width: 280px;
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            pointer-events: none;
        `;
        document.body.appendChild(confidenceTooltip);
    }
    
    // Get current output probabilities for explanation
    const outputActivations = NetworkAPI.getLayerActivations('output');
    const dogProb = (outputActivations[0] || 0) * 100;
    const notDogProb = (outputActivations[1] || 0) * 100;
    const confidenceDegree = Math.abs(dogProb - notDogProb);
    
    // Generate explanation content
    const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;
    const content = `
        <div style="font-weight: bold; margin-bottom: 8px;">🎯 ${t('ui.confidenceCalculation') || 'Confidence Calculation'}</div>
        <div style="margin-bottom: 6px;"><strong>Dog probability:</strong> ${dogProb.toFixed(1)}%</div>
        <div style="margin-bottom: 6px;"><strong>Not-Dog probability:</strong> ${notDogProb.toFixed(1)}%</div>
        <div style="margin-bottom: 8px; border-top: 1px solid #374151; padding-top: 6px;">
            <strong>Confidence = |${dogProb.toFixed(1)}% - ${notDogProb.toFixed(1)}%| = ${confidenceDegree.toFixed(1)}%</strong>
        </div>
        <div style="font-size: 11px; color: #d1d5db; line-height: 1.3;">
            Higher confidence means the network is more certain about its prediction. 
            When both probabilities are close (e.g., 52% vs 48%), confidence is low.
        </div>
    `;
    
    confidenceTooltip.innerHTML = content;
    confidenceTooltip.style.display = 'block';
    
    updateConfidenceTooltipPosition(event);
}

function hideConfidenceTooltip() {
    if (confidenceTooltip) {
        confidenceTooltip.style.display = 'none';
    }
}

function updateConfidenceTooltipPosition(event) {
    if (!confidenceTooltip) return;
    
    const rect = confidenceTooltip.getBoundingClientRect();
    let x = event.clientX + 15;
    let y = event.clientY - rect.height - 10;
    
    // Keep tooltip within viewport
    if (x + rect.width > window.innerWidth) {
        x = event.clientX - rect.width - 15;
    }
    if (y < 0) {
        y = event.clientY + 15;
    }
    
    confidenceTooltip.style.left = x + 'px';
    confidenceTooltip.style.top = y + 'px';
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.drawNetwork = drawNetwork;
if (typeof window !== 'undefined') window.drawConnections = drawConnections;
if (typeof window !== 'undefined') window.drawNeurons = drawNeurons;
if (typeof window !== 'undefined') window.drawLabels = drawLabels;
if (typeof window !== 'undefined') window.drawPrediction = drawPrediction;
if (typeof window !== 'undefined') window.updatePrediction = updatePrediction;
if (typeof window !== 'undefined') window.updateNeuronColors = updateNeuronColors;
if (typeof window !== 'undefined') window.getActivationColor = getActivationColor;
if (typeof window !== 'undefined') window.highlightSubNetwork = highlightSubNetwork;
if (typeof window !== 'undefined') window.clearSubNetworkHighlights = clearSubNetworkHighlights;
if (typeof window !== 'undefined') window.createFlowingDots = createFlowingDots;
if (typeof window !== 'undefined') window.applyWeightVisualization = applyWeightVisualization;
if (typeof window !== 'undefined') window.addWeightTooltip = addWeightTooltip;
if (typeof window !== 'undefined') window.getCurrentWeightForConnection = getCurrentWeightForConnection;
if (typeof window !== 'undefined') window.refreshAllConnectionVisuals = refreshAllConnectionVisuals;
if (typeof window !== 'undefined') window.updateConnectionAppearance = updateConnectionAppearance;
if (typeof window !== 'undefined') window.updateConnectionTooltip = updateConnectionTooltip;
if (typeof window !== 'undefined') window.updateNeuronValues = updateNeuronValues;
if (typeof window !== 'undefined') window.refreshVisualization = refreshVisualization;
