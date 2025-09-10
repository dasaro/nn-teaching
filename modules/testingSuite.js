// ============================================================================
// TESTING SUITE MODULE - All testing and debugging functions
// ============================================================================

import { sleep } from '../utils/animation.js';
import { NETWORK_CONFIG, EXPERT_CONFIG, PERFORMANCE_CONFIG } from '../config/constants.js';

/**
 * Testing Suite - Handles all testing, debugging, and validation functions
 */
export class TestingSuite {
    constructor() {
        this.testResults = [];
        this.debugMode = false;
        console.log('✅ Testing Suite: Initialized');
    }

    /**
     * Quick accuracy test - extracted from script.js
     */
    quickAccuracyTest(dependencies = {}) {
        const {
            forwardPropagationSilent,
            setVisualFeaturesAndLabel,
            activations
        } = dependencies;

        console.log('🧪 Running Quick Accuracy Test...');
        let correct = 0;
        const total = 8;
        
        const testImages = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
        
        testImages.forEach(imageType => {
            setVisualFeaturesAndLabel(imageType);
            const output = forwardPropagationSilent(activations.input);
            
            const isDogPredicted = output[0] > output[1];
            const isDogActual = imageType.startsWith('dog');
            
            if (isDogPredicted === isDogActual) {
                correct++;
            }
            
            console.log(`${imageType}: Predicted ${isDogPredicted ? 'dog' : 'not-dog'}, Actual ${isDogActual ? 'dog' : 'not-dog'} ${isDogPredicted === isDogActual ? '✅' : '❌'}`);
        });
        
        const accuracy = correct / total;
        console.log(`📊 Accuracy: ${(accuracy * 100).toFixed(1)}% (${correct}/${total})`);
        
        return accuracy;
    }

    /**
     * Debug weight initialization - extracted from script.js
     */
    debugWeightInitialization(dependencies = {}) {
        const { weights, networkConfig } = dependencies;
        
        console.log('🔍 Weight Initialization Debug:');
        console.log('Input to Hidden weights:');
        for (let i = 0; i < networkConfig.hiddenSize; i++) {
            console.log(`Hidden ${i}: [${weights.inputToHidden[i].map(w => w.toFixed(3)).join(', ')}]`);
        }
        
        console.log('Hidden to Output weights:');
        for (let i = 0; i < networkConfig.outputSize; i++) {
            console.log(`Output ${i}: [${weights.hiddenToOutput[i].map(w => w.toFixed(3)).join(', ')}]`);
        }
        
        // Check for dead weights (too close to zero)
        let deadWeights = 0;
        const threshold = 0.01;
        
        weights.inputToHidden.forEach((hiddenWeights, h) => {
            hiddenWeights.forEach((weight, i) => {
                if (Math.abs(weight) < threshold) deadWeights++;
            });
        });
        
        weights.hiddenToOutput.forEach((outputWeights, o) => {
            outputWeights.forEach((weight, h) => {
                if (Math.abs(weight) < threshold) deadWeights++;
            });
        });
        
        console.log(`⚠️ Dead weights (|w| < ${threshold}): ${deadWeights}`);
        
        return { deadWeights, threshold };
    }

    /**
     * Debug feature representation - extracted from script.js
     */
    debugFeatureRepresentation(inputValues, context = '') {
        console.log(`🔍 Feature Analysis ${context ? `(${context})` : ''}:`);
        console.log(`Input patterns: [${inputValues.map(v => v.toFixed(2)).join(', ')}]`);
        
        // Analyze pattern type
        const high = inputValues.filter(v => v > 0.5).length;
        const low = inputValues.filter(v => v <= 0.5).length;
        
        console.log(`Pattern analysis: ${high} high values, ${low} low values`);
        
        // Determine if this looks like a dog pattern
        if (inputValues[0] > 0.5 && inputValues[1] > 0.5 && inputValues[2] <= 0.5 && inputValues[3] <= 0.5) {
            console.log('🐕 Pattern type: DOG (HIGH-HIGH-LOW-LOW)');
        } else if (inputValues[0] <= 0.5 && inputValues[1] > 0.5 && inputValues[2] <= 0.5 && inputValues[3] > 0.5) {
            console.log('🐱 Pattern type: NON-DOG (LOW-HIGH-LOW-HIGH)');
        } else if (inputValues[0] > 0.5 && inputValues[1] <= 0.5 && inputValues[2] > 0.5 && inputValues[3] <= 0.5) {
            console.log('🌳 Pattern type: NON-DOG (HIGH-LOW-HIGH-LOW)');
        } else {
            console.log('❓ Pattern type: UNKNOWN/MIXED');
        }
        
        return {
            high,
            low,
            pattern: inputValues,
            context
        };
    }

    /**
     * Debug weight changes - extracted from script.js
     */
    debugWeightChanges(initialWeights, target, dependencies = {}) {
        const { weights } = dependencies;
        
        console.log('🔍 Weight Change Analysis:');
        console.log(`Target: [${target.join(', ')}]`);
        
        let totalChange = 0;
        let significantChanges = 0;
        const threshold = 0.001;
        
        // Compare input to hidden weights
        for (let h = 0; h < weights.inputToHidden.length; h++) {
            for (let i = 0; i < weights.inputToHidden[h].length; i++) {
                const change = Math.abs(weights.inputToHidden[h][i] - initialWeights.inputToHidden[h][i]);
                totalChange += change;
                if (change > threshold) {
                    significantChanges++;
                }
            }
        }
        
        // Compare hidden to output weights
        for (let o = 0; o < weights.hiddenToOutput.length; o++) {
            for (let h = 0; h < weights.hiddenToOutput[o].length; h++) {
                const change = Math.abs(weights.hiddenToOutput[o][h] - initialWeights.hiddenToOutput[o][h]);
                totalChange += change;
                if (change > threshold) {
                    significantChanges++;
                }
            }
        }
        
        console.log(`Total weight change: ${totalChange.toFixed(6)}`);
        console.log(`Significant changes (>${threshold}): ${significantChanges}`);
        
        return {
            totalChange,
            significantChanges,
            threshold
        };
    }

    /**
     * Test optimal learning sequence - extracted from script.js
     */
    testOptimalLearningSequence(dependencies = {}) {
        console.log('🧪 Testing Optimal Learning Sequence...');
        const { 
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations,
            initializeNetwork
        } = dependencies;
        
        // Initialize fresh network
        initializeNetwork();
        
        // Define optimal training sequence
        const sequence = [
            'dog1',   // Clear dog example
            'cat',    // Clear non-dog example  
            'dog2',   // Another dog
            'car',    // Clear non-dog
            'dog3',   // Third dog variant
            'tree'    // Another non-dog
        ];
        
        let accuracy = 0;
        
        sequence.forEach((imageType, step) => {
            console.log(`Step ${step + 1}: Training with ${imageType}`);
            
            setVisualFeaturesAndLabel(imageType);
            const output = forwardPropagationSilent(activations.input);
            
            // Create target
            const target = imageType.startsWith('dog') ? [1, 0] : [0, 1];
            
            // Backpropagate
            backpropagationSilent(target);
            
            // Test current accuracy
            accuracy = this.quickAccuracyTest(dependencies);
            console.log(`After step ${step + 1}: ${(accuracy * 100).toFixed(1)}% accuracy`);
        });
        
        return {
            finalAccuracy: accuracy,
            sequenceLength: sequence.length,
            sequence
        };
    }

    /**
     * Run comprehensive learning test - extracted from script.js
     */
    runLearningTest(dependencies = {}) {
        console.log('🧪 Running Comprehensive Learning Test...');
        const {
            initializeNetwork,
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations
        } = dependencies;
        
        const results = [];
        
        // Test different training approaches
        const approaches = [
            { name: 'Dogs First', sequence: ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car'] },
            { name: 'Alternating', sequence: ['dog1', 'cat', 'dog2', 'bird', 'dog3', 'car'] },
            { name: 'Non-Dogs First', sequence: ['cat', 'bird', 'car', 'dog1', 'dog2', 'dog3'] }
        ];
        
        approaches.forEach(approach => {
            console.log(`\n🔬 Testing approach: ${approach.name}`);
            initializeNetwork();
            
            let finalAccuracy = 0;
            
            approach.sequence.forEach((imageType, step) => {
                setVisualFeaturesAndLabel(imageType);
                const output = forwardPropagationSilent(activations.input);
                const target = imageType.startsWith('dog') ? [1, 0] : [0, 1];
                backpropagationSilent(target);
                
                if (step === approach.sequence.length - 1) {
                    finalAccuracy = this.quickAccuracyTest(dependencies);
                }
            });
            
            results.push({
                approach: approach.name,
                finalAccuracy,
                sequence: approach.sequence
            });
            
            console.log(`${approach.name} final accuracy: ${(finalAccuracy * 100).toFixed(1)}%`);
        });
        
        // Find best approach
        const best = results.reduce((prev, current) => 
            (current.finalAccuracy > prev.finalAccuracy) ? current : prev
        );
        
        console.log(`\n🏆 Best approach: ${best.approach} with ${(best.finalAccuracy * 100).toFixed(1)}% accuracy`);
        
        return {
            results,
            bestApproach: best
        };
    }

    /**
     * Test simple binary accuracy - extracted from script.js
     */
    testSimpleBinaryAccuracy(dataset, dependencies = {}) {
        const { forwardPropagationSilent } = dependencies;
        
        let correct = 0;
        
        dataset.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            const predicted = output > 0.5 ? 1 : 0;
            
            if (predicted === example.target) {
                correct++;
            }
        });
        
        return correct / dataset.length;
    }

    /**
     * Test accuracy with full dataset - extracted from script.js
     */
    testAccuracy(dataset, dependencies = {}) {
        const { forwardPropagationSilent } = dependencies;
        
        let correct = 0;
        
        dataset.forEach(example => {
            const output = forwardPropagationSilent(example.input);
            const predictedClass = output[0] > output[1] ? 0 : 1;
            const actualClass = example.target[0] > example.target[1] ? 0 : 1;
            
            if (predictedClass === actualClass) {
                correct++;
            }
        });
        
        return correct / dataset.length;
    }

    /**
     * Test dead neuron prevention - extracted from script.js
     */
    testDeadNeuronPrevention(dependencies = {}) {
        console.log('🧪 Testing Dead Neuron Prevention...');
        const {
            initializeNetwork,
            weights,
            forwardPropagationSilent,
            networkConfig
        } = dependencies;
        
        initializeNetwork();
        
        // Intentionally create conditions that could cause dead neurons
        weights.inputToHidden[0][0] = -10;  // Very negative weight
        weights.inputToHidden[1][1] = -8;
        
        const testInputs = [
            [1, 1, 0, 0],  // High activation scenario
            [0.5, 0.5, 0.5, 0.5],  // Medium activation
            [0.1, 0.1, 0.1, 0.1]   // Low activation
        ];
        
        const results = [];
        
        testInputs.forEach((input, i) => {
            const output = forwardPropagationSilent(input);
            console.log(`Test ${i + 1}: Input [${input.join(', ')}] → Output [${output.map(o => o.toFixed(3)).join(', ')}]`);
            
            results.push({
                input,
                output,
                hasDeadNeurons: output.some(o => o === 0)
            });
        });
        
        const deadNeuronCount = results.filter(r => r.hasDeadNeurons).length;
        console.log(`Dead neuron scenarios: ${deadNeuronCount}/${results.length}`);
        
        return {
            results,
            deadNeuronCount,
            testCount: results.length
        };
    }

    /**
     * Test generalization capability - extracted from script.js
     */
    testGeneralization(dependencies = {}) {
        console.log('🧪 Testing Generalization...');
        const {
            initializeNetwork,
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations
        } = dependencies;
        
        initializeNetwork();
        
        // Train on limited set
        const trainingSet = ['dog1', 'cat', 'car'];
        const testSet = ['dog2', 'dog3', 'bird', 'tree', 'fish'];
        
        console.log('Training on limited set:', trainingSet.join(', '));
        
        // Training phase
        trainingSet.forEach(imageType => {
            setVisualFeaturesAndLabel(imageType);
            const output = forwardPropagationSilent(activations.input);
            const target = imageType.startsWith('dog') ? [1, 0] : [0, 1];
            backpropagationSilent(target);
        });
        
        console.log('Testing generalization on unseen data:', testSet.join(', '));
        
        // Test phase
        let correct = 0;
        const testResults = [];
        
        testSet.forEach(imageType => {
            setVisualFeaturesAndLabel(imageType);
            const output = forwardPropagationSilent(activations.input);
            
            const isDogPredicted = output[0] > output[1];
            const isDogActual = imageType.startsWith('dog');
            const isCorrect = isDogPredicted === isDogActual;
            
            if (isCorrect) correct++;
            
            testResults.push({
                imageType,
                predicted: isDogPredicted ? 'dog' : 'not-dog',
                actual: isDogActual ? 'dog' : 'not-dog',
                correct: isCorrect,
                confidence: Math.max(...output)
            });
            
            console.log(`${imageType}: ${isDogPredicted ? 'dog' : 'not-dog'} (confidence: ${Math.max(...output).toFixed(3)}) ${isCorrect ? '✅' : '❌'}`);
        });
        
        const generalizationAccuracy = correct / testSet.length;
        console.log(`Generalization accuracy: ${(generalizationAccuracy * 100).toFixed(1)}%`);
        
        return {
            trainingSet,
            testSet,
            testResults,
            generalizationAccuracy
        };
    }

    /**
     * Test weight initialization methods - extracted from script.js
     */
    testWeightInitialization(dependencies = {}) {
        console.log('🧪 Testing Weight Initialization Methods...');
        const { initializeNetwork } = dependencies;
        
        const methods = ['random', 'xavier', 'he'];
        const results = [];
        
        methods.forEach(method => {
            console.log(`Testing ${method} initialization...`);
            
            // Initialize with specific method
            initializeNetwork(method);
            
            const accuracy = this.quickAccuracyTest(dependencies);
            results.push({
                method,
                initialAccuracy: accuracy
            });
            
            console.log(`${method} initial accuracy: ${(accuracy * 100).toFixed(1)}%`);
        });
        
        const best = results.reduce((prev, current) => 
            (current.initialAccuracy > prev.initialAccuracy) ? current : prev
        );
        
        console.log(`Best initialization method: ${best.method}`);
        
        return {
            results,
            bestMethod: best
        };
    }

    /**
     * Run comprehensive test suite - extracted from script.js
     */
    runComprehensiveTests(dependencies = {}) {
        console.log('🧪 Running Comprehensive Test Suite...');
        
        const testResults = {
            timestamp: new Date().toISOString(),
            tests: {}
        };
        
        // Run all tests
        testResults.tests.quickAccuracy = this.quickAccuracyTest(dependencies);
        testResults.tests.weightInitialization = this.testWeightInitialization(dependencies);
        testResults.tests.deadNeuronPrevention = this.testDeadNeuronPrevention(dependencies);
        testResults.tests.generalization = this.testGeneralization(dependencies);
        testResults.tests.optimalSequence = this.testOptimalLearningSequence(dependencies);
        testResults.tests.learningApproaches = this.runLearningTest(dependencies);
        
        // Summary
        console.log('\n📊 Test Suite Summary:');
        console.log(`Quick Accuracy: ${(testResults.tests.quickAccuracy * 100).toFixed(1)}%`);
        console.log(`Best Initialization: ${testResults.tests.weightInitialization.bestMethod.method}`);
        console.log(`Generalization: ${(testResults.tests.generalization.generalizationAccuracy * 100).toFixed(1)}%`);
        console.log(`Best Learning Approach: ${testResults.tests.learningApproaches.bestApproach.approach}`);
        
        // Store results
        this.testResults.push(testResults);
        
        return testResults;
    }

    /**
     * Test 100% accuracy achievement - extracted from script.js
     */
    test100PercentAccuracy(dependencies = {}) {
        console.log('🧪 Testing 100% Accuracy Achievement...');
        const {
            initializeNetwork,
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations
        } = dependencies;
        
        initializeNetwork();
        
        const maxEpochs = 100;
        let epoch = 0;
        let accuracy = 0;
        
        while (epoch < maxEpochs && accuracy < 1.0) {
            epoch++;
            
            // Train on all examples
            const allImages = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
            
            allImages.forEach(imageType => {
                setVisualFeaturesAndLabel(imageType);
                const output = forwardPropagationSilent(activations.input);
                const target = imageType.startsWith('dog') ? [1, 0] : [0, 1];
                backpropagationSilent(target);
            });
            
            // Test accuracy
            accuracy = this.quickAccuracyTest(dependencies);
            
            if (epoch % 10 === 0 || accuracy >= 1.0) {
                console.log(`Epoch ${epoch}: ${(accuracy * 100).toFixed(1)}% accuracy`);
            }
        }
        
        const achieved100Percent = accuracy >= 1.0;
        console.log(`${achieved100Percent ? '🎉' : '❌'} 100% accuracy ${achieved100Percent ? 'achieved' : 'not achieved'} in ${epoch} epochs`);
        
        return {
            achieved100Percent,
            finalAccuracy: accuracy,
            epochsRequired: epoch,
            maxEpochs
        };
    }

    /**
     * Test back and forth learning - extracted from script.js
     */
    testBackAndForthLearning(dependencies = {}) {
        console.log('🧪 Testing Back and Forth Learning...');
        const {
            initializeNetwork,
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations
        } = dependencies;
        
        initializeNetwork();
        
        const cycles = 5;
        const results = [];
        
        for (let cycle = 0; cycle < cycles; cycle++) {
            console.log(`Cycle ${cycle + 1}:`);
            
            // Forward: dogs then non-dogs
            ['dog1', 'dog2', 'dog3'].forEach(imageType => {
                setVisualFeaturesAndLabel(imageType);
                const target = [1, 0];
                backpropagationSilent(target);
            });
            
            ['cat', 'bird', 'car'].forEach(imageType => {
                setVisualFeaturesAndLabel(imageType);
                const target = [0, 1];
                backpropagationSilent(target);
            });
            
            const accuracy = this.quickAccuracyTest(dependencies);
            results.push(accuracy);
            
            console.log(`  Accuracy after cycle ${cycle + 1}: ${(accuracy * 100).toFixed(1)}%`);
        }
        
        // Check for improvement
        const initialAccuracy = results[0];
        const finalAccuracy = results[results.length - 1];
        const improved = finalAccuracy > initialAccuracy;
        
        console.log(`Learning progression: ${improved ? 'improving' : 'stable/declining'}`);
        
        return {
            results,
            initialAccuracy,
            finalAccuracy,
            improved,
            cycles
        };
    }

    /**
     * Test simplified network - extracted from script.js
     */
    testSimplifiedNetwork(dependencies = {}) {
        console.log('🧪 Testing Simplified Network...');
        const {
            initializeNetwork,
            setVisualFeaturesAndLabel,
            forwardPropagationSilent,
            backpropagationSilent,
            activations
        } = dependencies;
        
        // Use smaller learning rate for stability
        const originalLearningRate = NETWORK_CONFIG.learningRate;
        NETWORK_CONFIG.learningRate = 0.05;
        
        initializeNetwork();
        
        // Simplified training with just 2 clear examples
        const simpleTraining = [
            { type: 'dog1', target: [1, 0] },
            { type: 'cat', target: [0, 1] }
        ];
        
        let accuracy = 0;
        const maxIterations = 50;
        
        for (let i = 0; i < maxIterations; i++) {
            simpleTraining.forEach(example => {
                setVisualFeaturesAndLabel(example.type);
                const output = forwardPropagationSilent(activations.input);
                backpropagationSilent(example.target);
            });
            
            accuracy = this.quickAccuracyTest(dependencies);
            
            if (i % 10 === 0) {
                console.log(`Iteration ${i}: ${(accuracy * 100).toFixed(1)}% accuracy`);
            }
            
            if (accuracy >= 0.9) break;
        }
        
        // Restore original learning rate
        NETWORK_CONFIG.learningRate = originalLearningRate;
        
        console.log(`Simplified network final accuracy: ${(accuracy * 100).toFixed(1)}%`);
        
        return {
            finalAccuracy: accuracy,
            iterations: maxIterations,
            trainingSet: simpleTraining
        };
    }

    /**
     * Enable deep debugging mode
     */
    enableDeepDebugging() {
        this.debugMode = true;
        console.log('🔍 Deep debugging mode enabled');
        
        // Override console methods to capture debug info
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            if (this.debugMode) {
                this.testResults.push({
                    timestamp: Date.now(),
                    type: 'debug',
                    message: args.join(' ')
                });
            }
        };
    }

    /**
     * Get all test results
     */
    getTestResults() {
        return this.testResults;
    }

    /**
     * Clear test results
     */
    clearTestResults() {
        this.testResults = [];
        console.log('🗑️ Test results cleared');
    }
}

// ============================================================================
// GLOBAL INSTANCE AND LEGACY BRIDGE SUPPORT
// ============================================================================

// Create global instance for use by legacy code
export const globalTestingSuite = new TestingSuite();

// Legacy function bridges for backward compatibility
export function quickAccuracyTest() {
    const dependencies = {
        forwardPropagationSilent: window.forwardPropagationSilent,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        activations: window.activations
    };
    return globalTestingSuite.quickAccuracyTest(dependencies);
}

export function debugWeightInitialization() {
    const dependencies = {
        weights: window.weights,
        networkConfig: window.networkConfig
    };
    return globalTestingSuite.debugWeightInitialization(dependencies);
}

export function debugFeatureRepresentation(inputValues, context = '') {
    return globalTestingSuite.debugFeatureRepresentation(inputValues, context);
}

export function debugWeightChanges(initialWeights, target) {
    const dependencies = { weights: window.weights };
    return globalTestingSuite.debugWeightChanges(initialWeights, target, dependencies);
}

export function testOptimalLearningSequence() {
    const dependencies = {
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations,
        initializeNetwork: window.initializeNetwork
    };
    return globalTestingSuite.testOptimalLearningSequence(dependencies);
}

export function runLearningTest() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations
    };
    return globalTestingSuite.runLearningTest(dependencies);
}

export function testSimpleBinaryAccuracy(dataset) {
    const dependencies = {
        forwardPropagationSilent: window.forwardPropagationSilent
    };
    return globalTestingSuite.testSimpleBinaryAccuracy(dataset, dependencies);
}

export function testAccuracy(dataset) {
    const dependencies = {
        forwardPropagationSilent: window.forwardPropagationSilent
    };
    return globalTestingSuite.testAccuracy(dataset, dependencies);
}

export function testDeadNeuronPrevention() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        weights: window.weights,
        forwardPropagationSilent: window.forwardPropagationSilent,
        networkConfig: window.networkConfig
    };
    return globalTestingSuite.testDeadNeuronPrevention(dependencies);
}

export function testGeneralization() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations
    };
    return globalTestingSuite.testGeneralization(dependencies);
}

export function testWeightInitialization() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork
    };
    return globalTestingSuite.testWeightInitialization(dependencies);
}

export function runComprehensiveTests() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations,
        weights: window.weights,
        networkConfig: window.networkConfig
    };
    return globalTestingSuite.runComprehensiveTests(dependencies);
}

export function test100PercentAccuracy() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations
    };
    return globalTestingSuite.test100PercentAccuracy(dependencies);
}

export function testBackAndForthLearning() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations
    };
    return globalTestingSuite.testBackAndForthLearning(dependencies);
}

export function testSimplifiedNetwork() {
    const dependencies = {
        initializeNetwork: window.initializeNetwork,
        setVisualFeaturesAndLabel: window.setVisualFeaturesAndLabel,
        forwardPropagationSilent: window.forwardPropagationSilent,
        backpropagationSilent: window.backpropagationSilent,
        activations: window.activations
    };
    return globalTestingSuite.testSimplifiedNetwork(dependencies);
}

export function enableDeepDebugging() {
    return globalTestingSuite.enableDeepDebugging();
}

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

console.log('📦 Testing Suite module loaded');