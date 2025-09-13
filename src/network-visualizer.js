// ============================================================================
// NETWORK-VISUALIZER MODULE
// Network visualization and drawing functions
// ============================================================================

function drawNetwork() {
    const svg = document.getElementById('networkSvg');
    svg.innerHTML = '';
    
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

function drawConnections() {
    const svg = document.getElementById('networkSvg');
    
    // Input to Hidden connections
    for (let i = 0; i < networkConfig.inputSize; i++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.hidden[h].x - 25);
            line.setAttribute('y2', positions.hidden[h].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-hidden-${h}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.inputToHidden[h][i];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            addWeightTooltip(line, weight, `Input ${['A', 'B', 'C', 'D'][i]} → Hidden H${h + 1}`);
            
            svg.appendChild(line);
        }
    }
    
    // Hidden to Output connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let o = 0; o < networkConfig.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.hidden[h].x + 25);
            line.setAttribute('y1', positions.hidden[h].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-hidden-${h}-output-${o}`);
            
            // Apply visual weight encoding (thickness, color, opacity)
            const weight = weights.hiddenToOutput[o][h];
            applyWeightVisualization(line, weight);
            
            // Add hover tooltip for exact weight value
            const outputName = o === 0 ? 'Dog' : 'Not Dog';
            addWeightTooltip(line, weight, `Hidden H${h + 1} → ${outputName}`);
            
            svg.appendChild(line);
        }
    }
}

function drawNeurons() {
    const svg = document.getElementById('networkSvg');
    const layers = ['input', 'hidden', 'output'];
    const sizes = [networkConfig.inputSize, networkConfig.hiddenSize, networkConfig.outputSize];
    const labels = [['A', 'B', 'C', 'D'], ['H1', 'H2', 'H3', 'H4'], ['Dog', 'Not Dog']];
    
    layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < sizes[layerIndex]; i++) {
            const pos = positions[layer][i];
            
            // Draw neuron circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 30);
            circle.setAttribute('class', 'neuron');
            circle.setAttribute('id', `${layer}-neuron-${i}`);
            
            // Draw neuron label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y - 5);
            text.setAttribute('class', 'neuron-value');
            text.textContent = labels[layerIndex][i];
            
            // Draw activation value
            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueText.setAttribute('x', pos.x);
            valueText.setAttribute('y', pos.y + 8);
            valueText.setAttribute('class', 'neuron-value');
            valueText.setAttribute('id', `${layer}-value-${i}`);
            valueText.textContent = (activations[layer][i] !== undefined ? activations[layer][i] : 0).toFixed(2);
            
            svg.appendChild(circle);
            svg.appendChild(text);
            svg.appendChild(valueText);
        }
    });
}

function drawLabels() {
    const svg = document.getElementById('networkSvg');
    const labels = [{x: 80, y: 15, text: 'Input Layer'}, 
                   {x: 280, y: 15, text: 'Hidden Layer'}, 
                   {x: 480, y: 15, text: 'Output Layer'},
                   {x: 650, y: 15, text: 'AI Prediction'}];
    
    labels.forEach(label => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', label.x);
        text.setAttribute('y', label.y);
        text.setAttribute('class', 'layer-label');
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
    result.textContent = window.i18n.t('ui.thinking');
    svg.appendChild(result);
}

function updatePrediction() {
    const dogProb = activations.output[0];
    const notDogProb = activations.output[1];
    const predicted = dogProb > 0.5;
    const confidence = Math.abs(dogProb - 0.5) * 2; // 0 to 1 scale
    
    // Determine if prediction is correct
    const expectedDog = trueLabel === 'dog';
    const isCorrect = predicted === expectedDog;
    
    // Update emoji based on prediction and correctness
    let emoji = '🤔'; // default thinking
    let circleColor = '#3b82f6'; // default blue
    
    if (dogProb > 0 || notDogProb > 0) { // Has made a prediction
        if (predicted) {
            emoji = isCorrect ? '🐕✅' : '🐕❌'; // Dog prediction
        } else {
            emoji = isCorrect ? '❌✅' : '❌🐕'; // Not-dog prediction  
        }
        
        // Color based on correctness
        circleColor = isCorrect ? '#10b981' : '#ef4444'; // green/red
    }
    
    // Update elements
    const predictionEmoji = document.getElementById('predictionEmoji');
    const predictionResult = document.getElementById('predictionResult');
    const predictionCircle = document.getElementById('predictionCircle');
    
    if (predictionEmoji) predictionEmoji.textContent = emoji;
    if (predictionCircle) predictionCircle.setAttribute('stroke', circleColor);
    
    if (predictionResult) {
        if (dogProb > 0 || notDogProb > 0) {
            const confidenceText = `${(confidence * 100).toFixed(0)}%`;
            const predictionText = predicted ? 'DOG' : 'NOT-DOG';
            predictionResult.textContent = `${predictionText} (${confidenceText})`;
        } else {
            predictionResult.textContent = window.i18n.t('ui.thinking');
        }
    }
}

function updateNeuronColors() {
    console.log('=== UPDATING NEURON COLORS ===');
    
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
    // Format examples: "Input A → Hidden H1", "Hidden H1 → Dog", "Hidden H2 → Not Dog"
    
    if (connectionLabel.includes('Input') && connectionLabel.includes('Hidden')) {
        // Input to Hidden connection
        const inputMatch = connectionLabel.match(/Input ([ABCD])/);
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        
        if (inputMatch && hiddenMatch) {
            const inputIndex = ['A', 'B', 'C', 'D'].indexOf(inputMatch[1]);
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            return weights.inputToHidden[hiddenIndex][inputIndex];
        }
    } else if (connectionLabel.includes('Hidden') && (connectionLabel.includes('Dog') || connectionLabel.includes('Not Dog'))) {
        // Hidden to Output connection
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        const isDogOutput = connectionLabel.includes('Dog') && !connectionLabel.includes('Not Dog');
        
        if (hiddenMatch) {
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            const outputIndex = isDogOutput ? 0 : 1;
            return weights.hiddenToOutput[outputIndex][hiddenIndex];
        }
    }
    
    // Fallback: return 0 if parsing fails
    console.warn(`Could not parse connection label: ${connectionLabel}`);
    return 0;
}

function refreshAllConnectionVisuals() {
    // Update all input to hidden connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, weight);
            }
        }
    }
    
    // Update all hidden to output connections
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const weight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, weight);
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
