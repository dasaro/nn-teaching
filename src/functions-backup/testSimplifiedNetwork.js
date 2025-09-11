function testSimplifiedNetwork() {
    console.log('=== TESTING 4-NEURON NETWORK SUFFICIENCY ===');
    
    const examples = createOptimalLearningSequence();
    const results = [];
    
    // Test multiple random initializations
    for (let trial = 0; trial < 5; trial++) {
        initializeNetwork();
        
        let epoch = 0;
        const maxEpochs = 50;
        let finalAccuracy = 0;
        
        while (epoch < maxEpochs) {
            examples.forEach(ex => {
                forwardPropagationSilent(ex.input);
                backpropagationSilent(ex.target);
            });
            epoch++;
            
            // Check accuracy
            let correct = 0;
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
            });
            
            finalAccuracy = correct / examples.length;
            if (finalAccuracy === 1.0) break; // Early stopping
        }
        
        results.push({
            trial: trial + 1,
            epochs: epoch,
            accuracy: finalAccuracy
        });
        
        console.log(`Trial ${trial + 1}: ${(finalAccuracy * 100).toFixed(1)}% accuracy in ${epoch} epochs`);
    }
    
    const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
    const perfectTrials = results.filter(r => r.accuracy === 1.0).length;
    const avgEpochs = results.reduce((sum, r) => sum + r.epochs, 0) / results.length;
    
    console.log(`\nSummary: ${perfectTrials}/5 trials achieved 100% accuracy`);
    console.log(`Average accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`Average epochs needed: ${avgEpochs.toFixed(1)}`);
    
    const sufficient = avgAccuracy >= 0.9; // 90% average accuracy
    
    return {
        passed: sufficient,
        avgAccuracy: avgAccuracy,
        perfectTrials: perfectTrials,
        avgEpochs: avgEpochs,
        message: sufficient ? '✅ 4 neurons are sufficient for this task' : '❌ 4 neurons may be insufficient'
    };
}

if (typeof window !== 'undefined') window.testSimplifiedNetwork = testSimplifiedNetwork;