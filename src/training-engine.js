// ============================================================================
// TRAINING-ENGINE MODULE
// Machine learning training and optimization functions
// ============================================================================

function testOptimalLearningSequence() {
    console.log('=== TESTING OPTIMAL 4-EXAMPLE LEARNING SEQUENCE ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    console.log('\nLearning Examples:');
    examples.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] -> ${ex.isDog ? 'Dog' : 'Not Dog'}`);
        console.log(`  ${ex.description}`);
    });
    
    // Test initial predictions
    console.log('\n--- BEFORE TRAINING ---');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Simple training with reduced learning rate
    const originalLR = networkConfig.learningRate;
    networkConfig.learningRate = 0.05; // Even more conservative
    
    console.log('\n--- TRAINING (Conservative Learning) ---');
    let epoch = 0;
    const maxEpochs = 30;
    
    while (epoch < maxEpochs) {
        // Single pass through examples
        examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
        
        epoch++;
        
        // Check accuracy every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            console.log(`\nEpoch ${epoch} results:`);
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
                console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${isCorrect ? 'CORRECT' : 'WRONG'}`);
            });
            
            const accuracy = correct / examples.length;
            console.log(`Accuracy: ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy === 1.0) {
                console.log(`Perfect accuracy achieved at epoch ${epoch}!`);
                break;
            }
        }
    }
    
    // Restore original learning rate
    networkConfig.learningRate = originalLR;
    
    return {
        examples: examples,
        epochsNeeded: epoch,
        finalAccuracy: examples.map(ex => {
            const output = forwardPropagationSilent(ex.input);
            const dogProb = output[0];
            return (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        }).reduce((sum, correct) => sum + (correct ? 1 : 0), 0) / examples.length
    };
}

function testGeneralization() {
    console.log('=== TESTING GENERALIZATION ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split data: 70% training, 30% testing
    const splitIdx = Math.floor(trainingData.length * 0.7);
    const trainSet = trainingData.slice(0, splitIdx);
    const testSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, testing on ${testSet.length} examples`);
    
    // Train the network
    for (let epoch = 0; epoch < 50; epoch++) {
        trainSet.forEach(example => {
            forwardPropagationSilent(example.input);
            backpropagationSilent(example.target);
        });
    }
    
    // Test on training set
    let trainCorrect = 0;
    trainSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        if (predicted === actual) trainCorrect++;
    });
    
    // Test on test set
    let testCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    testSet.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) testCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const trainAccuracy = trainCorrect / trainSet.length;
    const testAccuracy = testCorrect / testSet.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Training Accuracy: ${(trainAccuracy * 100).toFixed(1)}%`);
    console.log(`Test Accuracy: ${(testAccuracy * 100).toFixed(1)}%`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const generalizationGap = trainAccuracy - testAccuracy;
    const balancedAccuracy = (dogAccuracy + nonDogAccuracy) / 2;
    
    console.log(`Generalization Gap: ${(generalizationGap * 100).toFixed(1)}%`);
    console.log(`Balanced Accuracy: ${(balancedAccuracy * 100).toFixed(1)}%`);
    
    // Good generalization: small gap, high balanced accuracy
    const goodGeneralization = generalizationGap < 0.15 && balancedAccuracy > 0.7;
    
    return {
        passed: goodGeneralization,
        trainAccuracy: trainAccuracy,
        testAccuracy: testAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        generalizationGap: generalizationGap,
        balancedAccuracy: balancedAccuracy,
        message: goodGeneralization ? '✅ PASS: Network generalizes well to both classes' : '❌ FAIL: Poor generalization detected'
    };
}

function runComprehensiveTests() {
    console.log('🧪 RUNNING COMPREHENSIVE NEURAL NETWORK TESTS...\n');
    
    const tests = [
        { name: 'Dead Neuron Prevention', fn: testDeadNeuronPrevention },
        { name: 'Weight Initialization', fn: testWeightInitialization },
        { name: 'Generalization', fn: testGeneralization },
        { name: '100% Accuracy Achievement', fn: test100PercentAccuracy }
    ];
    
    const results = [];
    
    tests.forEach(test => {
        console.log(`\n--- ${test.name.toUpperCase()} ---`);
        const result = test.fn();
        result.testName = test.name;
        results.push(result);
        console.log(result.message);
    });
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const passed = results.filter(r => r.passed).length;
    const total = results.length;
    
    results.forEach(result => {
        console.log(`${result.testName}: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    console.log(`\nOverall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 ALL TESTS PASSED! The neural network is working properly.');
    } else {
        console.log('⚠️ Some tests failed. Check the issues above.');
    }
    
    return {
        passed: passed,
        total: total,
        results: results,
        success: passed === total
    };
}

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
        hiddenErrors[h] = error * tanhDerivative(activations.hidden[h]);
    }
    
    // Update input to hidden weights
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const gradient = hiddenErrors[h] * input[i] * learningRate;
            weights.inputToHidden[h][i] -= gradient;
        }
    }
}

function testBackAndForthLearning() {
    console.log('=== TESTING BACK-AND-FORTH LEARNING STABILITY ===');
    
    const examples = createOptimalLearningSequence();
    initializeNetwork();
    
    // Train on first two examples (one dog, one cat)
    console.log('\n--- PHASE 1: Learning Dog vs Cat ---');
    const phase1Examples = [examples[0], examples[1]]; // PrototypeDog, PrototypeCat
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 1
    console.log('\nAfter learning Dog vs Cat:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Train on next two examples (another dog, an object)
    console.log('\n--- PHASE 2: Adding Family Dog vs Object ---');
    const phase2Examples = [examples[2], examples[3]]; // FamilyDog, Object
    
    for (let epoch = 0; epoch < 15; epoch++) {
        phase2Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Test all examples after phase 2
    console.log('\nAfter adding more examples:');
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    // Go back to training on original examples to test stability
    console.log('\n--- PHASE 3: Returning to Dog vs Cat (stability test) ---');
    
    for (let epoch = 0; epoch < 10; epoch++) {
        phase1Examples.forEach(ex => {
            forwardPropagationSilent(ex.input);
            backpropagationSilent(ex.target);
        });
    }
    
    // Final test
    console.log('\nFinal results after back-and-forth learning:');
    let finalCorrect = 0;
    examples.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
        if (correct) finalCorrect++;
        console.log(`${ex.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
    });
    
    const finalAccuracy = finalCorrect / examples.length;
    const stable = finalAccuracy >= 0.75; // At least 3/4 correct
    
    console.log(`\nStability Test: ${stable ? 'PASSED' : 'FAILED'} (${(finalAccuracy * 100).toFixed(1)}% accuracy)`);
    
    return {
        passed: stable,
        finalAccuracy: finalAccuracy,
        examples: examples,
        message: stable ? '✅ Network maintains learning stability' : '❌ Network shows instability in back-and-forth learning'
    };
}

function testSimpleBinaryAccuracy(dataset) {
    let correct = 0;
    dataset.forEach(example => {
        const output = simpleBinaryForward(example.input);
        const predicted = output > 0.5;
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}

function updateTrainingAnimation(epoch, accuracy) {
    const statusElement = document.querySelector('.training-status');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="spinner"></div>
            <span>Epoch ${epoch} • ${(accuracy * 100).toFixed(1)}%</span>
        `;
    }
}

function stopTrainingAnimation(success = true) {
    const networkArea = document.querySelector('.network-area');
    const statusElement = document.querySelector('.training-status');
    
    if (statusElement) {
        statusElement.innerHTML = `
            <span style="color: ${success ? '#10b981' : '#ef4444'};">${success ? '✅ Complete!' : '⚠️ Stopped'}</span>
        `;
        
        setTimeout(() => {
            networkArea.classList.remove('training');
            if (statusElement && statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
        }, 2000);
    }
    
    console.log(`🎨 Training animation ${success ? 'completed' : 'stopped'}`);
}

function generateSimpleTrainingData() {
    // Generate simple, well-separated training data for better generalization
    const trainingData = [];
    
    // Generate 12 dog examples with clear patterns
    for (let i = 0; i < 12; i++) {
        // Dogs: medium-large, friendly, bark, domestic
        const size = 0.6 + Math.random() * 0.3; // Dogs: medium to large (0.6-0.9)
        const friendliness = 0.8 + Math.random() * 0.2; // Dogs: friendly (0.8-1.0)
        const bark = 0.9 + Math.random() * 0.1; // Dogs: bark a lot (0.9-1.0)
        const domestic = 0.9 + Math.random() * 0.1; // Dogs: highly domestic (0.9-1.0)
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [1, 0],
            label: `Dog${i+1}`,
            isDog: true
        });
    }
    
    // Generate 12 non-dog examples with clear separation
    for (let i = 0; i < 12; i++) {
        let size, friendliness, bark, domestic, label;
        
        if (i < 6) {
            // Cats - clearly different from dogs
            size = 0.2 + Math.random() * 0.2; // Small (0.2-0.4)
            friendliness = 0.4 + Math.random() * 0.3; // Moderate (0.4-0.7)
            bark = 0.0 + Math.random() * 0.1; // Don't bark (0.0-0.1)
            domestic = 0.6 + Math.random() * 0.2; // Somewhat domestic (0.6-0.8)
            label = `Cat${i+1}`;
        } else {
            // Objects - very different from biological entities
            size = Math.random() * 0.6; // Variable size (0.0-0.6)
            friendliness = 0.0 + Math.random() * 0.1; // No friendliness (0.0-0.1)
            bark = 0.0 + Math.random() * 0.1; // No barking (0.0-0.1)
            domestic = 0.0 + Math.random() * 0.1; // No domestication (0.0-0.1)
            label = `Object${i-5}`;
        }
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [0, 1],
            label: label,
            isDog: false
        });
    }
    
    // Simple shuffling without normalization for better interpretability
    
    // Shuffle the data
    for (let i = trainingData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trainingData[i], trainingData[j]] = [trainingData[j], trainingData[i]];
    }
    
    return trainingData;
}

function detectConvergenceIssues(trainingData) {
    const recentCount = Math.min(10, convergenceAnalysis.lossHistory.length);
    if (recentCount < 5) return; // Need at least 5 data points
    
    console.log(`\n📈 ===== CONVERGENCE ANALYSIS (Epoch ${convergenceAnalysis.epochCount}) =====`);
    
    const recentLoss = convergenceAnalysis.lossHistory.slice(-recentCount);
    const recentAccuracy = convergenceAnalysis.accuracyHistory.slice(-recentCount);
    const recentWeightMag = convergenceAnalysis.weightMagnitudeHistory.slice(-recentCount);
    
    // Loss trend analysis
    const lossChange = recentLoss[recentLoss.length - 1] - recentLoss[0];
    const lossVariance = calculateWeightStats(recentLoss).std;
    console.log(`📊 Loss Analysis:`);
    console.log(`  Current loss: ${recentLoss[recentLoss.length - 1].toFixed(6)}`);
    console.log(`  Change over last ${recentCount} epochs: ${lossChange.toFixed(6)}`);
    console.log(`  Loss variance: ${lossVariance.toFixed(6)}`);
    
    // Accuracy trend analysis
    const accuracyChange = recentAccuracy[recentAccuracy.length - 1] - recentAccuracy[0];
    console.log(`🎯 Accuracy Analysis:`);
    console.log(`  Current accuracy: ${(recentAccuracy[recentAccuracy.length - 1] * 100).toFixed(1)}%`);
    console.log(`  Change over last ${recentCount} epochs: ${(accuracyChange * 100).toFixed(1)}%`);
    
    // Weight magnitude analysis
    const weightChange = recentWeightMag[recentWeightMag.length - 1] - recentWeightMag[0];
    console.log(`⚖️ Weight Analysis:`);
    console.log(`  Current weight magnitude: ${recentWeightMag[recentWeightMag.length - 1].toFixed(6)}`);
    console.log(`  Weight magnitude change: ${weightChange.toFixed(6)}`);
    
    // Convergence detection
    let issuesDetected = [];
    
    // Plateau detection
    if (Math.abs(lossChange) < 1e-6 && lossVariance < 1e-6) {
        issuesDetected.push('Loss plateau - network stopped learning');
        if (!convergenceAnalysis.convergenceDetected) {
            convergenceAnalysis.convergenceDetected = true;
            convergenceAnalysis.convergenceEpoch = convergenceAnalysis.epochCount;
        }
    }
    
    // Accuracy plateau
    if (Math.abs(accuracyChange) < 0.01 && recentAccuracy[recentAccuracy.length - 1] < 0.9) {
        issuesDetected.push('Accuracy plateau - may have reached local minimum');
    }
    
    // Weight stagnation
    if (Math.abs(weightChange) < 1e-6) {
        issuesDetected.push('Weight stagnation - weights barely changing');
    }
    
    // Same prediction issue
    const predictionDiversity = checkPredictionDiversity(trainingData);
    if (predictionDiversity < 0.1) {
        issuesDetected.push('Prediction uniformity - all inputs produce similar outputs');
    }
    
    // Report issues
    if (issuesDetected.length > 0) {
        console.log('\n🚨 CONVERGENCE ISSUES DETECTED:');
        issuesDetected.forEach(issue => console.log(`  ⚠️ ${issue}`));
        
        console.log('\n💡 DEBUGGING SUGGESTIONS:');
        console.log('  • Check feature representation with debugFeatureRepresentation()');
        console.log('  • Verify weight initialization with debugWeightInitialization()');
        console.log('  • Enable weight change monitoring in training loops');
        console.log('  • Consider adjusting learning rate or adding regularization');
    } else {
        console.log('\n✅ No major convergence issues detected');
    }
    
    console.log('📈 =============================================');
}

async function quickHyperparamTest() {
    console.log('🚀 QUICK HYPERPARAMETER TEST (Multiple Trials)');
    
    // Create training dataset once
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? [1, 0] : [0, 1],
            label: imageType,
            isDog: isDog
        });
    });
    
    // Test promising hyperparameter combinations (5 trials each)
    const testSets = [
        [0.4, 0.8, "High LR + High Momentum"],
        [0.5, 0.7, "Very High LR + Med Momentum"],  
        [0.35, 0.85, "Med-High LR + Very High Momentum"],
        [0.45, 0.75, "High LR + Med-High Momentum"],
        [0.3, 0.9, "Med LR + Max Momentum"]
    ];
    
    const results = [];
    
    for (let setIdx = 0; setIdx < testSets.length; setIdx++) {
        const [lr, mom, desc] = testSets[setIdx];
        console.log(`\n📊 Testing: ${desc} (LR=${lr}, Mom=${mom})`);
        
        const trials = [];
        
        // Run 5 trials for statistical validity
        for (let trial = 0; trial < 5; trial++) {
            initializeNetwork(); // Fresh start each trial
            const result = await trainWithHyperparams(trainingData, lr, mom, 100);
            trials.push(result);
            
            const status = result.accuracy === 1.0 ? '🏆' : result.accuracy >= 0.9 ? '🎯' : '📈';
            console.log(`  Trial ${trial+1}: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
        }
        
        // Calculate statistics
        const accuracies = trials.map(t => t.accuracy);
        const epochs = trials.map(t => t.epochs);
        const perfectTrials = trials.filter(t => t.accuracy === 1.0).length;
        
        const avgAccuracy = accuracies.reduce((a,b) => a+b, 0) / 5;
        const avgEpochs = epochs.reduce((a,b) => a+b, 0) / 5;
        const bestEpochs = Math.min(...epochs);
        const worstEpochs = Math.max(...epochs);
        
        results.push({
            description: desc,
            learningRate: lr,
            momentum: mom,
            avgAccuracy,
            avgEpochs,
            bestEpochs,
            worstEpochs,
            perfectTrials,
            consistency: 1 - (worstEpochs - bestEpochs) / avgEpochs // Lower variation = more consistent
        });
        
        console.log(`  📊 Stats: ${(avgAccuracy*100).toFixed(1)}% avg, ${avgEpochs.toFixed(1)} avg epochs, ${perfectTrials}/5 perfect`);
    }
    
    // Rank results by success rate, then speed
    results.sort((a, b) => {
        if (a.perfectTrials !== b.perfectTrials) return b.perfectTrials - a.perfectTrials;
        if (a.avgAccuracy !== b.avgAccuracy) return b.avgAccuracy - a.avgAccuracy;
        return a.avgEpochs - b.avgEpochs;
    });
    
    console.log('\n🏆 FINAL HYPERPARAMETER RANKINGS:');
    console.log('=' .repeat(70));
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Momentum=${result.momentum}`);
        console.log(`     Success: ${result.perfectTrials}/5 perfect (${(result.avgAccuracy*100).toFixed(1)}% avg)`);
        console.log(`     Speed: ${result.avgEpochs.toFixed(1)} avg epochs (best: ${result.bestEpochs}, worst: ${result.worstEpochs})`);
        console.log(`     Consistency: ${(result.consistency*100).toFixed(1)}%`);
        console.log('');
    });
    
    const winner = results[0];
    console.log('🎯 RECOMMENDED HYPERPARAMETERS:');
    console.log(`Learning Rate: ${winner.learningRate}`);
    console.log(`Momentum: ${winner.momentum}`);
    console.log(`Expected: ${winner.perfectTrials}/5 chance of 100%, avg ${winner.avgEpochs.toFixed(1)} epochs`);
    
    return winner;
}

function applyAntiStagnationMeasures(trainingState, trainingConfig) {
    // Add small random noise to weights
    const noiseScale = 0.01;
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            weights.inputToHidden[h][i] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            weights.hiddenToOutput[o][h] += (Math.random() - 0.5) * noiseScale;
        }
    }
    
    // Boost learning rate temporarily
    trainingState.currentLearningRate = Math.min(
        trainingState.currentLearningRate * 1.5,
        trainingConfig.initialLearningRate
    );
    
}

function testDeadNeuronPrevention() {
    console.log('=== TESTING DEAD NEURON PREVENTION ===');
    
    initializeNetwork();
    
    // Create a scenario that would cause dead neurons with regular ReLU
    // Set some weights to very negative values
    weights.inputToHidden[0][0] = -10;
    weights.inputToHidden[1][1] = -8;
    
    // Test with different inputs
    const testInputs = [
        [0.5, 0.5, 0.5, 0.5],
        [0.1, 0.9, 0.3, 0.7],
        [0.8, 0.2, 0.6, 0.4]
    ];
    
    let deadNeuronCount = 0;
    let totalActivations = 0;
    
    testInputs.forEach((input, idx) => {
        const output = forwardPropagationSilent(input);
        
        activations.hidden.forEach((activation, neuronIdx) => {
            if (Math.abs(activation) < 1e-10) {
                deadNeuronCount++;
            }
            totalActivations++;
        });
        
        console.log(`Test ${idx + 1}: Hidden=[${activations.hidden.map(a => a.toFixed(3)).join(', ')}] Output=[${output.map(o => o.toFixed(3)).join(', ')}]`);
    });
    
    const deadNeuronRate = deadNeuronCount / totalActivations;
    console.log(`Dead Neuron Rate: ${(deadNeuronRate * 100).toFixed(1)}% (${deadNeuronCount}/${totalActivations})`);
    
    return {
        passed: deadNeuronRate < 0.3, // Less than 30% dead neurons is acceptable
        deadNeuronRate: deadNeuronRate,
        message: deadNeuronRate < 0.3 ? '✅ PASS: Leaky ReLU prevents most dead neurons' : '❌ FAIL: Too many dead neurons detected'
    };
}

function testSimplifiedNetwork() {
    console.log('=== TESTING 4-NEURON NETWORK SUFFICIENCY ===');
    
    const examples = createOptimalLearningSequence();
    const results = [];
    
    // Test multiple random initializations
    for (let trial = 0; trial < 5; trial++) {
        initializeNetwork();
        
        let epoch = 0;
        const maxEpochs = 50;
        let finalAccuracy = 0;
        
        while (epoch < maxEpochs) {
            examples.forEach(ex => {
                forwardPropagationSilent(ex.input);
                backpropagationSilent(ex.target);
            });
            epoch++;
            
            // Check accuracy
            let correct = 0;
            examples.forEach(ex => {
                const output = forwardPropagationSilent(ex.input);
                const dogProb = output[0];
                const isCorrect = (ex.isDog && dogProb > 0.5) || (!ex.isDog && dogProb <= 0.5);
                if (isCorrect) correct++;
            });
            
            finalAccuracy = correct / examples.length;
            if (finalAccuracy === 1.0) break; // Early stopping
        }
        
        results.push({
            trial: trial + 1,
            epochs: epoch,
            accuracy: finalAccuracy
        });
        
        console.log(`Trial ${trial + 1}: ${(finalAccuracy * 100).toFixed(1)}% accuracy in ${epoch} epochs`);
    }
    
    const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;
    const perfectTrials = results.filter(r => r.accuracy === 1.0).length;
    const avgEpochs = results.reduce((sum, r) => sum + r.epochs, 0) / results.length;
    
    console.log(`\nSummary: ${perfectTrials}/5 trials achieved 100% accuracy`);
    console.log(`Average accuracy: ${(avgAccuracy * 100).toFixed(1)}%`);
    console.log(`Average epochs needed: ${avgEpochs.toFixed(1)}`);
    
    const sufficient = avgAccuracy >= 0.9; // 90% average accuracy
    
    return {
        passed: sufficient,
        avgAccuracy: avgAccuracy,
        perfectTrials: perfectTrials,
        avgEpochs: avgEpochs,
        message: sufficient ? '✅ 4 neurons are sufficient for this task' : '❌ 4 neurons may be insufficient'
    };
}

function testWeightInitialization() {
    console.log('=== TESTING WEIGHT INITIALIZATION ===');
    
    const numTests = 10;
    const results = [];
    
    for (let test = 0; test < numTests; test++) {
        initializeNetwork();
        
        // Check weight distribution
        const allWeights = [
            ...weights.inputToHidden.flat(),
            ...weights.hiddenToOutput.flat()
        ];
        
        const mean = allWeights.reduce((sum, w) => sum + w, 0) / allWeights.length;
        const variance = allWeights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / allWeights.length;
        const std = Math.sqrt(variance);
        
        // Test initial forward pass - shouldn't have extreme activations
        const testInput = [0.5, 0.5, 0.5, 0.5];
        const output = forwardPropagationSilent(testInput);
        
        const maxHiddenActivation = Math.max(...activations.hidden.map(Math.abs));
        const outputSum = output.reduce((sum, val) => sum + val, 0);
        
        results.push({
            mean: mean,
            std: std,
            maxHiddenActivation: maxHiddenActivation,
            outputSum: outputSum
        });
    }
    
    // Analyze results
    const avgMean = results.reduce((sum, r) => sum + Math.abs(r.mean), 0) / results.length;
    const avgStd = results.reduce((sum, r) => sum + r.std, 0) / results.length;
    const avgMaxHidden = results.reduce((sum, r) => sum + r.maxHiddenActivation, 0) / results.length;
    
    console.log(`Average weight mean: ${avgMean.toFixed(4)} (should be close to 0)`);
    console.log(`Average weight std: ${avgStd.toFixed(4)} (should be reasonable for He init)`);
    console.log(`Average max hidden activation: ${avgMaxHidden.toFixed(3)} (shouldn't be extreme)`);
    
    // Good initialization: mean near 0, reasonable std, no extreme activations
    const goodInit = avgMean < 0.1 && avgStd > 0.1 && avgStd < 1.0 && avgMaxHidden < 10;
    
    return {
        passed: goodInit,
        avgMean: avgMean,
        avgStd: avgStd,
        avgMaxHidden: avgMaxHidden,
        message: goodInit ? '✅ PASS: Weight initialization is good' : '❌ FAIL: Poor weight initialization'
    };
}

function simpleBinaryForward(input) {
    // Input to hidden
    const hidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += input[i] * weights.inputToHidden[h][i];
        }
        hidden[h] = tanhActivation(sum); // Use tanh activation (-1 to 1)
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

function startTrainingAnimation() {
    const networkArea = document.querySelector('.network-area');
    const statusElement = document.createElement('div');
    statusElement.className = 'training-status';
    statusElement.innerHTML = `
        <div class="spinner"></div>
        <span>AI Training...</span>
    `;
    
    networkArea.classList.add('training');
    networkArea.appendChild(statusElement);
    
    console.log('🎨 Training animation started');
}

function createOptimalLearningSequence() {
    return [
        // Example 1: Clear Dog - maximally dog-like features
        {
            input: [0.8, 0.9, 1.0, 0.95], // large, very friendly, always barks, highly domestic
            target: [1, 0],
            label: 'PrototypeDog',
            isDog: true,
            description: 'Large, very friendly dog that barks and is highly domesticated'
        },
        
        // Example 2: Clear Non-Dog (Cat) - maximally different from dogs
        {
            input: [0.3, 0.6, 0.05, 0.75], // small, moderately friendly, rarely barks, somewhat domestic
            target: [0, 1],
            label: 'PrototypeCat',
            isDog: false,
            description: 'Small, moderately friendly cat that rarely makes noise'
        },
        
        // Example 3: Another Dog - different but clearly dog
        {
            input: [0.65, 0.85, 0.9, 0.9], // medium-large, friendly, barks often, domestic
            target: [1, 0],
            label: 'FamilyDog',
            isDog: true,
            description: 'Medium family dog that is friendly and barks'
        },
        
        // Example 4: Non-Dog Object - completely non-biological
        {
            input: [0.4, 0.05, 0.0, 0.0], // medium size, no friendliness, no barking, not domestic
            target: [0, 1],
            label: 'Object',
            isDog: false,
            description: 'Inanimate object with no biological properties'
        }
    ];
}

function adaptLearningRate(trainingState, trainingConfig, accuracy, loss) {
    const history = trainingState.convergenceHistory;
    
    if (history.length < 5) return; // Need some history
    
    const recent = history.slice(-5);
    const improvementRate = (recent[4].accuracy - recent[0].accuracy) / 5;
    
    // Adaptive learning rate based on progress
    if (accuracy >= trainingConfig.adaptiveThreshold) {
        // Fine-tuning phase - reduce learning rate
        trainingState.currentLearningRate *= 0.95;
    } else if (improvementRate < 0.01 && trainingState.stagnationCounter > 5) {
        // Stagnation detected - boost learning rate temporarily
        trainingState.currentLearningRate = Math.min(
            trainingState.currentLearningRate * 1.2, 
            trainingConfig.initialLearningRate
        );
    } else if (accuracy < 0.7) {
        // Early training - maintain higher learning rate
        trainingState.currentLearningRate = Math.max(
            trainingState.currentLearningRate,
            trainingConfig.initialLearningRate * 0.8
        );
    } else {
        // Normal decay
        trainingState.currentLearningRate *= trainingConfig.learningRateDecay;
    }
    
    // Enforce bounds
    trainingState.currentLearningRate = Math.max(
        trainingConfig.minLearningRate,
        Math.min(trainingConfig.initialLearningRate, trainingState.currentLearningRate)
    );
}

function testAccuracy(dataset) {
    let correct = 0;
    let debugLog = [];
    
    dataset.forEach((example, idx) => {
        const output = forwardPropagationSilent(example.input);
        // With softmax outputs, compare probabilities: output[0] = dog prob, output[1] = not-dog prob
        const predicted = output[0] > output[1]; // True if dog probability > not-dog probability
        const isCorrect = predicted === example.isDog;
        if (isCorrect) correct++;
        
        debugLog.push(`${example.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted ? 'DOG' : 'NOT-DOG'} (actual: ${example.isDog ? 'DOG' : 'NOT-DOG'}) ${isCorrect ? '✅' : '❌'}`);
    });
    
    // Debug: Log all predictions if accuracy is exactly 50%
    const accuracy = correct / dataset.length;
    if (Math.abs(accuracy - 0.5) < 0.001) {
        console.log('🚨 DEBUG: Exactly 50% accuracy detected! Full predictions:');
        debugLog.forEach(log => console.log('  ' + log));
    }
    
    return accuracy;
}

async function debugTraining() {
    console.log('🔬 MANUAL TRAINING DEBUG');
    
    // Create a simple 2-example dataset manually
    const debugData = [
        {
            input: [0.9, 0.8, 0.9, 0.8], // Clear DOG pattern
            target: [1, 0], // Should predict DOG
            label: 'test_dog',
            isDog: true
        },
        {
            input: [0.2, 0.1, 0.2, 0.3], // Clear NOT-DOG pattern  
            target: [0, 1], // Should predict NOT-DOG
            label: 'test_not_dog',
            isDog: false
        }
    ];
    
    console.log('🎯 Debug dataset:');
    debugData.forEach(ex => {
        console.log(`${ex.label}: [${ex.input.join(', ')}] → target: [${ex.target.join(', ')}]`);
    });
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions
    console.log('\n📊 INITIAL PREDICTIONS (before training):');
    debugData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted}`);
    });
    
    // Train for a few epochs manually
    const lr = 0.5; // High learning rate for debugging
    const mom = 0.9;
    
    const momentumInputToHidden = Array(networkConfig.hiddenSize).fill(0).map(() => 
        Array(networkConfig.inputSize).fill(0)
    );
    const momentumHiddenToOutput = Array(networkConfig.outputSize).fill(0).map(() => 
        Array(networkConfig.hiddenSize).fill(0)
    );
    
    for (let epoch = 1; epoch <= 10; epoch++) {
        let totalLoss = 0;
        
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            
            // Calculate loss
            const loss = -ex.target.reduce((sum, target, i) => {
                return sum + target * Math.log(Math.max(output[i], 1e-15));
            }, 0);
            totalLoss += loss;
            
            // Backprop
            backpropagationWithMomentum(ex.target, lr, mom, momentumInputToHidden, momentumHiddenToOutput);
        });
        
        const avgLoss = totalLoss / debugData.length;
        let correct = 0;
        
        console.log(`\n--- Epoch ${epoch} (Loss: ${avgLoss.toFixed(4)}) ---`);
        debugData.forEach(ex => {
            const output = forwardPropagationSilent(ex.input);
            const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
            const isCorrect = (output[0] > output[1]) === ex.isDog;
            if (isCorrect) correct++;
            
            const status = isCorrect ? '✅' : '❌';
            console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} ${status}`);
        });
        
        const accuracy = correct / debugData.length;
        console.log(`Accuracy: ${(accuracy*100).toFixed(1)}%`);
        
        if (accuracy === 1.0) {
            console.log(`🎉 Perfect accuracy achieved in ${epoch} epochs!`);
            break;
        }
    }
}

function enableConvergenceAnalysis() {
    convergenceAnalysis.enabled = true;
    convergenceAnalysis.epochCount = 0;
    convergenceAnalysis.lossHistory = [];
    convergenceAnalysis.accuracyHistory = [];
    convergenceAnalysis.weightMagnitudeHistory = [];
    convergenceAnalysis.gradientMagnitudeHistory = [];
    convergenceAnalysis.convergenceDetected = false;
    convergenceAnalysis.convergenceEpoch = -1;
    console.log('🔍 CONVERGENCE ANALYSIS ENABLED');
}

function initializeOptimalWeights() {
    // Xavier/Glorot initialization for better convergence
    const inputFanIn = networkConfig.inputSize;
    const hiddenFanIn = networkConfig.hiddenSize;
    
    // Input to hidden weights
    const inputToHiddenVariance = Math.sqrt(2.0 / (inputFanIn + networkConfig.hiddenSize));
    weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
        Array.from({length: networkConfig.inputSize}, () => 
            (Math.random() * 2 - 1) * inputToHiddenVariance)
    );
    
    // Hidden to output weights
    const hiddenToOutputVariance = Math.sqrt(2.0 / (hiddenFanIn + networkConfig.outputSize));
    weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
        Array.from({length: networkConfig.hiddenSize}, () => 
            (Math.random() * 2 - 1) * hiddenToOutputVariance)
    );
    
}

async function tuneHyperparameters() {
    console.log('🔬 HYPERPARAMETER TUNING EXPERIMENT');
    console.log('Testing different combinations for optimal convergence...\n');
    
    // Create training dataset
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const trainingData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        trainingData.push({
            input: [...activations.input],
            target: isDog ? [1, 0] : [0, 1],
            label: imageType,
            isDog: isDog
        });
    });
    
    // Hyperparameter combinations to test
    const hyperparamSets = [
        // Format: [learningRate, initialMomentum, maxEpochs, description]
        [0.5, 0.8, 150, "High LR, High Momentum"],
        [0.4, 0.7, 150, "Medium-High LR, Med-High Momentum"],
        [0.3, 0.7, 150, "Medium LR, Medium Momentum (Current)"],
        [0.25, 0.8, 150, "Med-Low LR, High Momentum"],
        [0.2, 0.9, 150, "Low LR, Very High Momentum"],
        [0.6, 0.5, 150, "Very High LR, Low Momentum"],
        [0.35, 0.6, 150, "Med LR, Med-Low Momentum"],
        [0.45, 0.85, 120, "High LR, Very High Momentum, Early Stop"],
        [0.3, 0.75, 200, "Medium LR, Med-High Momentum, Extended"],
        [0.4, 0.9, 100, "Med-High LR, Max Momentum, Quick Stop"]
    ];
    
    const results = [];
    
    for (let i = 0; i < hyperparamSets.length; i++) {
        const [learningRate, momentum, maxEpochs, description] = hyperparamSets[i];
        
        console.log(`\n--- Test ${i+1}/${hyperparamSets.length}: ${description} ---`);
        console.log(`LR: ${learningRate}, Momentum: ${momentum}, Max Epochs: ${maxEpochs}`);
        
        // Reset network for fair comparison
        initializeNetwork();
        
        // Run training with these hyperparameters
        const result = await trainWithHyperparams(trainingData, learningRate, momentum, maxEpochs);
        
        results.push({
            index: i + 1,
            description,
            learningRate,
            momentum,
            maxEpochs,
            ...result
        });
        
        // Log result
        const status = result.accuracy === 1.0 ? '🏆 PERFECT' : result.accuracy >= 0.9 ? '🎯 EXCELLENT' : '📈 GOOD';
        console.log(`Result: ${(result.accuracy*100).toFixed(1)}% in ${result.epochs} epochs ${status}`);
    }
    
    // Analyze results
    console.log('\n🏆 HYPERPARAMETER TUNING RESULTS:');
    console.log('=' .repeat(80));
    
    // Sort by performance (accuracy first, then speed)
    results.sort((a, b) => {
        if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
        return a.epochs - b.epochs;
    });
    
    results.forEach((result, rank) => {
        const medal = rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '  ';
        const perfLabel = result.accuracy === 1.0 ? 'PERFECT' : `${(result.accuracy*100).toFixed(1)}%`;
        
        console.log(`${medal} #${rank+1}: ${result.description}`);
        console.log(`     LR=${result.learningRate}, Mom=${result.momentum} → ${perfLabel} in ${result.epochs} epochs`);
        console.log(`     Avg Confidence: ${(result.avgConfidence*100).toFixed(1)}%, Efficiency: ${result.efficiency.toFixed(2)}`);
        console.log('');
    });
    
    // Recommend best hyperparameters
    const best = results[0];
    console.log('🎯 RECOMMENDATION:');
    console.log(`Best hyperparameters: LR=${best.learningRate}, Momentum=${best.momentum}`);
    console.log(`Expected performance: ${(best.accuracy*100).toFixed(1)}% accuracy in ~${best.epochs} epochs`);
    
    return best;
}

function runLearningTest() {
    console.log('=== STARTING LEARNING TEST ===');
    
    // Generate simple training data
    const testCases = generateSimpleTrainingData();
    console.log(`Generated ${testCases.length} simple training examples (${testCases.filter(t => t.isDog).length} dogs, ${testCases.filter(t => !t.isDog).length} non-dogs)`);
    
    // Reset network
    initializeNetwork();
    
    // Test initial predictions (before training)
    console.log('--- BEFORE TRAINING ---');
    const initialResults = [];
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'}`);
        initialResults.push({ correct, confidence: Math.abs(dogProb - 0.5) });
    });
    
    // Simple, stable training approach
    const maxEpochs = 50;
    console.log(`--- TRAINING FOR UP TO ${maxEpochs} EPOCHS (simple approach) ---`);
    
    let epoch = 0;
    let perfectAccuracyCount = 0;
    
    while (epoch < maxEpochs && perfectAccuracyCount < 3) {
        // Simple training: one pass through all examples
        testCases.forEach(testCase => {
            forwardPropagationSilent(testCase.input);
            backpropagationSilent(testCase.target);
        });
        epoch++;
        
        // Test accuracy every epoch
        let correct = 0;
        testCases.forEach(testCase => {
            const output = forwardPropagationSilent(testCase.input);
            const dogProb = output[0];
            const isCorrect = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
            if (isCorrect) correct++;
        });
        
        const accuracy = correct / testCases.length;
        console.log(`Epoch ${epoch}: Accuracy = ${correct}/${testCases.length} (${(accuracy*100).toFixed(1)}%)`);
        
        // Early stopping if perfect accuracy achieved 3 times in a row
        if (accuracy === 1.0) {
            perfectAccuracyCount++;
            console.log(`Perfect accuracy achieved ${perfectAccuracyCount}/3 times`);
        } else {
            perfectAccuracyCount = 0;
        }
        
        // Stop if converged
        if (perfectAccuracyCount >= 3) {
            console.log(`🎉 CONVERGED! Perfect accuracy maintained for 3 epochs. Total training: ${epoch} epochs`);
            break;
        }
    }
    
    // Test final predictions (after training)
    console.log('--- AFTER TRAINING ---');
    let finalCorrect = 0;
    let totalConfidence = 0;
    
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        const confidence = Math.abs(dogProb - 0.5);
        
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? 'CORRECT' : 'WRONG'} (confidence: ${(confidence*100).toFixed(1)}%)`);
        
        if (correct) finalCorrect++;
        totalConfidence += confidence;
    });
    
    const finalAccuracy = finalCorrect / testCases.length;
    const avgConfidence = totalConfidence / testCases.length;
    
    console.log('=== LEARNING TEST RESULTS ===');
    console.log(`Final Accuracy: ${finalCorrect}/${testCases.length} (${(finalAccuracy*100).toFixed(1)}%)`);
    console.log(`Average Confidence: ${(avgConfidence*100).toFixed(1)}%`);
    console.log(`Training Epochs Used: ${epoch} epochs`);
    console.log(`Learning Success: ${finalAccuracy === 1.0 ? 'PERFECT! 🎉' : finalAccuracy >= 0.8 ? 'GOOD ✅' : 'NEEDS WORK ❌'}`);
    
    // Calculate training rounds needed for users
    const trainingRoundsNeeded = Math.ceil(epoch / 2); // Each user demo = ~2 epochs worth of training
    console.log(`📊 USER TRAINING ESTIMATE: Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times to reach 100% accuracy`);
    
    // Update UI with test results  
    updateStepInfoDual(
        `🧪 <strong>Test Results:</strong> ${(finalAccuracy*100).toFixed(1)}% accuracy after ${epoch} training rounds!<br>
        📈 <strong>Estimate:</strong> Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times for 100% accuracy!<br>
        ${finalAccuracy === 1.0 ? '🎉 PERFECT - The AI is now a pro!' : finalAccuracy >= 0.8 ? '✅ GOOD - The AI is getting smart!' : '❌ NEEDS MORE PRACTICE - Keep training!'}`,
        `🧪 <strong>Training Assessment:</strong><br>
        📊 Final Accuracy: ${(finalAccuracy*100).toFixed(1)}% (${epoch} epochs)<br>
        📈 Estimated Rounds for 100%: ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1}<br>
        🎯 Status: ${finalAccuracy === 1.0 ? 'OPTIMAL' : finalAccuracy >= 0.8 ? 'GOOD' : 'SUBOPTIMAL'}`
    );
    
    // Redraw network with updated weights
    drawNetwork();
    
    return { 
        accuracy: finalAccuracy, 
        confidence: avgConfidence, 
        epochs: epoch,
        userTrainingRounds: trainingRoundsNeeded,
        passed: finalAccuracy === 1.0 
    };
}

function test100PercentAccuracy() {
    console.log('=== TESTING 100% ACCURACY TARGET ===');
    
    initializeNetwork();
    const trainingData = generateBalancedTrainingData();
    
    // Split into train/validation sets
    const splitIdx = Math.floor(trainingData.length * 0.8);
    const trainSet = trainingData.slice(0, splitIdx);
    const validSet = trainingData.slice(splitIdx);
    
    console.log(`Training on ${trainSet.length} examples, validating on ${validSet.length} examples`);
    
    // Train with advanced techniques
    let epoch = 0;
    let bestAccuracy = 0;
    let perfectEpochs = 0;
    const maxEpochs = 200;
    
    while (epoch < maxEpochs && perfectEpochs < 10) {
        // Curriculum learning with increasing difficulty
        const curriculumSize = Math.min(20 + epoch * 2, trainSet.length);
        const currentSet = trainSet.slice(0, curriculumSize);
        
        // Adaptive learning rate
        networkConfig.learningRate = Math.max(0.01, 0.3 * Math.exp(-epoch * 0.015));
        
        // Multiple passes per epoch
        const passes = epoch < 50 ? 8 : epoch < 100 ? 5 : 3;
        for (let pass = 0; pass < passes; pass++) {
            currentSet.forEach(example => {
                forwardPropagationSilent(example.input);
                backpropagationSilent(example.target);
            });
        }
        
        epoch++;
        
        // Test on validation set every 10 epochs
        if (epoch % 10 === 0) {
            let correct = 0;
            validSet.forEach(example => {
                const output = forwardPropagationSilent(example.input);
                const predicted = output[0] > output[1];
                if (predicted === example.isDog) correct++;
            });
            
            const accuracy = correct / validSet.length;
            console.log(`Epoch ${epoch}: Validation Accuracy = ${(accuracy * 100).toFixed(1)}%`);
            
            if (accuracy > bestAccuracy) {
                bestAccuracy = accuracy;
                perfectEpochs = 0;
            }
            
            if (accuracy === 1.0) {
                perfectEpochs++;
                console.log(`Perfect accuracy achieved! (${perfectEpochs}/10 confirmations)`);
            }
        }
    }
    
    // Final comprehensive test on all data
    let totalCorrect = 0;
    let dogCorrect = 0, dogTotal = 0;
    let nonDogCorrect = 0, nonDogTotal = 0;
    
    trainingData.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const actual = example.isDog;
        
        if (predicted === actual) totalCorrect++;
        
        if (actual) {
            dogTotal++;
            if (predicted) dogCorrect++;
        } else {
            nonDogTotal++;
            if (!predicted) nonDogCorrect++;
        }
    });
    
    const overallAccuracy = totalCorrect / trainingData.length;
    const dogAccuracy = dogCorrect / dogTotal;
    const nonDogAccuracy = nonDogCorrect / nonDogTotal;
    
    console.log(`Final Results after ${epoch} epochs:`);
    console.log(`Overall Accuracy: ${(overallAccuracy * 100).toFixed(1)}% (${totalCorrect}/${trainingData.length})`);
    console.log(`Dog Accuracy: ${(dogAccuracy * 100).toFixed(1)}% (${dogCorrect}/${dogTotal})`);
    console.log(`Non-Dog Accuracy: ${(nonDogAccuracy * 100).toFixed(1)}% (${nonDogCorrect}/${nonDogTotal})`);
    
    const achieved100Percent = overallAccuracy === 1.0 && dogAccuracy === 1.0 && nonDogAccuracy === 1.0;
    
    return {
        passed: achieved100Percent,
        overallAccuracy: overallAccuracy,
        dogAccuracy: dogAccuracy,
        nonDogAccuracy: nonDogAccuracy,
        epochsUsed: epoch,
        message: achieved100Percent ? '🎉 PERFECT! 100% accuracy achieved on all classes!' : 
                `❌ Failed to reach 100% accuracy. Best: ${(Math.max(overallAccuracy, dogAccuracy, nonDogAccuracy) * 100).toFixed(1)}%`
    };
}

function analyzeConvergence(loss, accuracy, trainingData) {
    if (!convergenceAnalysis.enabled) return;
    
    convergenceAnalysis.epochCount++;
    
    // Record metrics
    convergenceAnalysis.lossHistory.push(loss);
    convergenceAnalysis.accuracyHistory.push(accuracy);
    
    // Calculate weight magnitude
    const allWeights = [
        ...weights.inputToHidden.flat(),
        ...weights.hiddenToOutput.flat()
    ];
    const weightMagnitude = Math.sqrt(allWeights.reduce((sum, w) => sum + w*w, 0));
    convergenceAnalysis.weightMagnitudeHistory.push(weightMagnitude);
    
    // Keep only recent history
    if (convergenceAnalysis.lossHistory.length > convergenceAnalysis.maxHistoryLength) {
        convergenceAnalysis.lossHistory.shift();
        convergenceAnalysis.accuracyHistory.shift();
        convergenceAnalysis.weightMagnitudeHistory.shift();
        convergenceAnalysis.gradientMagnitudeHistory.shift();
    }
    
    // Check for convergence every 5 epochs
    if (convergenceAnalysis.epochCount % 5 === 0) {
        detectConvergenceIssues(trainingData);
    }
}

function applyConvergenceBoost(trainingState, trainingConfig) {
    // Increase learning rate and apply focused training
    trainingState.currentLearningRate = trainingConfig.initialLearningRate * 0.8;
    
    // Reset momentum for fresh gradient flow
    trainingState.momentum.inputToHidden.forEach(row => row.fill(0));
    trainingState.momentum.hiddenToOutput.forEach(row => row.fill(0));
    
}

function quickAccuracyTest() {
    console.log('🧪 FULL 8-IMAGE ACCURACY TEST');
    
    // Test with ALL 8 images exactly like training does
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const testData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        testData.push({
            input: [...activations.input], // Copy input array
            target: isDog ? [1, 0] : [0, 1],
            isDog: isDog,
            label: imageType
        });
    });
    
    console.log('📊 Current predictions for all 8 images:');
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1] ? 'DOG' : 'NOT-DOG';
        const isCorrect = (output[0] > output[1]) === ex.isDog;
        const status = isCorrect ? '✅' : '❌';
        console.log(`${ex.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}] → ${predicted} (actual: ${ex.isDog ? 'DOG' : 'NOT-DOG'}) ${status}`);
    });
    
    const accuracy = testAccuracy(testData);
    console.log(`\n🎯 Total accuracy: ${(accuracy * 100).toFixed(1)}% (${accuracy * testData.length}/${testData.length} correct)`);
    
    // Check for bias
    let allPredictedDog = true;
    let allPredictedNotDog = true;
    testData.forEach(ex => {
        const output = forwardPropagationSilent(ex.input);
        const predicted = output[0] > output[1];
        if (predicted) allPredictedNotDog = false;
        if (!predicted) allPredictedDog = false;
    });
    
    if (allPredictedDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as DOG!');
    } else if (allPredictedNotDog) {
        console.log('🚨 BIAS DETECTED: Network predicts EVERYTHING as NOT-DOG!');
    }
    
    return accuracy;
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.testOptimalLearningSequence = testOptimalLearningSequence;
if (typeof window !== 'undefined') window.testGeneralization = testGeneralization;
if (typeof window !== 'undefined') window.runComprehensiveTests = runComprehensiveTests;
if (typeof window !== 'undefined') window.simpleBinaryBackward = simpleBinaryBackward;
if (typeof window !== 'undefined') window.testBackAndForthLearning = testBackAndForthLearning;
if (typeof window !== 'undefined') window.testSimpleBinaryAccuracy = testSimpleBinaryAccuracy;
if (typeof window !== 'undefined') window.updateTrainingAnimation = updateTrainingAnimation;
if (typeof window !== 'undefined') window.stopTrainingAnimation = stopTrainingAnimation;
if (typeof window !== 'undefined') window.generateSimpleTrainingData = generateSimpleTrainingData;
if (typeof window !== 'undefined') window.detectConvergenceIssues = detectConvergenceIssues;
if (typeof window !== 'undefined') window.quickHyperparamTest = quickHyperparamTest;
if (typeof window !== 'undefined') window.applyAntiStagnationMeasures = applyAntiStagnationMeasures;
if (typeof window !== 'undefined') window.testDeadNeuronPrevention = testDeadNeuronPrevention;
if (typeof window !== 'undefined') window.testSimplifiedNetwork = testSimplifiedNetwork;
if (typeof window !== 'undefined') window.testWeightInitialization = testWeightInitialization;
if (typeof window !== 'undefined') window.simpleBinaryForward = simpleBinaryForward;
if (typeof window !== 'undefined') window.startTrainingAnimation = startTrainingAnimation;
if (typeof window !== 'undefined') window.createOptimalLearningSequence = createOptimalLearningSequence;
if (typeof window !== 'undefined') window.adaptLearningRate = adaptLearningRate;
if (typeof window !== 'undefined') window.testAccuracy = testAccuracy;
if (typeof window !== 'undefined') window.debugTraining = debugTraining;
if (typeof window !== 'undefined') window.enableConvergenceAnalysis = enableConvergenceAnalysis;
if (typeof window !== 'undefined') window.initializeOptimalWeights = initializeOptimalWeights;
if (typeof window !== 'undefined') window.tuneHyperparameters = tuneHyperparameters;
if (typeof window !== 'undefined') window.runLearningTest = runLearningTest;
if (typeof window !== 'undefined') window.test100PercentAccuracy = test100PercentAccuracy;
if (typeof window !== 'undefined') window.analyzeConvergence = analyzeConvergence;
if (typeof window !== 'undefined') window.applyConvergenceBoost = applyConvergenceBoost;
if (typeof window !== 'undefined') window.quickAccuracyTest = quickAccuracyTest;
