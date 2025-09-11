function testAccuracy(dataset) {
    let correct = 0;
    let debugLog = [];
    
    dataset.forEach((example, idx) => {
        const output = forwardPropagationSilent(example.input);
        // With softmax outputs, compare probabilities: output[0] = dog prob, output[1] = not-dog prob
        const predicted = output[0] > output[1]; // True if dog probability > not-dog probability
        const isCorrect = predicted === example.isDog;
        if (isCorrect) correct++;
        
        debugLog.push(`${example.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted ? 'DOG' : 'NOT-DOG'} (actual: ${example.isDog ? 'DOG' : 'NOT-DOG'}) ${isCorrect ? '✅' : '❌'}`);
    });
    
    // Debug: Log all predictions if accuracy is exactly 50%
    const accuracy = correct / dataset.length;
    if (Math.abs(accuracy - 0.5) < 0.001) {
        console.log('🚨 DEBUG: Exactly 50% accuracy detected! Full predictions:');
        debugLog.forEach(log => console.log('  ' + log));
    }
    
    return accuracy;
}

if (typeof window !== 'undefined') window.testAccuracy = testAccuracy;