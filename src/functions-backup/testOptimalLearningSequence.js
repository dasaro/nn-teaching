function testOptimalLearningSequence() {
    console.log('=== TESTING OPTIMAL 4-EXAMPLE LEARNING SEQUENCE ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    console.log('\nLearning Examples:');
    examples.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] -> ${ex.isDog ? 'Dog' : 'Not Dog'}`);
        console.log(`  ${ex.description}`);
    });
    
    // Test initial predictions
    console.log('\n--- BEFORE TRAINING ---');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Simple training with reduced learning rate
    const originalLR = networkConfig.learningRate;
    networkConfig.learningRate = 0.05; // Even more conservative
    
    console.log('\n--- TRAINING (Conservative Learning) ---');
    let epoch = 0;
    const maxEpochs = 30;
    
    while (epoch < maxEpochs) {
        // Single pass through examples
        examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
        
        epoch++;
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            console.log(`\nEpoch ${epoch} results:`);
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
                console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${isCorrect ? 'CORRECT' : 'WRONG'}`);
            });
            
            const accuracy = correct / examples.length;
            console.log(`Accuracy: ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy === 1.0) {
                console.log(`Perfect accuracy achieved at epoch ${epoch}!`);
                break;
            }
        }
    }
    
    // Restore original learning rate
    networkConfig.learningRate = originalLR;
    
    return {
        examples: examples,
        epochsNeeded: epoch,
        finalAccuracy: examples.map(ex => {
            const output = forwardPropagationSilent(ex.input);
            const dogProb = output[0];
            return (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        }).reduce((sum, correct) => sum + (correct ? 1 : 0), 0) / examples.length
    };
}

if (typeof window !== 'undefined') window.testOptimalLearningSequence = testOptimalLearningSequence;