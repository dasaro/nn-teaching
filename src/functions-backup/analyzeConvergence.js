function analyzeConvergence(loss, accuracy, trainingData) {
    if (!convergenceAnalysis.enabled) return;
    
    convergenceAnalysis.epochCount++;
    
    // Record metrics
    convergenceAnalysis.lossHistory.push(loss);
    convergenceAnalysis.accuracyHistory.push(accuracy);
    
    // Calculate weight magnitude
    const allWeights = [
        ...weights.inputToHidden.flat(),
        ...weights.hiddenToOutput.flat()
    ];
    const weightMagnitude = Math.sqrt(allWeights.reduce((sum, w) => sum + w*w, 0));
    convergenceAnalysis.weightMagnitudeHistory.push(weightMagnitude);
    
    // Keep only recent history
    if (convergenceAnalysis.lossHistory.length > convergenceAnalysis.maxHistoryLength) {
        convergenceAnalysis.lossHistory.shift();
        convergenceAnalysis.accuracyHistory.shift();
        convergenceAnalysis.weightMagnitudeHistory.shift();
        convergenceAnalysis.gradientMagnitudeHistory.shift();
    }
    
    // Check for convergence every 5 epochs
    if (convergenceAnalysis.epochCount % 5 === 0) {
        detectConvergenceIssues(trainingData);
    }
}

if (typeof window !== 'undefined') window.analyzeConvergence = analyzeConvergence;