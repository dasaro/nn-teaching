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

if (typeof window !== 'undefined') window.displayResult = displayResult;