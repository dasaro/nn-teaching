function showWeightSliders() {
    // Create and show the weight editing panel instead of inline sliders
    createWeightEditingPanel();
}

if (typeof window !== 'undefined') window.showWeightSliders = showWeightSliders;