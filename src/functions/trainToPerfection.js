async function trainToPerfection() {
    if (isAnimating) return;
    console.log('🔄 NEW SIMPLE TRAINING ALGORITHM');
    
    // Start the training animation
    startTrainingAnimation();
    
    updateStepInfoDual(
        '🎯 <strong>Starting Auto-Training!</strong><br>🚀 The AI will now practice with different examples to get smarter. Watch as it learns!',
        '🎯 <strong>Auto-Training Initiated</strong><br>📊 Beginning batch training with multiple examples to improve network accuracy.'
    );
    
    // IMPORTANT: Save current user's image and label state before training
    const originalCurrentImage = currentImage;
    const originalTrueLabel = trueLabel;
    const originalInputActivations = [...activations.input];
    
    console.log(`💾 Saved original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    
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
            
            updateStepInfoDual(
                `🔄 <strong>Training Progress - Round ${epoch}</strong><br>🎯 Current accuracy: ${(accuracy*100).toFixed(1)}% - The AI is getting ${accuracy >= 0.8 ? 'really smart' : accuracy >= 0.5 ? 'better' : 'started'}!`,
                `🔄 <strong>Epoch ${epoch}</strong><br>📊 Accuracy: ${(accuracy*100).toFixed(1)}% | Loss: ${((1-accuracy)*100).toFixed(1)}%`
            );
            
            // Update training animation with current progress
            updateTrainingAnimation(epoch, accuracy);
            
            // Update visual representation of weights during training
            refreshAllConnectionVisuals();
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
            }
            
            if (accuracy >= 1.0) {
                console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
                updateStepInfoDual(
                    `🏆 <strong>Perfect Training Complete!</strong><br>🎉 The AI achieved 100% accuracy in just ${epoch} rounds! It's now a master at recognizing dogs!`,
                    `🏆 <strong>Training Complete</strong><br>📊 100% accuracy achieved in ${epoch} epochs. Optimal convergence reached.`
                );
                
                // Stop training animation with success
                stopTrainingAnimation(true);
                
                // IMPORTANT: Restore user's original image and label state after early completion
                console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
                currentImage = originalCurrentImage;
                trueLabel = originalTrueLabel;
                activations.input = originalInputActivations;
                
                // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
                preventAutoLabeling = true;
                
                // Update UI to reflect restored state
                selectImage(originalCurrentImage);
                
                // Wait a moment for async image loading, then restore label and re-enable auto-labeling
                setTimeout(() => {
                    if (originalTrueLabel) {
                        setTrueLabel(originalTrueLabel);
                    }
                    preventAutoLabeling = false;
                    
                    // Ensure buttons are properly enabled after restoration
                    document.getElementById('forwardBtn').disabled = false;
                    document.getElementById('fullDemoBtn').disabled = false;
                    document.getElementById('backwardBtn').disabled = true;
                    
                    console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
                }, 100);
                
                refreshAllConnectionVisuals(); // Make weight changes visible immediately
                return;
            }
        }
        
        await sleep(100); // Small delay for visualization
    }
    
    const finalAccuracy = testSimpleBinaryAccuracy(trainingData);
    updateStepInfoDual(
        `✅ <strong>Auto-Training Finished!</strong><br>🎓 Final result: ${(finalAccuracy*100).toFixed(1)}% accuracy! ${finalAccuracy >= 0.9 ? '🌟 Excellent performance!' : finalAccuracy >= 0.7 ? '👍 Good progress!' : '📚 Needs more practice!'}`,
        `✅ <strong>Training Session Complete</strong><br>📊 Final Accuracy: ${(finalAccuracy*100).toFixed(1)}%`
    );
    console.log(`Final accuracy: ${(finalAccuracy*100).toFixed(1)}%`);
    
    // Stop training animation
    stopTrainingAnimation(finalAccuracy >= 0.8);
    
    // IMPORTANT: Restore user's original image and label state after training
    console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
    currentImage = originalCurrentImage;
    trueLabel = originalTrueLabel;
    activations.input = originalInputActivations;
    
    // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
    preventAutoLabeling = true;
    
    // Update UI to reflect restored state
    selectImage(originalCurrentImage);
    
    // Wait a moment for async image loading, then restore label and re-enable auto-labeling
    setTimeout(() => {
        if (originalTrueLabel) {
            setTrueLabel(originalTrueLabel);
        }
        preventAutoLabeling = false;
        
        // Ensure buttons are properly enabled after restoration
        document.getElementById('forwardBtn').disabled = false;
        document.getElementById('fullDemoBtn').disabled = false;
        document.getElementById('backwardBtn').disabled = true;
        
        console.log(`✅ Restoration complete: image=${currentImage}, label=${trueLabel}`);
    }, 100);
    
    refreshAllConnectionVisuals(); // Make weight changes visible immediately
}

if (typeof window !== 'undefined') window.trainToPerfection = trainToPerfection;