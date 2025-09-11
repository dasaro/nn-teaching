function checkWeightSymmetry(weightMatrix) {
    if (weightMatrix.length < 2) return 0;
    
    let totalDifference = 0;
    let comparisons = 0;
    
    // Compare each neuron's weights with every other neuron
    for (let i = 0; i < weightMatrix.length - 1; i++) {
        for (let j = i + 1; j < weightMatrix.length; j++) {
            for (let k = 0; k < weightMatrix[i].length; k++) {
                totalDifference += Math.abs(weightMatrix[i][k] - weightMatrix[j][k]);
                comparisons++;
            }
        }
    }
    
    return comparisons > 0 ? totalDifference / comparisons : 0;
}

if (typeof window !== 'undefined') window.checkWeightSymmetry = checkWeightSymmetry;