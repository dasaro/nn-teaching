function quickAccuracyTest() {
    console.log('🧪 FULL 8-IMAGE ACCURACY TEST');
    
    // Test with ALL 8 images exactly like training does
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const testData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        testData.push({
            input: [...activations.input], // Copy input array
            target: isDog ? [1, 0] : [0, 1],
            isDog: isDog,
            label: imageType
        });
    });
    
    console.log('📊 Current predictions for all 8 images:');
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        const isCorrect = (output[0] > output[1]) === ex.isDog;
        const status = isCorrect ? '✅' : '❌';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} (actual: ${ex.isDog ? 'DOG' : 'NOT-DOG'}) ${status}`);
    });
    
    const accuracy = testAccuracy(testData);
    console.log(`\n🎯 Total accuracy: ${(accuracy * 100).toFixed(1)}% (${accuracy * testData.length}/${testData.length} correct)`);
    
    // Check for bias
    let allPredictedDog = true;
    let allPredictedNotDog = true;
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1];
        if (predicted) allPredictedNotDog = false;
        if (!predicted) allPredictedDog = false;
    });
    
    if (allPredictedDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as DOG!');
    } else if (allPredictedNotDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as NOT-DOG!');
    }
    
    return accuracy;
}

if (typeof window !== 'undefined') window.quickAccuracyTest = quickAccuracyTest;