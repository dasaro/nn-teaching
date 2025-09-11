function test100PercentAccuracy() {
    console.log('=== TESTING 100% ACCURACY TARGET ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split into train/validation sets
    const splitIdx = Math.floor(trainingData.length * 0.8);
    const trainSet = trainingData.slice(0, splitIdx);
    const validSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, validating on ${validSet.length} examples`);
    
    // Train with advanced techniques
    let epoch = 0;
    let bestAccuracy = 0;
    let perfectEpochs = 0;
    const maxEpochs = 200;
    
    while (epoch < maxEpochs && perfectEpochs < 10) {
        // Curriculum learning with increasing difficulty
        const curriculumSize = Math.min(20 + epoch * 2, trainSet.length);
        const currentSet = trainSet.slice(0, curriculumSize);
        
        // Adaptive learning rate
        networkConfig.learningRate = Math.max(0.01, 0.3 * Math.exp(-epoch * 0.015));
        
        // Multiple passes per epoch
        const passes = epoch < 50 ? 8 : epoch < 100 ? 5 : 3;
        for (let pass = 0; pass < passes; pass++) {
            currentSet.forEach(example => {
                forwardPropagationSilent(example.input);
                backpropagationSilent(example.target);
            });
        }
        
        epoch++;
        
        // Test on validation set every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            validSet.forEach(example => {
                const output = forwardPropagationSilent(example.input);
                const predicted = output[0] > output[1];
                if (predicted === example.isDog) correct++;
            });
            
            const accuracy = correct / validSet.length;
            console.log(`Epoch ${epoch}: Validation Accuracy = ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                perfectEpochs = 0;
            }
            
            if (accuracy === 1.0) {
                perfectEpochs++;
                console.log(`Perfect accuracy achieved! (${perfectEpochs}/10 confirmations)`);
            }
        }
    }
    
    // Final comprehensive test on all data
    let totalCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) totalCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const overallAccuracy = totalCorrect / trainingData.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Final Results after ${epoch} epochs:`);
    console.log(`Overall Accuracy: ${(overallAccuracy * 100).toFixed(1)}% (${totalCorrect}/${trainingData.length})`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const achieved100Percent = overallAccuracy === 1.0 && dogAccuracy === 1.0 && nonDogAccuracy === 1.0;
    
    return {
        passed: achieved100Percent,
        overallAccuracy: overallAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        epochsUsed: epoch,
        message: achieved100Percent ? '🎉 PERFECT! 100% accuracy achieved on all classes!' : 
                `❌ Failed to reach 100% accuracy. Best: ${(Math.max(overallAccuracy, dogAccuracy, nonDogAccuracy) * 100).toFixed(1)}%`
    };
}

if (typeof window !== 'undefined') window.test100PercentAccuracy = test100PercentAccuracy;