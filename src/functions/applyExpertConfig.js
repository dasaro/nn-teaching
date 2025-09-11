function applyExpertConfig() {
    console.log('🔧 Applying expert configuration...');
    console.log('Expert Config:', expertConfig);
    
    // Enable expert view mode when expert panel is used
    expertViewMode = true;
    
    // Sync to legacy networkConfig for compatibility
    syncExpertConfigToLegacy();
    
    // Reset and reinitialize network with new parameters
    resetWeights();
    
    // Update step info to reflect new configuration
    updateStepInfoDual(
        `⚙️ <strong>Expert Settings Applied!</strong><br>🔧 The neural network was restarted with ${expertConfig.hiddenActivation.replace('_', ' ')} activation and ${expertConfig.learningRate} learning rate. You're now in expert mode!`,
        `⚙️ <strong>Expert Configuration Applied</strong><br>🔧 Network reinitialized: ${expertConfig.hiddenActivation.replace('_', ' ')} activation, η=${expertConfig.learningRate}. Expert view enabled.`
    );
    
    // Close expert panel
    closeExpertPanel();
    
    console.log('✅ Expert configuration applied successfully');
}

if (typeof window !== 'undefined') window.applyExpertConfig = applyExpertConfig;