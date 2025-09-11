function testGeneralization() {
    console.log('=== TESTING GENERALIZATION ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split data: 70% training, 30% testing
    const splitIdx = Math.floor(trainingData.length * 0.7);
    const trainSet = trainingData.slice(0, splitIdx);
    const testSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, testing on ${testSet.length} examples`);
    
    // Train the network
    for (let epoch = 0; epoch < 50; epoch++) {
        trainSet.forEach(example => {
            forwardPropagationSilent(example.input);
            backpropagationSilent(example.target);
        });
    }
    
    // Test on training set
    let trainCorrect = 0;
    trainSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        if (predicted === actual) trainCorrect++;
    });
    
    // Test on test set
    let testCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    testSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) testCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const trainAccuracy = trainCorrect / trainSet.length;
    const testAccuracy = testCorrect / testSet.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Training Accuracy: ${(trainAccuracy * 100).toFixed(1)}%`);
    console.log(`Test Accuracy: ${(testAccuracy * 100).toFixed(1)}%`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const generalizationGap = trainAccuracy - testAccuracy;
    const balancedAccuracy = (dogAccuracy + nonDogAccuracy) / 2;
    
    console.log(`Generalization Gap: ${(generalizationGap * 100).toFixed(1)}%`);
    console.log(`Balanced Accuracy: ${(balancedAccuracy * 100).toFixed(1)}%`);
    
    // Good generalization: small gap, high balanced accuracy
    const goodGeneralization = generalizationGap < 0.15 && balancedAccuracy > 0.7;
    
    return {
        passed: goodGeneralization,
        trainAccuracy: trainAccuracy,
        testAccuracy: testAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        generalizationGap: generalizationGap,
        balancedAccuracy: balancedAccuracy,
        message: goodGeneralization ? '✅ PASS: Network generalizes well to both classes' : '❌ FAIL: Poor generalization detected'
    };
}

if (typeof window !== 'undefined') window.testGeneralization = testGeneralization;