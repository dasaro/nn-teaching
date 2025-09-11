function detectConvergenceIssues(trainingData) {
    const recentCount = Math.min(10, convergenceAnalysis.lossHistory.length);
    if (recentCount < 5) return; // Need at least 5 data points
    
    console.log(`\n📈 ===== CONVERGENCE ANALYSIS (Epoch ${convergenceAnalysis.epochCount}) =====`);
    
    const recentLoss = convergenceAnalysis.lossHistory.slice(-recentCount);
    const recentAccuracy = convergenceAnalysis.accuracyHistory.slice(-recentCount);
    const recentWeightMag = convergenceAnalysis.weightMagnitudeHistory.slice(-recentCount);
    
    // Loss trend analysis
    const lossChange = recentLoss[recentLoss.length - 1] - recentLoss[0];
    const lossVariance = calculateWeightStats(recentLoss).std;
    console.log(`📊 Loss Analysis:`);
    console.log(`  Current loss: ${recentLoss[recentLoss.length - 1].toFixed(6)}`);
    console.log(`  Change over last ${recentCount} epochs: ${lossChange.toFixed(6)}`);
    console.log(`  Loss variance: ${lossVariance.toFixed(6)}`);
    
    // Accuracy trend analysis
    const accuracyChange = recentAccuracy[recentAccuracy.length - 1] - recentAccuracy[0];
    console.log(`🎯 Accuracy Analysis:`);
    console.log(`  Current accuracy: ${(recentAccuracy[recentAccuracy.length - 1] * 100).toFixed(1)}%`);
    console.log(`  Change over last ${recentCount} epochs: ${(accuracyChange * 100).toFixed(1)}%`);
    
    // Weight magnitude analysis
    const weightChange = recentWeightMag[recentWeightMag.length - 1] - recentWeightMag[0];
    console.log(`⚖️ Weight Analysis:`);
    console.log(`  Current weight magnitude: ${recentWeightMag[recentWeightMag.length - 1].toFixed(6)}`);
    console.log(`  Weight magnitude change: ${weightChange.toFixed(6)}`);
    
    // Convergence detection
    let issuesDetected = [];
    
    // Plateau detection
    if (Math.abs(lossChange) < 1e-6 && lossVariance < 1e-6) {
        issuesDetected.push('Loss plateau - network stopped learning');
        if (!convergenceAnalysis.convergenceDetected) {
            convergenceAnalysis.convergenceDetected = true;
            convergenceAnalysis.convergenceEpoch = convergenceAnalysis.epochCount;
        }
    }
    
    // Accuracy plateau
    if (Math.abs(accuracyChange) < 0.01 && recentAccuracy[recentAccuracy.length - 1] < 0.9) {
        issuesDetected.push('Accuracy plateau - may have reached local minimum');
    }
    
    // Weight stagnation
    if (Math.abs(weightChange) < 1e-6) {
        issuesDetected.push('Weight stagnation - weights barely changing');
    }
    
    // Same prediction issue
    const predictionDiversity = checkPredictionDiversity(trainingData);
    if (predictionDiversity < 0.1) {
        issuesDetected.push('Prediction uniformity - all inputs produce similar outputs');
    }
    
    // Report issues
    if (issuesDetected.length > 0) {
        console.log('\n🚨 CONVERGENCE ISSUES DETECTED:');
        issuesDetected.forEach(issue => console.log(`  ⚠️ ${issue}`));
        
        console.log('\n💡 DEBUGGING SUGGESTIONS:');
        console.log('  • Check feature representation with debugFeatureRepresentation()');
        console.log('  • Verify weight initialization with debugWeightInitialization()');
        console.log('  • Enable weight change monitoring in training loops');
        console.log('  • Consider adjusting learning rate or adding regularization');
    } else {
        console.log('\n✅ No major convergence issues detected');
    }
    
    console.log('📈 =============================================');
}

if (typeof window !== 'undefined') window.detectConvergenceIssues = detectConvergenceIssues;