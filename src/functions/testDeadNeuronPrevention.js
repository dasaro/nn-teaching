function testDeadNeuronPrevention() {
    console.log('=== TESTING DEAD NEURON PREVENTION ===');
    
    initializeNetwork();
    
    // Create a scenario that would cause dead neurons with regular ReLU
    // Set some weights to very negative values
    weights.inputToHidden[0][0] = -10;
    weights.inputToHidden[1][1] = -8;
    
    // Test with different inputs
    const testInputs = [
        [0.5, 0.5, 0.5, 0.5],
        [0.1, 0.9, 0.3, 0.7],
        [0.8, 0.2, 0.6, 0.4]
    ];
    
    let deadNeuronCount = 0;
    let totalActivations = 0;
    
    testInputs.forEach((input, idx) => {
        const output = forwardPropagationSilent(input);
        
        activations.hidden.forEach((activation, neuronIdx) => {
            if (Math.abs(activation) < 1e-10) {
                deadNeuronCount++;
            }
            totalActivations++;
        });
        
        console.log(`Test ${idx + 1}: Hidden=[${activations.hidden.map(a => a.toFixed(3)).join(', ')}] Output=[${output.map(o => o.toFixed(3)).join(', ')}]`);
    });
    
    const deadNeuronRate = deadNeuronCount / totalActivations;
    console.log(`Dead Neuron Rate: ${(deadNeuronRate * 100).toFixed(1)}% (${deadNeuronCount}/${totalActivations})`);
    
    return {
        passed: deadNeuronRate < 0.3, // Less than 30% dead neurons is acceptable
        deadNeuronRate: deadNeuronRate,
        message: deadNeuronRate < 0.3 ? '✅ PASS: Leaky ReLU prevents most dead neurons' : '❌ FAIL: Too many dead neurons detected'
    };
}

if (typeof window !== 'undefined') window.testDeadNeuronPrevention = testDeadNeuronPrevention;