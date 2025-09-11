function debugFeatureRepresentation(inputValues, context = '') {
    console.log(`\n🔍 ===== FEATURE REPRESENTATION DEBUG ${context} =====`);
    
    // Input analysis
    console.log('📊 INPUT ANALYSIS:');
    const inputStats = calculateWeightStats(inputValues);
    console.log(`  Values: [${inputValues.slice(0, 8).map(v => v.toFixed(3)).join(', ')}${inputValues.length > 8 ? '...' : ''}]`);
    console.log(`  Stats: min=${inputStats.min.toFixed(4)}, max=${inputStats.max.toFixed(4)}, mean=${inputStats.mean.toFixed(4)}, std=${inputStats.std.toFixed(4)}`);
    
    // Check for problematic patterns
    const zeroCount = inputValues.filter(v => Math.abs(v) < 1e-10).length;
    const duplicateCount = checkValueDuplication(inputValues);
    console.log(`  Zero values: ${zeroCount}/${inputValues.length} (${(100*zeroCount/inputValues.length).toFixed(1)}%)`);
    console.log(`  Duplicate rate: ${(duplicateCount*100).toFixed(1)}% (potential lack of diversity)`);
    
    // Feature diversity analysis
    const diversity = calculateFeatureDiversity(inputValues);
    console.log(`  Feature diversity score: ${diversity.toFixed(4)} (higher = more diverse)`);
    
    // Activation pattern prediction
    console.log('\n🔮 ACTIVATION PREDICTION:');
    predictActivationPatterns(inputValues);
    
    console.log('🔍 ==========================================');
}

if (typeof window !== 'undefined') window.debugFeatureRepresentation = debugFeatureRepresentation;