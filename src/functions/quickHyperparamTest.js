async function quickHyperparamTest() {
    console.log('🚀 QUICK HYPERPARAMETER TEST (Multiple Trials)');
    
    // Create training dataset once
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
    
    // Test promising hyperparameter combinations (5 trials each)
    const testSets = [
        [0.4, 0.8, "High LR + High Momentum"],
        [0.5, 0.7, "Very High LR + Med Momentum"],  
        [0.35, 0.85, "Med-High LR + Very High Momentum"],
        [0.45, 0.75, "High LR + Med-High Momentum"],
        [0.3, 0.9, "Med LR + Max Momentum"]
    ];
    
    const results = [];
    
    for (let setIdx = 0; setIdx < testSets.length; setIdx++) {
        const [lr, mom, desc] = testSets[setIdx];
        console.log(`\n📊 Testing: ${desc} (LR=${lr}, Mom=${mom})`);
        
        const trials = [];
        
        // Run 5 trials for statistical validity
        for (let trial = 0; trial < 5; trial++) {
            initializeNetwork(); // Fresh start each trial
            const result = await trainWithHyperparams(trainingData, lr, mom, 100);
            trials.push(result);
            
            const status = result.accuracy === 1.0 ? '🏆' : result.accuracy >= 0.9 ? '🎯' : '📈';
            console.log(`  Trial ${trial+1}: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
        }
        
        // Calculate statistics
        const accuracies = trials.map(t => t.accuracy);
        const epochs = trials.map(t => t.epochs);
        const perfectTrials = trials.filter(t => t.accuracy === 1.0).length;
        
        const avgAccuracy = accuracies.reduce((a,b) => a+b, 0) / 5;
        const avgEpochs = epochs.reduce((a,b) => a+b, 0) / 5;
        const bestEpochs = Math.min(...epochs);
        const worstEpochs = Math.max(...epochs);
        
        results.push({
            description: desc,
            learningRate: lr,
            momentum: mom,
            avgAccuracy,
            avgEpochs,
            bestEpochs,
            worstEpochs,
            perfectTrials,
            consistency: 1 - (worstEpochs - bestEpochs) / avgEpochs // Lower variation = more consistent
        });
        
        console.log(`  📊 Stats: ${(avgAccuracy*100).toFixed(1)}% avg, ${avgEpochs.toFixed(1)} avg epochs, ${perfectTrials}/5 perfect`);
    }
    
    // Rank results by success rate, then speed
    results.sort((a, b) => {
        if (a.perfectTrials !== b.perfectTrials) return b.perfectTrials - a.perfectTrials;
        if (a.avgAccuracy !== b.avgAccuracy) return b.avgAccuracy - a.avgAccuracy;
        return a.avgEpochs - b.avgEpochs;
    });
    
    console.log('\n🏆 FINAL HYPERPARAMETER RANKINGS:');
    console.log('=' .repeat(70));
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Momentum=${result.momentum}`);
        console.log(`     Success: ${result.perfectTrials}/5 perfect (${(result.avgAccuracy*100).toFixed(1)}% avg)`);
        console.log(`     Speed: ${result.avgEpochs.toFixed(1)} avg epochs (best: ${result.bestEpochs}, worst: ${result.worstEpochs})`);
        console.log(`     Consistency: ${(result.consistency*100).toFixed(1)}%`);
        console.log('');
    });
    
    const winner = results[0];
    console.log('🎯 RECOMMENDED HYPERPARAMETERS:');
    console.log(`Learning Rate: ${winner.learningRate}`);
    console.log(`Momentum: ${winner.momentum}`);
    console.log(`Expected: ${winner.perfectTrials}/5 chance of 100%, avg ${winner.avgEpochs.toFixed(1)} epochs`);
    
    return winner;
}

if (typeof window !== 'undefined') window.quickHyperparamTest = quickHyperparamTest;