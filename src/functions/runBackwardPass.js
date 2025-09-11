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

if (typeof window !== 'undefined') window.runBackwardPass = runBackwardPass;