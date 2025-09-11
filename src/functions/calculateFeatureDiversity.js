function calculateFeatureDiversity(values) {
    if (values.length < 2) return 0;
    
    let totalVariation = 0;
    for (let i = 0; i < values.length - 1; i++) {
        for (let j = i + 1; j < values.length; j++) {
            totalVariation += Math.abs(values[i] - values[j]);
        }
    }
    
    const maxPossibleVariation = values.length * (values.length - 1) / 2;
    return totalVariation / maxPossibleVariation;
}

if (typeof window !== 'undefined') window.calculateFeatureDiversity = calculateFeatureDiversity;