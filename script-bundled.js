// ============================================================================
// NEURAL NETWORK VISUALIZATION - GITHUB PAGES COMPATIBLE BUNDLE
// ============================================================================
// This is a bundled version that combines all modules for file:// protocol support

// ============================================================================
// CONSTANTS
// ============================================================================
const NETWORK_CONFIG = {
    INPUT_SIZE: 4,
    HIDDEN_SIZE: 4,
    OUTPUT_SIZE: 2,
    DEFAULT_LEARNING_RATE: 0.1
};

const EXPERT_CONFIG = {
    hiddenActivation: 'leaky_relu',
    outputActivation: 'softmax',
    learningRate: 0.1,
    momentum: 0.0,
    l2Regularization: 0.0,
    inputSize: 4,
    hiddenSize: 4,
    outputSize: 2,
    leakyReLUAlpha: 0.1
};

const SVG_POSITIONS = {
    input: [{x: 80, y: 60}, {x: 80, y: 140}, {x: 80, y: 220}, {x: 80, y: 300}],
    hidden: [{x: 250, y: 90}, {x: 250, y: 160}, {x: 250, y: 230}, {x: 250, y: 270}],
    output: [{x: 420, y: 140}, {x: 420, y: 220}]
};

const DEFAULT_STATE = {
    isAnimating: false,
    trueLabel: null,
    currentImage: 'dog1',
    debugConsoleVisible: false,
    currentConsoleTab: 'weights',
    preventAutoLabeling: false,
    expertViewMode: false,
    messageLogActive: false,
    autoScrollEnabled: true,
    tutorialActive: false,
    tutorialStep: 0
};

const ANIMATION_CONFIG = {
    DEFAULT_SPEED: 5,
    MIN_SPEED: 1,
    MAX_SPEED: 10,
    STEP_DELAY_BASE: 1000
};

const CANVAS_CONFIG = {
    WIDTH: 200,
    HEIGHT: 200,
    CONTEXT_OPTIONS: { alpha: true, antialias: true }
};

const IMAGE_TYPES = {
    DOG_IMAGES: ['dog1', 'dog2', 'dog3'],
    NON_DOG_IMAGES: ['cat', 'bird', 'car', 'tree', 'fish'],
    get ALL_IMAGES() { return [...this.DOG_IMAGES, ...this.NON_DOG_IMAGES]; }
};

const LABELS = {
    DOG: 'dog',
    NOT_DOG: 'not-dog'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Math utilities
function sigmoid(x) {
    if (x > 500) return 1;
    if (x < -500) return 0;
    return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
    const s = sigmoid(x);
    return s * (1 - s);
}

function leakyReLU(x, alpha = 0.1) {
    return x >= 0 ? x : alpha * x;
}

function leakyReLUDerivative(x, alpha = 0.1) {
    return x >= 0 ? 1 : alpha;
}

function tanhActivation(x) {
    if (x > 500) return 1;
    if (x < -500) return -1;
    return Math.tanh(x);
}

function tanhDerivative(x) {
    const t = tanhActivation(x);
    return 1 - t * t;
}

function softmax(values) {
    const maxVal = Math.max(...values);
    const shifted = values.map(v => v - maxVal);
    const exps = shifted.map(v => Math.exp(Math.min(v, 500)));
    const sum = exps.reduce((acc, val) => acc + val, 0);
    return exps.map(exp => exp / (sum + 1e-8));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function safeGetElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id "${id}" not found`);
    }
    return element;
}

function getCanvasContext(canvasId, contextType = '2d', options = {}) {
    const canvas = safeGetElementById(canvasId);
    if (!canvas) return null;
    return canvas.getContext(contextType, options);
}

function calculateBinaryAccuracy(predictions, targets) {
    if (predictions.length !== targets.length) return 0;
    let correct = 0;
    for (let i = 0; i < predictions.length; i++) {
        const predicted = predictions[i][0] > predictions[i][1] ? 1 : 0;
        const actual = targets[i][0] > targets[i][1] ? 1 : 0;
        if (predicted === actual) correct++;
    }
    return correct / predictions.length;
}

function calculateDatasetAccuracy(dataset, forwardFunction) {
    let correct = 0;
    dataset.forEach(example => {
        const output = forwardFunction(example.input);
        const predicted = output[0] > output[1];
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}

// ============================================================================
// IMAGE PROCESSING FUNCTIONS
// ============================================================================

const FEATURE_PATTERNS = {
    dog1: [0.9, 0.9, 0.1, 0.1],
    dog2: [0.8, 0.7, 0.2, 0.3], 
    dog3: [0.7, 0.8, 0.3, 0.2],
    cat: [0.1, 0.9, 0.1, 0.9],
    bird: [0.2, 0.8, 0.3, 0.7],
    car: [0.3, 0.7, 0.2, 0.8],
    tree: [0.9, 0.1, 0.9, 0.1],
    fish: [0.8, 0.2, 0.7, 0.3]
};

const FALLBACK_COLORS = {
    dog1: '#8B4513', dog2: '#D2691E', dog3: '#FFFFFF',
    cat: '#696969', bird: '#FFD700', fish: '#1E90FF',
    car: '#FF6B6B', tree: '#228B22'
};

const FALLBACK_EMOJIS = {
    dog1: '🐕', dog2: '🐕', dog3: '🐕',
    cat: '🐱', bird: '🐦', fish: '🐟',
    car: '🚗', tree: '🌳'
};

function getFeaturePattern(imageType) {
    return FEATURE_PATTERNS[imageType] || [0.1, 0.1, 0.1, 0.1];
}

function getImageLabel(imageType) {
    return IMAGE_TYPES.DOG_IMAGES.includes(imageType) ? LABELS.DOG : LABELS.NOT_DOG;
}

function getFallbackColor(imageType) {
    return FALLBACK_COLORS[imageType] || '#f0f8ff';
}

function getFallbackEmoji(imageType) {
    return FALLBACK_EMOJIS[imageType] || '❓';
}

function setVisualFeaturesAndLabel(imageType, preventAutoLabeling = false) {
    const features = getFeaturePattern(imageType);
    const label = getImageLabel(imageType);

    // Update features
    if (typeof updateInputActivations === 'function') {
        updateInputActivations(features);
    }

    // Update label if not prevented
    if (!preventAutoLabeling && typeof setTrueLabel === 'function') {
        setTrueLabel(label);
    }

    console.log('🎯 Abstract patterns set for', imageType, '- [Pattern A, Pattern B, Pattern C, Pattern D]:', features);
    console.log('🎯 Pattern type:', imageType.startsWith('dog') ? 'DOG (HIGH-HIGH-LOW-LOW variants)' : 'NON-DOG (alternating patterns)');
}

function createImage(imageType, canvasId = 'inputImage', preventAutoLabeling = false) {
    return new Promise((resolve, reject) => {
        const canvas = safeGetElementById(canvasId);
        if (!canvas) {
            reject(new Error(`Canvas element "${canvasId}" not found`));
            return;
        }

        const ctx = getCanvasContext(canvasId, '2d', CANVAS_CONFIG.CONTEXT_OPTIONS);
        if (!ctx) {
            reject(new Error(`Failed to get canvas context for "${canvasId}"`));
            return;
        }

        // Show loading state
        ctx.fillStyle = '#f0f8ff';
        ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', CANVAS_CONFIG.WIDTH / 2, CANVAS_CONFIG.HEIGHT / 2);

        // Create image element
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            console.log(`✅ Successfully loaded image: ${imageType} from ${img.src}`);
            
            try {
                // Clear canvas and draw the loaded image
                ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
                ctx.drawImage(img, 0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
                
                // Add visual indicators
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 2;
                ctx.strokeRect(1, 1, CANVAS_CONFIG.WIDTH - 2, CANVAS_CONFIG.HEIGHT - 2);
                
                ctx.fillStyle = '#22c55e';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText('✓', CANVAS_CONFIG.WIDTH - 5, 15);
                
                // Set visual features and labels
                setVisualFeaturesAndLabel(imageType, preventAutoLabeling);
                
                resolve();
            } catch (error) {
                console.error('Error drawing image:', error);
                showFallbackImage(ctx, imageType, preventAutoLabeling);
                resolve(); // Still resolve, fallback worked
            }
        };

        img.onerror = (error) => {
            console.error(`❌ Failed to load image: ${imageType}`, error);
            console.log(`Current page location: ${window.location.href}`);
            console.log(`Image path: ${img.src}`);
            
            // Show fallback image
            showFallbackImage(ctx, imageType, preventAutoLabeling);
            resolve(); // Resolve with fallback
        };

        // Try to load image
        const imageUrl = window.imageUrls && window.imageUrls[imageType];
        if (imageUrl) {
            img.src = imageUrl;
        } else {
            console.warn(`No URL found for image type: ${imageType}`);
            showFallbackImage(ctx, imageType, preventAutoLabeling);
            resolve(); // Resolve with fallback
        }

        // Set features regardless of image loading success
        setVisualFeaturesAndLabel(imageType, preventAutoLabeling);
    });
}

function showFallbackImage(ctx, imageType, preventAutoLabeling = false) {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
    
    // Fill with fallback color
    ctx.fillStyle = getFallbackColor(imageType);
    ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
    
    // Add error indicator
    ctx.fillStyle = '#ef4444';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('IMG ERR', 5, 12);
    
    // Add large emoji fallback
    ctx.fillStyle = '#333';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(getFallbackEmoji(imageType), CANVAS_CONFIG.WIDTH / 2, CANVAS_CONFIG.HEIGHT / 2 + 15);
    
    // Set visual features even on fallback
    setVisualFeaturesAndLabel(imageType, preventAutoLabeling);
}

function getImageColor(imageType) {
    return getFallbackColor(imageType);
}

function getImageEmoji(imageType) {
    return getFallbackEmoji(imageType);
}

// ============================================================================
// TESTING FUNCTIONS
// ============================================================================

function quickAccuracyTest() {
    console.log('🧪 FULL 8-IMAGE ACCURACY TEST');
    
    const imageTypes = ['dog1', 'dog2', 'dog3', 'cat', 'bird', 'car', 'tree', 'fish'];
    const testData = [];
    
    imageTypes.forEach(imageType => {
        setVisualFeaturesAndLabel(imageType);
        const isDog = imageType.startsWith('dog');
        testData.push({
            input: [...activations.input],
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
    
    return accuracy;
}

function testAccuracy(dataset) {
    let correct = 0;
    dataset.forEach(example => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}

function calculateWeightStats(weightArray) {
    const mean = weightArray.reduce((sum, w) => sum + w, 0) / weightArray.length;
    const variance = weightArray.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / weightArray.length;
    const sortedWeights = [...weightArray].sort((a, b) => a - b);
    
    return {
        min: Math.min(...weightArray),
        max: Math.max(...weightArray),
        mean: mean,
        std: Math.sqrt(variance),
        median: sortedWeights[Math.floor(sortedWeights.length / 2)],
        range: Math.max(...weightArray) - Math.min(...weightArray)
    };
}

function checkWeightSymmetry(weightMatrix) {
    if (weightMatrix.length < 2) return 0;
    
    let totalDifference = 0;
    let comparisons = 0;
    
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

function debugWeightInitialization() {
    console.log('📊 WEIGHT INITIALIZATION ANALYSIS:');
    
    console.log('\n🔗 Input → Hidden Layer Weights:');
    weights.inputToHidden.forEach((neuron, h) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Hidden[${h}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    console.log('\n🔗 Hidden → Output Layer Weights:');
    weights.hiddenToOutput.forEach((neuron, o) => {
        const stats = calculateWeightStats(neuron);
        console.log(`  Output[${o}]: min=${stats.min.toFixed(4)}, max=${stats.max.toFixed(4)}, mean=${stats.mean.toFixed(4)}, std=${stats.std.toFixed(4)}`);
    });
    
    const inputSymmetry = checkWeightSymmetry(weights.inputToHidden);
    const outputSymmetry = checkWeightSymmetry(weights.hiddenToOutput);
    console.log(`\n⚖️ Symmetry Analysis (lower = more diverse):`);
    console.log(`  Input layer symmetry: ${inputSymmetry.toFixed(6)}`);
    console.log(`  Output layer symmetry: ${outputSymmetry.toFixed(6)}`);
    
    const allInputWeights = weights.inputToHidden.flat();
    const allOutputWeights = weights.hiddenToOutput.flat();
    console.log(`\n📈 Overall Weight Distribution:`);
    console.log(`  Input weights: ${allInputWeights.length} values, range [${Math.min(...allInputWeights).toFixed(4)}, ${Math.max(...allInputWeights).toFixed(4)}]`);
    console.log(`  Output weights: ${allOutputWeights.length} values, range [${Math.min(...allOutputWeights).toFixed(4)}, ${Math.max(...allOutputWeights).toFixed(4)}]`);
    
    console.log(`\n⚠️ Potential Issues Check:`);
    if (inputSymmetry < 0.01) console.log('  🚨 WARNING: Input weights may be too symmetric!');
    if (outputSymmetry < 0.01) console.log('  🚨 WARNING: Output weights may be too symmetric!');
    if (Math.abs(calculateWeightStats(allInputWeights).mean) > 0.02) console.log('  🚨 WARNING: Input weights have non-zero mean bias!');
    if (Math.abs(calculateWeightStats(allOutputWeights).mean) > 0.02) console.log('  🚨 WARNING: Output weights have non-zero mean bias!');
}

// ============================================================================
// TESTING SUITE OBJECT FOR COMPATIBILITY
// ============================================================================
const TestingSuite = {
    quickAccuracyTest: function(dependencies = {}) {
        return quickAccuracyTest();
    },
    
    debugWeightInitialization: function(dependencies = {}) {
        return debugWeightInitialization();
    },
    
    calculateWeightStats: function(weightArray) {
        return calculateWeightStats(weightArray);
    },
    
    checkWeightSymmetry: function(weightMatrix) {
        return checkWeightSymmetry(weightMatrix);
    },
    
    testAccuracy: function(dataset) {
        return testAccuracy(dataset);
    }
};

// ============================================================================
// UI AND LANGUAGE FUNCTIONS
// ============================================================================
function setLanguage(lang) {
    if (window.i18n && typeof window.i18n.setLanguage === 'function') {
        window.i18n.setLanguage(lang);
    } else {
        console.warn('i18n system not loaded');
    }
}

function toggleViewMode() {
    window.expertViewMode = !window.expertViewMode;
    const toggle = document.getElementById('viewModeToggle');
    const indicator = document.getElementById('viewModeIndicator');
    
    if (window.expertViewMode) {
        if (toggle) toggle.innerHTML = '<span data-i18n="ui.toggles.switchToStudent">🎒 Switch to Student Mode</span>';
        if (indicator) indicator.textContent = 'Expert Mode';
        document.getElementById('advancedControls').style.display = 'block';
    } else {
        if (toggle) toggle.innerHTML = '<span data-i18n="ui.toggles.switchToExpert">🎓 Switch to Expert Mode</span>';
        if (indicator) indicator.textContent = 'Student Mode';
        document.getElementById('advancedControls').style.display = 'none';
    }
}

function updateInputActivations(values) {
    if (window.activations) {
        window.activations.input = values;
        // Update display
        for (let i = 0; i < 4; i++) {
            const valueElement = document.getElementById(`input-value-${i}`);
            if (valueElement) {
                valueElement.textContent = values[i].toFixed(2);
            }
        }
    }
}

function setTrueLabel(label) {
    window.trueLabel = label;
    const currentLabel = document.getElementById('currentTrueLabel');
    if (currentLabel) {
        currentLabel.textContent = label === 'dog' ? '🐕 Dog' : '🚫 Not Dog';
    }
    
    // Update button states
    document.querySelectorAll('.label-btn').forEach(btn => btn.classList.remove('active'));
    if (label === 'dog') {
        document.querySelector('.dog-label').classList.add('active');
    } else if (label === 'not-dog') {
        document.querySelector('.not-dog-label').classList.add('active');
    }
}

function selectImage(imageType) {
    window.currentImage = imageType;
    
    // Update button states
    document.querySelectorAll('.img-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Find and select the clicked button
    const buttons = document.querySelectorAll('.img-btn');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(`'${imageType}'`)) {
            btn.classList.add('selected');
        }
    });
    
    // Create new image with new activations
    createImage(imageType);
}

function startDemo() {
    console.log('🚀 Starting neural network demo...');
    // Basic demo functionality - can be extended
    const currentStep = document.getElementById('currentStep');
    if (currentStep) {
        currentStep.textContent = 'Running forward propagation...';
    }
}

function resetDemo() {
    console.log('🔄 Resetting network...');
    const currentStep = document.getElementById('currentStep');
    if (currentStep) {
        currentStep.textContent = 'Ready to start!';
    }
}

function openPixelViewer() {
    console.log('🔍 Opening pixel viewer...');
}

function toggleWeightSliders() {
    console.log('⚖️ Toggling weight sliders...');
}

function closeExpertPanel() {
    const panel = document.getElementById('expertPanel');
    if (panel) panel.style.display = 'none';
}

function resetExpertDefaults() {
    console.log('🔄 Resetting expert defaults...');
}

function applyExpertConfig() {
    console.log('✅ Applying expert configuration...');
}

// Placeholder forward propagation function
function forwardPropagationSilent(input) {
    // Simple placeholder - returns random-ish values for demo
    return [Math.random() * 0.8 + 0.1, Math.random() * 0.8 + 0.1];
}

// Make key objects and functions available globally
window.NETWORK_CONFIG = NETWORK_CONFIG;
window.EXPERT_CONFIG = EXPERT_CONFIG;
window.SVG_POSITIONS = SVG_POSITIONS;
window.DEFAULT_STATE = DEFAULT_STATE;
window.ANIMATION_CONFIG = ANIMATION_CONFIG;
window.CANVAS_CONFIG = CANVAS_CONFIG;
window.IMAGE_TYPES = IMAGE_TYPES;
window.LABELS = LABELS;
window.TestingSuite = TestingSuite;

// Global function assignments
window.setLanguage = setLanguage;
window.toggleViewMode = toggleViewMode;
window.updateInputActivations = updateInputActivations;
window.setTrueLabel = setTrueLabel;
window.selectImage = selectImage;
window.startDemo = startDemo;
window.resetDemo = resetDemo;
window.openPixelViewer = openPixelViewer;
window.toggleWeightSliders = toggleWeightSliders;
window.closeExpertPanel = closeExpertPanel;
window.resetExpertDefaults = resetExpertDefaults;
window.applyExpertConfig = applyExpertConfig;
window.forwardPropagationSilent = forwardPropagationSilent;

// Initialize some default values
window.expertViewMode = false;
window.trueLabel = null;
window.currentImage = 'dog1';
window.activations = {
    input: [0.9, 0.9, 0.1, 0.1],
    hidden: [0, 0, 0, 0],
    output: [0, 0]
};

// Add image URLs for GitHub Pages compatibility
window.imageUrls = {
    dog1: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANA==',
    dog2: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAKgAgAEAAAAAQAAAMigAwAEAAAAAQAAAMgAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/CABEIAMgAyAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAADAgQBBQAGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUgaEVM7HB4fDBwvr/xAAbAQACAwEBAQEAAAAAAAAAAAADBAECBQAGB//aAAwDAQACEQMRAD8A9mUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgBQAoAUAKAFACgD//2Q==',
    dog3: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0JOANI=='
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Neural Network Visualization...');
    
    // Initialize with first image
    if (typeof createImage === 'function') {
        createImage('dog1');
    }
    
    // Set up speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function(e) {
            window.animationSpeed = parseInt(e.target.value);
            speedValue.textContent = e.target.value;
        });
    }
    
    console.log('✅ Neural Network Visualization initialized');
});

console.log('✅ Neural Network Bundle loaded - GitHub Pages compatible');