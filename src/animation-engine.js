// ============================================================================
// ANIMATION-ENGINE MODULE
// Animation and demo coordination functions
// ============================================================================

// Safe wrappers for UI functions that may not be loaded yet
function safeUpdateStepInfo(message) {
    if (typeof updateStepInfo !== 'undefined') {
        safeUpdateStepInfo(message);
    }
}

function safeUpdateStepInfoDual(leftMessage, rightMessage) {
    if (typeof updateStepInfoDual !== 'undefined') {
        updateStepInfoDual(leftMessage, rightMessage);
    }
}

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
    
    safeUpdateStepInfo("🚀 Let's watch how the AI brain processes this image step by step!");
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    const forwardStartTime = performance.now();
    safeUpdateStepInfo("📥 STEP 1: Converting the image into numbers the AI can understand. Each feature gets a score from 0 to 1.");
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    safeUpdateStepInfo("🧠 STEP 2: The hidden neurons are doing math! Each one multiplies input numbers by its connection weights, then adds them up.");
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    safeUpdateStepInfo("🎯 STEP 3: The output neurons make the final decision by combining all the hidden neuron signals!");
    await animateOutputComputation();
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Step 5: Backpropagation if true label is set
    console.log("Checking backpropagation condition: trueLabel =", trueLabel);
    if (trueLabel) {
        await sleep(2000);
        const backpropStartTime = performance.now();
        highlightSection('backward');
        safeUpdateStepInfoDual(
            "📚 <strong>STEP 4: Learning Time!</strong><br>🎓 Just like when you study for a test, the AI looks at its mistake and figures out how to do better next time. It's like having a really patient teacher help it learn!",
            "📚 <strong>STEP 4: Backpropagation Learning Phase</strong><br>🔄 Computing gradients and updating weights based on classification error."
        );
        await animateBackpropagation();
        
        performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
        performanceMetrics.epochCount++;
        const arch = NetworkAPI.getArchitecture();
        const stats = NetworkAPI.getStats();
        performanceMetrics.weightUpdates += stats.totalWeights;
        
        safeUpdateStepInfo("🎉 Learning complete! The AI has updated its 'memory' (connection weights) and should be smarter now. Try running it again!");
        
        // Keep weight values visible after training
        document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
        
        // Make weight changes visible immediately
        refreshAllConnectionVisuals();
    } else {
        safeUpdateStepInfo("💡 Tip: Select the correct answer above to see how the AI learns from its mistakes!");
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
    if (window.buttonStateManager) {
        window.buttonStateManager.resetAll();
    } else {
        document.getElementById('forwardBtn').disabled = false;
        document.getElementById('fullDemoBtn').disabled = false;
        document.getElementById('backwardBtn').disabled = true;
    }
    
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
    
    safeUpdateStepInfoDual(
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
        value.textContent = (activations.input && activations.input[i] !== undefined) ? activations.input[i].toFixed(2) : '0.00';
        
        await sleep(300);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
    }
    
    // Update visual properties based on activations
    updateNeuronColors();
}

async function animateForwardPropagation() {
    const arch = NetworkAPI.getArchitecture();
    
    if (arch.hiddenLayers.length === 0) {
        // No hidden layers: animate direct input to output
        safeUpdateStepInfo("⚡ STEP 2: Direct connection! Input goes straight to output neurons (no hidden layers).");
        await animateDirectPropagation();
        return;
    }
    
    // Animate through each hidden layer
    for (let layerIndex = 0; layerIndex < arch.hiddenLayers.length; layerIndex++) {
        const layerSize = arch.hiddenLayers[layerIndex];
        const isFirstLayer = layerIndex === 0;
        const layerName = arch.hiddenLayers.length === 1 ? "hidden" : `hidden layer ${layerIndex + 1}`;
        
        safeUpdateStepInfo(`🧠 Processing ${layerName}: ${layerSize} neurons computing weighted sums...`);
        
        for (let neuronIndex = 0; neuronIndex < layerSize; neuronIndex++) {
            // Highlight connections to this neuron
            if (isFirstLayer) {
                highlightSubNetwork('input', 'hidden', neuronIndex);
            }
            await sleep(600);
            
            // Animate each incoming connection
            if (isFirstLayer) {
                // Input to first hidden layer
                for (let i = 0; i < arch.inputSize; i++) {
                    const connectionId = `conn-input-${i}-hidden-0-${neuronIndex}`;
                    const connection = document.getElementById(connectionId);
                    if (connection) {
                        connection.classList.add('forward-pass');
                        
                        createFlowingDots(
                            positions.input[i].x, positions.input[i].y,
                            positions.hiddenLayers[0][neuronIndex].x, positions.hiddenLayers[0][neuronIndex].y,
                            connectionId, 600
                        );
                        
                        await sleep(200);
                        connection.classList.remove('forward-pass');
                    }
                }
            } else {
                // Hidden layer to hidden layer
                const prevLayerSize = arch.hiddenLayers[layerIndex - 1];
                for (let prevNeuron = 0; prevNeuron < prevLayerSize; prevNeuron++) {
                    const connectionId = `conn-hidden-${layerIndex - 1}-${prevNeuron}-hidden-${layerIndex}-${neuronIndex}`;
                    const connection = document.getElementById(connectionId);
                    if (connection) {
                        connection.classList.add('forward-pass');
                        
                        createFlowingDots(
                            positions.hiddenLayers[layerIndex - 1][prevNeuron].x, positions.hiddenLayers[layerIndex - 1][prevNeuron].y,
                            positions.hiddenLayers[layerIndex][neuronIndex].x, positions.hiddenLayers[layerIndex][neuronIndex].y,
                            connectionId, 600
                        );
                        
                        await sleep(200);
                        connection.classList.remove('forward-pass');
                    }
                }
            }
            
            await sleep(500);
            
            // Update neuron appearance
            const neuronId = `hidden-${layerIndex}-neuron-${neuronIndex}`;
            const valueId = `hidden-${layerIndex}-value-${neuronIndex}`;
            const neuron = document.getElementById(neuronId);
            const value = document.getElementById(valueId);
            
            if (neuron && value) {
                neuron.classList.add('forward-active');
                const layerActivations = NetworkAPI.getLayerActivations(layerIndex);
                const activation = layerActivations && layerActivations[neuronIndex];
                value.textContent = (activation !== undefined) ? activation.toFixed(2) : '0.00';
                
                await sleep(200);
                neuron.classList.remove('forward-active');
                neuron.classList.add('active');
            }
            
            updateNeuronColors();
            clearSubNetworkHighlights();
            await sleep(400);
        }
    }
}

async function animateDirectPropagation() {
    // Animate direct input to output connections (no hidden layers)
    const arch = NetworkAPI.getArchitecture();
    
    for (let o = 0; o < arch.outputSize; o++) {
        const outputName = o === 0 ? 'DOG' : 'NOT-DOG';
        
        for (let i = 0; i < arch.inputSize; i++) {
            const connectionId = `conn-input-${i}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                connection.classList.add('forward-pass');
                
                createFlowingDots(
                    positions.input[i].x, positions.input[i].y,
                    positions.output[o].x, positions.output[o].y,
                    connectionId, 600
                );
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        
        await sleep(500);
        
        // Update output neuron
        const neuron = document.getElementById(`output-neuron-${o}`);
        const value = document.getElementById(`output-value-${o}`);
        if (neuron && value) {
            neuron.classList.add('forward-active');
            const outputActivations = NetworkAPI.getLayerActivations('output');
            const activation = outputActivations && outputActivations[o];
            value.textContent = (activation !== undefined) ? activation.toFixed(2) : '0.00';
            
            await sleep(200);
            neuron.classList.remove('forward-active');
            neuron.classList.add('active');
        }
        
        updateNeuronColors();
        await sleep(400);
    }
}

async function animateOutputComputation() {
    const arch = NetworkAPI.getArchitecture();
    
    if (arch.hiddenLayers.length === 0) {
        // Direct input to output was already animated in forward propagation
        safeUpdateStepInfo("🎯 STEP 3: Computing final predictions from direct input connections!");
        await sleep(1000);
        return;
    }
    
    // Animate connections from last hidden layer to output
    const lastHiddenIndex = arch.hiddenLayers.length - 1;
    const lastHiddenSize = arch.hiddenLayers[lastHiddenIndex];
    
    for (let o = 0; o < arch.outputSize; o++) {
        const outputName = o === 0 ? 'DOG' : 'NOT-DOG';
        
        // Highlight connections to this output neuron
        highlightSubNetwork('hidden', 'output', o);
        await sleep(600);
        
        // Animate each connection from last hidden layer
        for (let h = 0; h < lastHiddenSize; h++) {
            const connectionId = `conn-hidden-${lastHiddenIndex}-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                connection.classList.add('forward-pass');
                
                createFlowingDots(
                    positions.hiddenLayers[lastHiddenIndex][h].x, positions.hiddenLayers[lastHiddenIndex][h].y,
                    positions.output[o].x, positions.output[o].y,
                    connectionId, 600
                );
                
                await sleep(200);
                connection.classList.remove('forward-pass');
            }
        }
        
        await sleep(400);
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
            value.textContent = (activations.output && activations.output[o] !== undefined) ? activations.output[o].toFixed(2) : '0.00';
            
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
    
    const arch = NetworkAPI.getArchitecture();
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
    // Calculate output layer error (simplified cross-entropy derivative)
    const outputErrors = [];
    for (let o = 0; o < arch.outputSize; o++) {
        outputErrors[o] = target[o] - NetworkAPI.getLayerActivations('output')[o];
    }
    
    // Educational enhancement: Ensure visible learning even with weak neurons
    const maxError = Math.max(...outputErrors.map(Math.abs));
    const prediction = NetworkAPI.getLayerActivations('output')[0] / (NetworkAPI.getLayerActivations('output')[0] + NetworkAPI.getLayerActivations('output')[1]);
    const isNearFiftyFifty = Math.abs(prediction - 0.5) < 0.15;
    const hasSmallGradients = maxError < 0.3;
    
    // Check for dead/dying neurons across all hidden layers
    let deadNeuronCount = 0;
    for (let layerIndex = 0; layerIndex < arch.hiddenLayers.length; layerIndex++) {
        const layerActivations = NetworkAPI.getLayerActivations(layerIndex);
        deadNeuronCount += layerActivations.filter(h => Math.abs(h) < 0.1).length;
    }
    const hasDeadNeurons = deadNeuronCount > 0;
    
    // Determine learning enhancement
    let adaptiveLearningRate = NetworkAPI.getConfig().learningRate;
    let needsMagic = false;
    
    if (isNearFiftyFifty || hasSmallGradients || hasDeadNeurons) {
        adaptiveLearningRate = NetworkAPI.getConfig().learningRate * 5.0;
        needsMagic = true;
        
        if (hasDeadNeurons && isNearFiftyFifty) {
            safeUpdateStepInfoDual(
                `🎢 <strong>STEP 4: AI Learning Boost!</strong><br>
                🎲 The AI is confused (guessing 50/50) AND some brain cells are "asleep"<br>
                🔋 We're boosting its learning power to wake up those sleepy neurons!<br>
                💡 Think of it like turning up the brightness on a dim lightbulb!`,
                `⚡ <strong>BOOST MODE:</strong> Weak neurons detected with confused prediction. Amplifying learning signal for breakthrough training!`
            );
        } else if (hasDeadNeurons) {
            safeUpdateStepInfoDual(
                `😴 <strong>STEP 4: Wake Up Sleepy Brain Cells!</strong><br>
                💤 Some brain cells are "asleep" (giving weak signals)<br>
                🔔 We're giving them a gentle nudge to participate more!<br>
                🌟 Like encouraging a quiet student to speak up in class!`,
                `🔥 NEURON REVIVAL! Some neurons are 'sleeping' - waking them up with extra learning power!`
            );
        } else if (isNearFiftyFifty) {
            safeUpdateStepInfoDual(
                `🤔 <strong>STEP 4: Breaking the Confusion!</strong><br>
                🎯 The AI can't decide (50/50 between dog/not-dog)<br>
                🎪 We're giving it a helpful push toward the right answer!<br>
                🧭 Like pointing a lost person in the right direction!`,
                `🚀 CONFUSION BREAKER! 50/50 prediction detected - using teaching magic to push the AI toward a decision!`
            );
        } else {
            safeUpdateStepInfoDual(
                `🔊 <strong>Turning Up the Learning Volume!</strong><br>
                📻 The AI's learning whispers are too quiet to hear clearly<br>
                🎚️ We're cranking up the volume so it can learn better!<br>
                🎧 It's like turning up your headphones when the music is too soft to enjoy!`,
                `💪 <strong>LEARNING BOOST:</strong> Weak learning signals detected - amplifying for better training!`
            );
        }
    } else {
        safeUpdateStepInfoDual(
            `🕵️ <strong>Learning Detective Work!</strong><br>
            🔍 The AI works backwards like a detective solving a case<br>
            🤔 For each connection it asks: "Did you help me get the right answer or not?"<br>
            💪 Helpful connections get stronger, unhelpful ones get weaker - just like building muscle by practicing!`,
            `🔄 Standard backpropagation: Computing gradients through chain rule to update weights based on error contribution.`
        );
    }
    
    if (arch.hiddenLayers.length === 0) {
        // Direct input to output backpropagation
        await animateDirectBackpropagation(outputErrors, target, adaptiveLearningRate, needsMagic);
    } else {
        // Multi-layer backpropagation
        await animateLayeredBackpropagation(outputErrors, target, adaptiveLearningRate, needsMagic);
    }
}

async function animateDirectBackpropagation(outputErrors, target, adaptiveLearningRate, needsMagic) {
    const arch = NetworkAPI.getArchitecture();
    
    // Update input to output weights directly
    for (let o = 0; o < arch.outputSize; o++) {
        for (let i = 0; i < arch.inputSize; i++) {
            const connectionId = `conn-input-${i}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                connection.classList.add('backward-pass');
            }
            
            // Calculate weight update
            let weightUpdate = adaptiveLearningRate * outputErrors[o] * NetworkAPI.getLayerActivations('input')[i];
            
            if (needsMagic && Math.abs(weightUpdate) < 0.1) {
                const direction = outputErrors[o] > 0 ? 1 : -1;
                weightUpdate += direction * 0.15;
            }
            
            weightUpdate = clampWeight(weightUpdate, -1.2, 1.2);
            
            // Update connection appearance
            if (connection) {
                // Apply visual update through backpropagation (will call NetworkAPI internally)
                NetworkAPI.backPropagate(target);
                applyWeightVisualization(connection, NetworkAPI.getWeight(0, i, 0, o));
                
                if (Math.abs(weightUpdate) > 0.01) {
                    connection.classList.add(weightUpdate > 0 ? 'weight-positive' : 'weight-negative');
                }
            }
            
            await sleep(300);
            if (connection) {
                connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
            }
        }
    }
}

async function animateLayeredBackpropagation(outputErrors, target, adaptiveLearningRate, needsMagic) {
    const arch = NetworkAPI.getArchitecture();
    
    // Step 1: Update last hidden layer to output weights
    const lastHiddenIndex = arch.hiddenLayers.length - 1;
    const lastHiddenSize = arch.hiddenLayers[lastHiddenIndex];
    
    for (let o = 0; o < arch.outputSize; o++) {
        for (let h = 0; h < lastHiddenSize; h++) {
            const connectionId = `conn-hidden-${lastHiddenIndex}-${h}-output-${o}`;
            const connection = document.getElementById(connectionId);
            if (connection) {
                connection.classList.add('backward-pass');
            }
            
            // Enhanced gradient update for educational visualization
            const lastHiddenActivations = NetworkAPI.getLayerActivations(lastHiddenIndex);
            let weightUpdate = adaptiveLearningRate * outputErrors[o] * lastHiddenActivations[h];
            
            // Apply educational enhancements
            if (needsMagic) {
                if (Math.abs(lastHiddenActivations[h]) < 0.1) {
                    const forceDirection = target[o] > 0.5 ? 1 : -1;
                    const forcedUpdate = forceDirection * 0.3 * (Math.random() * 0.5 + 0.5);
                    weightUpdate += forcedUpdate;
                }
                
                if (Math.abs(weightUpdate) < 0.1) {
                    const direction = outputErrors[o] > 0 ? 1 : -1;
                    weightUpdate += direction * 0.15;
                }
            }
            
            weightUpdate = clampWeight(weightUpdate, -1.2, 1.2);
            
            if (connection) {
                // Trigger backpropagation update
                NetworkAPI.backPropagate(target);
                applyWeightVisualization(connection, NetworkAPI.getWeight('hidden', h, 'output', o));
                
                if (Math.abs(weightUpdate) > 0.01) {
                    connection.classList.add(weightUpdate > 0 ? 'weight-positive' : 'weight-negative');
                }
            }
            
            await sleep(300);
            if (connection) {
                connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
            }
        }
    }
    
    // Step 2: Propagate backwards through hidden layers
    for (let layerIndex = arch.hiddenLayers.length - 1; layerIndex >= 0; layerIndex--) {
        const currentLayerSize = arch.hiddenLayers[layerIndex];
        
        if (layerIndex === 0) {
            // Update input to first hidden layer
            for (let h = 0; h < currentLayerSize; h++) {
                for (let i = 0; i < arch.inputSize; i++) {
                    const connectionId = `conn-input-${i}-hidden-0-${h}`;
                    const connection = document.getElementById(connectionId);
                    if (connection) {
                        connection.classList.add('backward-pass');
                    }
                    
                    await sleep(200);
                    
                    if (connection) {
                        // Update through backpropagation
                        NetworkAPI.backPropagate(target);
                        applyWeightVisualization(connection, NetworkAPI.getWeight('input', i, 'hidden', h));
                        connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
                    }
                }
            }
        } else {
            // Update previous hidden layer to current hidden layer
            const prevLayerSize = arch.hiddenLayers[layerIndex - 1];
            for (let h = 0; h < currentLayerSize; h++) {
                for (let prevH = 0; prevH < prevLayerSize; prevH++) {
                    const connectionId = `conn-hidden-${layerIndex - 1}-${prevH}-hidden-${layerIndex}-${h}`;
                    const connection = document.getElementById(connectionId);
                    if (connection) {
                        connection.classList.add('backward-pass');
                    }
                    
                    await sleep(200);
                    
                    if (connection) {
                        // Update through backpropagation
                        NetworkAPI.backPropagate(target);
                        applyWeightVisualization(connection, NetworkAPI.getWeight(layerIndex - 1, prevH, layerIndex, h));
                        connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
                    }
                }
            }
        }
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
    
    safeUpdateStepInfoDual(
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
    
    // CRITICAL: Run forward propagation to compute activation values
    console.log("🧮 Computing forward propagation...");
    const inputValues = activations.input;
    NetworkAPI.forwardPropagate(inputValues);
    console.log("✅ Forward propagation complete, activations:", NetworkAPI.getAllActivations());
    
    safeUpdateStepInfoDual(
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
    safeUpdateStepInfoDual(
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
    safeUpdateStepInfoDual(
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
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    safeUpdateStepInfoDual(
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
    
    performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
    
    // Step 4: Show result
    await displayResult();
    
    // Update state
    demoState.forwardCompleted = true;
    demoState.hasResults = true;
    
    // Enable backward pass if we have the correct answer
    if (trueLabel) {
        if (window.buttonStateManager) {
            window.buttonStateManager.setLearnButtonState('ready');
        } else {
            document.getElementById('backwardBtn').disabled = false;
        }
        safeUpdateStepInfoDual(
            window.i18n.t('completion.thinkingDone'),
            window.i18n.t('forward.expert.result', [
                performanceMetrics.forwardPassTime,
                activations.output[0] > activations.output[1] ? window.i18n.t('prediction.dog') : window.i18n.t('prediction.notDog'),
                activations.output.map(o => (o*100).toFixed(1)).join(', ')
            ]) + `<br>📈 ${window.i18n.t('expert.confidence')} ${Math.abs((activations.output[0] - activations.output[1]) * 100).toFixed(1)}%<br>
             🎓 ${window.i18n.t('expert.readyBackprop')} <strong>${trueLabel.toUpperCase()}</strong>`
        );
    } else {
        safeUpdateStepInfoDual(
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
            safeUpdateStepInfoDual(
                "⚠️ <strong>Hold on!</strong><br>👀 First let's watch the AI think! Click 'Watch AI Think' to see how it processes the image.",
                "⚠️ <strong>Forward Pass Required</strong><br>📈 Execute forward propagation first to generate predictions for learning."
            );
        } else if (!trueLabel) {
            safeUpdateStepInfoDual(
                "⚠️ <strong>Need Your Help!</strong><br>🎯 Please tell the AI what the correct answer is by clicking 'This is a DOG' or 'This is NOT a dog' above!",
                "⚠️ <strong>Ground Truth Required</strong><br>🎯 Please provide the correct label using the teaching buttons above."
            );
        }
        return;
    }
    
    // Start message logging for detailed step-by-step view
    startMessageLog();
    
    isAnimating = true;
    
    // Use button state manager for better UX
    if (window.buttonStateManager) {
        window.buttonStateManager.setLearnButtonState('learning');
        window.buttonStateManager.setButtonState('fullDemoBtn', true);
    } else {
        document.getElementById('backwardBtn').disabled = true;
        document.getElementById('fullDemoBtn').disabled = true;
    }
    
    await sleep(1000);
    const backpropStartTime = performance.now();
    highlightSection('backward');
    
    // Calculate target values for detailed explanations
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    const prediction = activations.output;
    const error = prediction.map((pred, i) => target[i] - pred);
    
    safeUpdateStepInfoDual(
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
    
    safeUpdateStepInfoDual(
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
    
    safeUpdateStepInfoDual(
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
    
    safeUpdateStepInfoDual(
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
    const arch = NetworkAPI.getArchitecture();
        const stats = NetworkAPI.getStats();
        performanceMetrics.weightUpdates += stats.totalWeights;
    
    safeUpdateStepInfoDual(
        "🎉 <strong>Graduation Day!</strong><br>🎓 Our AI just finished its lesson and updated its brain connections! It's now a little bit smarter than before.<br><br>🔁 <strong>Try it again!</strong> Click 'Watch AI Think' to see how much better it got at recognizing dogs!",
        `🎓 <strong>Learning Complete!</strong><br>
         ⏱️ Study time: ${performanceMetrics.backpropTime}ms<br>
         📝 Brain connections updated: ${stats.totalWeights} total<br>
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
    
    highlightSection('none');
    isAnimating = false;
    
    // Use button state manager for better feedback
    if (window.buttonStateManager) {
        window.buttonStateManager.setLearnButtonState('thinking-required');
        window.buttonStateManager.setButtonState('fullDemoBtn', false);
    } else {
        document.getElementById('backwardBtn').disabled = true;
        document.getElementById('fullDemoBtn').disabled = false;
    }
    
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
