function hideWeightSliders() {
    // Remove the weight editing panel
    const panel = document.getElementById('weightEditingPanel');
    if (panel) {
        panel.remove();
    }
    
    // Reset connections to proper weight-based visualization
    refreshAllConnectionVisuals();
}

if (typeof window !== 'undefined') window.hideWeightSliders = hideWeightSliders;