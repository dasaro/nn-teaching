function debugWeightInitialization() {
    console.log('📊 WEIGHT INITIALIZATION ANALYSIS:');
    
    // Analyze input->hidden weights
    console.log('\n🔗 Input → Hidden Layer Weights:');
    weights.inputToHidden.forEach((neuron, h) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Hidden[${h}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Analyze hidden->output weights  
    console.log('\n🔗 Hidden → Output Layer Weights:');
    weights.hiddenToOutput.forEach((neuron, o) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Output[${o}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    // Check for symmetry issues (major cause of convergence problems)
    const inputSymmetry = checkWeightSymmetry(weights.inputToHidden);
    const outputSymmetry = checkWeightSymmetry(weights.hiddenToOutput);
    console.log(`\n⚖️ Symmetry Analysis (lower = more diverse):`);
    console.log(`  Input layer symmetry: ${inputSymmetry.toFixed(6)}`);
    console.log(`  Output layer symmetry: ${outputSymmetry.toFixed(6)}`);
    
    // Check weight distribution
    const allInputWeights = weights.inputToHidden.flat();
    const allOutputWeights = weights.hiddenToOutput.flat();
    console.log(`\n📈 Overall Weight Distribution:`);
    console.log(`  Input weights: ${allInputWeights.length} values, range [${Math.min(...allInputWeights).toFixed(4)}, ${Math.max(...allInputWeights).toFixed(4)}]`);
    console.log(`  Output weights: ${allOutputWeights.length} values, range [${Math.min(...allOutputWeights).toFixed(4)}, ${Math.max(...allOutputWeights).toFixed(4)}]`);
    
    // Potential problem indicators
    console.log(`\n⚠️ Potential Issues Check:`);
    if (inputSymmetry < 0.01) console.log('  🚨 WARNING: Input weights may be too symmetric!');
    if (outputSymmetry < 0.01) console.log('  🚨 WARNING: Output weights may be too symmetric!');
    if (Math.abs(calculateWeightStats(allInputWeights).mean) > 0.02) console.log('  🚨 WARNING: Input weights have non-zero mean bias!');
    if (Math.abs(calculateWeightStats(allOutputWeights).mean) > 0.02) console.log('  🚨 WARNING: Output weights have non-zero mean bias!');
}

if (typeof window !== 'undefined') window.debugWeightInitialization = debugWeightInitialization;