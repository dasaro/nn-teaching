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

if (typeof window !== 'undefined') window.runForwardPass = runForwardPass;