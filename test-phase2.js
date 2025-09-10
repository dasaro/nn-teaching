#!/usr/bin/env node
// ============================================================================
// PHASE 2 MODULE TESTING (WITHOUT BROWSER)
// ============================================================================
// Comprehensive testing of Phase 2 modules using Node.js environment

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');

// Create a minimal DOM environment
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
    <svg id="networkSvg" width="800" height="480"></svg>
    <canvas id="inputImage" width="140" height="140"></canvas>
    <div id="currentStep"></div>
    <button id="forwardBtn"></button>
    <button id="backwardBtn"></button>
    <button id="fullDemoBtn"></button>
</body>
</html>
`);

// Set up global environment
global.window = dom.window;
global.document = dom.window.document;
global.console = console;
global.HTMLElement = dom.window.HTMLElement;
global.SVGElement = dom.window.SVGElement;

// Mock setTimeout and performance for animations
global.setTimeout = setTimeout;
global.performance = {
    now: () => Date.now()
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);

console.log('🧪 Phase 2 Module Testing Suite');
console.log('================================\n');

let testsPassed = 0;
let testsFailed = 0;

/**
 * Test assertion helper
 */
function assert(condition, message) {
    if (condition) {
        console.log(`✅ ${message}`);
        testsPassed++;
    } else {
        console.error(`❌ ${message}`);
        testsFailed++;
        throw new Error(`Assertion failed: ${message}`);
    }
}

/**
 * Test suite runner
 */
async function runTestSuite(suiteName, tests) {
    console.log(`\n📋 ${suiteName}`);
    console.log('─'.repeat(suiteName.length + 4));
    
    for (const [testName, testFn] of Object.entries(tests)) {
        try {
            console.log(`\n🔍 Testing: ${testName}`);
            await testFn();
        } catch (error) {
            console.error(`❌ Test failed: ${testName}`, error.message);
            testsFailed++;
        }
    }
}

// ============================================================================
// CONSTANTS TESTING
// ============================================================================

async function testConstants() {
    const tests = {
        'Constants module loads correctly': async () => {
            const constants = await import('./config/constants.js');
            assert(constants.NETWORK_CONFIG, 'NETWORK_CONFIG exists');
            assert(constants.EXPERT_CONFIG, 'EXPERT_CONFIG exists');
            assert(constants.SVG_POSITIONS, 'SVG_POSITIONS exists');
            assert(constants.DEFAULT_STATE, 'DEFAULT_STATE exists');
            assert(constants.ANIMATION_CONFIG, 'ANIMATION_CONFIG exists');
        },
        
        'Network config has correct structure': async () => {
            const { NETWORK_CONFIG } = await import('./config/constants.js');
            assert(typeof NETWORK_CONFIG.inputSize === 'number', 'inputSize is number');
            assert(typeof NETWORK_CONFIG.hiddenSize === 'number', 'hiddenSize is number');
            assert(typeof NETWORK_CONFIG.outputSize === 'number', 'outputSize is number');
            assert(typeof NETWORK_CONFIG.learningRate === 'number', 'learningRate is number');
            assert(NETWORK_CONFIG.inputSize === 4, 'inputSize is 4');
            assert(NETWORK_CONFIG.hiddenSize === 4, 'hiddenSize is 4');
            assert(NETWORK_CONFIG.outputSize === 2, 'outputSize is 2');
        },
        
        'SVG positions have correct structure': async () => {
            const { SVG_POSITIONS } = await import('./config/constants.js');
            assert(Array.isArray(SVG_POSITIONS.input), 'input positions is array');
            assert(Array.isArray(SVG_POSITIONS.hidden), 'hidden positions is array');
            assert(Array.isArray(SVG_POSITIONS.output), 'output positions is array');
            assert(SVG_POSITIONS.input.length === 4, 'input has 4 positions');
            assert(SVG_POSITIONS.hidden.length === 4, 'hidden has 4 positions');
            assert(SVG_POSITIONS.output.length === 2, 'output has 2 positions');
            
            // Check position structure
            SVG_POSITIONS.input.forEach((pos, i) => {
                assert(typeof pos.x === 'number', `input[${i}] has x coordinate`);
                assert(typeof pos.y === 'number', `input[${i}] has y coordinate`);
            });
        }
    };
    
    await runTestSuite('Constants Module Tests', tests);
}

// ============================================================================
// MATH UTILITIES TESTING
// ============================================================================

async function testMathUtils() {
    const tests = {
        'Math utilities module loads correctly': async () => {
            const mathUtils = await import('./utils/math.js');
            assert(typeof mathUtils.sigmoid === 'function', 'sigmoid function exists');
            assert(typeof mathUtils.leakyReLU === 'function', 'leakyReLU function exists');
            assert(typeof mathUtils.softmax === 'function', 'softmax function exists');
            assert(typeof mathUtils.dotProduct === 'function', 'dotProduct function exists');
            assert(typeof mathUtils.initializeMatrix === 'function', 'initializeMatrix function exists');
        },
        
        'Sigmoid function works correctly': async () => {
            const { sigmoid } = await import('./utils/math.js');
            assert(Math.abs(sigmoid(0) - 0.5) < 0.001, 'sigmoid(0) ≈ 0.5');
            assert(sigmoid(1000) < 1.0, 'sigmoid(large) < 1.0');
            assert(sigmoid(-1000) > 0.0, 'sigmoid(-large) > 0.0');
            assert(sigmoid(1) > 0.5, 'sigmoid(1) > 0.5');
            assert(sigmoid(-1) < 0.5, 'sigmoid(-1) < 0.5');
        },
        
        'Leaky ReLU function works correctly': async () => {
            const { leakyReLU } = await import('./utils/math.js');
            assert(leakyReLU(1) === 1, 'leakyReLU(1) = 1');
            assert(leakyReLU(-1) === -0.1, 'leakyReLU(-1) = -0.1');
            assert(leakyReLU(0) === 0, 'leakyReLU(0) = 0');
            assert(leakyReLU(-2, 0.2) === -0.4, 'leakyReLU(-2, 0.2) = -0.4');
        },
        
        'Softmax function works correctly': async () => {
            const { softmax } = await import('./utils/math.js');
            const result = softmax([1, 2, 3]);
            assert(result.length === 3, 'softmax returns correct length');
            assert(Math.abs(result.reduce((a, b) => a + b, 0) - 1.0) < 0.001, 'softmax sums to 1');
            assert(result[2] > result[1], 'softmax preserves order');
            assert(result[1] > result[0], 'softmax preserves order');
        },
        
        'Dot product works correctly': async () => {
            const { dotProduct } = await import('./utils/math.js');
            assert(dotProduct([1, 2, 3], [4, 5, 6]) === 32, 'dot product calculation');
            assert(dotProduct([1, 0], [0, 1]) === 0, 'orthogonal vectors');
            assert(dotProduct([2, 3], [2, 3]) === 13, 'same vectors');
        },
        
        'Matrix initialization works correctly': async () => {
            const { initializeMatrix } = await import('./utils/math.js');
            const matrix = initializeMatrix(3, 4, 0.1);
            assert(matrix.length === 3, 'matrix has correct rows');
            assert(matrix[0].length === 4, 'matrix has correct columns');
            assert(matrix.every(row => row.every(val => Math.abs(val) <= 0.1)), 'values within scale');
        }
    };
    
    await runTestSuite('Math Utilities Tests', tests);
}

// ============================================================================
// DOM UTILITIES TESTING
// ============================================================================

async function testDOMUtils() {
    const tests = {
        'DOM utilities module loads correctly': async () => {
            const domUtils = await import('./utils/dom.js');
            assert(typeof domUtils.safeGetElementById === 'function', 'safeGetElementById exists');
            assert(typeof domUtils.createSVGElement === 'function', 'createSVGElement exists');
            assert(typeof domUtils.formatMatrix === 'function', 'formatMatrix exists');
            assert(typeof domUtils.getCanvasContext === 'function', 'getCanvasContext exists');
        },
        
        'Safe element getter works': async () => {
            const { safeGetElementById } = await import('./utils/dom.js');
            const svg = safeGetElementById('networkSvg');
            assert(svg !== null, 'finds existing element');
            assert(svg.tagName === 'svg', 'returns correct element');
            
            const missing = safeGetElementById('nonexistent');
            assert(missing === null, 'returns null for missing element');
        },
        
        'SVG element creation works': async () => {
            const { createSVGElement } = await import('./utils/dom.js');
            const circle = createSVGElement('circle', {
                cx: '50',
                cy: '50',
                r: '25'
            });
            assert(circle.tagName === 'circle', 'creates correct element');
            assert(circle.getAttribute('cx') === '50', 'sets attributes');
            assert(circle.getAttribute('cy') === '50', 'sets attributes');
            assert(circle.getAttribute('r') === '25', 'sets attributes');
        },
        
        'Matrix formatting works': async () => {
            const { formatMatrix } = await import('./utils/dom.js');
            const matrix = [[1, 2], [3, 4]];
            const html = formatMatrix(matrix, 'Test');
            assert(typeof html === 'string', 'returns string');
            assert(html.includes('Test'), 'includes name');
            assert(html.includes('1.000'), 'formats numbers');
        }
    };
    
    await runTestSuite('DOM Utilities Tests', tests);
}

// ============================================================================
// ANIMATION UTILITIES TESTING
// ============================================================================

async function testAnimationUtils() {
    const tests = {
        'Animation utilities module loads correctly': async () => {
            const animUtils = await import('./utils/animation.js');
            assert(typeof animUtils.sleep === 'function', 'sleep function exists');
            assert(typeof animUtils.withAnimation === 'function', 'withAnimation function exists');
            assert(typeof animUtils.easeInOutQuad === 'function', 'easeInOutQuad function exists');
            assert(typeof animUtils.animateValue === 'function', 'animateValue function exists');
        },
        
        'Sleep function works': async () => {
            const { sleep } = await import('./utils/animation.js');
            const start = Date.now();
            await sleep(50, 10); // Fast speed
            const elapsed = Date.now() - start;
            assert(elapsed >= 5 && elapsed < 200, 'sleep duration is reasonable');
        },
        
        'Easing functions work': async () => {
            const { easeInOutQuad, easeLinear } = await import('./utils/animation.js');
            assert(easeLinear(0.5) === 0.5, 'linear easing is linear');
            assert(easeInOutQuad(0) === 0, 'quad easing starts at 0');
            assert(easeInOutQuad(1) === 1, 'quad easing ends at 1');
            assert(easeInOutQuad(0.5) === 0.5, 'quad easing is symmetric');
        }
    };
    
    await runTestSuite('Animation Utilities Tests', tests);
}

// ============================================================================
// NEURAL NETWORK ENGINE TESTING
// ============================================================================

async function testNeuralNetwork() {
    const tests = {
        'Neural Network Engine loads correctly': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            assert(typeof NeuralNetworkEngine === 'function', 'NeuralNetworkEngine is constructor');
            
            const network = new NeuralNetworkEngine();
            assert(network instanceof NeuralNetworkEngine, 'creates instance correctly');
            assert(typeof network.forwardPropagation === 'function', 'has forwardPropagation method');
            assert(typeof network.backwardPropagation === 'function', 'has backwardPropagation method');
        },
        
        'Network initialization works': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const network = new NeuralNetworkEngine();
            
            assert(network.weights.inputToHidden.length === 4, 'input-to-hidden weights correct size');
            assert(network.weights.hiddenToOutput.length === 2, 'hidden-to-output weights correct size');
            assert(network.activations.input.length === 4, 'input activations correct size');
            assert(network.activations.hidden.length === 4, 'hidden activations correct size');
            assert(network.activations.output.length === 2, 'output activations correct size');
        },
        
        'Forward propagation works': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const network = new NeuralNetworkEngine();
            
            const input = [0.8, 0.9, 0.1, 0.2];
            const output = network.forwardPropagation(input);
            
            assert(Array.isArray(output), 'returns array');
            assert(output.length === 2, 'output has correct length');
            assert(output.every(val => val >= 0 && val <= 1), 'output values in valid range');
            assert(Math.abs(output[0] + output[1] - 1.0) < 0.001, 'softmax outputs sum to 1');
        },
        
        'Backward propagation works': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const network = new NeuralNetworkEngine();
            
            // Forward pass first
            const input = [0.8, 0.9, 0.1, 0.2];
            network.forwardPropagation(input);
            
            // Store initial weights
            const initialWeights = JSON.parse(JSON.stringify(network.weights));
            
            // Backward pass
            const target = [1, 0];
            const loss = network.backwardPropagation(target);
            
            assert(typeof loss === 'number', 'returns loss value');
            assert(loss >= 0, 'loss is non-negative');
            
            // Check that weights changed
            let weightsChanged = false;
            for (let i = 0; i < network.weights.inputToHidden.length; i++) {
                for (let j = 0; j < network.weights.inputToHidden[i].length; j++) {
                    if (Math.abs(network.weights.inputToHidden[i][j] - initialWeights.inputToHidden[i][j]) > 1e-10) {
                        weightsChanged = true;
                        break;
                    }
                }
            }
            assert(weightsChanged, 'weights updated during backpropagation');
        },
        
        'Training on examples works': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const network = new NeuralNetworkEngine();
            
            const trainingData = [
                { input: [0.8, 0.9, 0.1, 0.2], target: [1, 0] }, // Dog
                { input: [0.1, 0.8, 0.1, 0.9], target: [0, 1] }  // Not dog
            ];
            
            const initialLoss = network.trainOnExample(trainingData[0].input, trainingData[0].target).loss;
            
            // Train for a few iterations
            for (let i = 0; i < 10; i++) {
                network.trainOnExample(trainingData[0].input, trainingData[0].target);
                network.trainOnExample(trainingData[1].input, trainingData[1].target);
            }
            
            const finalLoss = network.trainOnExample(trainingData[0].input, trainingData[0].target).loss;
            assert(finalLoss < initialLoss, 'loss decreased with training');
        }
    };
    
    await runTestSuite('Neural Network Engine Tests', tests);
}

// ============================================================================
// IMAGE PROCESSOR TESTING
// ============================================================================

async function testImageProcessor() {
    const tests = {
        'Image Processor loads correctly': async () => {
            const imageProcessor = await import('./modules/imageProcessor.js');
            assert(typeof imageProcessor.ImageProcessor === 'function', 'ImageProcessor constructor exists');
            assert(typeof imageProcessor.setVisualFeaturesAndLabel === 'function', 'legacy function exists');
            assert(typeof imageProcessor.getImageColor === 'function', 'getImageColor function exists');
        },
        
        'Feature patterns are correct': async () => {
            const { ImageProcessor } = await import('./modules/imageProcessor.js');
            const processor = new ImageProcessor();
            
            const dogPattern = processor.getFeaturePattern('dog1');
            const catPattern = processor.getFeaturePattern('cat');
            
            assert(Array.isArray(dogPattern), 'dog pattern is array');
            assert(dogPattern.length === 4, 'dog pattern has 4 features');
            assert(Array.isArray(catPattern), 'cat pattern is array');
            assert(catPattern.length === 4, 'cat pattern has 4 features');
            
            // Check dog pattern characteristics (HIGH-HIGH-LOW-LOW)
            assert(dogPattern[0] > 0.5 && dogPattern[1] > 0.5, 'dog pattern high-high');
            assert(dogPattern[2] < 0.5 && dogPattern[3] < 0.5, 'dog pattern low-low');
            
            // Check patterns are different
            const similarity = processor.calculateImageSimilarity('dog1', 'cat');
            assert(similarity < 0.9, 'dog and cat patterns are different');
        },
        
        'Label detection works': async () => {
            const { ImageProcessor } = await import('./modules/imageProcessor.js');
            const processor = new ImageProcessor();
            
            assert(processor.getImageLabel('dog1') === 'dog', 'dog1 labeled as dog');
            assert(processor.getImageLabel('dog2') === 'dog', 'dog2 labeled as dog');
            assert(processor.getImageLabel('cat') === 'not-dog', 'cat labeled as not-dog');
            assert(processor.getImageLabel('car') === 'not-dog', 'car labeled as not-dog');
        },
        
        'Image validation works': async () => {
            const { ImageProcessor } = await import('./modules/imageProcessor.js');
            const processor = new ImageProcessor();
            
            assert(processor.isValidImageType('dog1'), 'dog1 is valid');
            assert(processor.isValidImageType('cat'), 'cat is valid');
            assert(!processor.isValidImageType('unicorn'), 'unicorn is invalid');
            
            const availableTypes = processor.getAvailableImageTypes();
            assert(Array.isArray(availableTypes), 'available types is array');
            assert(availableTypes.includes('dog1'), 'includes dog1');
            assert(availableTypes.includes('cat'), 'includes cat');
        }
    };
    
    await runTestSuite('Image Processor Tests', tests);
}

// ============================================================================
// NETWORK ANIMATOR TESTING
// ============================================================================

async function testNetworkAnimator() {
    const tests = {
        'Network Animator loads correctly': async () => {
            const animator = await import('./modules/networkAnimator.js');
            assert(typeof animator.NetworkAnimator === 'function', 'NetworkAnimator constructor exists');
            assert(typeof animator.drawNetwork === 'function', 'legacy drawNetwork function exists');
            
            const animatorInstance = new animator.NetworkAnimator();
            assert(animatorInstance instanceof animator.NetworkAnimator, 'creates instance correctly');
            assert(typeof animatorInstance.drawNetwork === 'function', 'has drawNetwork method');
        },
        
        'SVG initialization works': async () => {
            const { NetworkAnimator } = await import('./modules/networkAnimator.js');
            const animator = new NetworkAnimator('networkSvg');
            
            assert(animator.svgId === 'networkSvg', 'stores SVG ID correctly');
            assert(animator.svgElement !== null, 'finds SVG element');
            assert(animator.positions, 'has position configuration');
        },
        
        'Connection creation works': async () => {
            const { NetworkAnimator } = await import('./modules/networkAnimator.js');
            const animator = new NetworkAnimator('networkSvg');
            
            const startPos = { x: 50, y: 50 };
            const endPos = { x: 100, y: 100 };
            const line = animator.createConnectionLine(startPos, endPos, 0.5, 'test-conn');
            
            assert(line.tagName === 'line', 'creates line element');
            assert(line.getAttribute('x1') === '50', 'sets start x');
            assert(line.getAttribute('y1') === '50', 'sets start y');
            assert(line.getAttribute('x2') === '100', 'sets end x');
            assert(line.getAttribute('y2') === '100', 'sets end y');
        },
        
        'Neuron creation works': async () => {
            const { NetworkAnimator } = await import('./modules/networkAnimator.js');
            const animator = new NetworkAnimator('networkSvg');
            
            const position = { x: 100, y: 100 };
            const neuron = animator.createNeuron(position, 0.75, 'test-neuron', 'hidden');
            
            assert(neuron.tagName === 'g', 'creates group element');
            
            const circle = neuron.querySelector('circle');
            const text = neuron.querySelector('text');
            
            assert(circle !== null, 'contains circle');
            assert(text !== null, 'contains text');
            assert(circle.getAttribute('cx') === '100', 'circle positioned correctly');
            assert(text.textContent === '0.75', 'text shows activation value');
        }
    };
    
    await runTestSuite('Network Animator Tests', tests);
}

// ============================================================================
// APP STATE MANAGER TESTING
// ============================================================================

async function testAppStateManager() {
    const tests = {
        'App State Manager loads correctly': async () => {
            const stateManager = await import('./modules/appStateManager.js');
            assert(typeof stateManager.AppStateManager === 'function', 'AppStateManager constructor exists');
            assert(typeof stateManager.stateManager === 'object', 'convenience object exists');
            
            const manager = new stateManager.AppStateManager();
            assert(manager instanceof stateManager.AppStateManager, 'creates instance correctly');
        },
        
        'State management works': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            // Test basic get/set
            manager.set('testValue', 42);
            assert(manager.get('testValue') === 42, 'basic set/get works');
            
            // Test multiple updates
            manager.update({
                value1: 'hello',
                value2: 'world'
            });
            assert(manager.get('value1') === 'hello', 'bulk update works');
            assert(manager.get('value2') === 'world', 'bulk update works');
        },
        
        'Animation state management works': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            assert(!manager.isAnimating(), 'initially not animating');
            
            manager.setAnimating(true);
            assert(manager.isAnimating(), 'sets animating state');
            
            manager.setAnimating(false);
            assert(!manager.isAnimating(), 'clears animating state');
        },
        
        'Demo state management works': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            const initialState = manager.getDemoState();
            assert(!initialState.forwardCompleted, 'initially forward not completed');
            
            manager.updateDemoState({ forwardCompleted: true });
            const updatedState = manager.getDemoState();
            assert(updatedState.forwardCompleted, 'updates demo state');
            
            manager.resetDemoState();
            const resetState = manager.getDemoState();
            assert(!resetState.forwardCompleted, 'resets demo state');
        },
        
        'Event listeners work': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            let listenerCalled = false;
            let receivedValue = null;
            
            manager.addStateChangeListener('testKey', (newValue) => {
                listenerCalled = true;
                receivedValue = newValue;
            });
            
            manager.set('testKey', 'test-value');
            
            // Give event loop time to process
            await new Promise(resolve => setTimeout(resolve, 10));
            
            assert(listenerCalled, 'state change listener called');
            assert(receivedValue === 'test-value', 'listener received correct value');
        },
        
        'Image and label management works': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            manager.setCurrentImage('dog1');
            assert(manager.get('currentImage') === 'dog1', 'sets current image');
            
            manager.setTrueLabel('dog');
            assert(manager.get('trueLabel') === 'dog', 'sets true label');
            
            const target = manager.getTargetVector();
            assert(Array.isArray(target), 'returns target vector');
            assert(target[0] === 1 && target[1] === 0, 'dog target vector correct');
        }
    };
    
    await runTestSuite('App State Manager Tests', tests);
}

// ============================================================================
// INTEGRATION TESTING
// ============================================================================

async function testIntegration() {
    const tests = {
        'All modules work together': async () => {
            // Import all modules
            const constants = await import('./config/constants.js');
            const mathUtils = await import('./utils/math.js');
            const { ImageProcessor } = await import('./modules/imageProcessor.js');
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const { AppStateManager } = await import('./modules/appStateManager.js');
            
            // Create instances
            const imageProcessor = new ImageProcessor();
            const network = new NeuralNetworkEngine(constants.NETWORK_CONFIG);
            const stateManager = new AppStateManager();
            
            assert(true, 'all modules imported successfully');
            
            // Test data flow
            const features = imageProcessor.getFeaturePattern('dog1');
            const output = network.forwardPropagation(features);
            
            stateManager.setCurrentImage('dog1');
            stateManager.setTrueLabel('dog');
            
            assert(features.length === constants.NETWORK_CONFIG.inputSize, 'features match network input');
            assert(output.length === constants.NETWORK_CONFIG.outputSize, 'output matches network output');
            assert(stateManager.get('currentImage') === 'dog1', 'state manager tracks image');
        },
        
        'Network training integration works': async () => {
            const { ImageProcessor } = await import('./modules/imageProcessor.js');
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            
            const imageProcessor = new ImageProcessor();
            const network = new NeuralNetworkEngine();
            
            // Create training data from image patterns
            const trainingData = [
                {
                    input: imageProcessor.getFeaturePattern('dog1'),
                    target: [1, 0]
                },
                {
                    input: imageProcessor.getFeaturePattern('cat'),
                    target: [0, 1]
                }
            ];
            
            // Test initial predictions
            const initialDogOutput = network.forwardPropagationSilent(trainingData[0].input);
            
            // Train the network
            for (let epoch = 0; epoch < 5; epoch++) {
                network.trainOnBatch(trainingData);
            }
            
            // Test final predictions
            const finalDogOutput = network.forwardPropagationSilent(trainingData[0].input);
            
            // Should show improvement (dog prediction should be higher)
            assert(finalDogOutput[0] >= initialDogOutput[0], 'network learning shows improvement');
        }
    };
    
    await runTestSuite('Integration Tests', tests);
}

// ============================================================================
// PERFORMANCE TESTING
// ============================================================================

async function testPerformance() {
    const tests = {
        'Neural network performance is acceptable': async () => {
            const { default: NeuralNetworkEngine } = await import('./modules/neuralNetwork.js');
            const network = new NeuralNetworkEngine();
            
            const input = [0.8, 0.9, 0.1, 0.2];
            
            // Test forward propagation performance
            const forwardStart = performance.now();
            for (let i = 0; i < 1000; i++) {
                network.forwardPropagationSilent(input);
            }
            const forwardTime = performance.now() - forwardStart;
            
            console.log(`  📊 1000 forward passes: ${forwardTime.toFixed(2)}ms`);
            assert(forwardTime < 1000, 'forward propagation is fast enough');
            
            // Test backward propagation performance
            const target = [1, 0];
            network.forwardPropagation(input); // Set up activations
            
            const backwardStart = performance.now();
            for (let i = 0; i < 100; i++) {
                network.backwardPropagationSilent(target);
            }
            const backwardTime = performance.now() - backwardStart;
            
            console.log(`  📊 100 backward passes: ${backwardTime.toFixed(2)}ms`);
            assert(backwardTime < 1000, 'backward propagation is fast enough');
        },
        
        'State manager performance is acceptable': async () => {
            const { AppStateManager } = await import('./modules/appStateManager.js');
            const manager = new AppStateManager();
            
            const start = performance.now();
            for (let i = 0; i < 10000; i++) {
                manager.set(`key${i % 100}`, i);
                manager.get(`key${i % 100}`);
            }
            const elapsed = performance.now() - start;
            
            console.log(`  📊 10000 state operations: ${elapsed.toFixed(2)}ms`);
            assert(elapsed < 1000, 'state operations are fast enough');
        }
    };
    
    await runTestSuite('Performance Tests', tests);
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
    console.log('Starting comprehensive Phase 2 testing...\n');
    
    try {
        // Test all modules
        await testConstants();
        await testMathUtils();
        await testDOMUtils();
        await testAnimationUtils();
        await testNeuralNetwork();
        await testImageProcessor();
        await testNetworkAnimator();
        await testAppStateManager();
        await testIntegration();
        await testPerformance();
        
        // Final summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Tests Passed: ${testsPassed}`);
        console.log(`❌ Tests Failed: ${testsFailed}`);
        console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
        
        if (testsFailed === 0) {
            console.log('\n🎉 ALL TESTS PASSED! Phase 2 modules are working correctly.');
            console.log('✅ Safe to proceed with integration and commit.');
            return true;
        } else {
            console.log('\n❌ Some tests failed. Please review and fix issues before proceeding.');
            return false;
        }
        
    } catch (error) {
        console.error('\n💥 Test runner crashed:', error);
        return false;
    }
}

// Run the test suite if this is the main module
if (require.main === module) {
    runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { runAllTests };