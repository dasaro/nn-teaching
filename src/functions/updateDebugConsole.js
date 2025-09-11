function updateDebugConsole() {
    if (!debugConsoleVisible) return;
    
    switch(currentConsoleTab) {
        case 'weights':
            displayWeightMatrices();
            break;
        case 'activations':
            displayActivations();
            break;
        case 'gradients':
            displayGradients();
            break;
        case 'performance':
            displayPerformanceMetrics();
            break;
    }
}

if (typeof window !== 'undefined') window.updateDebugConsole = updateDebugConsole;