function enableDeepDebugging() {
    console.log('🔧 ===== ENABLING DEEP DEBUGGING MODE =====');
    enableConvergenceAnalysis();
    
    // Override forwardPropagationSilent and backpropagationSilent to always use debug mode
    const originalForward = window.forwardPropagationSilent;
    const originalBackward = window.backpropagationSilent;
    
    window.forwardPropagationSilent = function(inputValues, debugMode = true) {
        return originalForward.call(this, inputValues, debugMode);
    };
    
    window.backpropagationSilent = function(target, debugMode = true) {
        return originalBackward.call(this, target, debugMode);
    };
    
    console.log('✅ Deep debugging enabled - all training will show detailed logs');
    console.log('🔧 ==========================================');
}

if (typeof window !== 'undefined') window.enableDeepDebugging = enableDeepDebugging;