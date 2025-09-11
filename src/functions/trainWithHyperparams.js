async function trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs) {
    const targetAccuracy = 1.0;
    let epoch = 0;
    let bestAccuracy = 0;
    let patience = 0;
    const maxPatience = 15;
    
    let momentum = initialMomentum;
    
    // Initialize momentum buffers
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    // Training loop
    while (epoch < maxEpochs) {
        epoch++;
        let epochLoss = 0;
        
        // Shuffle training data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        shuffled.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            
            // Calculate loss
            const loss = -example.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            epochLoss += loss;
            
            // Backward pass
            backpropagationWithMomentum(example.target, learningRate, momentum, 
                                      momentumInputToHidden, momentumHiddenToOutput);
        });
        
        // Test accuracy every 5 epochs
        if (epoch % 5 === 0 || epoch === 1) {
            const accuracy = testAccuracy(trainingData);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                patience = 0;
                
                if (accuracy >= targetAccuracy) {
                    break; // Perfect accuracy achieved
                }
            } else {
                patience++;
                
                if (patience >= 5) {
                    learningRate *= 0.85; // Slightly less aggressive reduction
                    momentum = Math.min(0.95, momentum + 0.03);
                }
                
                if (patience >= maxPatience) {
                    break; // Early stopping
                }
            }
        }
    }
    
    // Final test
    const finalAccuracy = testAccuracy(trainingData);
    let avgConfidence = 0;
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const confidence = Math.max(output[0], output[1]);
        avgConfidence += confidence;
    });
    avgConfidence /= trainingData.length;
    
    return {
        accuracy: finalAccuracy,
        epochs: epoch,
        avgConfidence: avgConfidence,
        efficiency: epoch <= 30 ? 1.0 : Math.max(0.3, 30/epoch),
        converged: finalAccuracy >= targetAccuracy
    };
}

if (typeof window !== 'undefined') window.trainWithHyperparams = trainWithHyperparams;