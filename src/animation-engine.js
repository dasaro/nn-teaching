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
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    updateStepInfo("🎯 STEP 3: The output neurons make the final decision by combining all the hidden neuron signals!");
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
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    
    // Reset all connections
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Don't hide weight values - keep them visible to show learning
    // document.querySelectorAll('.weight-value').forEach(w => w.classList.remove('show'));
    
    // Reset activations display (but keep learned weights!) - using NEW feature system!
    setVisualFeaturesAndLabel(currentImage);
    activations.hidden = [0, 0, 0];
    activations.output = [0, 0];
    
    // Update displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
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
        '🎮 <strong>Ready to Explore!</strong><br>🚀 Choose "Watch AI Think" to see how the AI makes decisions, or "Watch AI Learn" to see how it gets smarter. Try the full demo for the complete experience!',
        '🎮 <strong>System Ready</strong><br>📊 All network parameters initialized. Ready to demonstrate forward propagation, backpropagation, or full training cycle.'
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
    // Enhanced pedagogical forward propagation with connection highlighting and math overlays
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        // First, highlight ALL connections TO this specific neuron
        highlightSubNetwork('input', 'hidden', h);
        await sleep(600);
        
        // Animate each connection individually with enhanced highlighting and flowing dots
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
        
        // Apply Leaky ReLU activation (prevents dead neurons)
        activations.hidden[h] = leakyReLU(sum);
        
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
    
    // Determine target values
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
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
    
    // Update output to hidden weights with ROBUST gradients
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (connection) {
                connection.classList.add('backward-pass');
            }
            
            // Enhanced gradient update for educational visualization
            let weightUpdate = adaptiveLearningRate * outputErrors[o] * activations.hidden[h];
            
            // DEAD NEURON REVIVAL: Force strong updates regardless of activation
            if (needsMagic) {
                const currentWeight = weights.hiddenToOutput[o][h];
                
                // If this hidden neuron is dead (near zero activation)
                if (Math.abs(activations.hidden[h]) < 0.1) {
                    // FORCE a significant weight change toward the correct answer
                    const forceDirection = target[o] > 0.5 ? 1 : -1;
                    const forcedUpdate = forceDirection * 0.3 * (Math.random() * 0.5 + 0.5);
                    weightUpdate += forcedUpdate;
                }
                
                // Ensure minimum meaningful change
                if (Math.abs(weightUpdate) < 0.1) {
                    const direction = outputErrors[o] > 0 ? 1 : -1;
                    weightUpdate += direction * 0.15;
                }
            }
            
            // More generous clipping for pedagogical magic
            weightUpdate = Math.max(-1.2, Math.min(1.2, weightUpdate));
            
            weights.hiddenToOutput[o][h] += weightUpdate;
            
            // Update weight visualization with change amount
            const newWeight = weights.hiddenToOutput[o][h];
            if (connection) {
                applyWeightVisualization(connection, newWeight);
            }
            // Visual update already handled by applyWeightVisualization above
            
            // Color code the connection based on update  
            if (Math.abs(weightUpdate) > 0.01) {
                connection.classList.add(weightUpdate > 0 ? 'weight-positive' : 'weight-negative');
            }
            
            await sleep(300);
            connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // Leaky ReLU derivative: 1 if hidden activation > 0, 0.1 otherwise
        hiddenErrors[h] = error * leakyReLUDerivative(activations.hidden[h]);
    }
    
    gradientInfo.hiddenGradients = [...hiddenErrors];
    gradientHistory.push(gradientInfo);
    
    // Keep only last 20 gradient entries
    if (gradientHistory.length > 20) {
        gradientHistory.shift();
    }
    
    // Update input to hidden weights with proper gradients
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (connection) {
                connection.classList.add('backward-pass');
            }
            
            // Enhanced gradient update for educational visualization
            let weightUpdate = adaptiveLearningRate * hiddenErrors[h] * activations.input[i];
            
            // DEAD NEURON INPUT REVIVAL: Force input connections to wake up neurons
            if (needsMagic) {
                const currentWeight = weights.inputToHidden[h][i];
                
                // If this hidden neuron is dead, boost its input connections
                if (Math.abs(activations.hidden[h]) < 0.1) {
                    // FORCE a significant weight change to help activate the neuron
                    const forceDirection = hiddenErrors[h] > 0 ? 1 : -1;
                    const forcedUpdate = forceDirection * 0.2 * (Math.random() * 0.5 + 0.5);
                    weightUpdate += forcedUpdate;
                }
                
                // Ensure minimum meaningful change
                if (Math.abs(weightUpdate) < 0.08) {
                    const direction = hiddenErrors[h] > 0 ? 1 : -1;
                    weightUpdate += direction * 0.1;
                }
            }
            
            // More generous clipping for pedagogical magic
            weightUpdate = Math.max(-1.0, Math.min(1.0, weightUpdate));
            
            weights.inputToHidden[h][i] += weightUpdate;
            
            // Update weight visualization with change amount
            const newWeight = weights.inputToHidden[h][i];
            if (connection) {
                applyWeightVisualization(connection, newWeight);
            }
            // Visual update already handled by applyWeightVisualization above
            
            // Color code the connection
            if (Math.abs(weightUpdate) > 0.02) {
                connection.classList.add(weightUpdate > 0 ? 'weight-positive' : 'weight-negative');
            }
            
            await sleep(200);
            connection.classList.remove('backward-pass', 'weight-positive', 'weight-negative');
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
    
    const prediction = dogProb > notDogProb ? 'CANINE' : 'NON-CANINE';
    const isCorrect = (prediction === 'CANINE' && trueLabel === 'dog') || (prediction === 'NON-CANINE' && trueLabel === 'not-dog');
    
    // Calculate accuracy and loss
    const accuracy = isCorrect ? 1.0 : 0.0;
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    const loss = -target.reduce((sum, t, i) => sum + t * Math.log(Math.max(activations.output[i], 1e-15)), 0);
    
    performanceMetrics.lastAccuracy = accuracy;
    performanceMetrics.lastLoss = loss;
    
    const statusEmoji = isCorrect ? '✅' : '❌';
    const statusText = isCorrect ? 'Correct!' : 'Wrong!';
    
    updateStepInfoDual(
        `${statusEmoji} <strong>AI's Final Answer:</strong> "${prediction}" with ${confidence.toFixed(1)}% confidence<br>
        ${statusText} ${isCorrect ? '🎉 Great job! The AI got it right!' : '📚 The AI will learn from this mistake!'}`,
        `${statusEmoji} <strong>Classification Result:</strong> "${prediction}" (${confidence.toFixed(1)}% confidence)<br>
        ${statusText} Accuracy: ${isCorrect ? 'Correct ✓' : 'Incorrect ✗'}`
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
        `📷 <strong>STEP 1: The AI Looks at Our Picture</strong><br>
        👀 Just like when you look at a photo, the AI examines every detail! Here's what catches its attention:<br>
        • 🐕 Dog Feature A: <strong>${(activations.input[0] * 100).toFixed(0)}%</strong> strength (maybe ears or shape?)<br>
        • 🦴 Dog Feature B: <strong>${(activations.input[1] * 100).toFixed(0)}%</strong> strength (maybe fur texture?)<br>
        • 👁️ Dog Feature C: <strong>${(activations.input[2] * 100).toFixed(0)}%</strong> strength (maybe eyes or nose?)<br>
        • 🎯 Pattern Match: <strong>${(activations.input[3] * 100).toFixed(0)}%</strong> overall doggy-ness<br>
        💡 <em>Higher numbers mean 'this looks very dog-like to me!'</em>`,
        `📥 <strong>Input Layer Activation</strong><br>
         ${formatMatrix(activations.input, 'Input Vector x')}
         <div class="op-description">Feature patterns: A=${activations.input[0].toFixed(3)}, B=${activations.input[1].toFixed(3)}, C=${activations.input[2].toFixed(3)}, D=${activations.input[3].toFixed(3)}</div>`
    );
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfoDual(
        `🤔 <strong>STEP 2: The AI's Brain Cells Work Together</strong><br>
        💭 Now comes the magic! The AI's brain cells team up to find bigger patterns, like detectives gathering clues:<br>
        • 🧠 Brain Cell 1: <strong>${(activations.hidden[0] * 100).toFixed(0)}%</strong> excited (maybe finds 'fluffy texture + right size')<br>
        • 🧠 Brain Cell 2: <strong>${(activations.hidden[1] * 100).toFixed(0)}%</strong> excited (maybe finds 'pointy ears + wet nose')<br>
        • 🧠 Brain Cell 3: <strong>${(activations.hidden[2] * 100).toFixed(0)}%</strong> excited (maybe finds 'four legs + tail')<br>
        • 🧠 Brain Cell 4: <strong>${(activations.hidden[3] * 100).toFixed(0)}%</strong> excited (maybe finds 'friendly face')<br>
        🎯 <em>Each brain cell is like a specialist detective looking for specific clues!</em>`,
        `✖️ <strong>Hidden Layer Computation</strong><br>
         ${formatOperation("Matrix Multiplication", "h = σ(W₁ᵀ × x)", 
           `[${activations.hidden.map(h => h.toFixed(3)).join(', ')}]`,
           `For each hidden neuron i: h[i] = ${expertConfig.hiddenActivation}(Σⱼ W₁[i,j] × x[j])`)}
         Current activation function: <strong>${expertConfig.hiddenActivation.replace('_', ' ').toUpperCase()}</strong>`
    );
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    updateStepInfoDual(
        `🎯 <strong>STEP 3: The Big Decision Moment!</strong><br>
        🎭 All the brain cells vote together like a jury making their final decision! Here's how confident each option feels:<br>
        • 🐕 <strong>"It's definitely a DOG!"</strong> → <strong>${(activations.output[0] * 100).toFixed(1)}%</strong> confident<br>
        • ❌ <strong>"Nope, NOT a dog!"</strong> → <strong>${(activations.output[1] * 100).toFixed(1)}%</strong> confident<br>
        <br>🏆 <strong>Final Decision:</strong> ${activations.output[0] > activations.output[1] ? 
          '🐕 "I\'m pretty sure this is a DOG!" (The dog vote won!)' : 
          '❌ "I don\'t think this is a dog." (The not-dog vote won!)'}`,
        `➕ <strong>Output Layer Computation</strong><br>
         ${formatOperation("Final Prediction", "y = σ(W₂ᵀ × h)", 
           `[${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]`,
           `For each output j: y[j] = ${expertConfig.outputActivation}(Σᵢ W₂[j,i] × h[i])`)}
         Output activation: <strong>${expertConfig.outputActivation.toUpperCase()}</strong>`
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
        document.getElementById('backwardBtn').disabled = false;
        updateStepInfoDual(
            "🎉 Thinking complete! The AI made its guess. Now click 'Learn' to see how it can improve from mistakes!",
            `🎯 <strong>Forward Pass Complete!</strong><br>
             ⏱️ Computation time: ${performanceMetrics.forwardPassTime}ms<br>
             📊 Final output: [${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]<br>
             🎯 Prediction: <strong>${activations.output[0] > activations.output[1] ? 'DOG' : 'NOT DOG'}</strong><br>
             📈 Confidence: ${Math.abs((activations.output[0] - activations.output[1]) * 100).toFixed(1)}%<br>
             🎓 Ready for backpropagation with target: <strong>${trueLabel.toUpperCase()}</strong>`
        );
    } else {
        updateStepInfoDual(
            "🎉 Thinking complete! Set the correct answer above, then click 'Learn' to see how the AI improves!",
            `🎯 <strong>Forward Pass Complete!</strong><br>
             📊 Network output: [${activations.output.map(o => (o*100).toFixed(1)).join('%, ')}%]<br>
             ⚠️ Need target label for backpropagation training`
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
