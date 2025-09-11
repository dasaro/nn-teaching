async function startFullDemo() {
    // Start message logging for the full sequence
    startMessageLog();
    
    // Temporarily disable auto-logging for individual functions
    const wasMessageLogActive = messageLogActive;
    messageLogActive = false;
    
    await runForwardPass();
    if (trueLabel && !isAnimating) {
        await sleep(2000);
        await runBackwardPass();
    }
    
    // Restore message logging and stop it to show complete sequence
    messageLogActive = wasMessageLogActive;
    if (messageLogActive) {
        stopMessageLog();
    }
}

if (typeof window !== 'undefined') window.startFullDemo = startFullDemo;