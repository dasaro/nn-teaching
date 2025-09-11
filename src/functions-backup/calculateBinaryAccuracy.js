function calculateBinaryAccuracy(predictedProbability, isDogActual) {
    const predictedIsDog = predictedProbability > 0.5;
    return predictedIsDog === isDogActual;
}

if (typeof window !== 'undefined') window.calculateBinaryAccuracy = calculateBinaryAccuracy;