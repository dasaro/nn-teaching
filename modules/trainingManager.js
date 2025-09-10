// ============================================================================
// TRAINING MANAGER MODULE - Advanced training algorithms and management
// ============================================================================

import { sleep } from '../utils/animation.js';

/**
 * Training Manager - Handles advanced training algorithms and management
 */
export class TrainingManager {
    constructor() {
        this.isTraining = false;
        this.trainingHistory = [];
        console.log('✅ Training Manager: Initialized');
    }

    /**
     * Train network to perfection using simple binary classification
     * Extracted from script.js trainToPerfection() function
     */
    async trainToPerfection(dependencies = {}) {
        const {
            isAnimating,
            currentImage,
            trueLabel,
            activations,
            setVisualFeaturesAndLabel,
            initializeNetwork,
            simpleBinaryForward,
            simpleBinaryBackward,
            testSimpleBinaryAccuracy,
            updateStepInfoDual,
            startTrainingAnimation,
            stopTrainingAnimation,
            updateTrainingAnimation,
            refreshAllConnectionVisuals,
            selectImage,
            setTrueLabel,
            preventAutoLabeling
        } = dependencies;

        if (isAnimating) return;
        console.log('🔄 NEW SIMPLE TRAINING ALGORITHM');
        
        this.isTraining = true;
        
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
                    
                    // Restore original state
                    await this.restoreOriginalState(originalCurrentImage, originalTrueLabel, originalInputActivations, dependencies);
                    
                    refreshAllConnectionVisuals(); // Make weight changes visible immediately
                    this.isTraining = false;
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
        
        // Restore original state
        await this.restoreOriginalState(originalCurrentImage, originalTrueLabel, originalInputActivations, dependencies);
        
        refreshAllConnectionVisuals(); // Make weight changes visible immediately
        this.isTraining = false;
    }

    /**
     * Helper function to restore original state after training
     */
    async restoreOriginalState(originalCurrentImage, originalTrueLabel, originalInputActivations, dependencies) {
        const { selectImage, setTrueLabel } = dependencies;
        
        console.log(`🔄 Restoring original state: image=${originalCurrentImage}, label=${originalTrueLabel}`);
        
        // Access global variables through dependencies or window
        if (typeof window !== 'undefined') {
            window.currentImage = originalCurrentImage;
            window.trueLabel = originalTrueLabel;
            if (window.activations) {
                window.activations.input = originalInputActivations;
            }
            
            // Prevent auto-labeling during restoration (SET BEFORE selectImage!)
            window.preventAutoLabeling = true;
            
            // Update UI to reflect restored state
            selectImage(originalCurrentImage);
            
            // Wait a moment for async image loading, then restore label and re-enable auto-labeling
            setTimeout(() => {
                if (originalTrueLabel) {
                    setTrueLabel(originalTrueLabel);
                }
                window.preventAutoLabeling = false;
                
                // Ensure buttons are properly enabled after restoration
                const forwardBtn = document.getElementById('forwardBtn');
                const fullDemoBtn = document.getElementById('fullDemoBtn');
                const backwardBtn = document.getElementById('backwardBtn');
                
                if (forwardBtn) forwardBtn.disabled = false;
                if (fullDemoBtn) fullDemoBtn.disabled = false;
                if (backwardBtn) backwardBtn.disabled = true;
                
                console.log(`✅ Restoration complete: image=${window.currentImage}, label=${window.trueLabel}`);
            }, 100);
        }
    }

    /**
     * Check if training is currently running
     */
    isTrainingActive() {
        return this.isTraining;
    }

    /**
     * Stop training if running
     */
    stopTraining() {
        this.isTraining = false;
        console.log('🛑 Training stopped');
    }

    /**
     * Get training history
     */
    getTrainingHistory() {
        return [...this.trainingHistory];
    }

    /**
     * Add training session to history
     */
    addTrainingSession(session) {
        this.trainingHistory.push({
            timestamp: new Date().toISOString(),
            ...session
        });
        
        // Keep only last 10 sessions
        if (this.trainingHistory.length > 10) {
            this.trainingHistory = this.trainingHistory.slice(-10);
        }
    }

    /**
     * Train with specific hyperparameters (extracted from script.js)
     * @param {Array} trainingData - Training data samples
     * @param {number} learningRate - Learning rate
     * @param {number} initialMomentum - Initial momentum value
     * @param {number} maxEpochs - Maximum number of epochs
     * @param {Object} dependencies - Required functions and objects
     * @returns {Object} Training results
     */
    async trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs, dependencies) {
        const {
            forwardPropagationSilent,
            backpropagationWithMomentum,
            testAccuracy,
            networkConfig,
            weights
        } = dependencies;

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
                    if (patience >= maxPatience) {
                        console.log(`Early stopping at epoch ${epoch} due to stagnation`);
                        break;
                    }
                }
                
                // Adaptive learning rate
                if (patience > 5) {
                    learningRate *= 0.95; // Reduce learning rate
                    momentum = Math.min(0.95, momentum * 1.01); // Slightly increase momentum
                }
            }
            
            // Progress logging
            if (epoch % 10 === 0 || epoch === 1) {
                const currentAccuracy = testAccuracy(trainingData);
                console.log(`Epoch ${epoch}: Loss = ${(epochLoss/trainingData.length).toFixed(4)}, Accuracy = ${(currentAccuracy*100).toFixed(1)}%`);
            }
        }
        
        // Final evaluation
        const finalAccuracy = testAccuracy(trainingData);
        let avgConfidence = 0;
        trainingData.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            avgConfidence += Math.max(...output);
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
}

// ============================================================================
// GLOBAL INSTANCE AND LEGACY BRIDGE SUPPORT
// ============================================================================

// Create global instance for use by legacy code
export const globalTrainingManager = new TrainingManager();

// Legacy function bridge for backward compatibility
export function trainToPerfectionManaged(dependencies) {
    return globalTrainingManager.trainToPerfection(dependencies);
}

export function trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs, dependencies) {
    return globalTrainingManager.trainWithHyperparams(trainingData, learningRate, initialMomentum, maxEpochs, dependencies);
}

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

console.log('📦 Training Manager module loaded');