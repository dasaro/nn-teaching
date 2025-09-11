function predictActivationPatterns(inputValues) {
    // Predict hidden layer activations
    const predictedHidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += inputValues[i] * weights.inputToHidden[h][i];
        }
        predictedHidden[h] = leakyReLU(sum); // Leaky ReLU
    }
    
    console.log(`  Predicted hidden activations: [${predictedHidden.map(v => v.toFixed(3)).join(', ')}]`);
    
    const hiddenStats = calculateWeightStats(predictedHidden);
    console.log(`  Hidden stats: min=${hiddenStats.min.toFixed(4)}, max=${hiddenStats.max.toFixed(4)}, mean=${hiddenStats.mean.toFixed(4)}`);
    
    // Check for dead neurons
    const deadNeurons = predictedHidden.filter(v => Math.abs(v) < 1e-6).length;
    if (deadNeurons > 0) {
        console.log(`  ⚠️ WARNING: ${deadNeurons} potentially dead neurons detected!`);
    }
    
    // Predict output layer
    const predictedOutputs = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += predictedHidden[h] * weights.hiddenToOutput[o][h];
        }
        predictedOutputs[o] = sum;
    }
    
    console.log(`  Predicted raw outputs: [${predictedOutputs.map(v => v.toFixed(3)).join(', ')}]`);
    
    // Apply softmax for final prediction
    const softmaxOutputs = softmax(predictedOutputs);
    
    console.log(`  Final probabilities: [${softmaxOutputs.map(v => (v*100).toFixed(1) + '%').join(', ')}]`);
    
    // Convergence warning
    const maxProb = Math.max(...softmaxOutputs);
    const minProb = Math.min(...softmaxOutputs);
    if (maxProb - minProb < 0.1) {
        console.log('  ⚠️ WARNING: Predictions are very close - possible convergence issue!');
    }
}

if (typeof window !== 'undefined') window.predictActivationPatterns = predictActivationPatterns;