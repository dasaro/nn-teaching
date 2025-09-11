function enableConvergenceAnalysis() {
    convergenceAnalysis.enabled = true;
    convergenceAnalysis.epochCount = 0;
    convergenceAnalysis.lossHistory = [];
    convergenceAnalysis.accuracyHistory = [];
    convergenceAnalysis.weightMagnitudeHistory = [];
    convergenceAnalysis.gradientMagnitudeHistory = [];
    convergenceAnalysis.convergenceDetected = false;
    convergenceAnalysis.convergenceEpoch = -1;
    console.log('🔍 CONVERGENCE ANALYSIS ENABLED');
}

if (typeof window !== 'undefined') window.enableConvergenceAnalysis = enableConvergenceAnalysis;