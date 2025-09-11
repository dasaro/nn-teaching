function calculateWeightStats(weightArray) {
    const mean = weightArray.reduce((sum, w) => sum + w, 0) / weightArray.length;
    const variance = weightArray.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / weightArray.length;
    const sortedWeights = [...weightArray].sort((a, b) => a - b);
    
    return {
        min: Math.min(...weightArray),
        max: Math.max(...weightArray),
        mean: mean,
        std: Math.sqrt(variance),
        median: sortedWeights[Math.floor(sortedWeights.length / 2)],
        range: Math.max(...weightArray) - Math.min(...weightArray)
    };
}

if (typeof window !== 'undefined') window.calculateWeightStats = calculateWeightStats;