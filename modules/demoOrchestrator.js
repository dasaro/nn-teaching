// ============================================================================
// DEMO ORCHESTRATOR MODULE - Main demo flow and animation sequencing
// ============================================================================

import { sleep } from '../utils/animation.js';

/**
 * Demo Orchestrator Manager - Handles the main demo flow and animation sequencing
 */
export class DemoOrchestratorManager {
    constructor() {
        this.isRunning = false;
        this.performanceMetrics = {
            totalOperations: 0,
            forwardPassTime: 0,
            backpropTime: 0,
            epochCount: 0,
            weightUpdates: 0
        };
        console.log('✅ Demo Orchestrator Manager: Initialized');
    }

    /**
     * Main demo orchestration function - extracted from script.js startDemo()
     */
    async startDemo(dependencies = {}) {
        const {
            isAnimating,
            trueLabel,
            currentImage,
            setTrueLabel,
            updateStepInfo,
            updateStepInfoDual,
            highlightSection,
            animateInputActivation,
            animateForwardPropagation,
            animateOutputComputation,
            displayResult,
            animateBackpropagation,
            refreshAllConnectionVisuals,
            networkConfig,
            performanceMetrics
        } = dependencies;

        if (isAnimating) return;
        
        console.log("=== START DEMO CALLED ===");
        console.log("Current trueLabel:", trueLabel);
        console.log("Current image:", currentImage);
        
        // Failsafe: Ensure trueLabel is set based on current image
        if (!trueLabel) {
            console.log("trueLabel was null, setting it based on currentImage");
            const correctLabel = currentImage.startsWith('dog') ? 'dog' : 'not-dog';
            setTrueLabel(correctLabel);
            console.log("trueLabel set to:", trueLabel);
        }
        
        const startTime = performance.now();
        this.isRunning = true;
        
        // Update performance metrics
        if (performanceMetrics) {
            performanceMetrics.totalOperations++;
        }
        
        // Show current weight values at start
        document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
        
        updateStepInfo("🚀 Let's watch how the AI brain processes this image step by step!");
        highlightSection('forward');
        await sleep(1000);
        
        // Step 1: Show input activation
        const forwardStartTime = performance.now();
        updateStepInfo("📥 STEP 1: Converting the image into numbers the AI can understand. Each feature gets a score from 0 to 1.");
        await animateInputActivation();
        
        // Step 2: Forward propagation to hidden layer
        updateStepInfo("🧠 STEP 2: The hidden neurons are doing math! Each one multiplies input numbers by its connection weights, then adds them up.");
        await animateForwardPropagation();
        
        // Step 3: Forward propagation to output layer
        updateStepInfo("🎯 STEP 3: The output neurons make the final decision by combining all the hidden neuron signals!");
        await animateOutputComputation();
        
        if (performanceMetrics) {
            performanceMetrics.forwardPassTime = Math.round(performance.now() - forwardStartTime);
        }
        
        // Step 4: Show result
        await displayResult();
        
        // Step 5: Backpropagation if true label is set
        console.log("Checking backpropagation condition: trueLabel =", trueLabel);
        if (trueLabel) {
            await sleep(2000);
            const backpropStartTime = performance.now();
            highlightSection('backward');
            updateStepInfoDual(
                "📚 <strong>STEP 4: Learning Time!</strong><br>🎓 Just like when you study for a test, the AI looks at its mistake and figures out how to do better next time. It's like having a really patient teacher help it learn!",
                "📚 <strong>STEP 4: Backpropagation Learning Phase</strong><br>🔄 Computing gradients and updating weights based on classification error."
            );
            await animateBackpropagation();
            
            if (performanceMetrics && networkConfig) {
                performanceMetrics.backpropTime = Math.round(performance.now() - backpropStartTime);
                performanceMetrics.epochCount++;
                performanceMetrics.weightUpdates += (networkConfig.inputSize * networkConfig.hiddenSize) + (networkConfig.hiddenSize * networkConfig.outputSize);
            }
            
            updateStepInfo("🎉 Learning complete! The AI has updated its 'memory' (connection weights) and should be smarter now. Try running it again!");
            
            // Keep weight values visible after training
            document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
            
            // Make weight changes visible immediately
            refreshAllConnectionVisuals();
        } else {
            updateStepInfo("💡 Tip: Select the correct answer above to see how the AI learns from its mistakes!");
        }
        
        highlightSection('none');
        
        // Button doesn't exist in compact interface
        this.isRunning = false;
        
        console.log('🎬 Demo orchestration completed');
    }

    /**
     * Check if demo is currently running
     */
    isDemoRunning() {
        return this.isRunning;
    }

    /**
     * Stop demo if running
     */
    stopDemo() {
        this.isRunning = false;
        console.log('🛑 Demo orchestration stopped');
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }

    /**
     * Reset performance metrics
     */
    resetPerformanceMetrics() {
        this.performanceMetrics = {
            totalOperations: 0,
            forwardPassTime: 0,
            backpropTime: 0,
            epochCount: 0,
            weightUpdates: 0
        };
        console.log('📊 Performance metrics reset');
    }
}

// ============================================================================
// GLOBAL INSTANCE AND LEGACY BRIDGE SUPPORT
// ============================================================================

// Create global instance for use by legacy code
export const globalDemoOrchestrator = new DemoOrchestratorManager();

// Legacy function bridge for backward compatibility
export function startDemoOrchestration(dependencies) {
    return globalDemoOrchestrator.startDemo(dependencies);
}

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

console.log('📦 Demo Orchestrator module loaded');