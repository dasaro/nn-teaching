function runLearningTest() {
    console.log('=== STARTING LEARNING TEST ===');
    
    // Generate simple training data
    const testCases = generateSimpleTrainingData();
    console.log(`Generated ${testCases.length} simple training examples (${testCases.filter(t => t.isDog).length} dogs, ${testCases.filter(t => !t.isDog).length} non-dogs)`);
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions (before training)
    console.log('--- BEFORE TRAINING ---');
    const initialResults = [];
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
        initialResults.push({ correct, confidence: Math.abs(dogProb - 0.5) });
    });
    
    // Simple, stable training approach
    const maxEpochs = 50;
    console.log(`--- TRAINING FOR UP TO ${maxEpochs} EPOCHS (simple approach) ---`);
    
    let epoch = 0;
    let perfectAccuracyCount = 0;
    
    while (epoch < maxEpochs && perfectAccuracyCount < 3) {
        // Simple training: one pass through all examples
        testCases.forEach(testCase => {
            forwardPropagationSilent(testCase.input);
            backpropagationSilent(testCase.target);
        });
        epoch++;
        
        // Test accuracy every epoch
        let correct = 0;
        testCases.forEach(testCase => {
            const output = forwardPropagationSilent(testCase.input);
            const dogProb = output[0];
            const isCorrect = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
            if (isCorrect) correct++;
        });
        
        const accuracy = correct / testCases.length;
        console.log(`Epoch ${epoch}: Accuracy = ${correct}/${testCases.length} (${(accuracy*100).toFixed(1)}%)`);
        
        // Early stopping if perfect accuracy achieved 3 times in a row
        if (accuracy === 1.0) {
            perfectAccuracyCount++;
            console.log(`Perfect accuracy achieved ${perfectAccuracyCount}/3 times`);
        } else {
            perfectAccuracyCount = 0;
        }
        
        // Stop if converged
        if (perfectAccuracyCount >= 3) {
            console.log(`🎉 CONVERGED! Perfect accuracy maintained for 3 epochs. Total training: ${epoch} epochs`);
            break;
        }
    }
    
    // Test final predictions (after training)
    console.log('--- AFTER TRAINING ---');
    let finalCorrect = 0;
    let totalConfidence = 0;
    
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        const confidence = Math.abs(dogProb - 0.5);
        
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'} (confidence: ${(confidence*100).toFixed(1)}%)`);
        
        if (correct) finalCorrect++;
        totalConfidence += confidence;
    });
    
    const finalAccuracy = finalCorrect / testCases.length;
    const avgConfidence = totalConfidence / testCases.length;
    
    console.log('=== LEARNING TEST RESULTS ===');
    console.log(`Final Accuracy: ${finalCorrect}/${testCases.length} (${(finalAccuracy*100).toFixed(1)}%)`);
    console.log(`Average Confidence: ${(avgConfidence*100).toFixed(1)}%`);
    console.log(`Training Epochs Used: ${epoch} epochs`);
    console.log(`Learning Success: ${finalAccuracy === 1.0 ? 'PERFECT! 🎉' : finalAccuracy >= 0.8 ? 'GOOD ✅' : 'NEEDS WORK ❌'}`);
    
    // Calculate training rounds needed for users
    const trainingRoundsNeeded = Math.ceil(epoch / 2); // Each user demo = ~2 epochs worth of training
    console.log(`📊 USER TRAINING ESTIMATE: Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times to reach 100% accuracy`);
    
    // Update UI with test results  
    updateStepInfoDual(
        `🧪 <strong>Test Results:</strong> ${(finalAccuracy*100).toFixed(1)}% accuracy after ${epoch} training rounds!<br>
        📈 <strong>Estimate:</strong> Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times for 100% accuracy!<br>
        ${finalAccuracy === 1.0 ? '🎉 PERFECT - The AI is now a pro!' : finalAccuracy >= 0.8 ? '✅ GOOD - The AI is getting smart!' : '❌ NEEDS MORE PRACTICE - Keep training!'}`,
        `🧪 <strong>Training Assessment:</strong><br>
        📊 Final Accuracy: ${(finalAccuracy*100).toFixed(1)}% (${epoch} epochs)<br>
        📈 Estimated Rounds for 100%: ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1}<br>
        🎯 Status: ${finalAccuracy === 1.0 ? 'OPTIMAL' : finalAccuracy >= 0.8 ? 'GOOD' : 'SUBOPTIMAL'}`
    );
    
    // Redraw network with updated weights
    drawNetwork();
    
    return { 
        accuracy: finalAccuracy, 
        confidence: avgConfidence, 
        epochs: epoch,
        userTrainingRounds: trainingRoundsNeeded,
        passed: finalAccuracy === 1.0 
    };
}

if (typeof window !== 'undefined') window.runLearningTest = runLearningTest;