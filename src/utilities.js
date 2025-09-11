// ============================================================================
// UTILITIES MODULE
// Utility functions and helpers
// ============================================================================

function clearAllHighlights() {
    // Redraw both canvases to clear all highlights
    drawOriginalImage();
    drawInteractivePixelGrid();
}

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

function displayAIInputNumbers() {
    const container = document.getElementById('aiInputNumbers');
    
    // Get normalized pixel values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const values = [];
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            values.push(gray.toFixed(2));
        }
    }
    
    // Display as a formatted array
    container.innerHTML = `
        <div class="number-array">
            <div class="array-label">Input array (64 numbers):</div>
            <div class="array-values">[${values.slice(0, 8).join(', ')}, ..., ${values.slice(-8).join(', ')}]</div>
            <div class="array-note">Each number represents the brightness of one pixel (0 = black, 1 = white)</div>
        </div>
    `;
}

async function trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs) {
    const targetAccuracy = 1.0;
    let epoch = 0;
    let bestAccuracy = 0;
    let patience = 0;
    const maxPatience = 15;
    
    let momentum = initialMomentum;
    
    // Initialize momentum buffers
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    // Training loop
    while (epoch < maxEpochs) {
        epoch++;
        let epochLoss = 0;
        
        // Shuffle training data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        shuffled.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            
            // Calculate loss
            const loss = -example.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            epochLoss += loss;
            
            // Backward pass
            backpropagationWithMomentum(example.target, learningRate, momentum, 
                                      momentumInputToHidden, momentumHiddenToOutput);
        });
        
        // Test accuracy every 5 epochs
        if (epoch % 5 === 0 || epoch === 1) {
            const accuracy = testAccuracy(trainingData);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                patience = 0;
                
                if (accuracy >= targetAccuracy) {
                    break; // Perfect accuracy achieved
                }
            } else {
                patience++;
                
                if (patience >= 5) {
                    learningRate *= 0.85; // Slightly less aggressive reduction
                    momentum = Math.min(0.95, momentum + 0.03);
                }
                
                if (patience >= maxPatience) {
                    break; // Early stopping
                }
            }
        }
    }
    
    // Final test
    const finalAccuracy = testAccuracy(trainingData);
    let avgConfidence = 0;
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const confidence = Math.max(output[0], output[1]);
        avgConfidence += confidence;
    });
    avgConfidence /= trainingData.length;
    
    return {
        accuracy: finalAccuracy,
        epochs: epoch,
        avgConfidence: avgConfidence,
        efficiency: epoch <= 30 ? 1.0 : Math.max(0.3, 30/epoch),
        converged: finalAccuracy >= targetAccuracy
    };
}

function toggleWeightSliders() {
    weightSlidersActive = !weightSlidersActive;
    const btn = document.getElementById('whatIfBtn');
    
    if (weightSlidersActive) {
        btn.textContent = '🔧 Exit What If?';
        btn.classList.add('active');
        showWeightSliders();
        updateStepInfoDual(
            '🔧 <strong>Weight Exploration Mode!</strong><br>🎛️ Drag the sliders to see how different brain connections affect the AI\'s decisions. Watch the magic happen in real-time!',
            '🔧 <strong>Weight Exploration Mode</strong><br>🔊 Interactive weight manipulation enabled. Real-time prediction updates active.'
        );
    } else {
        btn.textContent = '🔧 What If?';
        btn.classList.remove('active');
        hideWeightSliders();
        updateStepInfoDual(
            '🎮 <strong>Ready to Explore!</strong><br>🚀 Pick "Watch AI Think", "Watch AI Learn", or "Full Demo" to see the neural network in action!',
            '🎮 <strong>System Ready</strong><br>📈 Select demonstration mode: Forward propagation, Backpropagation, or Complete cycle.'
        );
    }
}

function displayPerformanceMetrics() {
    const display = document.getElementById('performanceDisplay');
    
    let html = `
        <strong>SYSTEM PERFORMANCE:</strong><br>
        Total Operations: ${performanceMetrics.totalOperations}<br>
        Weight Updates: ${performanceMetrics.weightUpdates}<br>
        Training Epochs: ${performanceMetrics.epochCount}<br><br>
        
        <strong>TIMING METRICS:</strong><br>
        Forward Pass: ${performanceMetrics.forwardPassTime}ms<br>
        Backpropagation: ${performanceMetrics.backpropTime}ms<br><br>
        
        <strong>NETWORK STATUS:</strong><br>
        Last Accuracy: ${(performanceMetrics.lastAccuracy * 100).toFixed(1)}%<br>
        Last Loss: ${performanceMetrics.lastLoss.toFixed(4)}<br>
        Learning Rate: ${networkConfig.learningRate}<br><br>
        
        <strong>MEMORY USAGE:</strong><br>
        Weights: ${(weights.inputToHidden.length * weights.inputToHidden[0].length + 
                    weights.hiddenToOutput.length * weights.hiddenToOutput[0].length)} parameters<br>
        History Buffer: ${gradientHistory.length} entries
    `;
    
    display.innerHTML = html;
}

function setVisualFeaturesAndLabel(imageType) {
    // NUANCED feature patterns for better learning: [feature_A, feature_B, feature_C, feature_D]
    // Dogs use mixed HIGH/LOW patterns, Non-dogs use different mixed patterns
    // This gives 8 distinct, learnable combinations for 4 hidden units to distinguish
    
    switch(imageType) {
        case 'dog1':
            updateInputActivations([0.9, 0.9, 0.1, 0.1]); // Dog pattern: HIGH-HIGH-LOW-LOW
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog2':
            updateInputActivations([0.8, 0.7, 0.2, 0.3]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog3':
            updateInputActivations([0.7, 0.8, 0.3, 0.2]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'cat':
            updateInputActivations([0.1, 0.9, 0.1, 0.9]); // Non-dog pattern: LOW-HIGH-LOW-HIGH
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'bird':
            updateInputActivations([0.2, 0.8, 0.3, 0.7]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'car':
            updateInputActivations([0.3, 0.7, 0.2, 0.8]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'tree':
            updateInputActivations([0.9, 0.1, 0.9, 0.1]); // Non-dog pattern: HIGH-LOW-HIGH-LOW
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'fish':
            updateInputActivations([0.8, 0.2, 0.7, 0.3]); // Non-dog pattern: HIGH-LOW-HIGH-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        default:
            console.error('Unknown image type:', imageType);
            updateInputActivations([0.1, 0.1, 0.1, 0.1]);
            if (!preventAutoLabeling) setTrueLabel('not-dog');
    }
    console.log('🎯 Abstract patterns set for', imageType, '- [Pattern A, Pattern B, Pattern C, Pattern D]:', activations.input);
    console.log('🎯 Pattern type:', imageType.startsWith('dog') ? 'DOG (HIGH-HIGH-LOW-LOW variants)' : 'NON-DOG (alternating patterns)');
}

function displayGradients() {
    const display = document.getElementById('gradientsDisplay');
    if (gradientHistory.length === 0) {
        display.innerHTML = `<em>${t('whatIf.noGradientData')}</em>`;
        return;
    }
    
    const latest = gradientHistory[gradientHistory.length - 1];
    let html = `<strong>LATEST GRADIENT UPDATE (Epoch ${performanceMetrics.epochCount}):</strong><br><br>`;
    
    if (latest.outputGradients) {
        html += '<strong>OUTPUT GRADIENTS:</strong><br>';
        latest.outputGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `O${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
        html += '<br>';
    }
    
    if (latest.hiddenGradients) {
        html += '<strong>HIDDEN GRADIENTS:</strong><br>';
        latest.hiddenGradients.forEach((grad, i) => {
            const color = grad > 0 ? '#00ff88' : '#ff4444';
            html += `H${i}: <span style="color: ${color}">${grad.toFixed(4)}</span><br>`;
        });
    }
    
    display.innerHTML = html;
}

function setupEventListeners() {
    document.getElementById('speedSlider').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
    });
}

function createWeightEditingPanel() {
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'weightEditingPanel';
    panel.className = 'weight-editing-panel';
    
    // Panel header
    const header = document.createElement('div');
    header.className = 'weight-panel-header';
    header.innerHTML = `
        <h3>🔧 Weight Explorer</h3>
        <p>Adjust connection weights to see how they affect predictions</p>
    `;
    
    // Content container
    const content = document.createElement('div');
    content.className = 'weight-panel-content';
    
    // Input to Hidden section
    const inputSection = document.createElement('div');
    inputSection.className = 'weight-section';
    inputSection.innerHTML = `<h4>${t('whatIf.inputToHidden')}</h4>`;
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const hiddenGroup = document.createElement('div');
        hiddenGroup.className = 'weight-group';
        hiddenGroup.innerHTML = `<h5>${t('whatIf.toHiddenNeuron', [h + 1])}</h5>`;
        
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weightControl = createWeightControl('input', i, h, weights.inputToHidden[h][i]);
            hiddenGroup.appendChild(weightControl);
        }
        
        inputSection.appendChild(hiddenGroup);
    }
    
    // Hidden to Output section
    const outputSection = document.createElement('div');
    outputSection.className = 'weight-section';
    outputSection.innerHTML = `<h4>${t('whatIf.hiddenToOutput')}</h4>`;
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputGroup = document.createElement('div');
        outputGroup.className = 'weight-group';
        outputGroup.innerHTML = `<h5>${o === 0 ? t('whatIf.toDogOutput') : t('whatIf.toNotDogOutput')}</h5>`;
        
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weightControl = createWeightControl('hidden', h, o, weights.hiddenToOutput[o][h]);
            outputGroup.appendChild(weightControl);
        }
        
        outputSection.appendChild(outputGroup);
    }
    
    content.appendChild(inputSection);
    content.appendChild(outputSection);
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    // Add panel to the page
    document.body.appendChild(panel);
}

function updateLastWeights() {
    weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(weights.inputToHidden));
    weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(weights.hiddenToOutput));
}

function debugWeightInitialization() {
    console.log('📊 WEIGHT INITIALIZATION ANALYSIS:');
    
    // Analyze input->hidden weights
    console.log('\n🔗 Input → Hidden Layer Weights:');
    weights.inputToHidden.forEach((neuron, h) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Hidden[${h}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Analyze hidden->output weights  
    console.log('\n🔗 Hidden → Output Layer Weights:');
    weights.hiddenToOutput.forEach((neuron, o) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Output[${o}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Check for symmetry issues (major cause of convergence problems)
    const inputSymmetry = checkWeightSymmetry(weights.inputToHidden);
    const outputSymmetry = checkWeightSymmetry(weights.hiddenToOutput);
    console.log(`\n⚖️ Symmetry Analysis (lower = more diverse):`);
    console.log(`  Input layer symmetry: ${inputSymmetry.toFixed(6)}`);
    console.log(`  Output layer symmetry: ${outputSymmetry.toFixed(6)}`);
    
    // Check weight distribution
    const allInputWeights = weights.inputToHidden.flat();
    const allOutputWeights = weights.hiddenToOutput.flat();
    console.log(`\n📈 Overall Weight Distribution:`);
    console.log(`  Input weights: ${allInputWeights.length} values, range [${Math.min(...allInputWeights).toFixed(4)}, ${Math.max(...allInputWeights).toFixed(4)}]`);
    console.log(`  Output weights: ${allOutputWeights.length} values, range [${Math.min(...allOutputWeights).toFixed(4)}, ${Math.max(...allOutputWeights).toFixed(4)}]`);
    
    // Potential problem indicators
    console.log(`\n⚠️ Potential Issues Check:`);
    if (inputSymmetry < 0.01) console.log('  🚨 WARNING: Input weights may be too symmetric!');
    if (outputSymmetry < 0.01) console.log('  🚨 WARNING: Output weights may be too symmetric!');
    if (Math.abs(calculateWeightStats(allInputWeights).mean) > 0.02) console.log('  🚨 WARNING: Input weights have non-zero mean bias!');
    if (Math.abs(calculateWeightStats(allOutputWeights).mean) > 0.02) console.log('  🚨 WARNING: Output weights have non-zero mean bias!');
}

function hideWeightSliders() {
    // Remove the weight editing panel
    const panel = document.getElementById('weightEditingPanel');
    if (panel) {
        panel.remove();
    }
    
    // Reset connections to proper weight-based visualization
    refreshAllConnectionVisuals();
}

function enableDeepDebugging() {
    console.log('🔧 ===== ENABLING DEEP DEBUGGING MODE =====');
    enableConvergenceAnalysis();
    
    // Override forwardPropagationSilent and backpropagationSilent to always use debug mode
    const originalForward = window.forwardPropagationSilent;
    const originalBackward = window.backpropagationSilent;
    
    window.forwardPropagationSilent = function(inputValues, debugMode = true) {
        return originalForward.call(this, inputValues, debugMode);
    };
    
    window.backpropagationSilent = function(target, debugMode = true) {
        return originalBackward.call(this, target, debugMode);
    };
    
    console.log('✅ Deep debugging enabled - all training will show detailed logs');
    console.log('🔧 ==========================================');
}

function setTrueLabel(label) {
    console.log("setTrueLabel called with:", label);
    trueLabel = label;
    console.log("trueLabel is now:", trueLabel);
    
    // Update UI (with safety checks for DOM elements)
    const labelButtons = document.querySelectorAll('.label-btn');
    if (labelButtons.length > 0) {
        labelButtons.forEach(btn => btn.classList.remove('selected'));
        
        const targetButton = document.getElementById(label === 'dog' ? 'labelDog' : 'labelNotDog');
        if (targetButton) {
            targetButton.classList.add('selected');
        } else {
            console.warn("Target label button not found:", label === 'dog' ? 'labelDog' : 'labelNotDog');
        }
        
        const selectedLabel = document.getElementById('selectedLabel');
        if (selectedLabel) {
            selectedLabel.textContent = label === 'dog' ? 'Correct answer: Dog' : 'Correct answer: Not a Dog';
            selectedLabel.style.color = '#065f46';
        } else {
            console.warn("selectedLabel element not found");
        }
    } else {
        console.warn("Label buttons not found in DOM yet");
    }
}

function updateWeight(fromLayer, fromIndex, toIndex, newWeight) {
    if (fromLayer === 'input') {
        weights.inputToHidden[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-input-${fromIndex}-hidden-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            // Update tooltip weight value
            updateConnectionTooltip(connection, newWeight, `Input ${['A', 'B', 'C', 'D'][fromIndex]} → Hidden H${toIndex + 1}`);
        }
    } else {
        weights.hiddenToOutput[toIndex][fromIndex] = newWeight;
        
        // Update the visual encoding of the connection line
        const connectionId = `conn-hidden-${fromIndex}-output-${toIndex}`;
        const connection = document.getElementById(connectionId);
        if (connection) {
            applyWeightVisualization(connection, newWeight);
            const outputName = toIndex === 0 ? 'Dog' : 'Not Dog';
            updateConnectionTooltip(connection, newWeight, `Hidden H${fromIndex + 1} → ${outputName}`);
        }
    }
}

function checkPredictionDiversity(trainingData) {
    const predictions = [];
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        predictions.push(output[0]); // Just check first output
    });
    
    const predictionStats = calculateWeightStats(predictions);
    return predictionStats.std; // Higher std = more diverse predictions
}

function highlightConnection(fromLayer, fromIndex, toIndex, highlight) {
    const connectionId = fromLayer === 'input' 
        ? `conn-input-${fromIndex}-hidden-${toIndex}`
        : `conn-hidden-${fromIndex}-output-${toIndex}`;
    
    const connection = document.getElementById(connectionId);
    if (connection) {
        if (highlight) {
            connection.style.stroke = '#FFD700';
            connection.style.strokeWidth = '4px';
            connection.style.opacity = '1';
        } else {
            // Reset to weight-based appearance
            const weight = fromLayer === 'input' 
                ? weights.inputToHidden[toIndex][fromIndex]
                : weights.hiddenToOutput[toIndex][fromIndex];
            updateConnectionAppearance(fromLayer, fromIndex, toIndex, weight);
        }
    }
}

function syncExpertConfigToLegacy() {
    networkConfig.learningRate = expertConfig.learningRate;
    networkConfig.inputSize = expertConfig.inputSize;
    networkConfig.hiddenSize = expertConfig.hiddenSize;
    networkConfig.outputSize = expertConfig.outputSize;
}

function drawInputNeuronVisualization() {
    const container = document.getElementById('inputNeurons');
    container.innerHTML = '';
    
    if (!pixelData) return;
    
    // Create 64 input neurons (8x8 grid)
    pixelData.forEach((pixel, index) => {
        const neuron = document.createElement('div');
        neuron.className = 'input-neuron';
        neuron.style.backgroundColor = `rgb(${pixel.brightness}, ${pixel.brightness}, ${pixel.brightness})`;
        neuron.textContent = pixel.value.toFixed(1);
        neuron.title = `Input #${index + 1}: ${pixel.value.toFixed(2)}`;
        
        // Add click handler
        neuron.onclick = () => {
            selectedPixel = index;
            drawInteractivePixelGrid();
            highlightInputNeuron(index);
            
            const pixelInfo = document.getElementById('pixelInfo');
            pixelInfo.innerHTML = `
                <strong>Input #${index + 1}</strong><br>
                From pixel (${pixel.x}, ${pixel.y}): ${pixel.value.toFixed(2)}
            `;
        };
        
        container.appendChild(neuron);
    });
}

function debugFeatureRepresentation(inputValues, context = '') {
    console.log(`\n🔍 ===== FEATURE REPRESENTATION DEBUG ${context} =====`);
    
    // Input analysis
    console.log('📊 INPUT ANALYSIS:');
    const inputStats = calculateWeightStats(inputValues);
    console.log(`  Values: [${inputValues.slice(0, 8).map(v => v.toFixed(3)).join(', ')}${inputValues.length > 8 ? '...' : ''}]`);
    console.log(`  Stats: min=${inputStats.min.toFixed(4)}, max=${inputStats.max.toFixed(4)}, mean=${inputStats.mean.toFixed(4)}, std=${inputStats.std.toFixed(4)}`);
    
    // Check for problematic patterns
    const zeroCount = inputValues.filter(v => Math.abs(v) < 1e-10).length;
    const duplicateCount = checkValueDuplication(inputValues);
    console.log(`  Zero values: ${zeroCount}/${inputValues.length} (${(100*zeroCount/inputValues.length).toFixed(1)}%)`);
    console.log(`  Duplicate rate: ${(duplicateCount*100).toFixed(1)}% (potential lack of diversity)`);
    
    // Feature diversity analysis
    const diversity = calculateFeatureDiversity(inputValues);
    console.log(`  Feature diversity score: ${diversity.toFixed(4)} (higher = more diverse)`);
    
    // Activation pattern prediction
    console.log('\n🔮 ACTIVATION PREDICTION:');
    predictActivationPatterns(inputValues);
    
    console.log('🔍 ==========================================');
}

function showWeightSliders() {
    // Create and show the weight editing panel instead of inline sliders
    createWeightEditingPanel();
}

function recalculateNetwork() {
    // Recalculate hidden layer activations using expert-configured activation function
    const hiddenActivationFn = getActivationFunction('hidden');
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += activations.input[i] * weights.inputToHidden[h][i];
        }
        activations.hidden[h] = hiddenActivationFn(sum);
    }
    
    // Recalculate output layer activations based on expert configuration
    if (expertConfig.outputActivation === 'softmax') {
        // Calculate raw outputs first, then apply softmax
        const rawOutputs = [];
        for (let o = 0; o < networkConfig.outputSize; o++) {
            let sum = 0;
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
            }
            rawOutputs[o] = sum;
        }
        // Apply softmax activation
        activations.output = softmax(rawOutputs);
    } else {
        // Use sigmoid for each output independently
        for (let o = 0; o < networkConfig.outputSize; o++) {
            let sum = 0;
            for (let h = 0; h < networkConfig.hiddenSize; h++) {
                sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
            }
            activations.output[o] = sigmoid(sum);
        }
    }
    
    // Update visual displays
    updateNeuronColors();
    updatePrediction();
}

function clearHighlight() {
    // Redraw both canvases to clear all highlights
    drawInteractivePixelGrid();
    drawOriginalImage();
}

function getActivationFunction(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return leakyReLU;
            case 'sigmoid': return sigmoid;
            case 'tanh': return tanhActivation;
            default: return leakyReLU;
        }
    } else if (layer === 'output') {
        switch (expertConfig.outputActivation) {
            case 'softmax': return softmax;
            case 'sigmoid': return sigmoid;
            default: return softmax;
        }
    }
}

function t(key, replacements = []) {
    if (typeof window.i18n !== 'undefined') {
        return window.i18n.t(key, replacements);
    }
    // Fallback if i18n is not loaded yet
    return key;
}

function updatePerformanceDisplays() {
    // These elements don't exist in compact interface - skip updates
    const epochCounter = document.getElementById('epochCounter');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const lossDisplay = document.getElementById('lossDisplay');
    const learningRateDisplay = document.getElementById('learningRateDisplay');
    
    if (epochCounter) epochCounter.textContent = performanceMetrics.epochCount;
    if (accuracyDisplay) accuracyDisplay.textContent = (performanceMetrics.lastAccuracy * 100).toFixed(1) + '%';
    if (lossDisplay) lossDisplay.textContent = performanceMetrics.lastLoss.toFixed(3);
    if (learningRateDisplay) learningRateDisplay.textContent = networkConfig.learningRate.toFixed(2);
    
    // Update neural metrics - check if elements exist first
    const forwardTime = document.getElementById('forwardTime');
    const backpropTime = document.getElementById('backpropTime');
    
    if (forwardTime) forwardTime.textContent = performanceMetrics.forwardPassTime + 'ms';
    if (backpropTime) backpropTime.textContent = performanceMetrics.backpropTime + 'ms';
    
    const weightUpdates = document.getElementById('weightUpdates');
    const totalOps = document.getElementById('totalOps');
    
    if (weightUpdates) weightUpdates.textContent = performanceMetrics.weightUpdates;
    if (totalOps) totalOps.textContent = performanceMetrics.totalOperations;
}

function displayActivations() {
    const display = document.getElementById('activationsDisplay');
    let html = '';
    
    html += `<strong>INPUT LAYER:</strong><br>[`;
    activations.input.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(0, ${intensity}, 255)">${val.toFixed(3)}</span>`;
        if (i < activations.input.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>HIDDEN LAYER:</strong><br>[`;
    activations.hidden.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(${intensity}, 255, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.hidden.length - 1) html += ', ';
    });
    html += ']<br><br>';
    
    html += `<strong>OUTPUT LAYER:</strong><br>[`;
    activations.output.forEach((val, i) => {
        const intensity = Math.floor(val * 255);
        html += `<span style="color: rgb(255, ${intensity}, 0)">${val.toFixed(3)}</span>`;
        if (i < activations.output.length - 1) html += ', ';
    });
    html += ']';
    
    display.innerHTML = html;
}

function updateDebugConsole() {
    if (!debugConsoleVisible) return;
    
    switch(currentConsoleTab) {
        case 'weights':
            displayWeightMatrices();
            break;
        case 'activations':
            displayActivations();
            break;
        case 'gradients':
            displayGradients();
            break;
        case 'performance':
            displayPerformanceMetrics();
            break;
    }
}

function getActivationDerivative(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
            case 'sigmoid': return sigmoidDerivative;
            case 'tanh': return tanhDerivative;
            default: return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
        }
    }
}

function displayWeightMatrices() {
    const display = document.getElementById('weightsDisplay');
    let html = '';
    
    html += '<div class="matrix-section"><strong>INPUT → HIDDEN WEIGHTS:</strong><br>';
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        html += `H${h}: [`;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weight = weights.inputToHidden[h][i];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (i < networkConfig.inputSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    
    html += '</div><br><div class="matrix-section"><strong>HIDDEN → OUTPUT WEIGHTS:</strong><br>';
    for (let o = 0; o < networkConfig.outputSize; o++) {
        html += `O${o}: [`;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weight = weights.hiddenToOutput[o][h];
            const color = weight > 0 ? '#00ff88' : '#ff4444';
            html += `<span style="color: ${color}">${weight.toFixed(3)}</span>`;
            if (h < networkConfig.hiddenSize - 1) html += ', ';
        }
        html += ']<br>';
    }
    html += '</div>';
    
    display.innerHTML = html;
}

function resetWeights() {
    
    // Reinitialize random weights
    initializeNetwork();
    
    // Properly reset activations to match network configuration
    activations = {
        input: new Array(networkConfig.inputSize).fill(0),
        hidden: new Array(networkConfig.hiddenSize).fill(0), 
        output: new Array(networkConfig.outputSize).fill(0)
    };
    
    // Set default input pattern for the current image
    const currentImageElement = document.querySelector('.img-btn.selected');
    if (currentImageElement) {
        const currentImage = currentImageElement.onclick.toString().match(/'([^']+)'/)?.[1] || 'dog1';
        setVisualFeaturesAndLabel(currentImage);
    }
    
    // Reset performance metrics
    performanceMetrics.epochCount = 0;
    performanceMetrics.weightUpdates = 0;
    performanceMetrics.lastAccuracy = 0;
    performanceMetrics.lastLoss = 0;
    gradientHistory = [];
    activationHistory = [];
    weightHistory = [];
    
    // Redraw network with new weights and proper activations
    drawNetwork();
    
    // Reset demo
    resetDemo();
    
    updateStepInfoDual(
        '🔄 <strong>Network Reset Complete!</strong><br>🌟 The AI\'s brain is now completely fresh and ready to learn! All connections have been randomized and it\'s like having a brand new student ready for their first lesson.',
        '🔄 <strong>Network Reinitialized</strong><br>📊 All weights randomized to initial state. Ready to begin training from scratch with fresh parameters.'
    );
    
    // Auto-select appropriate label based on current image
    const currentImageId = document.querySelector('.img-btn.selected').onclick.toString().match(/'([^']+)'/)[1];
    const isDogImage = ['dog1', 'dog2', 'dog3'].includes(currentImageId);
    setTrueLabel(isDogImage ? 'dog' : 'not-dog');
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
    
    // Make weight changes visible immediately
    refreshAllConnectionVisuals();
}

function debugWeightChanges(initialWeights, target) {
    console.log('\n⚖️ ===== WEIGHT CHANGE ANALYSIS =====');
    
    // Calculate weight changes
    const inputWeightChanges = [];
    const outputWeightChanges = [];
    
    // Analyze input->hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const change = weights.inputToHidden[h][i] - initialWeights.inputToHidden[h][i];
            inputWeightChanges.push(change);
        }
    }
    
    // Analyze hidden->output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const change = weights.hiddenToOutput[o][h] - initialWeights.hiddenToOutput[o][h];
            outputWeightChanges.push(change);
        }
    }
    
    // Statistics on weight changes
    const inputChangeStats = calculateWeightStats(inputWeightChanges);
    const outputChangeStats = calculateWeightStats(outputWeightChanges);
    
    console.log('📊 WEIGHT UPDATE STATISTICS:');
    console.log(`  Input→Hidden changes: ${inputWeightChanges.length} weights`);
    console.log(`    Range: [${inputChangeStats.min.toFixed(6)}, ${inputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${inputChangeStats.mean.toFixed(6)}, Std: ${inputChangeStats.std.toFixed(6)}`);
    
    console.log(`  Hidden→Output changes: ${outputWeightChanges.length} weights`);
    console.log(`    Range: [${outputChangeStats.min.toFixed(6)}, ${outputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${outputChangeStats.mean.toFixed(6)}, Std: ${outputChangeStats.std.toFixed(6)}`);
    
    // Check for problematic patterns
    console.log('\n⚠️ CONVERGENCE ISSUE DETECTION:');
    
    // Check for very small changes (possible convergence)
    const smallInputChanges = inputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    const smallOutputChanges = outputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    
    console.log(`  Tiny changes (<1e-6): Input ${smallInputChanges}/${inputWeightChanges.length} (${(100*smallInputChanges/inputWeightChanges.length).toFixed(1)}%)`);
    console.log(`  Tiny changes (<1e-6): Output ${smallOutputChanges}/${outputWeightChanges.length} (${(100*smallOutputChanges/outputWeightChanges.length).toFixed(1)}%)`);
    
    if (smallInputChanges > inputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most input weights barely changing - possible convergence!');
    }
    if (smallOutputChanges > outputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most output weights barely changing - possible convergence!');
    }
    
    // Check for symmetry in weight changes
    const inputChangeSymmetry = checkWeightSymmetry([inputWeightChanges]);
    const outputChangeSymmetry = checkWeightSymmetry([outputWeightChanges]);
    
    console.log(`  Weight change symmetry: Input=${inputChangeSymmetry.toFixed(6)}, Output=${outputChangeSymmetry.toFixed(6)}`);
    if (inputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Input weight changes are too symmetric!');
    }
    if (outputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Output weight changes are too symmetric!');
    }
    
    // Gradient magnitude analysis
    const inputGradMagnitude = Math.sqrt(inputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    const outputGradMagnitude = Math.sqrt(outputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    
    console.log(`\n📈 GRADIENT ANALYSIS:`);
    console.log(`  Input gradient magnitude: ${inputGradMagnitude.toFixed(6)}`);
    console.log(`  Output gradient magnitude: ${outputGradMagnitude.toFixed(6)}`);
    
    if (inputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in input layer!');
    }
    if (outputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in output layer!');
    }
    if (inputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in input layer!');
    }
    if (outputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in output layer!');
    }
    
    // Target analysis
    console.log(`\n🎯 TARGET ANALYSIS:`);
    console.log(`  Target: [${target.map(t => t.toFixed(3)).join(', ')}]`);
    console.log(`  Current output: [${activations.output.map(o => o.toFixed(3)).join(', ')}]`);
    
    const error = target.map((t, i) => t - activations.output[i]);
    const errorMagnitude = Math.sqrt(error.reduce((sum, e) => sum + e*e, 0));
    console.log(`  Error: [${error.map(e => e.toFixed(3)).join(', ')}]`);
    console.log(`  Error magnitude: ${errorMagnitude.toFixed(6)}`);
    
    if (errorMagnitude < 0.01) {
        console.log('  ✅ Very low error - network converging well');
    } else if (errorMagnitude > 1.0) {
        console.log('  ⚠️ High error - network struggling to learn');
    }
    
    console.log('⚖️ ====================================');
}

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

async function trainToPerfection() {
    if (isAnimating) return;
    console.log('🔄 NEW SIMPLE TRAINING ALGORITHM');
    
    // Start the training animation
    startTrainingAnimation();
    
    updateStepInfoDual(
        '🎯 <strong>Starting Auto-Training!</strong><br>🚀 The AI will now practice with different examples to get smarter. Watch as it learns!',
        '🎯 <strong>Auto-Training Initiated</strong><br>📊 Beginning batch training with multiple examples to improve network accuracy.'
    );
    
    // IMPORTANT: Save current user's image and label state before training
    const originalCurrentImage = currentImage;
    const originalTrueLabel = trueLabel;
    const originalInputActivations = [...activations.input];
    
    console.log(`💾 Saved original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    
    // Create training dataset with all 8 image types
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? 1 : 0, // Simple binary target: 1 = dog, 0 = not-dog
            label: imageType,
            isDog: isDog
        });
    });
    
    console.log(`📊 Training data created:`);
    trainingData.forEach((example, i) => {
        console.log(`${i+1}. ${example.label}: [${example.input.join(', ')}] → target: ${example.target}`);
    });
    
    // Initialize network with very simple weights
    initializeNetwork();
    
    // EXTREMELY SIMPLE TRAINING: Just use gradient descent without complex momentum
    const learningRate = 0.3; // Moderate learning rate
    const maxEpochs = 100;
    let bestAccuracy = 0;
    
    for (let epoch = 1; epoch <= maxEpochs; epoch++) {
        let totalError = 0;
        
        // Shuffle data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        for (const example of shuffled) {
            // Forward pass - get single output (probability of being a dog)
            const output = simpleBinaryForward(example.input);
            const error = output - example.target;
            totalError += error * error;
            
            // Simple backward pass - update weights directly
            simpleBinaryBackward(example.input, output, example.target, learningRate);
        }
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0 || epoch === 1) {
            const accuracy = testSimpleBinaryAccuracy(trainingData);
            console.log(`Epoch ${epoch}: Accuracy ${(accuracy*100).toFixed(1)}%, Error ${(totalError/trainingData.length).toFixed(4)}`);
            
            // Show predictions for all examples
            console.log('Predictions:');
            trainingData.forEach(ex => {
                const output = simpleBinaryForward(ex.input);
                const predicted = output > 0.5 ? 'DOG' : 'NOT-DOG';
                const actual = ex.isDog ? 'DOG' : 'NOT-DOG';
                const correct = (output > 0.5) === ex.isDog ? '✅' : '❌';
                console.log(`  ${ex.label}: ${output.toFixed(3)} → ${predicted} (${actual}) ${correct}`);
            });
            
            updateStepInfoDual(
                `🔄 <strong>Training Progress - Round ${epoch}</strong><br>🎯 Current accuracy: ${(accuracy*100).toFixed(1)}% - The AI is getting ${accuracy >= 0.8 ? 'really smart' : accuracy >= 0.5 ? 'better' : 'started'}!`,
                `🔄 <strong>Epoch ${epoch}</strong><br>📊 Accuracy: ${(accuracy*100).toFixed(1)}% | Loss: ${((1-accuracy)*100).toFixed(1)}%`
            );
            
            // Update training animation with current progress
            updateTrainingAnimation(epoch, accuracy);
            
            // Update visual representation of weights during training
            refreshAllConnectionVisuals();
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
            }
            
            if (accuracy >= 1.0) {
                console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
                updateStepInfoDual(
                    `🏆 <strong>Perfect Training Complete!</strong><br>🎉 The AI achieved 100% accuracy in just ${epoch} rounds! It's now a master at recognizing dogs!`,
                    `🏆 <strong>Training Complete</strong><br>📊 100% accuracy achieved in ${epoch} epochs. Optimal convergence reached.`
                );
                
                // Stop training animation with success
                stopTrainingAnimation(true);
                
                // IMPORTANT: Restore user's original image and label state after early completion
                console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
                currentImage = originalCurrentImage;
                trueLabel = originalTrueLabel;
                activations.input = originalInputActivations;
                
                // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
                preventAutoLabeling = true;
                
                // Update UI to reflect restored state
                selectImage(originalCurrentImage);
                
                // Wait a moment for async image loading, then restore label and re-enable auto-labeling
                setTimeout(() => {
                    if (originalTrueLabel) {
                        setTrueLabel(originalTrueLabel);
                    }
                    preventAutoLabeling = false;
                    
                    // Ensure buttons are properly enabled after restoration
                    document.getElementById('forwardBtn').disabled = false;
                    document.getElementById('fullDemoBtn').disabled = false;
                    document.getElementById('backwardBtn').disabled = true;
                    
                    console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
                }, 100);
                
                refreshAllConnectionVisuals(); // Make weight changes visible immediately
                return;
            }
        }
        
        await sleep(100); // Small delay for visualization
    }
    
    const finalAccuracy = testSimpleBinaryAccuracy(trainingData);
    updateStepInfoDual(
        `✅ <strong>Auto-Training Finished!</strong><br>🎓 Final result: ${(finalAccuracy*100).toFixed(1)}% accuracy! ${finalAccuracy >= 0.9 ? '🌟 Excellent performance!' : finalAccuracy >= 0.7 ? '👍 Good progress!' : '📚 Needs more practice!'}`,
        `✅ <strong>Training Session Complete</strong><br>📊 Final Accuracy: ${(finalAccuracy*100).toFixed(1)}%`
    );
    console.log(`Final accuracy: ${(finalAccuracy*100).toFixed(1)}%`);
    
    // Stop training animation
    stopTrainingAnimation(finalAccuracy >= 0.8);
    
    // IMPORTANT: Restore user's original image and label state after training
    console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    currentImage = originalCurrentImage;
    trueLabel = originalTrueLabel;
    activations.input = originalInputActivations;
    
    // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
    preventAutoLabeling = true;
    
    // Update UI to reflect restored state
    selectImage(originalCurrentImage);
    
    // Wait a moment for async image loading, then restore label and re-enable auto-labeling
    setTimeout(() => {
        if (originalTrueLabel) {
            setTrueLabel(originalTrueLabel);
        }
        preventAutoLabeling = false;
        
        // Ensure buttons are properly enabled after restoration
        document.getElementById('forwardBtn').disabled = false;
        document.getElementById('fullDemoBtn').disabled = false;
        document.getElementById('backwardBtn').disabled = true;
        
        console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
    }, 100);
    
    refreshAllConnectionVisuals(); // Make weight changes visible immediately
}

function showWeightChanges() {
    if (!weightChanges.inputToHidden || !weightChanges.hiddenToOutput) return;
    
    // Show input-to-hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connectionId = `conn-input-${i}-hidden-${h}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.inputToHidden[h][i];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
    
    // Show hidden-to-output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connectionId = `conn-hidden-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                const currentWeight = weights.hiddenToOutput[o][h];
                applyWeightVisualization(connection, currentWeight);
            }
        }
    }
}

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

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.clearAllHighlights = clearAllHighlights;
if (typeof window !== 'undefined') window.updateInputActivations = updateInputActivations;
if (typeof window !== 'undefined') window.displayAIInputNumbers = displayAIInputNumbers;
if (typeof window !== 'undefined') window.trainWithHyperparams = trainWithHyperparams;
if (typeof window !== 'undefined') window.toggleWeightSliders = toggleWeightSliders;
if (typeof window !== 'undefined') window.displayPerformanceMetrics = displayPerformanceMetrics;
if (typeof window !== 'undefined') window.setVisualFeaturesAndLabel = setVisualFeaturesAndLabel;
if (typeof window !== 'undefined') window.displayGradients = displayGradients;
if (typeof window !== 'undefined') window.setupEventListeners = setupEventListeners;
if (typeof window !== 'undefined') window.createWeightEditingPanel = createWeightEditingPanel;
if (typeof window !== 'undefined') window.updateLastWeights = updateLastWeights;
if (typeof window !== 'undefined') window.debugWeightInitialization = debugWeightInitialization;
if (typeof window !== 'undefined') window.hideWeightSliders = hideWeightSliders;
if (typeof window !== 'undefined') window.enableDeepDebugging = enableDeepDebugging;
if (typeof window !== 'undefined') window.setTrueLabel = setTrueLabel;
if (typeof window !== 'undefined') window.updateWeight = updateWeight;
if (typeof window !== 'undefined') window.checkPredictionDiversity = checkPredictionDiversity;
if (typeof window !== 'undefined') window.highlightConnection = highlightConnection;
if (typeof window !== 'undefined') window.syncExpertConfigToLegacy = syncExpertConfigToLegacy;
if (typeof window !== 'undefined') window.drawInputNeuronVisualization = drawInputNeuronVisualization;
if (typeof window !== 'undefined') window.debugFeatureRepresentation = debugFeatureRepresentation;
if (typeof window !== 'undefined') window.showWeightSliders = showWeightSliders;
if (typeof window !== 'undefined') window.recalculateNetwork = recalculateNetwork;
if (typeof window !== 'undefined') window.clearHighlight = clearHighlight;
if (typeof window !== 'undefined') window.getActivationFunction = getActivationFunction;
if (typeof window !== 'undefined') window.t = t;
if (typeof window !== 'undefined') window.updatePerformanceDisplays = updatePerformanceDisplays;
if (typeof window !== 'undefined') window.displayActivations = displayActivations;
if (typeof window !== 'undefined') window.updateDebugConsole = updateDebugConsole;
if (typeof window !== 'undefined') window.getActivationDerivative = getActivationDerivative;
if (typeof window !== 'undefined') window.displayWeightMatrices = displayWeightMatrices;
if (typeof window !== 'undefined') window.resetWeights = resetWeights;
if (typeof window !== 'undefined') window.debugWeightChanges = debugWeightChanges;
if (typeof window !== 'undefined') window.createWeightControl = createWeightControl;
if (typeof window !== 'undefined') window.trainToPerfection = trainToPerfection;
if (typeof window !== 'undefined') window.showWeightChanges = showWeightChanges;
if (typeof window !== 'undefined') window.highlightInputNeuron = highlightInputNeuron;
