function checkPredictionDiversity(trainingData) {
    const predictions = [];
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        predictions.push(output[0]); // Just check first output
    });
    
    const predictionStats = calculateWeightStats(predictions);
    return predictionStats.std; // Higher std = more diverse predictions
}

if (typeof window !== 'undefined') window.checkPredictionDiversity = checkPredictionDiversity;