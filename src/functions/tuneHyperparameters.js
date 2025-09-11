async function tuneHyperparameters() {
    console.log('🔬 HYPERPARAMETER TUNING EXPERIMENT');
    console.log('Testing different combinations for optimal convergence...\n');
    
    // Create training dataset
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? [1, 0] : [0, 1],
            label: imageType,
            isDog: isDog
        });
    });
    
    // Hyperparameter combinations to test
    const hyperparamSets = [
        // Format: [learningRate, initialMomentum, maxEpochs, description]
        [0.5, 0.8, 150, "High LR, High Momentum"],
        [0.4, 0.7, 150, "Medium-High LR, Med-High Momentum"],
        [0.3, 0.7, 150, "Medium LR, Medium Momentum (Current)"],
        [0.25, 0.8, 150, "Med-Low LR, High Momentum"],
        [0.2, 0.9, 150, "Low LR, Very High Momentum"],
        [0.6, 0.5, 150, "Very High LR, Low Momentum"],
        [0.35, 0.6, 150, "Med LR, Med-Low Momentum"],
        [0.45, 0.85, 120, "High LR, Very High Momentum, Early Stop"],
        [0.3, 0.75, 200, "Medium LR, Med-High Momentum, Extended"],
        [0.4, 0.9, 100, "Med-High LR, Max Momentum, Quick Stop"]
    ];
    
    const results = [];
    
    for (let i = 0; i < hyperparamSets.length; i++) {
        const [learningRate, momentum, maxEpochs, description] = hyperparamSets[i];
        
        console.log(`\n--- Test ${i+1}/${hyperparamSets.length}: ${description} ---`);
        console.log(`LR: ${learningRate}, Momentum: ${momentum}, Max Epochs: ${maxEpochs}`);
        
        // Reset network for fair comparison
        initializeNetwork();
        
        // Run training with these hyperparameters
        const result = await trainWithHyperparams(trainingData, learningRate, momentum, maxEpochs);
        
        results.push({
            index: i + 1,
            description,
            learningRate,
            momentum,
            maxEpochs,
            ...result
        });
        
        // Log result
        const status = result.accuracy === 1.0 ? '🏆 PERFECT' : result.accuracy >= 0.9 ? '🎯 EXCELLENT' : '📈 GOOD';
        console.log(`Result: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
    }
    
    // Analyze results
    console.log('\n🏆 HYPERPARAMETER TUNING RESULTS:');
    console.log('=' .repeat(80));
    
    // Sort by performance (accuracy first, then speed)
    results.sort((a, b) => {
        if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
        return a.epochs - b.epochs;
    });
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        const perfLabel = result.accuracy === 1.0 ? 'PERFECT' : `${(result.accuracy*100).toFixed(1)}%`;
        
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Mom=${result.momentum} → ${perfLabel} in ${result.epochs} epochs`);
        console.log(`     Avg Confidence: ${(result.avgConfidence*100).toFixed(1)}%, Efficiency: ${result.efficiency.toFixed(2)}`);
        console.log('');
    });
    
    // Recommend best hyperparameters
    const best = results[0];
    console.log('🎯 RECOMMENDATION:');
    console.log(`Best hyperparameters: LR=${best.learningRate}, Momentum=${best.momentum}`);
    console.log(`Expected performance: ${(best.accuracy*100).toFixed(1)}% accuracy in ~${best.epochs} epochs`);
    
    return best;
}

if (typeof window !== 'undefined') window.tuneHyperparameters = tuneHyperparameters;