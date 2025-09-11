function testBackAndForthLearning() {
    console.log('=== TESTING BACK-AND-FORTH LEARNING STABILITY ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    // Train on first two examples (one dog, one cat)
    console.log('\n--- PHASE 1: Learning Dog vs Cat ---');
    const phase1Examples = [examples[0], examples[1]]; // PrototypeDog, PrototypeCat
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 1
    console.log('\nAfter learning Dog vs Cat:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Train on next two examples (another dog, an object)
    console.log('\n--- PHASE 2: Adding Family Dog vs Object ---');
    const phase2Examples = [examples[2], examples[3]]; // FamilyDog, Object
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase2Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 2
    console.log('\nAfter adding more examples:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Go back to training on original examples to test stability
    console.log('\n--- PHASE 3: Returning to Dog vs Cat (stability test) ---');
    
    for (let epoch = 0; epoch < 10; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Final test
    console.log('\nFinal results after back-and-forth learning:');
    let finalCorrect = 0;
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        if (correct) finalCorrect++;
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    const finalAccuracy = finalCorrect / examples.length;
    const stable = finalAccuracy >= 0.75; // At least 3/4 correct
    
    console.log(`\nStability Test: ${stable ? 'PASSED' : 'FAILED'} (${(finalAccuracy * 100).toFixed(1)}% accuracy)`);
    
    return {
        passed: stable,
        finalAccuracy: finalAccuracy,
        examples: examples,
        message: stable ? '✅ Network maintains learning stability' : '❌ Network shows instability in back-and-forth learning'
    };
}

if (typeof window !== 'undefined') window.testBackAndForthLearning = testBackAndForthLearning;