function getCurrentWeightForConnection(connectionLabel) {
    // Parse the connection label to extract indices
    // Format examples: "Input A → Hidden H1", "Hidden H1 → Dog", "Hidden H2 → Not Dog"
    
    if (connectionLabel.includes('Input') && connectionLabel.includes('Hidden')) {
        // Input to Hidden connection
        const inputMatch = connectionLabel.match(/Input ([ABCD])/);
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        
        if (inputMatch && hiddenMatch) {
            const inputIndex = ['A', 'B', 'C', 'D'].indexOf(inputMatch[1]);
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            return weights.inputToHidden[hiddenIndex][inputIndex];
        }
    } else if (connectionLabel.includes('Hidden') && (connectionLabel.includes('Dog') || connectionLabel.includes('Not Dog'))) {
        // Hidden to Output connection
        const hiddenMatch = connectionLabel.match(/Hidden H(\d+)/);
        const isDogOutput = connectionLabel.includes('Dog') && !connectionLabel.includes('Not Dog');
        
        if (hiddenMatch) {
            const hiddenIndex = parseInt(hiddenMatch[1]) - 1; // Convert to 0-based
            const outputIndex = isDogOutput ? 0 : 1;
            return weights.hiddenToOutput[outputIndex][hiddenIndex];
        }
    }
    
    // Fallback: return 0 if parsing fails
    console.warn(`Could not parse connection label: ${connectionLabel}`);
    return 0;
}

if (typeof window !== 'undefined') window.getCurrentWeightForConnection = getCurrentWeightForConnection;