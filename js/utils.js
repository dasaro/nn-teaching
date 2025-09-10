// ============================================================================
// UTILITY FUNCTIONS - GitHub Pages Compatible Version
// ============================================================================
// Combined utilities from math.js, dom.js, and animation.js

(function(window) {
    'use strict';

    // ============================================================================
    // MATH UTILITIES
    // ============================================================================
    const MathUtils = {
        // Activation functions
        sigmoid: function(x) {
            if (x > 500) return 1; // Prevent overflow
            if (x < -500) return 0;
            return 1 / (1 + Math.exp(-x));
        },

        sigmoidDerivative: function(x) {
            const s = this.sigmoid(x);
            return s * (1 - s);
        },

        leakyReLU: function(x, alpha = 0.1) {
            return x >= 0 ? x : alpha * x;
        },

        leakyReLUDerivative: function(x, alpha = 0.1) {
            return x >= 0 ? 1 : alpha;
        },

        tanhActivation: function(x) {
            if (x > 500) return 1;
            if (x < -500) return -1;
            return Math.tanh(x);
        },

        tanhDerivative: function(x) {
            const t = this.tanhActivation(x);
            return 1 - t * t;
        },

        softmax: function(values) {
            const maxVal = Math.max(...values);
            const shifted = values.map(v => v - maxVal);
            const exps = shifted.map(v => Math.exp(Math.min(v, 500)));
            const sum = exps.reduce((acc, val) => acc + val, 0);
            return exps.map(exp => exp / (sum + 1e-8));
        },

        calculateBinaryAccuracy: function(predictions, targets) {
            if (predictions.length !== targets.length) return 0;
            let correct = 0;
            for (let i = 0; i < predictions.length; i++) {
                const predicted = predictions[i][0] > predictions[i][1] ? 1 : 0;
                const actual = targets[i][0] > targets[i][1] ? 1 : 0;
                if (predicted === actual) correct++;
            }
            return correct / predictions.length;
        },

        calculateDatasetAccuracy: function(dataset, forwardFunction) {
            let correct = 0;
            dataset.forEach(example => {
                const output = forwardFunction(example.input);
                const predicted = output[0] > output[1];
                if (predicted === example.isDog) correct++;
            });
            return correct / dataset.length;
        }
    };

    // ============================================================================
    // DOM UTILITIES  
    // ============================================================================
    const DOMUtils = {
        safeGetElementById: function(id) {
            const element = document.getElementById(id);
            if (!element) {
                console.warn(`Element with id "${id}" not found`);
            }
            return element;
        },

        getCanvasContext: function(canvasId, contextType = '2d', options = {}) {
            const canvas = this.safeGetElementById(canvasId);
            if (!canvas) return null;
            return canvas.getContext(contextType, options);
        },

        formatMatrix: function(matrix, precision = 3) {
            if (!Array.isArray(matrix)) return 'Invalid matrix';
            return matrix.map(row => 
                Array.isArray(row) 
                    ? `[${row.map(val => val.toFixed(precision)).join(', ')}]`
                    : val.toFixed(precision)
            ).join('\n');
        },

        formatOperation: function(operation, inputs, outputs, precision = 3) {
            const inputStr = Array.isArray(inputs) ? inputs.map(v => v.toFixed(precision)).join(', ') : inputs;
            const outputStr = Array.isArray(outputs) ? outputs.map(v => v.toFixed(precision)).join(', ') : outputs;
            return `${operation}: [${inputStr}] → [${outputStr}]`;
        },

        getElementByIdQuietly: function(id) {
            return document.getElementById(id);
        }
    };

    // ============================================================================
    // ANIMATION UTILITIES
    // ============================================================================
    const AnimationUtils = {
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        calculateAnimationDelay: function(speed) {
            const baseDelay = window.ANIMATION_CONFIG ? window.ANIMATION_CONFIG.STEP_DELAY_BASE : 1000;
            return baseDelay / (speed || 5);
        },

        easeInOut: function(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        },

        lerp: function(start, end, t) {
            return start + (end - start) * t;
        }
    };

    // ============================================================================
    // GLOBAL EXPORTS
    // ============================================================================
    window.MathUtils = MathUtils;
    window.DOMUtils = DOMUtils;
    window.AnimationUtils = AnimationUtils;

    // Legacy global functions for backward compatibility
    window.sigmoid = MathUtils.sigmoid;
    window.sigmoidDerivative = MathUtils.sigmoidDerivative;
    window.leakyReLU = MathUtils.leakyReLU;
    window.leakyReLUDerivative = MathUtils.leakyReLUDerivative;
    window.tanhActivation = MathUtils.tanhActivation;
    window.tanhDerivative = MathUtils.tanhDerivative;
    window.softmax = MathUtils.softmax;
    window.calculateBinaryAccuracy = MathUtils.calculateBinaryAccuracy;
    window.calculateDatasetAccuracy = MathUtils.calculateDatasetAccuracy;
    window.formatMatrix = DOMUtils.formatMatrix;
    window.formatOperation = DOMUtils.formatOperation;
    window.getElementByIdQuietly = DOMUtils.getElementByIdQuietly;
    window.safeGetElementById = DOMUtils.safeGetElementById;
    window.getCanvasContext = DOMUtils.getCanvasContext;
    window.sleep = AnimationUtils.sleep;

    console.log('✅ Utilities loaded - GitHub Pages compatible version');

})(window);