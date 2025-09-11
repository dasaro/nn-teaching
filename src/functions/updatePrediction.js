function updatePrediction() {
    const dogProb = activations.output[0];
    const notDogProb = activations.output[1];
    const predicted = dogProb > 0.5;
    const confidence = Math.abs(dogProb - 0.5) * 2; // 0 to 1 scale
    
    // Determine if prediction is correct
    const expectedDog = trueLabel === 'dog';
    const isCorrect = predicted === expectedDog;
    
    // Update emoji based on prediction and correctness
    let emoji = '🤔'; // default thinking
    let circleColor = '#3b82f6'; // default blue
    
    if (dogProb > 0 || notDogProb > 0) { // Has made a prediction
        if (predicted) {
            emoji = isCorrect ? '🐕✅' : '🐕❌'; // Dog prediction
        } else {
            emoji = isCorrect ? '❌✅' : '❌🐕'; // Not-dog prediction  
        }
        
        // Color based on correctness
        circleColor = isCorrect ? '#10b981' : '#ef4444'; // green/red
    }
    
    // Update elements
    const predictionEmoji = document.getElementById('predictionEmoji');
    const predictionResult = document.getElementById('predictionResult');
    const predictionCircle = document.getElementById('predictionCircle');
    
    if (predictionEmoji) predictionEmoji.textContent = emoji;
    if (predictionCircle) predictionCircle.setAttribute('stroke', circleColor);
    
    if (predictionResult) {
        if (dogProb > 0 || notDogProb > 0) {
            const confidenceText = `${(confidence * 100).toFixed(0)}%`;
            const predictionText = predicted ? 'DOG' : 'NOT-DOG';
            predictionResult.textContent = `${predictionText} (${confidenceText})`;
        } else {
            predictionResult.textContent = 'Thinking...';
        }
    }
}

if (typeof window !== 'undefined') window.updatePrediction = updatePrediction;