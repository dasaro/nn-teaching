// ============================================================================
// CONSTANTS CONFIGURATION - GitHub Pages Compatible Version
// ============================================================================
// Converted from ES6 modules to IIFE for file:// protocol compatibility

(function(window) {
    'use strict';

    // ============================================================================
    // NETWORK CONFIGURATION
    // ============================================================================
    const NETWORK_CONFIG = {
        INPUT_SIZE: 4,
        HIDDEN_SIZE: 4,
        OUTPUT_SIZE: 2,
        DEFAULT_LEARNING_RATE: 0.1,
        ACTIVATION_FUNCTIONS: {
            LEAKY_RELU: 'leaky_relu',
            SIGMOID: 'sigmoid', 
            TANH: 'tanh',
            SOFTMAX: 'softmax'
        }
    };

    // ============================================================================
    // EXPERT CONFIGURATION
    // ============================================================================
    const EXPERT_CONFIG = {
        hiddenActivation: 'leaky_relu',
        outputActivation: 'softmax',
        learningRate: 0.1,
        momentum: 0.0,
        l2Regularization: 0.0,
        inputSize: 4,
        hiddenSize: 4,
        outputSize: 2,
        leakyReLUAlpha: 0.1,
        activationFunctions: ['leaky_relu', 'sigmoid', 'tanh'],
        outputFunctions: ['softmax', 'sigmoid']
    };

    // ============================================================================
    // SVG POSITIONS
    // ============================================================================
    const SVG_POSITIONS = {
        input: [{x: 80, y: 60}, {x: 80, y: 140}, {x: 80, y: 220}, {x: 80, y: 300}],
        hidden: [{x: 250, y: 90}, {x: 250, y: 160}, {x: 250, y: 230}, {x: 250, y: 270}],
        output: [{x: 420, y: 140}, {x: 420, y: 220}]
    };

    // ============================================================================
    // DEFAULT STATE
    // ============================================================================
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

    // ============================================================================
    // ANIMATION CONFIGURATION
    // ============================================================================
    const ANIMATION_CONFIG = {
        DEFAULT_SPEED: 5,
        MIN_SPEED: 1,
        MAX_SPEED: 10,
        STEP_DELAY_BASE: 1000,
        NEURON_ACTIVATION_DURATION: 300,
        CONNECTION_FLOW_DURATION: 500
    };

    // ============================================================================
    // CANVAS CONFIGURATION
    // ============================================================================
    const CANVAS_CONFIG = {
        WIDTH: 200,
        HEIGHT: 200,
        CONTEXT_OPTIONS: {
            alpha: true,
            antialias: true
        }
    };

    // ============================================================================
    // IMAGE TYPES AND LABELS
    // ============================================================================
    const IMAGE_TYPES = {
        DOG_IMAGES: ['dog1', 'dog2', 'dog3'],
        NON_DOG_IMAGES: ['cat', 'bird', 'car', 'tree', 'fish'],
        get ALL_IMAGES() {
            return [...this.DOG_IMAGES, ...this.NON_DOG_IMAGES];
        }
    };

    const LABELS = {
        DOG: 'dog',
        NOT_DOG: 'not-dog'
    };

    // ============================================================================
    // GLOBAL EXPORTS
    // ============================================================================
    window.NETWORK_CONFIG = NETWORK_CONFIG;
    window.EXPERT_CONFIG = EXPERT_CONFIG;
    window.SVG_POSITIONS = SVG_POSITIONS;
    window.DEFAULT_STATE = DEFAULT_STATE;
    window.ANIMATION_CONFIG = ANIMATION_CONFIG;
    window.CANVAS_CONFIG = CANVAS_CONFIG;
    window.IMAGE_TYPES = IMAGE_TYPES;
    window.LABELS = LABELS;

    console.log('✅ Constants loaded - GitHub Pages compatible version');

})(window);