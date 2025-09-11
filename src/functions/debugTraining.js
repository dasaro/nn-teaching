async function debugTraining() {
    console.log('🔬 MANUAL TRAINING DEBUG');
    
    // Create a simple 2-example dataset manually
    const debugData = [
        {
            input: [0.9, 0.8, 0.9, 0.8], // Clear DOG pattern
            target: [1, 0], // Should predict DOG
            label: 'test_dog',
            isDog: true
        },
        {
            input: [0.2, 0.1, 0.2, 0.3], // Clear NOT-DOG pattern  
            target: [0, 1], // Should predict NOT-DOG
            label: 'test_not_dog',
            isDog: false
        }
    ];
    
    console.log('🎯 Debug dataset:');
    debugData.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] → target: [${ex.target.join(', ')}]`);
    });
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions
    console.log('\n📊 INITIAL PREDICTIONS (before training):');
    debugData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted}`);
    });
    
    // Train for a few epochs manually
    const lr = 0.5; // High learning rate for debugging
    const mom = 0.9;
    
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    for (let epoch = 1; epoch <= 10; epoch++) {
        let totalLoss = 0;
        
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            
            // Calculate loss
            const loss = -ex.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            totalLoss += loss;
            
            // Backprop
            backpropagationWithMomentum(ex.target, lr, mom, momentumInputToHidden, momentumHiddenToOutput);
        });
        
        const avgLoss = totalLoss / debugData.length;
        let correct = 0;
        
        console.log(`\n--- Epoch ${epoch} (Loss: ${avgLoss.toFixed(4)}) ---`);
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
            const isCorrect = (output[0] > output[1]) === ex.isDog;
            if (isCorrect) correct++;
            
            const status = isCorrect ? '✅' : '❌';
            console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} ${status}`);
        });
        
        const accuracy = correct / debugData.length;
        console.log(`Accuracy: ${(accuracy*100).toFixed(1)}%`);
        
        if (accuracy === 1.0) {
            console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
            break;
        }
    }
}

if (typeof window !== 'undefined') window.debugTraining = debugTraining;