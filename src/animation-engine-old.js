// ============================================================================
// ANIMATION-ENGINE MODULE
// Animation and demo coordination functions
// ============================================================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * (11 - animationSpeed) / 10));
}

async function startDemo() {
    if (isAnimating) return;
    
    console.log("=== START DEMO CALLED ===");
    console.log("Current trueLabel:", trueLabel);
    console.log("Current image:", currentImage);
    
    // Failsafe: Ensure trueLabel is set based on current image
    if (!trueLabel) {
        console.log("trueLabel was null, setting it based on currentImage");
        const correctLabel = currentImage.startsWith('dog') ? 'dog' : 'not-dog';
        setTrueLabel(correctLabel);
        console.log("trueLabel set to:", trueLabel);
    }
    
    const startTime = performance.now();
    isAnimating = true;
    // Button doesn't exist in compact interface
    performanceMetrics.totalOperations++;
    
    
    // Show current weight values at start
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfo("🚀 Let's watch how the AI brain processes this image step by step!");
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    const forwardStartTime = performance.now();
    updateStepInfo("📥 STEP 1: Converting the image into numbers the AI can understand. Each feature gets a score from 0 to 1.");
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfo("🧠 STEP 2: The hidden neurons are doing math! Each one multiplies input numbers by its connection weights, then adds them up.");
    const forwardResult = await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer (only if not already processed)
    if (!forwardResult?.processedOutputLayer) {
        updateStepInfo("🎯 STEP 3: The output neurons make the final decision by combining all the hidden neuron signals!");
        await animateOutputComputation();
    } else {
        console.log('✅ Output layer already processed by dynamic system');
    }
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Step 5: Backpropagation if true label is set
    console.log("Checking backpropagation condition: trueLabel =", trueLabel);
    if (trueLabel) {
        await sleep(2000);
        const backpropStartTime = performance.now();
        highlightSection('backward');
        updateStepInfoDual(
            "📚 <strong>STEP 4: Learning Time!</strong><br>🎓 Just like when you study for a test, the AI looks at its mistake and figures out how to do better next time. It's like having a really patient teacher help it learn!",
            "📚 <strong>STEP 4: Backpropagation Learning Phase</strong><br>🔄 Computing gradients and updating weights based on classification error."
        );
        await animateBackpropagation();
        
        performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
        performanceMetrics.epochCount++;
        performanceMetrics.weightUpdates += (networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize);
        
        updateStepInfo("🎉 Learning complete! The AI has updated its 'memory' (connection weights) and should be smarter now. Try running it again!");
        
        // Keep weight values visible after training
        document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
        
        // Make weight changes visible immediately
        refreshAllConnectionVisuals();
    } else {
        updateStepInfo("💡 Tip: Select the correct answer above to see how the AI learns from its mistakes!");
    }
    
    highlightSection('none');
    
    // Button doesn't exist in compact interface
    isAnimating = false;
}

async function startFullDemo() {
    // Start message logging for the full sequence
    startMessageLog();
    
    // Temporarily disable auto-logging for individual functions
    const wasMessageLogActive = messageLogActive;
    messageLogActive = false;
    
    await runForwardPass();
    if (trueLabel && !isAnimating) {
        await sleep(2000);
        await runBackwardPass();
    }
    
    // Restore message logging and stop it to show complete sequence
    messageLogActive = wasMessageLogActive;
    if (messageLogActive) {
        stopMessageLog();
    }
}

function resetDemo() {
    isAnimating = false;
    
    // Clear any accumulated messages to prevent old messages from showing
    if (messageLogActive) {
        messageLogActive = false;
    }
    messageLog = [];
    
    // Reset demo state
    demoState.forwardCompleted = false;
    demoState.hasResults = false;
    
    // Properly reset all button states
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('fullDemoBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true;
    
    // Reset all neuron states
    resetNeuronStates();
    
    // Don't hide weight values - keep them visible to show learning
    // document.querySelectorAll('.weight-value').forEach(w => w.classList.remove('show'));
    
    // Reset activations display (but keep learned weights!) - using NEW feature system!
    setVisualFeaturesAndLabel(currentImage);
    activations.hidden = [0, 0, 0];
    activations.output = [0, 0];
    
    // Update displays
    updateNetworkDisplays();
    
    // Reset probability bars and confidence (with null checks)
    const dogProbBar = document.getElementById('dogProbBar');
    const notDogProbBar = document.getElementById('notDogProbBar');
    const dogProbValue = document.getElementById('dogProbValue');
    const notDogProbValue = document.getElementById('notDogProbValue');
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    
    if (dogProbBar) dogProbBar.style.width = '0%';
    if (notDogProbBar) notDogProbBar.style.width = '0%';
    if (dogProbValue) dogProbValue.textContent = '0%';
    if (notDogProbValue) notDogProbValue.textContent = '0%';
    if (confidenceFill) confidenceFill.style.width = '0%';
    if (confidenceValue) confidenceValue.textContent = '0%';
    
    // Reset prediction display styling (if element exists)
    const predictionDisplay = document.getElementById('predictionDisplay');
    if (predictionDisplay) {
        predictionDisplay.style.borderColor = '#00ccff';
        predictionDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    }
    
    updateStepInfoDual(
        window.i18n.t('ui.readyToExplore'),
        window.i18n.t('ui.systemReady')
    );
    
    // Enable forward pass button
    document.getElementById('forwardBtn').disabled = false;
    // Button doesn't exist in compact interface
    
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
}

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

async function animateForwardPropagation() {
    // Use the new variable layer system for all networks
    console.log('🎬 Starting variable layer forward propagation animation');
    
    // Use the global variable layer system - run computation first
    const inputValues = activations.input;
    const result = forwardPropagateCurrentNetwork(inputValues);
    
    if (!result || !result.layers || result.layers.length === 0) {
        console.warn('⚠️ Variable layer system failed, using legacy animation');
        await animateForwardPropagationLegacy();
        return { processedOutputLayer: false };
    }
    
    const layers = result.layers;
    const weights = result.weights;
    const layerActivations = result.activations;
    
    console.log('🎬 Starting dynamic forward propagation with', layers.length, 'layers');
    console.log('   Layers:', layers.map(l => `${l.name}(${l.size})`).join(' → '));
    console.log('   Weight matrices:', weights.length, 'total');
    console.log('   Activation arrays:', layerActivations.length, 'total');
    
    // Process each layer transition (skip input layer, process all hidden layers)
    for (let layerIndex = 1; layerIndex < layers.length; layerIndex++) {
        const fromLayer = layers[layerIndex - 1];
        const toLayer = layers[layerIndex];
        const weightMatrix = weights[layerIndex - 1];
        
        if (!weightMatrix) continue;
        
        console.log(`🔄 Processing ${fromLayer.name} → ${toLayer.name} (layer ${layerIndex})`);
        
        // Process each neuron in the current layer
        for (let neuronIndex = 0; neuronIndex < toLayer.size; neuronIndex++) {
            // Get neuron positions
            const fromPositions = getPositionsForLayerAnimation(fromLayer, layerIndex - 1);
            const toPositions = getPositionsForLayerAnimation(toLayer, layerIndex);
            
            // Highlight all connections TO this specific neuron
            highlightConnectionsToNeuron(fromLayer, toLayer, neuronIndex, layerIndex);
            await sleep(600);
            
            // Animate each connection individually
            let sum = 0;
            for (let fromNeuron = 0; fromNeuron < fromLayer.size; fromNeuron++) {
                const connectionId = generateConnectionIdForAnimation(fromLayer, fromNeuron, toLayer, neuronIndex, layerIndex - 1);
                const connection = document.getElementById(connectionId);
                
                if (connection) {
                    connection.classList.add('forward-pass');
                    
                    // Create flowing dots
                    if (fromPositions[fromNeuron] && toPositions[neuronIndex]) {
                        createFlowingDots(
                            fromPositions[fromNeuron].x, fromPositions[fromNeuron].y,
                            toPositions[neuronIndex].x, toPositions[neuronIndex].y,
                            connectionId, 600
                        );
                    }
                    
                    // Calculate contribution using the computed activations
                    const fromActivation = layerActivations[layerIndex - 1][fromNeuron];
                    const weight = weightMatrix[neuronIndex][fromNeuron];
                    const contribution = fromActivation * weight;
                    sum += contribution;
                    
                    await sleep(200);
                    connection.classList.remove('forward-pass');
                }
            }
            
            await sleep(500);
            
            // Use the pre-computed activation values from the variable layer system
            const computedValue = layerActivations[layerIndex][neuronIndex];
            
            // Update global activations with computed value
            if (toLayer.type === 'output') {
                // Update global output activations
                activations.output[neuronIndex] = computedValue;
            } else if (toLayer.type === 'hidden') {
                // Update global hidden activations  
                if (!activations.hidden) activations.hidden = [];
                activations.hidden[neuronIndex] = computedValue;
            }
            
            // Update neuron display - handle potential non-numeric values
            const neuronId = generateNeuronIdForAnimation(toLayer, neuronIndex, layerIndex);
            const valueId = generateValueIdForAnimation(toLayer, neuronIndex, layerIndex);
            
            const neuron = document.getElementById(neuronId);
            const value = document.getElementById(valueId);
            
            if (neuron && value) {
                neuron.classList.add('forward-active');
                
                // Safely display the computed value
                if (typeof computedValue === 'number' && !isNaN(computedValue)) {
                    value.textContent = computedValue.toFixed(2);
                } else {
                    value.textContent = '0.00';
                    console.warn('Invalid activation value:', computedValue);
                }
                
                await sleep(200);
                neuron.classList.remove('forward-active');
                neuron.classList.add('active');
            }
            
            // Update visual properties
            updateNeuronColors();
            clearSubNetworkHighlights();
            await sleep(300);
        }
        
        // Output layer has already been processed by the variable layer system with softmax
        if (layerIndex === layers.length - 1 && toLayer.type === 'output') {
            console.log('✅ Output layer already processed with softmax by variable layer system');
            
            // Update display values with the computed softmax outputs
            for (let i = 0; i < toLayer.size; i++) {
                const valueId = generateValueIdForAnimation(toLayer, i, layerIndex);
                const valueElement = document.getElementById(valueId);
                if (valueElement) {
                    valueElement.textContent = layerActivations[layerIndex][i].toFixed(3);
                }
            }
        }
        
        // Small delay between layers
        await sleep(400);
    }
    
    // Final visual update
    updateNeuronColors();
    
    console.log('✅ Forward propagation animation completed for all', layers.length - 1, 'layer transitions');
    
    return { processedOutputLayer: true }; // Dynamic system processes all layers including output
}

// Legacy fallback animation for when dynamic structure fails
async function animateForwardPropagationLegacy() {
    console.log('🔙 Using legacy forward propagation');
    
    // Compute hidden layer (single layer only)
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        // First, highlight ALL connections TO this specific neuron
        highlightSubNetwork('input', 'hidden', h);
        await sleep(600);
        
        // Animate each connection individually
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.input[i].x, positions.input[i].y, 
                                positions.hidden[h].x, positions.hidden[h].y, 
                                `conn-input-${i}-hidden-${h}`, 600);
                
                // Individual connection computation
                const contribution = activations.input[i] * weights.inputToHidden[h][i];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(500);
        
        // Apply activation function
        const hiddenActivationFn = getActivationFunction('hidden');
        activations.hidden[h] = hiddenActivationFn(sum);
        
        // Update neuron
        const neuron = document.getElementById(`hidden-neuron-${h}`);
        const value = document.getElementById(`hidden-value-${h}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.hidden[h].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
        
        // Update visual properties
        updateNeuronColors();
        
        clearSubNetworkHighlights();
        await sleep(400);
    }
    
    // Update visual properties based on activations
    updateNeuronColors();
}

// Helper functions for dynamic animation
function getLegacyLayersForAnimation() {
    return [
        { type: 'input', size: networkConfig.inputSize, name: 'Input' },
        { type: 'hidden', size: networkConfig.hiddenSize, name: 'Hidden', index: 0 },
        { type: 'output', size: networkConfig.outputSize, name: 'Output' }
    ];
}

function getLegacyWeightsForAnimation() {
    return [weights.inputToHidden, weights.hiddenToOutput];
}

function getLegacyActivationsForAnimation() {
    return [activations.input, activations.hidden, activations.output];
}

function getPositionsForLayerAnimation(layer, layerIndex) {
    if (layer.type === 'input') return positions.input;
    if (layer.type === 'output') return positions.output;
    if (layer.type === 'hidden') {
        // For multiple hidden layers, check specific layer positions
        if (layer.index === 0) {
            return positions.hidden || positions[`hidden_0`] || [];
        } else {
            return positions[`hidden_${layer.index}`] || positions[`hidden${layer.index}`] || [];
        }
    }
    return [];
}

function generateConnectionIdForAnimation(fromLayer, fromNeuron, toLayer, toNeuron, layerIndex) {
    if (fromLayer.type === 'input' && toLayer.type === 'hidden') {
        // Match network visualizer format: conn-input-{fromNeuron}-hidden-{toNeuron}
        return `conn-input-${fromNeuron}-hidden-${toNeuron}`;
    }
    if (fromLayer.type === 'hidden' && toLayer.type === 'hidden') {
        // Match network visualizer format: conn-hidden{layerIndex}-{fromNeuron}-hidden{layerIndex + 1}-{toNeuron}
        // Use layerIndex parameter which represents the current transition layer index
        return `conn-hidden${layerIndex - 1}-${fromNeuron}-hidden${layerIndex}-${toNeuron}`;
    }
    if (fromLayer.type === 'hidden' && toLayer.type === 'output') {
        // Match network visualizer format: conn-hidden-{fromNeuron}-output-{toNeuron}
        return `conn-hidden-${fromNeuron}-output-${toNeuron}`;
    }
    return `conn-layer${layerIndex}-${fromNeuron}-layer${layerIndex + 1}-${toNeuron}`;
}

function generateNeuronIdForAnimation(layer, neuronIndex, layerIndex) {
    if (layer.type === 'input') return `input-neuron-${neuronIndex}`;
    if (layer.type === 'output') return `output-neuron-${neuronIndex}`;
    if (layer.type === 'hidden') {
        // Match the network visualizer format
        if (layer.index === 0) {
            return `hidden-neuron-${neuronIndex}`;
        } else {
            return `hidden_${layer.index}-neuron-${neuronIndex}`;
        }
    }
    return `layer${layerIndex}-neuron-${neuronIndex}`;
}

function generateValueIdForAnimation(layer, neuronIndex, layerIndex) {
    if (layer.type === 'input') return `input-value-${neuronIndex}`;
    if (layer.type === 'output') return `output-value-${neuronIndex}`;
    if (layer.type === 'hidden') {
        // Match the network visualizer format
        if (layer.index === 0) {
            return `hidden-value-${neuronIndex}`;
        } else {
            return `hidden_${layer.index}-value-${neuronIndex}`;
        }
    }
    return `layer${layerIndex}-value-${neuronIndex}`;
}

function highlightConnectionsToNeuron(fromLayer, toLayer, neuronIndex, layerIndex) {
    // This function highlights all connections going TO a specific neuron
    // For now, we'll use the existing highlight system or implement a simple version
    if (fromLayer.type === 'input' && toLayer.type === 'hidden') {
        highlightSubNetwork('input', 'hidden', neuronIndex);
    } else if (fromLayer.type === 'hidden' && toLayer.type === 'output') {
        highlightSubNetwork('hidden', 'output', neuronIndex);
    }
    // For hidden-to-hidden connections, we might need to implement new highlighting
}

async function animateOutputComputation() {
    // Enhanced output computation with pedagogical highlighting
    
    // Compute output layer
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputName = o === 0 ? 'DOG' : 'NOT-DOG';
        
        // First, highlight ALL connections TO this output neuron
        highlightSubNetwork('hidden', 'output', o);
        await sleep(600);
        
        // Animate each connection with enhanced highlighting and flowing dots
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (connection) {
                connection.classList.add('forward-pass');
                
                // Create flowing dots along this connection
                createFlowingDots(positions.hidden[h].x, positions.hidden[h].y, 
                                positions.output[o].x, positions.output[o].y, 
                                `conn-hidden-${h}-output-${o}`, 600);
                
                const contribution = activations.hidden[h] * weights.hiddenToOutput[o][h];
                sum += contribution;
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        await sleep(400);
        
        activations.output[o] = sum;
        clearSubNetworkHighlights();
        await sleep(300);
    }
    
    // Apply softmax
    activations.output = softmax(activations.output);
    
    // Update prediction column after output is computed
    updatePrediction();
    
    // Update output neurons
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const neuron = document.getElementById(`output-neuron-${o}`);
        const value = document.getElementById(`output-value-${o}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            value.textContent = activations.output[o].toFixed(2);
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
    }
    
    // Final visual update
    updateNeuronColors();
}

async function animateBackpropagation() {
    if (!trueLabel) return;
    
    // Use the variable layer backpropagation system
    console.log('🔄 Starting variable layer backpropagation animation');
    
    // Determine target values
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
    // Run the variable layer backpropagation system
    const backpropResult = backpropagateCurrentNetwork(target);
    
    if (!backpropResult) {
        console.warn('⚠️ Variable layer backprop failed, using legacy animation');
        await animateBackpropagationLegacy();
        return;
    }
    
    // Calculate output layer error (simplified cross-entropy derivative)
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = target[o] - activations.output[o];
    }
    
    // Store gradient information for debug console
    const gradientInfo = {
        outputGradients: [...outputErrors],
        hiddenGradients: [],
        timestamp: Date.now(),
        epoch: performanceMetrics.epochCount + 1
    };
    
    // Educational enhancement: Ensure visible learning even with weak neurons
    const maxError = Math.max(...outputErrors.map(Math.abs));
    const prediction = activations.output[0] / (activations.output[0] + activations.output[1]);
    const isNearFiftyFifty = Math.abs(prediction - 0.5) < 0.15; // Within 15% of 50/50
    const hasSmallGradients = maxError < 0.3;
    
    // Check for dead/dying neurons (activations near zero)
    const deadHiddenNeurons = activations.hidden.filter(h => Math.abs(h) < 0.1).length;
    const hasDeadNeurons = deadHiddenNeurons > 0;
    
    // AGGRESSIVE pedagogical learning rate - make it ALWAYS learn!
    let adaptiveLearningRate = networkConfig.learningRate;
    let needsMagic = false;
    
    if (isNearFiftyFifty || hasSmallGradients || hasDeadNeurons) {
        // Educational enhancement: Amplify learning for demonstration purposes
        adaptiveLearningRate = networkConfig.learningRate * 5.0; // Even more aggressive!
        needsMagic = true;
        
        if (hasDeadNeurons && isNearFiftyFifty) {
            updateStepInfoDual(
                `🎢 <strong>STEP 3: AI Learning Boost!</strong><br>
                🎲 The AI is confused (guessing 50/50) AND some brain cells are "asleep"<br>
                🔋 We're boosting its learning power to wake up those sleepy neurons!<br>
                💡 Think of it like turning up the brightness on a dim lightbulb!`,
                `⚡ <strong>BOOST MODE:</strong> Weak neurons detected with confused prediction. Amplifying learning signal for breakthrough training!`
            );
        } else if (hasDeadNeurons) {
            updateStepInfoDual(
                `😴 <strong>STEP 3: Wake Up Sleepy Brain Cells!</strong><br>
                💤 Some brain cells are "asleep" (giving weak signals)<br>
                🔔 We're giving them a gentle nudge to participate more!<br>
                🌟 Like encouraging a quiet student to speak up in class!`,
                `🔥 NEURON REVIVAL! Some neurons are 'sleeping' - waking them up with extra learning power!`
            );
        } else if (isNearFiftyFifty) {
            updateStepInfoDual(
                `🤔 <strong>STEP 3: Breaking the Confusion!</strong><br>
                🎯 The AI can't decide (50/50 between dog/not-dog)<br>
                🎪 We're giving it a helpful push toward the right answer!<br>
                🧭 Like pointing a lost person in the right direction!`,
                `🚀 CONFUSION BREAKER! 50/50 prediction detected - using teaching magic to push the AI toward a decision!`
            );
        } else {
            updateStepInfoDual(
                `🔊 <strong>Turning Up the Learning Volume!</strong><br>
                📻 The AI's learning whispers are too quiet to hear clearly<br>
                🎚️ We're cranking up the volume so it can learn better!<br>
                🎧 It's like turning up your headphones when the music is too soft to enjoy!`,
                `💪 <strong>LEARNING BOOST:</strong> Weak learning signals detected - amplifying for better training!`
            );
        }
    } else {
        updateStepInfoDual(
            `🕵️ <strong>Learning Detective Work!</strong><br>
            🔍 The AI works backwards like a detective solving a case<br>
            🤔 For each connection it asks: "Did you help me get the right answer or not?"<br>
            💪 Helpful connections get stronger, unhelpful ones get weaker - just like building muscle by practicing!`,
            `🔄 Standard backpropagation: Computing gradients through chain rule to update weights based on error contribution.`
        );
    }
    
    // The weights have already been updated by the variable layer system
    // Just animate the visual updates for all connections
    await animateWeightUpdatesVariable(backpropResult, needsMagic, adaptiveLearningRate, target, outputErrors);
    
    // Calculate hidden layer errors from the backpropagation result
    const hiddenErrors = backpropResult.hiddenGradients || [];
    
    gradientInfo.hiddenGradients = [...hiddenErrors];
    gradientHistory.push(gradientInfo);
    
    // Keep only last 20 gradient entries
    if (gradientHistory.length > 20) {
        gradientHistory.shift();
    }
}

async function displayResult() {
    const dogProb = activations.output[0] * 100;
    const notDogProb = activations.output[1] * 100;
    const confidence = Math.abs(dogProb - 50); // Distance from 50% = confidence
    
    // Update probability bars (only if they exist - they were removed in recent update)
    const dogBar = document.getElementById('dogProbBar');
    const notDogBar = document.getElementById('notDogProbBar');
    
    if (dogBar && notDogBar) {
        dogBar.style.width = `${dogProb}%`;
        notDogBar.style.width = `${notDogProb}%`;
    }
    
    // Update confidence meter (only if it exists)
    const confidenceFill = document.getElementById('confidenceFill');
    const confidenceValue = document.getElementById('confidenceValue');
    if (confidenceFill && confidenceValue) {
        confidenceFill.style.width = `${confidence * 2}%`; // Scale to 0-100%
        confidenceValue.textContent = `${confidence.toFixed(1)}%`;
    }
    
    // Update percentage text (only if elements exist)
    const dogProbValue = document.getElementById('dogProbValue');
    const notDogProbValue = document.getElementById('notDogProbValue');
    if (dogProbValue && notDogProbValue) {
        dogProbValue.textContent = `${dogProb.toFixed(1)}%`;
        notDogProbValue.textContent = `${notDogProb.toFixed(1)}%`;
    }
    
    const prediction = dogProb > notDogProb ? window.i18n.t('prediction.canine') : window.i18n.t('prediction.nonCanine');
    const isCorrect = (prediction === window.i18n.t('prediction.canine') && trueLabel === 'dog') || (prediction === window.i18n.t('prediction.nonCanine') && trueLabel === 'not-dog');
    
    // Calculate accuracy and loss
    const accuracy = isCorrect ? 1.0 : 0.0;
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    const loss = -target.reduce((sum, t, i) => sum + t * Math.log(Math.max(activations.output[i], 1e-15)), 0);
    
    performanceMetrics.lastAccuracy = accuracy;
    performanceMetrics.lastLoss = loss;
    
    const statusEmoji = isCorrect ? '✅' : '❌';
    const statusText = isCorrect ? window.i18n.t('result.correct') : window.i18n.t('result.wrong');
    
    
    updateStepInfoDual(
        `${statusEmoji} <strong>AI's Final Answer:</strong> "${prediction}" with ${confidence.toFixed(1)}% confidence<br>
        ${statusText} ${isCorrect ? window.i18n.t('result.aiGotItRight') : window.i18n.t('result.aiWillLearn')}`,
        `${statusEmoji} <strong>Classification Result:</strong> "${prediction}" (${confidence.toFixed(1)}% confidence)<br>
        ${statusText} Accuracy: ${isCorrect ? window.i18n.t('result.correctCheck') : window.i18n.t('result.incorrectX')}`
    );
    
    // Highlight the prediction result visually (only if element exists)
    const predictionDisplay = document.getElementById('predictionDisplay');
    if (predictionDisplay) {
        if (isCorrect) {
            predictionDisplay.style.borderColor = '#10b981';
            predictionDisplay.style.backgroundColor = '#ecfdf5';
        } else {
            predictionDisplay.style.borderColor = '#ef4444';
            predictionDisplay.style.backgroundColor = '#fef2f2';
        }
    }
    
    // Update debug console if open
    if (debugConsoleVisible) {
        updateDebugConsole();
    }
    
    await sleep(2000); // Longer pause to see result
}

async function runForwardPass() {
    if (isAnimating) return;
    
    console.log("=== FORWARD PASS ONLY ===");
    console.log("Current trueLabel:", trueLabel);
    console.log("Current image:", currentImage);
    
    // Failsafe: Ensure trueLabel is set based on current image
    if (!trueLabel) {
        console.log("trueLabel was null, setting it based on currentImage");
        const correctLabel = currentImage.startsWith('dog') ? 'dog' : 'not-dog';
        setTrueLabel(correctLabel);
        console.log("trueLabel set to:", trueLabel);
    }
    
    // Start message logging for detailed step-by-step view
    startMessageLog();
    
    isAnimating = true;
    document.getElementById('forwardBtn').disabled = true;
    document.getElementById('fullDemoBtn').disabled = true;
    performanceMetrics.totalOperations++;
    
    // Show current weight values at start
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfoDual(
        t('forward.student.start'),
        t('forward.expert.start', [
            formatMatrix(weights.inputToHidden, 'W₁ (Input→Hidden)'),
            formatMatrix(weights.hiddenToOutput, 'W₂ (Hidden→Output)'),
            expertConfig.hiddenActivation,
            expertConfig.outputActivation
        ])
    );
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    const forwardStartTime = performance.now();
    updateStepInfoDual(
        window.i18n.t('forward.student.step1', [
            (activations.input[0] * 100).toFixed(0),
            (activations.input[1] * 100).toFixed(0),
            (activations.input[2] * 100).toFixed(0),
            (activations.input[3] * 100).toFixed(0)
        ]),
        window.i18n.t('forward.expert.step1', [
            formatMatrix(activations.input, 'Input Vector x'),
            activations.input[0].toFixed(3),
            activations.input[1].toFixed(3), 
            activations.input[2].toFixed(3),
            activations.input[3].toFixed(3)
        ])
    );
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfoDual(
        window.i18n.t('forward.student.step2', [
            ((activations.hidden[0] || 0) * 100).toFixed(0),
            ((activations.hidden[1] || 0) * 100).toFixed(0),
            ((activations.hidden[2] || 0) * 100).toFixed(0),
            ((activations.hidden[3] || 0) * 100).toFixed(0)
        ]),
        window.i18n.t('forward.expert.step2', [
            formatOperation(window.i18n.t('expert.matrixMultiplication'), "h = σ(W₁ᵀ × x)", 
              `[${activations.hidden.map(h => h.toFixed(3)).join(', ')}]`,
              `For each hidden neuron i: h[i] = ${expertConfig.hiddenActivation}(Σⱼ W₁[i,j] × x[j])`) + 
            `<br>${window.i18n.t('expert.currentActivation')} <strong>${expertConfig.hiddenActivation.replace('_', ' ').toUpperCase()}</strong>`
        ])
    );
    const expertForwardResult = await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer (only if not already processed)
    if (!expertForwardResult?.processedOutputLayer) {
        updateStepInfoDual(
            window.i18n.t('forward.student.step3', [
              window.i18n.t('vote.definitelyDog'),
              (activations.output[0] * 100).toFixed(1),
              window.i18n.t('vote.nopeNotDog'),
              (activations.output[1] * 100).toFixed(1),
              activations.output[0] > activations.output[1] ? 
                `🐕 "${window.i18n.t('vote.prettyDog')}" ${window.i18n.t('vote.dogWon')}` : 
                `❌ "${window.i18n.t('vote.dontThinkDog')}" ${window.i18n.t('vote.notDogWon')}`
            ]),
            window.i18n.t('forward.expert.step3', [
                formatOperation(window.i18n.t('expert.finalPrediction'), "y = σ(W₂ᵀ × h)", 
                  `[${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]`,
                  `For each output j: y[j] = ${expertConfig.outputActivation}(Σᵢ W₂[j,i] × h[i])`) + 
                `<br>${window.i18n.t('expert.outputActivation')} <strong>${expertConfig.outputActivation.toUpperCase()}</strong>`
            ])
        );
        await animateOutputComputation();
    } else {
        console.log('✅ Output layer already processed by dynamic system (expert mode)');
    }
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Update state
    demoState.forwardCompleted = true;
    demoState.hasResults = true;
    
    // Enable backward pass if we have the correct answer
    if (trueLabel) {
        document.getElementById('backwardBtn').disabled = false;
        updateStepInfoDual(
            window.i18n.t('completion.thinkingDone'),
            window.i18n.t('forward.expert.result', [
                performanceMetrics.forwardPassTime,
                activations.output[0] > activations.output[1] ? window.i18n.t('prediction.dog') : window.i18n.t('prediction.notDog'),
                activations.output.map(o => (o*100).toFixed(1)).join(', ')
            ]) + `<br>📈 ${window.i18n.t('expert.confidence')} ${Math.abs((activations.output[0] - activations.output[1]) * 100).toFixed(1)}%<br>
             🎓 ${window.i18n.t('expert.readyBackprop')} <strong>${trueLabel.toUpperCase()}</strong>`
        );
    } else {
        updateStepInfoDual(
            window.i18n.t('completion.setCorrectAnswer'),
            window.i18n.t('forward.expert.result', [
                '0',
                'N/A',
                activations.output.map(o => (o*100).toFixed(1)).join(', ')
            ]).replace('{0}ms', 'N/A') + `<br>⚠️ ${window.i18n.t('expert.needTargetLabel')}`
        );
    }
    
    highlightSection('none');
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('fullDemoBtn').disabled = false;
    isAnimating = false;
    
    // Stop message logging if active
    if (messageLogActive) {
        stopMessageLog();
    }
    
    console.log('✅ Forward pass complete - buttons should be enabled:', {
        forwardBtn: !document.getElementById('forwardBtn').disabled,
        fullDemoBtn: !document.getElementById('fullDemoBtn').disabled,
        backwardBtn: !document.getElementById('backwardBtn').disabled
    });
}

async function runBackwardPass() {
    if (isAnimating || !demoState.forwardCompleted || !trueLabel) {
        if (!demoState.forwardCompleted) {
            updateStepInfoDual(
                "⚠️ <strong>Hold on!</strong><br>👀 First let's watch the AI think! Click 'Watch AI Think' to see how it processes the image.",
                "⚠️ <strong>Forward Pass Required</strong><br>📈 Execute forward propagation first to generate predictions for learning."
            );
        } else if (!trueLabel) {
            updateStepInfoDual(
                "⚠️ <strong>Need Your Help!</strong><br>🎯 Please tell the AI what the correct answer is by clicking 'This is a DOG' or 'This is NOT a dog' above!",
                "⚠️ <strong>Ground Truth Required</strong><br>🎯 Please provide the correct label using the teaching buttons above."
            );
        }
        return;
    }
    
    // Start message logging for detailed step-by-step view
    startMessageLog();
    
    isAnimating = true;
    document.getElementById('backwardBtn').disabled = true;
    document.getElementById('fullDemoBtn').disabled = true;
    
    await sleep(1000);
    const backpropStartTime = performance.now();
    highlightSection('backward');
    
    // Calculate target values for detailed explanations
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    const prediction = activations.output;
    const error = prediction.map((pred, i) => target[i] - pred);
    
    updateStepInfoDual(
        `📚 <strong>LEARNING TIME: Oops, Let's Learn from This!</strong><br>
        🎯 <strong>The correct answer:</strong> "${trueLabel === 'dog' ? 'DOG' : 'NOT DOG'}"<br>
        🤖 <strong>What the AI guessed:</strong> "${prediction[0] > prediction[1] ? 'DOG' : 'NOT DOG'}"<br>
        <br>${prediction[0] > prediction[1] && trueLabel === 'dog' || prediction[0] <= prediction[1] && trueLabel !== 'dog' ? 
          '✅ <strong>Great job!</strong> The AI got it right! Now let\'s help it become even more confident...' : 
          '😅 <strong>Learning opportunity!</strong> Everyone makes mistakes - that\'s how we learn!'}<br>
        🎓 Time to teach our AI to be smarter! Let\'s adjust its brain connections...`,
        `📚 <strong>Backpropagation Started</strong><br>
         🎯 <strong>Step 1: Error Calculation</strong><br>
         Target: [${target.join(', ')}] (${trueLabel === 'dog' ? 'Dog' : 'Not Dog'})<br>
         Predicted: [${prediction.map(p => p.toFixed(3)).join(', ')}]<br>
         Error: [${error.map(e => e.toFixed(3)).join(', ')}]<br>
         📊 Loss Function: L = ½Σ(target - predicted)²<br>
         Current Loss: <strong>${(0.5 * error.reduce((sum, e) => sum + e*e, 0)).toFixed(4)}</strong>`
    );
    
    await sleep(2000);
    
    updateStepInfoDual(
        `🔍 <strong>STEP 1: Detective Work - What Needs Fixing?</strong><br>
        💡 The AI examines its two answer brain cells like a detective solving a case:<br>
        • 🐕 <strong>"Dog" brain cell:</strong> ${error[0] > 0 ? 'needs to be STRONGER 💪 (wasn\'t confident enough!)' : error[0] < 0 ? 'was too EXCITED 😅 (too sure it was a dog!)' : 'was PERFECT ✅'}<br>
        • ❌ <strong>"Not Dog" brain cell:</strong> ${error[1] > 0 ? 'needs to be STRONGER 💪 (should have spoken up more!)' : error[1] < 0 ? 'was too LOUD 😅 (too sure it wasn\'t a dog!)' : 'was PERFECT ✅'}<br>
        📏 <strong>Mistake size:</strong> ${Math.abs(error[0]).toFixed(2)} (0 = perfect, bigger = more confused)<br>
        🎯 Now our AI knows exactly what to improve!`,
        `🧮 <strong>Step 2: Output Layer Gradients</strong><br>
         ${formatOperation("Output Error Gradient", "δₒ = (target - output) ⊙ σ'(zₒ)", 
           `[${error.map(e => e.toFixed(3)).join(', ')}]`,
           `For softmax: δₒ[i] = target[i] - softmax(zₒ)[i]`)}
         🔢 These gradients tell us how much each output neuron contributed to the error`
    );
    
    await sleep(2000);
    
    // Calculate actual hidden gradients for expert view
    const hiddenGradients = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let gradient = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            gradient += weights.hiddenToOutput[o][h] * error[o];
        }
        // Apply activation derivative (for leaky ReLU or current activation function)
        const activationDerivative = activations.hidden[h] > 0 ? 1 : expertConfig.leakyReLUAlpha;
        hiddenGradients[h] = gradient * activationDerivative;
    }
    
    updateStepInfoDual(
        `🔍 <strong>STEP 2: Following the Clues Backwards</strong><br>
        🕵️‍♀️ The AI becomes a detective: "Which brain cells led me astray?" Let's investigate:<br>
        • 🧠 Brain Cell 1: ${Math.abs(hiddenGradients[0]) > 0.1 ? '🚨 Major suspect! (big influence on mistake)' : '😅 Minor role (small influence)'}<br>
        • 🧠 Brain Cell 2: ${Math.abs(hiddenGradients[1]) > 0.1 ? '🚨 Major suspect! (big influence on mistake)' : '😅 Minor role (small influence)'}<br>
        • 🧠 Brain Cell 3: ${Math.abs(hiddenGradients[2]) > 0.1 ? '🚨 Major suspect! (big influence on mistake)' : '😅 Minor role (small influence)'}<br>
        • 🧠 Brain Cell 4: ${Math.abs(hiddenGradients[3]) > 0.1 ? '🚨 Major suspect! (big influence on mistake)' : '😅 Minor role (small influence)'}<br>
        🍞 <em>Like following a trail of breadcrumbs, we're tracing the mistake back to its source!</em>`,
        `⚡ <strong>Step 3: Hidden Layer Gradients (Chain Rule)</strong><br>
         ${formatOperation("Hidden Error Gradient", "δₕ = (W₂ᵀ × δₒ) ⊙ σ'(zₕ)", 
           `[${hiddenGradients.map(g => g.toFixed(3)).join(', ')}]`,
           `Chain rule: δₕ[j] = Σᵢ(W₂[i,j] × δₒ[i]) × σ'(zₕ[j])<br>Using ${expertConfig.hiddenActivation} activation derivative`)}
         🔗 This propagates the error backwards through the network using the chain rule of calculus<br>
         📐 Each hidden gradient shows how much that neuron contributed to the final error`
    );
    
    await sleep(2000);
    
    updateStepInfoDual(
        `🎓 <strong>STEP 3: The AI Studies and Improves!</strong><br>
        🏭 Time for the AI to update its brain! Like a student reviewing their notes after a test:<br>
        • 📉 <strong>Bad connections</strong> → Turn down the volume (make weaker) 🔇<br>
        • 📈 <strong>Helpful connections</strong> → Turn up the volume (make stronger) 🔊<br>
        • 🏃‍♀️ <strong>Learning speed:</strong> ${(expertConfig.learningRate * 100).toFixed(0)}% (how fast it learns from mistakes)<br>
        💭 <em>"Next time I see something like this, I'll remember this lesson!"</em><br>
        🏆 <strong>Result:</strong> Our AI just got a little bit smarter!`,
        `🔧 <strong>Step 4: Weight Updates (Gradient Descent)</strong><br>
         ${formatOperation("Weight Update Rule", "W_new = W_old + η × δ × activation", 
           `Learning Rate η = ${expertConfig.learningRate}`,
           `Hidden→Output: ΔW₂[i,j] = η × δₒ[i] × h[j]<br>Input→Hidden: ΔW₁[j,k] = η × δₕ[j] × x[k]`)}
         📈 Positive gradients increase weights, negative gradients decrease them<br>
         🎯 This minimizes the error function using gradient descent optimization`
    );
    
    await animateBackpropagation();
    
    performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
    performanceMetrics.epochCount++;
    performanceMetrics.weightUpdates += (networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize);
    
    updateStepInfoDual(
        "🎉 <strong>Graduation Day!</strong><br>🎓 Our AI just finished its lesson and updated its brain connections! It's now a little bit smarter than before.<br><br>🔁 <strong>Try it again!</strong> Click 'Watch AI Think' to see how much better it got at recognizing dogs!",
        `🎓 <strong>Learning Complete!</strong><br>
         ⏱️ Study time: ${performanceMetrics.backpropTime}ms<br>
         📝 Brain connections updated: ${(networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize)} total<br>
         📊 Mistake size: ${(0.5 * error.reduce((sum, e) => sum + e*e, 0)).toFixed(4)} (smaller is better!)<br>
         🧠 The AI's improved brain connections:<br>
         ${formatMatrix(weights.inputToHidden, 'W₁ (Input→Hidden) - After Update')}<br>
         ${formatMatrix(weights.hiddenToOutput, 'W₂ (Hidden→Output) - After Update')}<br>
         🎯 <strong>Mathematical Summary:</strong> Used gradient descent to minimize loss function L(W) by computing ∇L and updating weights via W := W - η∇L<br>
         📚 <strong>Backpropagation Algorithm:</strong><br>
         &nbsp;&nbsp;1️⃣ Compute loss: L = ½||target - predicted||²<br>
         &nbsp;&nbsp;2️⃣ Calculate output gradients: δₒ = ∂L/∂output<br>
         &nbsp;&nbsp;3️⃣ Propagate gradients backwards: δₕ = (W₂ᵀδₒ) ⊙ σ'(zₕ)<br>
         &nbsp;&nbsp;4️⃣ Update weights: W := W + η(δ ⊗ activations)<br>
         &nbsp;&nbsp;5️⃣ Repeat until convergence ✨`
    );
    
    // Keep weight values visible after training
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    // Make weight changes visible immediately
    refreshAllConnectionVisuals();
    
    // Reset state to allow another forward pass
    demoState.forwardCompleted = false;
    demoState.hasResults = false;
    document.getElementById('backwardBtn').disabled = true;
    
    highlightSection('none');
    document.getElementById('fullDemoBtn').disabled = false;
    isAnimating = false;
    
    // Stop message logging if active
    if (messageLogActive) {
        stopMessageLog();
    }
    
    // Update prediction column after forward pass completes
    updatePrediction();
}

function highlightSection(phase) {
    // Remove any existing highlights
    document.querySelectorAll('.layer-highlight').forEach(el => {
        el.classList.remove('layer-highlight');
    });
    
    if (phase === 'forward') {
        // Subtle highlighting for forward pass
        document.body.style.setProperty('--current-phase', '"Forward Pass"');
    } else if (phase === 'backward') {
        // Subtle highlighting for backward pass
        document.body.style.setProperty('--current-phase', '"Backward Pass"');
    } else {
        document.body.style.setProperty('--current-phase', '""');
    }
}

// Helper function to animate weight updates for variable layer networks
async function animateWeightUpdatesVariable(backpropResult, needsMagic, adaptiveLearningRate, target, outputErrors) {
    const layers = backpropResult.layers || [];
    const weightUpdates = backpropResult.weightUpdates || [];
    
    // Animate weight updates for each layer transition
    for (let layerIndex = 0; layerIndex < weightUpdates.length; layerIndex++) {
        const fromLayer = layers[layerIndex];
        const toLayer = layers[layerIndex + 1];
        const layerWeightUpdates = weightUpdates[layerIndex];
        
        if (!layerWeightUpdates || !fromLayer || !toLayer) continue;
        
        // Animate each connection in this layer
        for (let toNeuron = 0; toNeuron < toLayer.size; toNeuron++) {
            for (let fromNeuron = 0; fromNeuron < fromLayer.size; fromNeuron++) {
                const connectionId = generateConnectionIdForAnimation(fromLayer, fromNeuron, toLayer, toNeuron, layerIndex);
                const connection = document.getElementById(connectionId);
                
                if (connection) {
                    connection.classList.add('backward-pass');
                    
                    // Get the weight update amount
                    const weightUpdate = layerWeightUpdates[toNeuron] ? layerWeightUpdates[toNeuron][fromNeuron] : 0;
                    
                    // Color code the connection based on update
                    if (Math.abs(weightUpdate) > 0.01) {
                        connection.classList.add(weightUpdate > 0 ? 'weight-positive' : 'weight-negative');
                    }
                    
                    await sleep(200);
                    connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
                }
            }
        }
        
        // Delay between layers
        await sleep(300);
    }
}

// Legacy backpropagation animation fallback
async function animateBackpropagationLegacy() {
    console.log('🔙 Using legacy backpropagation animation');
    
    if (!trueLabel) return;
    
    // Determine target values
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
    // Calculate output layer error (simplified cross-entropy derivative)
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = target[o] - activations.output[o];
    }
    
    // Update output to hidden weights
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (connection) {
                connection.classList.add('backward-pass');
                
                const weightUpdate = networkConfig.learningRate * outputErrors[o] * activations.hidden[h];
                weights.hiddenToOutput[o][h] += weightUpdate;
                
                if (connection) {
                    applyWeightVisualization(connection, weights.hiddenToOutput[o][h]);
                }
                
                await sleep(300);
                connection.classList.remove('backward-pass');
            }
        }
    }
    
    // Calculate hidden layer errors
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        hiddenErrors[h] = error * leakyReLUDerivative(activations.hidden[h]);
    }
    
    // Update input to hidden weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (connection) {
                connection.classList.add('backward-pass');
                
                const weightUpdate = networkConfig.learningRate * hiddenErrors[h] * activations.input[i];
                weights.inputToHidden[h][i] += weightUpdate;
                
                if (connection) {
                    applyWeightVisualization(connection, weights.inputToHidden[h][i]);
                }
                
                await sleep(200);
                connection.classList.remove('backward-pass');
            }
        }
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.sleep = sleep;
if (typeof window !== 'undefined') window.startDemo = startDemo;
if (typeof window !== 'undefined') window.startFullDemo = startFullDemo;
if (typeof window !== 'undefined') window.resetDemo = resetDemo;
if (typeof window !== 'undefined') window.animateInputActivation = animateInputActivation;
if (typeof window !== 'undefined') window.animateForwardPropagation = animateForwardPropagation;
if (typeof window !== 'undefined') window.animateOutputComputation = animateOutputComputation;
if (typeof window !== 'undefined') window.animateBackpropagation = animateBackpropagation;
if (typeof window !== 'undefined') window.displayResult = displayResult;
if (typeof window !== 'undefined') window.runForwardPass = runForwardPass;
if (typeof window !== 'undefined') window.runBackwardPass = runBackwardPass;
if (typeof window !== 'undefined') window.highlightSection = highlightSection;
