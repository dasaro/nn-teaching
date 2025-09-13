// Activation Function Visualizer
// Interactive graphs and biological intuition for activation functions

let activationModal = null;
let activationCanvas = null;
let activationCtx = null;
let currentActivationFunction = 'leakyReLU';
let interactivePoint = { x: 0, y: 0 };
let isDragging = false;

// Initialize the activation function visualizer
function initializeActivationVisualizer() {
    // This will be called when needed, no need to initialize on page load
}

// Show activation function modal
function showActivationFunctionModal() {
    if (!activationModal) {
        createActivationModal();
    }
    
    activationModal.classList.add('show');
    updateActivationVisualization();
}

// Hide activation function modal
function hideActivationFunctionModal() {
    if (activationModal) {
        activationModal.classList.remove('show');
    }
}

// Create the modal DOM structure
function createActivationModal() {
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('activation-visualizer') : (key) => key;
    
    activationModal = document.createElement('div');
    activationModal.className = 'modal activation-modal';
    activationModal.innerHTML = `
        <div class="modal-content activation-modal-content">
            <div class="modal-header">
                <h2 data-i18n="activation.title">${t('activation.title')}</h2>
                <button class="modal-close" onclick="hideActivationFunctionModal()" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="activation-subtitle" data-i18n="activation.subtitle">${t('activation.subtitle')}</p>
                
                <!-- Biological Inspiration Section -->
                <div class="activation-section">
                    <h3 data-i18n="activation.biologicalTitle">${t('activation.biologicalTitle')}</h3>
                    <p class="activation-explanation" data-i18n="activation.biologicalExplanation">${t('activation.biologicalExplanation')}</p>
                    <div class="biological-examples">
                        <div class="bio-example bio-negative">
                            <div class="bio-icon">🚫</div>
                            <div class="bio-text">
                                <strong data-i18n="activation.negativeInput">${t('activation.negativeInput')}</strong>
                                <p data-i18n="activation.inhibited">${t('activation.inhibited')}</p>
                            </div>
                        </div>
                        <div class="bio-example bio-zero">
                            <div class="bio-icon">⚪</div>
                            <div class="bio-text">
                                <strong data-i18n="activation.zeroInput">${t('activation.zeroInput')}</strong>
                                <p data-i18n="activation.silent">${t('activation.silent')}</p>
                            </div>
                        </div>
                        <div class="bio-example bio-positive">
                            <div class="bio-icon">⚡</div>
                            <div class="bio-text">
                                <strong data-i18n="activation.positiveInput">${t('activation.positiveInput')}</strong>
                                <p data-i18n="activation.excited">${t('activation.excited')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Function Selection -->
                <div class="activation-section">
                    <h3 data-i18n="activation.mathematicalTitle">${t('activation.mathematicalTitle')}</h3>
                    <div class="function-selector">
                        <button class="function-btn active" onclick="selectActivationFunction('leakyReLU')" data-i18n="activation.leakyReLU">${t('activation.leakyReLU')}</button>
                        <button class="function-btn" onclick="selectActivationFunction('sigmoid')" data-i18n="activation.sigmoid">${t('activation.sigmoid')}</button>
                        <button class="function-btn" onclick="selectActivationFunction('tanh')" data-i18n="activation.tanh">${t('activation.tanh')}</button>
                        <button class="function-btn" onclick="selectActivationFunction('relu')" data-i18n="activation.relu">${t('activation.relu')}</button>
                    </div>
                </div>
                
                <!-- Interactive Graph -->
                <div class="activation-section">
                    <h3 data-i18n="activation.interactiveTitle">${t('activation.interactiveTitle')}</h3>
                    <p class="interaction-help" data-i18n="activation.dragPoint">${t('activation.dragPoint')}</p>
                    <div class="graph-container">
                        <canvas id="activationCanvas" width="400" height="300"></canvas>
                        <div class="graph-info">
                            <div class="current-values">
                                <div class="value-display">
                                    <span data-i18n="activation.inputValue">${t('activation.inputValue')}</span>: 
                                    <span id="currentInput" class="value-number">0.00</span>
                                </div>
                                <div class="value-display">
                                    <span data-i18n="activation.outputValue">${t('activation.outputValue')}</span>: 
                                    <span id="currentOutput" class="value-number">0.00</span>
                                </div>
                            </div>
                            <div class="function-info">
                                <div class="function-description" id="functionDescription">
                                    ${t('activation.leakyReLUDesc')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Biological Connection -->
                <div class="activation-section">
                    <h3 data-i18n="activation.biologicalConnection">${t('activation.biologicalConnection')}</h3>
                    <div class="neuron-response" id="neuronResponse">
                        <div class="neuron-visual">
                            <div class="neuron-body" id="neuronBody">
                                <div class="neuron-nucleus"></div>
                                <div class="neuron-dendrites"></div>
                                <div class="neuron-axon"></div>
                            </div>
                        </div>
                        <div class="response-text" id="responseText">${t('activation.silent')}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(activationModal);
    
    // Initialize canvas
    activationCanvas = document.getElementById('activationCanvas');
    activationCtx = activationCanvas.getContext('2d');
    
    // Add event listeners for interaction
    setupCanvasInteraction();
    
    // Close modal when clicking outside
    activationModal.addEventListener('click', (e) => {
        if (e.target === activationModal) {
            hideActivationFunctionModal();
        }
    });
}

// Setup canvas interaction for dragging the point
function setupCanvasInteraction() {
    if (!activationCanvas) return;
    
    activationCanvas.addEventListener('mousedown', startDrag);
    activationCanvas.addEventListener('mousemove', handleMouseMove);
    activationCanvas.addEventListener('mouseup', endDrag);
    activationCanvas.addEventListener('mouseleave', endDrag);
    
    // Touch events for mobile
    activationCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        activationCanvas.dispatchEvent(mouseEvent);
    });
    
    activationCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        activationCanvas.dispatchEvent(mouseEvent);
    });
    
    activationCanvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        activationCanvas.dispatchEvent(mouseEvent);
    });
}

function startDrag(e) {
    const rect = activationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Helper functions matching those in drawActivationGraph
    const padding = 50;
    const graphWidth = activationCanvas.width - 2 * padding;
    const centerX = padding + graphWidth / 2;
    const outputRange = getCurrentOutputRange();
    
    function inputToCanvasX(input) {
        return centerX + (input / 8) * graphWidth;
    }
    
    function outputToCanvasY(output) {
        const graphHeight = activationCanvas.height - 2 * padding;
        const centerY = padding + graphHeight / 2;
        return centerY - (output / outputRange) * (graphHeight / 2);
    }
    
    // Check if click is near the interactive point
    const pointX = inputToCanvasX(interactivePoint.x);
    const pointY = outputToCanvasY(interactivePoint.y);
    
    if (Math.abs(x - pointX) < 20 && Math.abs(y - pointY) < 20) {
        isDragging = true;
        activationCanvas.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (!isDragging) return;
    
    const rect = activationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Helper functions matching those in drawActivationGraph
    const padding = 50;
    const graphWidth = activationCanvas.width - 2 * padding;
    const centerX = padding + graphWidth / 2;
    
    function canvasXToInput(canvasX) {
        return ((canvasX - centerX) / graphWidth) * 8;
    }
    
    // Convert canvas x to input value (-4 to 4)
    interactivePoint.x = Math.max(-4, Math.min(4, canvasXToInput(x)));
    interactivePoint.y = calculateActivation(interactivePoint.x, currentActivationFunction);
    
    updateActivationVisualization();
}

function handleMouseMove(e) {
    if (isDragging) {
        drag(e);
        return;
    }
    
    // Check if mouse is over the interactive point for cursor change
    const rect = activationCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Helper functions matching those in drawActivationGraph
    const padding = 50;
    const graphWidth = activationCanvas.width - 2 * padding;
    const centerX = padding + graphWidth / 2;
    const outputRange = getCurrentOutputRange();
    
    function inputToCanvasX(input) {
        return centerX + (input / 8) * graphWidth;
    }
    
    function outputToCanvasY(output) {
        const graphHeight = activationCanvas.height - 2 * padding;
        const centerY = padding + graphHeight / 2;
        return centerY - (output / outputRange) * (graphHeight / 2);
    }
    
    // Check if mouse is near the interactive point
    const pointX = inputToCanvasX(interactivePoint.x);
    const pointY = outputToCanvasY(interactivePoint.y);
    
    if (Math.abs(x - pointX) < 20 && Math.abs(y - pointY) < 20) {
        activationCanvas.style.cursor = 'grab';
    } else {
        activationCanvas.style.cursor = 'crosshair';
    }
}

function endDrag() {
    isDragging = false;
    activationCanvas.style.cursor = 'crosshair';
}

// Select activation function
function selectActivationFunction(functionName) {
    currentActivationFunction = functionName;
    
    // Update button states
    document.querySelectorAll('.function-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update interactive point
    interactivePoint.y = calculateActivation(interactivePoint.x, functionName);
    
    updateActivationVisualization();
}

// Calculate activation function output
function calculateActivation(input, functionName) {
    switch (functionName) {
        case 'leakyReLU':
            return input >= 0 ? input : 0.01 * input;
        case 'sigmoid':
            return 1 / (1 + Math.exp(-input));
        case 'tanh':
            return Math.tanh(input);
        case 'relu':
            return Math.max(0, input);
        default:
            return input >= 0 ? input : 0.01 * input;
    }
}

// Update the visualization
function updateActivationVisualization() {
    if (!activationCtx) return;
    
    drawActivationGraph();
    updateValueDisplays();
    updateFunctionDescription();
    updateNeuronVisualization();
}

// Draw the activation function graph
function drawActivationGraph() {
    const ctx = activationCtx;
    const canvas = activationCanvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Graph parameters
    const padding = 50;
    const graphWidth = canvas.width - 2 * padding;
    const graphHeight = canvas.height - 2 * padding;
    const centerX = padding + graphWidth / 2;
    const centerY = padding + graphHeight / 2;
    
    // Input and output ranges
    const inputRange = 8; // -4 to 4
    const outputRange = getCurrentOutputRange(); // Dynamic based on function
    
    // Helper functions for coordinate transformation
    function inputToCanvasX(input) {
        return centerX + (input / inputRange) * graphWidth;
    }
    
    function outputToCanvasY(output) {
        return centerY - (output / outputRange) * (graphHeight / 2);
    }
    
    function canvasXToInput(canvasX) {
        return ((canvasX - centerX) / graphWidth) * inputRange;
    }
    
    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Vertical grid lines (every 1 unit)
    for (let input = -4; input <= 4; input += 1) {
        const x = inputToCanvasX(input);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    const gridStep = Math.max(0.5, outputRange / 4);
    for (let output = -outputRange; output <= outputRange; output += gridStep) {
        const y = outputToCanvasY(output);
        if (y >= padding && y <= canvas.height - padding) {
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
    }
    
    // Draw axes
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // X-axis (y = 0)
    const xAxisY = outputToCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(padding, xAxisY);
    ctx.lineTo(canvas.width - padding, xAxisY);
    ctx.stroke();
    
    // Y-axis (x = 0)
    ctx.beginPath();
    ctx.moveTo(centerX, padding);
    ctx.lineTo(centerX, canvas.height - padding);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    
    // X-axis labels
    ctx.textAlign = 'center';
    for (let input = -4; input <= 4; input += 2) {
        const x = inputToCanvasX(input);
        ctx.fillText(input.toString(), x, canvas.height - 25);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    const labelStep = Math.max(1, Math.ceil(outputRange / 3));
    for (let output = -Math.ceil(outputRange); output <= Math.ceil(outputRange); output += labelStep) {
        if (output !== 0) {
            const y = outputToCanvasY(output);
            if (y >= padding && y <= canvas.height - padding) {
                ctx.fillText(output.toString(), centerX - 10, y + 4);
            }
        }
    }
    
    // Draw activation function curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    for (let input = -4; input <= 4; input += 0.05) {
        const output = calculateActivation(input, currentActivationFunction);
        const canvasX = inputToCanvasX(input);
        const canvasY = outputToCanvasY(output);
        
        // Only draw points within the canvas bounds
        if (canvasY >= padding && canvasY <= canvas.height - padding) {
            if (firstPoint) {
                ctx.moveTo(canvasX, canvasY);
                firstPoint = false;
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
    }
    ctx.stroke();
    
    // Draw interactive point
    const pointX = inputToCanvasX(interactivePoint.x);
    const pointY = outputToCanvasY(interactivePoint.y);
    
    // Only draw point if it's within bounds
    if (pointY >= padding && pointY <= canvas.height - padding) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pointX, pointY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw point outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw dashed lines to axes
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // Vertical line to x-axis
        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(pointX, xAxisY);
        ctx.stroke();
        
        // Horizontal line to y-axis
        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(centerX, pointY);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
}

// Get appropriate output range for current function
function getCurrentOutputRange() {
    switch (currentActivationFunction) {
        case 'sigmoid':
            return 2; // 0 to 1, but give some padding
        case 'tanh':
            return 2; // -1 to 1, but give some padding  
        case 'relu':
        case 'leakyReLU':
            return 6; // Can go high with positive inputs
        default:
            return 4;
    }
}

// Update value displays
function updateValueDisplays() {
    const inputElement = document.getElementById('currentInput');
    const outputElement = document.getElementById('currentOutput');
    
    if (inputElement) inputElement.textContent = interactivePoint.x.toFixed(2);
    if (outputElement) outputElement.textContent = interactivePoint.y.toFixed(3);
}

// Update function description
function updateFunctionDescription() {
    const descElement = document.getElementById('functionDescription');
    if (!descElement) return;
    
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('activation-visualizer') : (key) => key;
    
    let description = '';
    switch (currentActivationFunction) {
        case 'leakyReLU':
            description = t('activation.leakyReLUDesc');
            break;
        case 'sigmoid':
            description = t('activation.sigmoidDesc');
            break;
        case 'tanh':
            description = t('activation.tanhDesc');
            break;
        case 'relu':
            description = t('activation.reluDesc');
            break;
    }
    
    descElement.textContent = description;
}

// Update neuron visualization based on input
function updateNeuronVisualization() {
    const neuronBody = document.getElementById('neuronBody');
    const responseText = document.getElementById('responseText');
    
    if (!neuronBody || !responseText) return;
    
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('activation-visualizer') : (key) => key;
    const input = interactivePoint.x;
    const output = interactivePoint.y;
    
    // Remove all previous classes
    neuronBody.className = 'neuron-body';
    
    if (input < -0.5) {
        neuronBody.classList.add('inhibited');
        responseText.textContent = t('activation.inhibited');
    } else if (Math.abs(input) <= 0.5) {
        neuronBody.classList.add('silent');
        responseText.textContent = t('activation.silent');
    } else {
        neuronBody.classList.add('excited');
        const intensity = Math.min(1, Math.abs(output));
        neuronBody.style.setProperty('--intensity', intensity);
        responseText.textContent = t('activation.excited');
    }
}

// Add button to open activation function modal
function addActivationFunctionButton() {
    const toolButtons = document.querySelector('.tool-buttons');
    if (!toolButtons) return;
    
    const t = window.i18nUtils ? window.i18nUtils.initModuleTranslation('activation-visualizer') : (key) => key;
    
    const button = document.createElement('button');
    button.className = 'tool-btn';
    button.onclick = showActivationFunctionModal;
    button.innerHTML = '📊 Functions';
    button.title = 'Learn about activation functions';
    button.setAttribute('data-i18n-title', 'activation.title');
    
    toolButtons.appendChild(button);
}

// Initialize interactive point
interactivePoint = { x: 1, y: calculateActivation(1, currentActivationFunction) };

// Export functions for global access
if (typeof window !== 'undefined') {
    window.activationVisualizer = {
        initialize: initializeActivationVisualizer,
        show: showActivationFunctionModal,
        hide: hideActivationFunctionModal,
        addButton: addActivationFunctionButton
    };
    
    // Make functions globally available
    window.showActivationFunctionModal = showActivationFunctionModal;
    window.hideActivationFunctionModal = hideActivationFunctionModal;
    window.selectActivationFunction = selectActivationFunction;
}