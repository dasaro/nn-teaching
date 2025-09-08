// COMPLETELY NEW SIMPLE TRAINING ALGORITHM
async function trainToPerfection() {
    if (isAnimating) return;
    console.log('🔄 NEW SIMPLE TRAINING ALGORITHM');
    updateStepInfo('🎯 Starting simple training algorithm...');
    
    // Create training dataset with all 8 image types
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? 1 : 0, // Simple binary target: 1 = dog, 0 = not-dog
            label: imageType,
            isDog: isDog
        });
    });
    
    console.log(`📊 Training data created:`);
    trainingData.forEach((example, i) => {
        console.log(`${i+1}. ${example.label}: [${example.input.join(', ')}] → target: ${example.target}`);
    });
    
    // Initialize network with very simple weights
    initializeNetwork();
    
    // EXTREMELY SIMPLE TRAINING: Just use gradient descent without complex momentum
    const learningRate = 0.3; // Moderate learning rate
    const maxEpochs = 100;
    let bestAccuracy = 0;
    
    for (let epoch = 1; epoch <= maxEpochs; epoch++) {
        let totalError = 0;
        
        // Shuffle data
        const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
        
        // Train on each example
        for (const example of shuffled) {
            // Forward pass - get single output (probability of being a dog)
            const output = simpleBinaryForward(example.input);
            const error = output - example.target;
            totalError += error * error;
            
            // Simple backward pass - update weights directly
            simpleBinaryBackward(example.input, output, example.target, learningRate);
        }
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0 || epoch === 1) {
            const accuracy = testSimpleBinaryAccuracy(trainingData);
            console.log(`Epoch ${epoch}: Accuracy ${(accuracy*100).toFixed(1)}%, Error ${(totalError/trainingData.length).toFixed(4)}`);
            
            // Show predictions for all examples
            console.log('Predictions:');
            trainingData.forEach(ex => {
                const output = simpleBinaryForward(ex.input);
                const predicted = output > 0.5 ? 'DOG' : 'NOT-DOG';
                const actual = ex.isDog ? 'DOG' : 'NOT-DOG';
                const correct = (output > 0.5) === ex.isDog ? '✅' : '❌';
                console.log(`  ${ex.label}: ${output.toFixed(3)} → ${predicted} (${actual}) ${correct}`);
            });
            
            updateStepInfo(`🔄 Epoch ${epoch}: ${(accuracy*100).toFixed(1)}% accuracy`);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
            }
            
            if (accuracy >= 1.0) {
                console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
                updateStepInfo(`🏆 Training Complete! 100% accuracy in ${epoch} epochs`);
                return;
            }
        }
        
        await sleep(100); // Small delay for visualization
    }
    
    const finalAccuracy = testSimpleBinaryAccuracy(trainingData);
    updateStepInfo(`✅ Training Complete: ${(finalAccuracy*100).toFixed(1)}% accuracy`);
    console.log(`Final accuracy: ${(finalAccuracy*100).toFixed(1)}%`);
}

// Simple binary forward propagation (single output: probability of being a dog)
function simpleBinaryForward(input) {
    // Input to hidden
    const hidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += input[i] * weights.inputToHidden[h][i];
        }
        hidden[h] = Math.tanh(sum); // Use tanh activation (-1 to 1)
    }
    
    // Hidden to output (single output)
    let outputSum = 0;
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        outputSum += hidden[h] * weights.hiddenToOutput[0][h]; // Just use first output neuron
    }
    
    // Sigmoid activation for binary classification
    const output = 1 / (1 + Math.exp(-outputSum));
    
    // Store activations for backward pass
    activations.input = input;
    activations.hidden = hidden;
    activations.output = [output, 1 - output]; // For compatibility with existing code
    
    return output;
}

// Simple binary backward propagation
function simpleBinaryBackward(input, output, target, learningRate) {
    // Output error
    const outputError = output - target;
    
    // Update hidden to output weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const gradient = outputError * activations.hidden[h] * learningRate;
        weights.hiddenToOutput[0][h] -= gradient; // Only update first output neuron
    }
    
    // Calculate hidden errors
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const error = outputError * weights.hiddenToOutput[0][h];
        // tanh derivative: 1 - tanh²(x)
        const tanhDerivative = 1 - (activations.hidden[h] * activations.hidden[h]);
        hiddenErrors[h] = error * tanhDerivative;
    }
    
    // Update input to hidden weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const gradient = hiddenErrors[h] * input[i] * learningRate;
            weights.inputToHidden[h][i] -= gradient;
        }
    }
}

// Test accuracy for simple binary classification
function testSimpleBinaryAccuracy(dataset) {
    let correct = 0;
    dataset.forEach(example => {
        const output = simpleBinaryForward(example.input);
        const predicted = output > 0.5;
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}