function testWeightInitialization() {
    console.log('=== TESTING WEIGHT INITIALIZATION ===');
    
    const numTests = 10;
    const results = [];
    
    for (let test = 0; test < numTests; test++) {
        initializeNetwork();
        
        // Check weight distribution
        const allWeights = [
            ...weights.inputToHidden.flat(),
            ...weights.hiddenToOutput.flat()
        ];
        
        const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
        const variance = allWeights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / allWeights.length;
        const std = Math.sqrt(variance);
        
        // Test initial forward pass - shouldn't have extreme activations
        const testInput = [0.5, 0.5, 0.5, 0.5];
        const output = forwardPropagationSilent(testInput);
        
        const maxHiddenActivation = Math.max(...activations.hidden.map(Math.abs));
        const outputSum = output.reduce((sum, val) => sum + val, 0);
        
        results.push({
            mean: mean,
            std: std,
            maxHiddenActivation: maxHiddenActivation,
            outputSum: outputSum
        });
    }
    
    // Analyze results
    const avgMean = results.reduce((sum, r) => sum + Math.abs(r.mean), 0) / results.length;
    const avgStd = results.reduce((sum, r) => sum + r.std, 0) / results.length;
    const avgMaxHidden = results.reduce((sum, r) => sum + r.maxHiddenActivation, 0) / results.length;
    
    console.log(`Average weight mean: ${avgMean.toFixed(4)} (should be close to 0)`);
    console.log(`Average weight std: ${avgStd.toFixed(4)} (should be reasonable for He init)`);
    console.log(`Average max hidden activation: ${avgMaxHidden.toFixed(3)} (shouldn't be extreme)`);
    
    // Good initialization: mean near 0, reasonable std, no extreme activations
    const goodInit = avgMean < 0.1 && avgStd > 0.1 && avgStd < 1.0 && avgMaxHidden < 10;
    
    return {
        passed: goodInit,
        avgMean: avgMean,
        avgStd: avgStd,
        avgMaxHidden: avgMaxHidden,
        message: goodInit ? '✅ PASS: Weight initialization is good' : '❌ FAIL: Poor weight initialization'
    };
}

if (typeof window !== 'undefined') window.testWeightInitialization = testWeightInitialization;