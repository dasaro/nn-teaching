function applyWeightVisualization(lineElement, weight) {
    const absWeight = Math.abs(weight);
    const maxWeight = 3; // Our slider range
    
    // Red-Gray-Green color scheme: Red for negative, Gray for minimal, Green for positive
    let color;
    if (Math.abs(weight) < 0.05) {
        // Very weak connections - visible medium gray
        color = '#9ca3af';
    } else if (weight > 0) {
        // Positive weights: Gray to Green gradient (lighter to darker based on strength)
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (34 - 156)); // From #9ca3af to #22c55e
        const greenValue = Math.floor(163 + intensity * (197 - 163));
        const blueValue = Math.floor(175 + intensity * (94 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    } else {
        // Negative weights: Gray to Red gradient (lighter to darker based on strength)  
        const intensity = Math.min(absWeight / maxWeight, 1);
        const redValue = Math.floor(156 + intensity * (220 - 156)); // From #9ca3af to #dc2626
        const greenValue = Math.floor(163 + intensity * (38 - 163));
        const blueValue = Math.floor(175 + intensity * (38 - 175));
        color = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    }
    
    // Moderate thickness variation for clear visual feedback
    const baseThickness = 1.5;
    const maxThicknessFactor = 3; // More noticeable range: 1.5px to 4.5px
    const thickness = baseThickness + (absWeight / maxWeight) * maxThicknessFactor;
    
    // Opacity as primary importance indicator
    const minOpacity = 0.4;
    const maxOpacity = 0.95;
    const opacity = minOpacity + (absWeight / maxWeight) * (maxOpacity - minOpacity);
    
    // Apply visual properties using inline styles for higher CSS specificity
    lineElement.style.stroke = color;
    lineElement.style.strokeWidth = thickness.toFixed(1) + 'px';
    lineElement.style.opacity = opacity.toFixed(2);
    lineElement.style.strokeDasharray = 'none'; // Always solid lines
}

if (typeof window !== 'undefined') window.applyWeightVisualization = applyWeightVisualization;