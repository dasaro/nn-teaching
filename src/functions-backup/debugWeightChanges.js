function debugWeightChanges(initialWeights, target) {
    console.log('\n⚖️ ===== WEIGHT CHANGE ANALYSIS =====');
    
    // Calculate weight changes
    const inputWeightChanges = [];
    const outputWeightChanges = [];
    
    // Analyze input->hidden weight changes
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const change = weights.inputToHidden[h][i] - initialWeights.inputToHidden[h][i];
            inputWeightChanges.push(change);
        }
    }
    
    // Analyze hidden->output weight changes
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const change = weights.hiddenToOutput[o][h] - initialWeights.hiddenToOutput[o][h];
            outputWeightChanges.push(change);
        }
    }
    
    // Statistics on weight changes
    const inputChangeStats = calculateWeightStats(inputWeightChanges);
    const outputChangeStats = calculateWeightStats(outputWeightChanges);
    
    console.log('📊 WEIGHT UPDATE STATISTICS:');
    console.log(`  Input→Hidden changes: ${inputWeightChanges.length} weights`);
    console.log(`    Range: [${inputChangeStats.min.toFixed(6)}, ${inputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${inputChangeStats.mean.toFixed(6)}, Std: ${inputChangeStats.std.toFixed(6)}`);
    
    console.log(`  Hidden→Output changes: ${outputWeightChanges.length} weights`);
    console.log(`    Range: [${outputChangeStats.min.toFixed(6)}, ${outputChangeStats.max.toFixed(6)}]`);
    console.log(`    Mean: ${outputChangeStats.mean.toFixed(6)}, Std: ${outputChangeStats.std.toFixed(6)}`);
    
    // Check for problematic patterns
    console.log('\n⚠️ CONVERGENCE ISSUE DETECTION:');
    
    // Check for very small changes (possible convergence)
    const smallInputChanges = inputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    const smallOutputChanges = outputWeightChanges.filter(c => Math.abs(c) < 1e-6).length;
    
    console.log(`  Tiny changes (<1e-6): Input ${smallInputChanges}/${inputWeightChanges.length} (${(100*smallInputChanges/inputWeightChanges.length).toFixed(1)}%)`);
    console.log(`  Tiny changes (<1e-6): Output ${smallOutputChanges}/${outputWeightChanges.length} (${(100*smallOutputChanges/outputWeightChanges.length).toFixed(1)}%)`);
    
    if (smallInputChanges > inputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most input weights barely changing - possible convergence!');
    }
    if (smallOutputChanges > outputWeightChanges.length * 0.8) {
        console.log('  🚨 WARNING: Most output weights barely changing - possible convergence!');
    }
    
    // Check for symmetry in weight changes
    const inputChangeSymmetry = checkWeightSymmetry([inputWeightChanges]);
    const outputChangeSymmetry = checkWeightSymmetry([outputWeightChanges]);
    
    console.log(`  Weight change symmetry: Input=${inputChangeSymmetry.toFixed(6)}, Output=${outputChangeSymmetry.toFixed(6)}`);
    if (inputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Input weight changes are too symmetric!');
    }
    if (outputChangeSymmetry < 0.001) {
        console.log('  🚨 WARNING: Output weight changes are too symmetric!');
    }
    
    // Gradient magnitude analysis
    const inputGradMagnitude = Math.sqrt(inputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    const outputGradMagnitude = Math.sqrt(outputWeightChanges.reduce((sum, c) => sum + c*c, 0));
    
    console.log(`\n📈 GRADIENT ANALYSIS:`);
    console.log(`  Input gradient magnitude: ${inputGradMagnitude.toFixed(6)}`);
    console.log(`  Output gradient magnitude: ${outputGradMagnitude.toFixed(6)}`);
    
    if (inputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in input layer!');
    }
    if (outputGradMagnitude < 1e-5) {
        console.log('  🚨 WARNING: Vanishing gradients in output layer!');
    }
    if (inputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in input layer!');
    }
    if (outputGradMagnitude > 10) {
        console.log('  🚨 WARNING: Exploding gradients in output layer!');
    }
    
    // Target analysis
    console.log(`\n🎯 TARGET ANALYSIS:`);
    console.log(`  Target: [${target.map(t => t.toFixed(3)).join(', ')}]`);
    console.log(`  Current output: [${activations.output.map(o => o.toFixed(3)).join(', ')}]`);
    
    const error = target.map((t, i) => t - activations.output[i]);
    const errorMagnitude = Math.sqrt(error.reduce((sum, e) => sum + e*e, 0));
    console.log(`  Error: [${error.map(e => e.toFixed(3)).join(', ')}]`);
    console.log(`  Error magnitude: ${errorMagnitude.toFixed(6)}`);
    
    if (errorMagnitude < 0.01) {
        console.log('  ✅ Very low error - network converging well');
    } else if (errorMagnitude > 1.0) {
        console.log('  ⚠️ High error - network struggling to learn');
    }
    
    console.log('⚖️ ====================================');
}

if (typeof window !== 'undefined') window.debugWeightChanges = debugWeightChanges;