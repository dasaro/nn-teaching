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

if (typeof window !== 'undefined') window.animateBackpropagation = animateBackpropagation;