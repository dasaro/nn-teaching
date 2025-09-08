// Simplified Neural Network Visualization App
let animationSpeed = 5;
let isAnimating = false;
let trueLabel = null; // 'dog' or 'not-dog'
let currentImage = 'dog1';

// Network structure optimized for stable learning - SIMPLIFIED
const networkConfig = {
    inputSize: 4, // 4 input features: [dog_size, friendliness, bark, domestic]
    hiddenSize: 3, // Just 3 hidden neurons - simpler is better
    outputSize: 2,  // dog/not-dog
    learningRate: 0.2 // Moderate learning rate to prevent NaN
};

// Network weights
let weights = {
    inputToHidden: [],
    hiddenToOutput: []
};

// Network activations
let activations = {
    input: [0.8, 0.6, 0.9, 0.7], // Will be updated with distinctive features
    hidden: [0, 0, 0],
    output: [0, 0]
};

// Network positions for SVG drawing - back to 3 hidden neurons
const positions = {
    input: [{x: 80, y: 80}, {x: 80, y: 150}, {x: 80, y: 220}, {x: 80, y: 290}],
    hidden: [{x: 300, y: 120}, {x: 300, y: 200}, {x: 300, y: 280}],
    output: [{x: 520, y: 150}, {x: 520, y: 250}]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeNetwork();
    createImage(currentImage);
    drawNetwork();
    setupEventListeners();
    resetDemo();
});

function setupEventListeners() {
    document.getElementById('speedSlider').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
    });
}

function initializeNetwork() {
    // Initialize smaller random weights between -0.5 and 0.5 to prevent instability
    weights.inputToHidden = Array.from({length: networkConfig.hiddenSize}, () =>
        Array.from({length: networkConfig.inputSize}, () => (Math.random() - 0.5))
    );
    
    weights.hiddenToOutput = Array.from({length: networkConfig.outputSize}, () =>
        Array.from({length: networkConfig.hiddenSize}, () => (Math.random() - 0.5))
    );
    
    console.log('Network initialized with weights between -0.5 and 0.5');
}

function createImage(imageType) {
    const canvas = document.getElementById('inputImage');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, 200, 200);
    
    switch(imageType) {
        case 'dog1':
            drawDog1(ctx);
            updateInputActivations([1.0, 1.0, 1.0, 1.0]); // [size=max, friendliness=max, bark=max, domestic=max] - PURE DOG
            setTrueLabel('dog'); // Pre-select correct answer
            break;
        case 'dog2':
            drawDog2(ctx);
            updateInputActivations([0.9, 1.0, 1.0, 1.0]); // [size=large, friendliness=max, bark=max, domestic=max] - PURE DOG
            setTrueLabel('dog'); // Pre-select correct answer
            break;
        case 'cat':
            drawCat(ctx);
            updateInputActivations([0.2, 0.3, 0.0, 0.8]); // [size=small, friendliness=low, bark=ZERO, domestic=high] - CLEARLY NOT DOG
            setTrueLabel('not-dog'); // Pre-select correct answer
            break;
        case 'car':
            drawCar(ctx);
            updateInputActivations([1.0, 0.0, 0.0, 0.0]); // [size=max, friendliness=ZERO, bark=ZERO, domestic=ZERO] - CLEARLY NOT DOG
            setTrueLabel('not-dog'); // Pre-select correct answer
            break;
        case 'tree':
            drawTree(ctx);
            updateInputActivations([0.9, 0.0, 0.0, 0.0]); // [size=large, friendliness=ZERO, bark=ZERO, domestic=ZERO] - CLEARLY NOT DOG
            setTrueLabel('not-dog'); // Pre-select correct answer
            break;
    }
}

function drawDog1(ctx) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(60, 120, 80, 60);
    
    // Head
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.arc(100, 80, 35, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(80, 60, 15, 25, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(120, 60, 15, 25, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 90, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 95, 8, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(70, 180, 10, 20);
    ctx.fillRect(85, 180, 10, 20);
    ctx.fillRect(105, 180, 10, 20);
    ctx.fillRect(120, 180, 10, 20);
    
    // Tail
    ctx.beginPath();
    ctx.arc(150, 140, 15, 0, Math.PI);
    ctx.fill();
}

function drawDog2(ctx) {
    // Different dog - more square/bulldog style
    // Body
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(50, 130, 100, 50);
    
    // Head - more square
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(70, 60, 60, 60);
    
    // Ears - smaller, different position
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(65, 55, 15, 20);
    ctx.fillRect(120, 55, 15, 20);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(85, 80, 6, 6);
    ctx.fillRect(109, 80, 6, 6);
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.fillRect(96, 100, 8, 4);
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 110);
    ctx.lineTo(100, 115);
    ctx.lineTo(110, 110);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(60, 180, 12, 20);
    ctx.fillRect(80, 180, 12, 20);
    ctx.fillRect(108, 180, 12, 20);
    ctx.fillRect(128, 180, 12, 20);
}

function drawCat(ctx) {
    // Body
    ctx.fillStyle = '#696969';
    ctx.fillRect(70, 130, 60, 50);
    
    // Head
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(100, 85, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pointed ears
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(80, 65);
    ctx.lineTo(85, 45);
    ctx.lineTo(95, 60);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(120, 65);
    ctx.lineTo(115, 45);
    ctx.lineTo(105, 60);
    ctx.fill();
    
    // Eyes - cat-like
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(90, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(110, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(89, 78, 2, 4);
    ctx.fillRect(109, 78, 2, 4);
    
    // Nose - triangle
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(100, 88);
    ctx.lineTo(95, 95);
    ctx.lineTo(105, 95);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 85);
    ctx.lineTo(85, 87);
    ctx.moveTo(70, 90);
    ctx.lineTo(85, 90);
    ctx.moveTo(130, 85);
    ctx.lineTo(115, 87);
    ctx.moveTo(130, 90);
    ctx.lineTo(115, 90);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#696969';
    ctx.fillRect(75, 180, 8, 20);
    ctx.fillRect(90, 180, 8, 20);
    ctx.fillRect(102, 180, 8, 20);
    ctx.fillRect(117, 180, 8, 20);
    
    // Tail - long and curved
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(140, 150, 20, Math.PI, 0);
    ctx.stroke();
}

function drawCar(ctx) {
    // Car body
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(40, 130, 120, 40);
    
    // Car roof
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(60, 100, 80, 30);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(65, 105, 25, 20);
    ctx.fillRect(110, 105, 25, 20);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(65, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wheel centers
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(65, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Headlights
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(35, 145, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, 155, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function drawTree(ctx) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(90, 120, 20, 80);
    
    // Tree crown - multiple circles
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(80, 100, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, 100, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 120, 25, 0, 2 * Math.PI);
    ctx.fill();
    
    // Leaves details
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(90, 90, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 90, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 110, 8, 0, 2 * Math.PI);
    ctx.fill();
}

function updateInputActivations(values) {
    activations.input = values;
    // Update display
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const valueElement = document.getElementById(`input-value-${i}`);
        if (valueElement) {
            valueElement.textContent = activations.input[i].toFixed(2);
        }
    }
}

function selectImage(imageType) {
    currentImage = imageType;
    
    // Update button states
    document.querySelectorAll('.img-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Create new image with new activations
    createImage(imageType);
    
    // IMPORTANT: Don't reset demo - preserve learned weights!
    // Only reset visual state, not the weights
    isAnimating = false;
    
    // Reset visual states only
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Reset activations display for new image (but keep weights!)
    activations.hidden = [0, 0, 0, 0, 0];
    activations.output = [0, 0];
    
    // Update neuron displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
    // Reset probability bars
    document.getElementById('dogProbBar').style.width = '0%';
    document.getElementById('notDogProbBar').style.width = '0%';
    document.getElementById('dogProbValue').textContent = '0%';
    document.getElementById('notDogProbValue').textContent = '0%';
    
    // True label is now pre-selected in createImage function, so don't clear it
    
    // Show weights to demonstrate learning persistence
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfo('New image selected! 📚 Previous learning preserved in weights. Test if the network learned to distinguish dogs from non-dogs!');
    document.getElementById('startBtn').disabled = false;
    hideOperation();
}

function drawNetwork() {
    const svg = document.getElementById('networkSvg');
    svg.innerHTML = '';
    
    // Draw connections first (so they appear behind neurons)
    drawConnections();
    
    // Draw neurons
    drawNeurons();
    
    // Draw layer labels
    drawLabels();
    
    // Update visual properties based on current values
    updateConnectionThickness();
    updateNeuronColors();
}

function drawConnections() {
    const svg = document.getElementById('networkSvg');
    
    // Input to Hidden connections
    for (let i = 0; i < networkConfig.inputSize; i++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.input[i].x + 25);
            line.setAttribute('y1', positions.input[i].y);
            line.setAttribute('x2', positions.hidden[h].x - 25);
            line.setAttribute('y2', positions.hidden[h].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-input-${i}-hidden-${h}`);
            
            // Add weight value text - always visible
            const weight = weights.inputToHidden[h][i];
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const midX = (positions.input[i].x + positions.hidden[h].x) / 2;
            const midY = (positions.input[i].y + positions.hidden[h].y) / 2;
            
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('class', 'weight-value show');
            text.setAttribute('id', `weight-input-${i}-hidden-${h}`);
            text.textContent = weight.toFixed(1);
            
            // Initial thickness - will be updated during animation based on activations
            line.setAttribute('stroke-width', 2);
            
            svg.appendChild(line);
            svg.appendChild(text);
        }
    }
    
    // Hidden to Output connections
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let o = 0; o < networkConfig.outputSize; o++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', positions.hidden[h].x + 25);
            line.setAttribute('y1', positions.hidden[h].y);
            line.setAttribute('x2', positions.output[o].x - 25);
            line.setAttribute('y2', positions.output[o].y);
            line.setAttribute('class', 'connection-line');
            line.setAttribute('id', `conn-hidden-${h}-output-${o}`);
            
            // Add weight value text - always visible
            const weight = weights.hiddenToOutput[o][h];
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const midX = (positions.hidden[h].x + positions.output[o].x) / 2;
            const midY = (positions.hidden[h].y + positions.output[o].y) / 2;
            
            text.setAttribute('x', midX);
            text.setAttribute('y', midY - 5);
            text.setAttribute('class', 'weight-value show');
            text.setAttribute('id', `weight-hidden-${h}-output-${o}`);
            text.textContent = weight.toFixed(1);
            
            // Initial thickness - will be updated during animation based on activations
            line.setAttribute('stroke-width', 2);
            
            svg.appendChild(line);
            svg.appendChild(text);
        }
    }
}

function drawNeurons() {
    const svg = document.getElementById('networkSvg');
    const layers = ['input', 'hidden', 'output'];
    const sizes = [networkConfig.inputSize, networkConfig.hiddenSize, networkConfig.outputSize];
    const labels = [['Size', 'Friend', 'Bark', 'Home'], ['H1', 'H2', 'H3'], ['Dog', 'Not']];
    
    layers.forEach((layer, layerIndex) => {
        for (let i = 0; i < sizes[layerIndex]; i++) {
            const pos = positions[layer][i];
            
            // Draw neuron circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 25);
            circle.setAttribute('class', 'neuron');
            circle.setAttribute('id', `${layer}-neuron-${i}`);
            
            // Draw neuron label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y - 5);
            text.setAttribute('class', 'neuron-value');
            text.textContent = labels[layerIndex][i];
            
            // Draw activation value
            const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueText.setAttribute('x', pos.x);
            valueText.setAttribute('y', pos.y + 8);
            valueText.setAttribute('class', 'neuron-value');
            valueText.setAttribute('id', `${layer}-value-${i}`);
            valueText.textContent = activations[layer][i].toFixed(2);
            
            svg.appendChild(circle);
            svg.appendChild(text);
            svg.appendChild(valueText);
        }
    });
}

function drawLabels() {
    const svg = document.getElementById('networkSvg');
    const labels = [{x: 80, y: 40, text: 'Input Layer'}, 
                   {x: 300, y: 40, text: 'Hidden Layer'}, 
                   {x: 520, y: 40, text: 'Output Layer'}];
    
    labels.forEach(label => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', label.x);
        text.setAttribute('y', label.y);
        text.setAttribute('class', 'layer-label');
        text.textContent = label.text;
        svg.appendChild(text);
    });
}

function setTrueLabel(label) {
    trueLabel = label;
    
    // Update UI
    document.querySelectorAll('.label-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(label === 'dog' ? 'labelDog' : 'labelNotDog').classList.add('selected');
    
    const selectedLabel = document.getElementById('selectedLabel');
    selectedLabel.textContent = label === 'dog' ? '✓ Correct answer: Dog' : '✓ Correct answer: Not Dog';
    selectedLabel.style.color = '#48bb78';
}

async function startDemo() {
    if (isAnimating) return;
    
    isAnimating = true;
    document.getElementById('startBtn').disabled = true;
    
    // Show current weight values at start
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfo("🔵 Starting neural network processing...");
    highlightSection('forward');
    await sleep(1000);
    
    // Step 1: Show input activation
    updateStepInfo("🔵 FORWARD PASS: Image features are fed into input neurons...");
    showOperation("Loading", "Reading image");
    await animateInputActivation();
    
    // Step 2: Forward propagation to hidden layer
    updateStepInfo("🔵 FORWARD PASS: Computing hidden layer activations...");
    showOperation("Multiplication", "Input × Weight");
    await animateForwardPropagation();
    
    // Step 3: Forward propagation to output layer
    updateStepInfo("🔵 FORWARD PASS: Computing final prediction...");
    showOperation("Sum", "Adding up results");
    await animateOutputComputation();
    
    // Step 4: Show result
    await displayResult();
    
    // Step 5: Backpropagation if true label is set
    if (trueLabel) {
        await sleep(2000);
        highlightSection('backward');
        updateStepInfo("🔴 BACKWARD PASS: Learning from the correct answer (backpropagation)...");
        showOperation("Learning", "Adjusting weights");
        await animateBackpropagation();
        updateStepInfo("✅ Network has learned! Weights have been updated. Run again to see the effect!");
        
        // Keep weight values visible after training
        document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    } else {
        updateStepInfo("Set the correct answer above to see learning in action!");
    }
    
    highlightSection('none');
    hideOperation();
    
    document.getElementById('startBtn').disabled = false;
    isAnimating = false;
}

async function animateInputActivation() {
    for (let i = 0; i < networkConfig.inputSize; i++) {
        const neuron = document.getElementById(`input-neuron-${i}`);
        const value = document.getElementById(`input-value-${i}`);
        
        neuron.classList.add('forward-active');
        value.textContent = activations.input[i].toFixed(2);
        
        await sleep(300);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
    }
    
    // Update visual properties based on activations
    updateNeuronColors();
    updateConnectionThickness();
}

async function animateForwardPropagation() {
    // All weights are always visible now
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        // Highlight incoming connections
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            connection.classList.add('forward-pass');
            await sleep(200);
            connection.classList.remove('forward-pass');
        }
        
        // Compute activation
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += activations.input[i] * weights.inputToHidden[h][i];
        }
        activations.hidden[h] = Math.max(0, sum); // ReLU activation
        
        // Update neuron
        const neuron = document.getElementById(`hidden-neuron-${h}`);
        const value = document.getElementById(`hidden-value-${h}`);
        neuron.classList.add('forward-active');
        value.textContent = activations.hidden[h].toFixed(2);
        
        await sleep(200);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
        
        // Update visual properties
        updateNeuronColors();
        updateConnectionThickness();
        
        await sleep(500);
    }
}

async function animateOutputComputation() {
    // Compute output layer
    for (let o = 0; o < networkConfig.outputSize; o++) {
        // Highlight incoming connections
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            connection.classList.add('forward-pass');
            await sleep(200);
            connection.classList.remove('forward-pass');
        }
        
        // Compute activation
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
        }
        activations.output[o] = sum;
        
        await sleep(300);
    }
    
    // Apply softmax
    const maxVal = Math.max(...activations.output);
    const expVals = activations.output.map(val => Math.exp(val - maxVal));
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    activations.output = expVals.map(val => val / sumExp);
    
    // Update output neurons
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const neuron = document.getElementById(`output-neuron-${o}`);
        const value = document.getElementById(`output-value-${o}`);
        neuron.classList.add('forward-active');
        value.textContent = activations.output[o].toFixed(2);
        
        await sleep(200);
        neuron.classList.remove('forward-active');
        neuron.classList.add('active');
    }
    
    // Final visual update
    updateNeuronColors();
    updateConnectionThickness();
}

async function displayResult() {
    const dogProb = activations.output[0] * 100;
    const notDogProb = activations.output[1] * 100;
    
    // Update probability bars
    const dogBar = document.getElementById('dogProbBar');
    const notDogBar = document.getElementById('notDogProbBar');
    
    dogBar.style.width = `${dogProb}%`;
    notDogBar.style.width = `${notDogProb}%`;
    
    // Update percentage text
    document.getElementById('dogProbValue').textContent = `${dogProb.toFixed(1)}%`;
    document.getElementById('notDogProbValue').textContent = `${notDogProb.toFixed(1)}%`;
    
    const prediction = dogProb > notDogProb ? 'Dog' : 'Not Dog';
    const confidence = Math.max(dogProb, notDogProb);
    const isCorrect = (prediction === 'Dog' && trueLabel === 'dog') || (prediction === 'Not Dog' && trueLabel === 'not-dog');
    
    // Make prediction very prominent
    const predictionEmoji = prediction === 'Dog' ? '🐕' : '❌';
    const correctnessEmoji = isCorrect ? '✅' : '❌';
    const correctnessText = isCorrect ? 'CORRECT!' : 'WRONG!';
    
    updateStepInfo(`${predictionEmoji} PREDICTION: "${prediction}" (${confidence.toFixed(1)}% confident) ${correctnessEmoji} ${correctnessText}`);
    
    // Highlight the prediction result visually
    const predictionDisplay = document.getElementById('predictionDisplay');
    if (isCorrect) {
        predictionDisplay.style.borderColor = '#48bb78';
        predictionDisplay.style.backgroundColor = '#f0fff4';
    } else {
        predictionDisplay.style.borderColor = '#f56565';
        predictionDisplay.style.backgroundColor = '#fff5f5';
    }
    
    await sleep(2000); // Longer pause to see result
}

async function animateBackpropagation() {
    if (!trueLabel) return;
    
    // Determine target values
    const target = trueLabel === 'dog' ? [1, 0] : [0, 1];
    
    // Calculate output layer error (simplified cross-entropy derivative)
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = target[o] - activations.output[o];
    }
    
    updateStepInfo("Adjusting weights based on the error...");
    
    // Update output to hidden weights with proper gradients
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const connection = document.getElementById(`conn-hidden-${h}-output-${o}`);
            connection.classList.add('backward-pass');
            
            // Proper gradient descent weight update
            const weightUpdate = networkConfig.learningRate * outputErrors[o] * activations.hidden[h];
            weights.hiddenToOutput[o][h] += weightUpdate;
            
            // Update weight display with visual emphasis
            const weightText = document.getElementById(`weight-hidden-${h}-output-${o}`);
            const oldWeight = parseFloat(weightText.textContent);
            const newWeight = weights.hiddenToOutput[o][h];
            weightText.textContent = newWeight.toFixed(1);
            
            // Update line thickness based on new weight
            const weightMagnitude = Math.abs(newWeight);
            const thickness = Math.max(3, Math.min(15, weightMagnitude * 10 + 3));
            connection.style.strokeWidth = thickness + 'px';
            
            // Add visual emphasis if weight changed significantly
            if (Math.abs(newWeight - oldWeight) > 0.05) {
                weightText.style.fontWeight = 'bold';
                weightText.style.fontSize = '12px';
                setTimeout(() => {
                    weightText.style.fontWeight = 'normal';
                    weightText.style.fontSize = '10px';
                }, 1000);
            }
            
            // Color code the connection based on update
            if (Math.abs(weightUpdate) > 0.01) {
                connection.classList.add(weightUpdate > 0 ? 'positive' : 'negative');
            }
            
            await sleep(300);
            connection.classList.remove('backward-pass', 'positive', 'negative');
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // ReLU derivative: 1 if hidden activation > 0, 0 otherwise
        hiddenErrors[h] = activations.hidden[h] > 0 ? error : 0;
    }
    
    // Update input to hidden weights with proper gradients
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const connection = document.getElementById(`conn-input-${i}-hidden-${h}`);
            connection.classList.add('backward-pass');
            
            // Proper gradient descent weight update
            const weightUpdate = networkConfig.learningRate * hiddenErrors[h] * activations.input[i];
            weights.inputToHidden[h][i] += weightUpdate;
            
            // Update weight display with visual emphasis
            const weightText = document.getElementById(`weight-input-${i}-hidden-${h}`);
            const oldWeight = parseFloat(weightText.textContent);
            const newWeight = weights.inputToHidden[h][i];
            weightText.textContent = newWeight.toFixed(1);
            
            // Update line thickness based on new weight
            const weightMagnitude = Math.abs(newWeight);
            const thickness = Math.max(3, Math.min(15, weightMagnitude * 10 + 3));
            connection.style.strokeWidth = thickness + 'px';
            
            // Add visual emphasis if weight changed significantly
            if (Math.abs(newWeight - oldWeight) > 0.05) {
                weightText.style.fontWeight = 'bold';
                weightText.style.fontSize = '12px';
                setTimeout(() => {
                    weightText.style.fontWeight = 'normal';
                    weightText.style.fontSize = '10px';
                }, 1000);
            }
            
            // Color code the connection
            if (Math.abs(weightUpdate) > 0.02) {
                connection.classList.add(weightUpdate > 0 ? 'positive' : 'negative');
            }
            
            await sleep(200);
            connection.classList.remove('backward-pass', 'positive', 'negative');
        }
    }
}

function resetDemo() {
    isAnimating = false;
    
    // Reset all neuron states
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('active', 'forward-active', 'backward-active');
    });
    
    // Reset all connections
    document.querySelectorAll('.connection-line').forEach(connection => {
        connection.classList.remove('active', 'forward-pass', 'backward-pass', 'positive', 'negative');
    });
    
    // Don't hide weight values - keep them visible to show learning
    // document.querySelectorAll('.weight-value').forEach(w => w.classList.remove('show'));
    
    // Reset activations display (but keep learned weights!)
    activations.input = currentImage === 'dog1' ? [1.0, 1.0, 1.0, 1.0] :
                       currentImage === 'dog2' ? [0.9, 1.0, 1.0, 1.0] :
                       currentImage === 'cat' ? [0.2, 0.3, 0.0, 0.8] :
                       currentImage === 'car' ? [1.0, 0.0, 0.0, 0.0] :
                       currentImage === 'tree' ? [0.9, 0.0, 0.0, 0.0] : [1.0, 1.0, 1.0, 1.0];
    activations.hidden = [0, 0, 0];
    activations.output = [0, 0];
    
    // Update displays
    for (let i = 0; i < networkConfig.inputSize; i++) {
        document.getElementById(`input-value-${i}`).textContent = activations.input[i].toFixed(2);
    }
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        document.getElementById(`hidden-value-${h}`).textContent = '0.00';
    }
    for (let o = 0; o < networkConfig.outputSize; o++) {
        document.getElementById(`output-value-${o}`).textContent = '0.00';
    }
    
    // Reset probability bars
    document.getElementById('dogProbBar').style.width = '0%';
    document.getElementById('notDogProbBar').style.width = '0%';
    document.getElementById('dogProbValue').textContent = '0%';
    document.getElementById('notDogProbValue').textContent = '0%';
    
    updateStepInfo("Click \"Start Demo\" to see how the neural network processes the image!");
    document.getElementById('startBtn').disabled = false;
}

function updateStepInfo(message) {
    document.getElementById('currentStep').innerHTML = message;
}

function showOperation(title, description) {
    const box = document.getElementById('operationBox');
    const titleEl = document.getElementById('operationTitle');
    const descEl = document.getElementById('operationDesc');
    
    titleEl.textContent = title;
    descEl.textContent = description;
    box.style.display = 'block';
}

function hideOperation() {
    document.getElementById('operationBox').style.display = 'none';
}

function highlightSection(phase) {
    // Remove any existing highlights
    document.querySelectorAll('.layer-highlight').forEach(el => {
        el.classList.remove('layer-highlight');
    });
    
    if (phase === 'forward') {
        // Subtle highlighting for forward pass
        document.body.style.setProperty('--current-phase', '"Forward Pass"');
    } else if (phase === 'backward') {
        // Subtle highlighting for backward pass
        document.body.style.setProperty('--current-phase', '"Backward Pass"');
    } else {
        document.body.style.setProperty('--current-phase', '""');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * (11 - animationSpeed) / 10));
}

function updateConnectionThickness() {
    console.log('=== UPDATING CONNECTION THICKNESS ===');
    
    // Update input to hidden connections based on weight magnitude
    for (let i = 0; i < networkConfig.inputSize; i++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const line = document.getElementById(`conn-input-${i}-hidden-${h}`);
            if (line) {
                const weight = weights.inputToHidden[h][i];
                const weightMagnitude = Math.abs(weight);
                // VERY aggressive scaling to make differences obvious
                const thickness = Math.max(3, Math.min(15, weightMagnitude * 10 + 3));
                line.style.strokeWidth = thickness + 'px'; // Use style instead of setAttribute
                console.log(`Input-Hidden ${i}-${h}: Weight=${weight.toFixed(2)}, Thickness=${thickness}px`);
            } else {
                console.log(`Line not found: conn-input-${i}-hidden-${h}`);
            }
        }
    }
    
    // Update hidden to output connections based on weight magnitude
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let o = 0; o < networkConfig.outputSize; o++) {
            const line = document.getElementById(`conn-hidden-${h}-output-${o}`);
            if (line) {
                const weight = weights.hiddenToOutput[o][h];
                const weightMagnitude = Math.abs(weight);
                // VERY aggressive scaling
                const thickness = Math.max(3, Math.min(15, weightMagnitude * 10 + 3));
                line.style.strokeWidth = thickness + 'px'; // Use style instead of setAttribute
                console.log(`Hidden-Output ${h}-${o}: Weight=${weight.toFixed(2)}, Thickness=${thickness}px`);
            } else {
                console.log(`Line not found: conn-hidden-${h}-output-${o}`);
            }
        }
    }
}

function updateNeuronColors() {
    console.log('=== UPDATING NEURON COLORS ===');
    
    // Function to get light orange to dark orange color based on activation
    function getActivationColor(activation) {
        // Light orange (low) to Dark orange (high) gradient
        // Low activation: Light orange rgb(255, 218, 185)
        // High activation: Dark orange rgb(204, 85, 0)
        const t = Math.max(0, Math.min(1, activation)); // Clamp to 0-1
        
        const red = Math.round(255 - t * 51);    // 255 -> 204
        const green = Math.round(218 - t * 133); // 218 -> 85  
        const blue = Math.round(185 - t * 185);  // 185 -> 0
        
        return `rgb(${red}, ${green}, ${blue})`;
    }
    
    // Update all neurons with same color scheme
    const layers = ['input', 'hidden', 'output'];
    const activationArrays = [activations.input, activations.hidden, activations.output];
    
    layers.forEach((layer, layerIndex) => {
        const layerActivations = activationArrays[layerIndex];
        for (let i = 0; i < layerActivations.length; i++) {
            const neuron = document.getElementById(`${layer}-neuron-${i}`);
            if (neuron) {
                const activation = layerActivations[i];
                const color = getActivationColor(activation);
                neuron.style.fill = color;
                console.log(`${layer} ${i}: activation=${activation.toFixed(2)}, color=${color}`);
            }
        }
    });
}

function resetWeights() {
    // Reinitialize random weights
    initializeNetwork();
    
    // Redraw network with new weights
    drawNetwork();
    
    // Reset demo
    resetDemo();
    
    updateStepInfo('Weights have been reset to random values. The network has "forgotten" its learning!');
    
    // Clear any selected true label
    trueLabel = null;
    document.querySelectorAll('.label-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('selectedLabel').textContent = 'Select the correct label above';
    document.getElementById('selectedLabel').style.color = '#4a5568';
}

// Unit testing functions for network learning
function forwardPropagationSilent(inputValues) {
    // Set input activations
    activations.input = inputValues;
    
    // Compute hidden layer
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += activations.input[i] * weights.inputToHidden[h][i];
        }
        activations.hidden[h] = Math.max(0, sum); // ReLU activation
        
        // Check for NaN
        if (isNaN(activations.hidden[h])) {
            console.error('NaN in hidden activation!');
            activations.hidden[h] = 0;
        }
    }
    
    // Compute output layer
    for (let o = 0; o < networkConfig.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += activations.hidden[h] * weights.hiddenToOutput[o][h];
        }
        activations.output[o] = sum;
        
        // Check for NaN
        if (isNaN(activations.output[o])) {
            console.error('NaN in output activation!');
            activations.output[o] = 0;
        }
    }
    
    // Apply softmax with numerical stability
    const maxVal = Math.max(...activations.output);
    const expVals = activations.output.map(val => {
        const expVal = Math.exp(Math.min(val - maxVal, 700)); // Prevent overflow
        return isNaN(expVal) ? 0.5 : expVal;
    });
    const sumExp = expVals.reduce((a, b) => a + b, 0);
    
    if (sumExp === 0) {
        // Fallback if all exponentials are 0
        activations.output = [0.5, 0.5];
    } else {
        activations.output = expVals.map(val => val / sumExp);
    }
    
    // Final NaN check
    for (let o = 0; o < networkConfig.outputSize; o++) {
        if (isNaN(activations.output[o])) {
            console.error('NaN in final output!');
            activations.output[o] = 0.5;
        }
    }
    
    return activations.output;
}

function backpropagationSilent(target) {
    // Calculate output layer error
    const outputErrors = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        outputErrors[o] = target[o] - activations.output[o];
        // Check for NaN
        if (isNaN(outputErrors[o])) {
            console.error('NaN in output error!');
            return;
        }
    }
    
    // Update output to hidden weights with gradient clipping
    for (let o = 0; o < networkConfig.outputSize; o++) {
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            let weightUpdate = networkConfig.learningRate * outputErrors[o] * activations.hidden[h];
            
            // Gradient clipping to prevent explosion
            weightUpdate = Math.max(-1, Math.min(1, weightUpdate));
            
            // Check for NaN
            if (isNaN(weightUpdate)) {
                console.error('NaN in weight update!');
                continue;
            }
            
            weights.hiddenToOutput[o][h] += weightUpdate;
            
            // Ensure weight stays within bounds
            weights.hiddenToOutput[o][h] = Math.max(-5, Math.min(5, weights.hiddenToOutput[o][h]));
        }
    }
    
    // Calculate hidden layer errors (backpropagated)
    const hiddenErrors = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let error = 0;
        for (let o = 0; o < networkConfig.outputSize; o++) {
            error += outputErrors[o] * weights.hiddenToOutput[o][h];
        }
        // ReLU derivative: 1 if hidden activation > 0, 0 otherwise
        hiddenErrors[h] = activations.hidden[h] > 0 ? error : 0;
        
        // Check for NaN
        if (isNaN(hiddenErrors[h])) {
            console.error('NaN in hidden error!');
            hiddenErrors[h] = 0;
        }
    }
    
    // Update input to hidden weights with gradient clipping
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        for (let i = 0; i < networkConfig.inputSize; i++) {
            let weightUpdate = networkConfig.learningRate * hiddenErrors[h] * activations.input[i];
            
            // Gradient clipping to prevent explosion
            weightUpdate = Math.max(-1, Math.min(1, weightUpdate));
            
            // Check for NaN
            if (isNaN(weightUpdate)) {
                console.error('NaN in input weight update!');
                continue;
            }
            
            weights.inputToHidden[h][i] += weightUpdate;
            
            // Ensure weight stays within bounds
            weights.inputToHidden[h][i] = Math.max(-5, Math.min(5, weights.inputToHidden[h][i]));
        }
    }
}

function runLearningTest() {
    console.log('=== STARTING LEARNING TEST ===');
    
    // Test data: [size, friendliness, bark, domestic] -> [dog_prob, not_dog_prob]
    const testCases = [
        // Dogs - High friendliness, bark, and domestic; medium-large size
        { input: [0.9, 0.95, 0.9, 0.95], target: [1, 0], label: 'Dog1', isDog: true },
        { input: [0.8, 0.9, 0.95, 0.9], target: [1, 0], label: 'Dog2', isDog: true },
        // Non-dogs - Very distinctive patterns
        { input: [0.3, 0.4, 0.1, 0.7], target: [0, 1], label: 'Cat', isDog: false },    // Small, less friendly, no bark
        { input: [0.95, 0.05, 0.05, 0.05], target: [0, 1], label: 'Car', isDog: false }, // Large, no biological traits
        { input: [0.8, 0.05, 0.05, 0.05], target: [0, 1], label: 'Tree', isDog: false }  // Large, no biological traits
    ];
    
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
    
    // Train for multiple epochs with early stopping
    const maxEpochs = 20;
    console.log(`--- TRAINING FOR UP TO ${maxEpochs} EPOCHS (with early stopping) ---`);
    
    let epoch = 0;
    let perfectAccuracyCount = 0;
    
    while (epoch < maxEpochs && perfectAccuracyCount < 3) {
        // Train on each example multiple times per epoch for faster learning
        for (let rep = 0; rep < 2; rep++) {
            testCases.forEach(testCase => {
                forwardPropagationSilent(testCase.input);
                backpropagationSilent(testCase.target);
            });
        }
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
    updateStepInfo(`🧪 Test Results: ${(finalAccuracy*100).toFixed(1)}% accuracy after ${epoch} epochs. Estimated: Run demo ${trainingRoundsNeeded}-${trainingRoundsNeeded + 1} times for 100% accuracy! ${finalAccuracy === 1.0 ? '🎉 PERFECT' : finalAccuracy >= 0.8 ? '✅ GOOD' : '❌ POOR'}`);
    
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

async function trainToPerfection() {
    console.log('=== AUTO-TRAINING TO 100% ACCURACY (SIMPLIFIED NETWORK) ===');
    updateStepInfo('🚀 Auto-training simplified network to 100% accuracy...');
    
    // EXTREMELY distinctive test data - should be easy to learn
    const testCases = [
        // Dogs - All dog features at MAX
        { input: [1.0, 1.0, 1.0, 1.0], target: [1, 0], label: 'Dog1', isDog: true },
        { input: [0.9, 1.0, 1.0, 1.0], target: [1, 0], label: 'Dog2', isDog: true },
        // Non-dogs - Zero dog features (except size for some)
        { input: [0.2, 0.3, 0.0, 0.8], target: [0, 1], label: 'Cat', isDog: false },   // Small, can't bark
        { input: [1.0, 0.0, 0.0, 0.0], target: [0, 1], label: 'Car', isDog: false },  // Not alive
        { input: [0.9, 0.0, 0.0, 0.0], target: [0, 1], label: 'Tree', isDog: false }  // Not alive
    ];
    
    // Reset network to random weights
    initializeNetwork();
    console.log('Network reset. 3 hidden neurons, learning rate 0.2 (stable)');
    
    // Test initial accuracy
    let initialCorrect = 0;
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        if (correct) initialCorrect++;
    });
    console.log(`Initial accuracy: ${initialCorrect}/5 (${(initialCorrect/5*100).toFixed(1)}%)`);
    
    // VERY aggressive training
    const maxEpochs = 100; // More epochs if needed
    let epoch = 0;
    let bestAccuracy = 0;
    let perfectCount = 0;
    
    showOperation("Training", "Intensive weight adjustment");
    
    while (epoch < maxEpochs && perfectCount < 3) {
        // INTENSIVE training - 10 repetitions per epoch
        for (let rep = 0; rep < 10; rep++) {
            testCases.forEach(testCase => {
                forwardPropagationSilent(testCase.input);
                backpropagationSilent(testCase.target);
            });
        }
        epoch++;
        
        // Test current accuracy
        let correct = 0;
        testCases.forEach(testCase => {
            const output = forwardPropagationSilent(testCase.input);
            const dogProb = output[0];
            const isCorrect = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
            if (isCorrect) correct++;
        });
        
        const accuracy = correct / testCases.length;
        if (accuracy > bestAccuracy) bestAccuracy = accuracy;
        
        // Update UI every few epochs
        if (epoch % 2 === 0 || accuracy === 1.0) {
            updateStepInfo(`🔄 Intensive Training... Epoch ${epoch}: ${(accuracy*100).toFixed(1)}% (Best: ${(bestAccuracy*100).toFixed(1)}%)`);
            
            // Update visual network
            updateConnectionThickness();
            updateNeuronColors();
            
            await sleep(100);
        }
        
        console.log(`Epoch ${epoch}: ${correct}/5 (${(accuracy*100).toFixed(1)}%)`);
        
        // Track perfect accuracy
        if (accuracy === 1.0) {
            perfectCount++;
            console.log(`🎯 Perfect accuracy! (${perfectCount}/3)`);
            if (perfectCount >= 3) {
                console.log(`🎉 STABLE CONVERGENCE! 100% accuracy maintained`);
                break;
            }
        } else {
            perfectCount = 0; // Reset if we lose perfection
        }
    }
    
    // Final comprehensive test
    console.log('=== FINAL COMPREHENSIVE TEST ===');
    let finalCorrect = 0;
    let detailedResults = [];
    
    testCases.forEach(testCase => {
        const output = forwardPropagationSilent(testCase.input);
        const dogProb = output[0];
        const predicted = dogProb > 0.5 ? 'Dog' : 'Not Dog';
        const correct = (testCase.isDog && dogProb > 0.5) || (!testCase.isDog && dogProb <= 0.5);
        const confidence = Math.abs(dogProb - 0.5);
        
        console.log(`${testCase.label}: ${predicted} (${(dogProb*100).toFixed(1)}%) - ${correct ? '✅' : '❌'} (conf: ${(confidence*100).toFixed(1)}%)`);
        detailedResults.push({ label: testCase.label, predicted, probability: dogProb, correct, confidence });
        
        if (correct) finalCorrect++;
    });
    
    const finalAccuracy = finalCorrect / testCases.length;
    console.log(`FINAL RESULT: ${finalCorrect}/5 (${(finalAccuracy*100).toFixed(1)}%) after ${epoch} epochs`);
    
    hideOperation();
    
    if (finalAccuracy === 1.0) {
        updateStepInfo(`🎉 PERFECT! 100% accuracy achieved in ${epoch} epochs with simplified network. Ready for demos!`);
        console.log('🎉 MISSION ACCOMPLISHED! Perfect classification achieved!');
    } else if (finalAccuracy >= 0.8) {
        updateStepInfo(`⚡ Good! ${(finalAccuracy*100).toFixed(1)}% accuracy in ${epoch} epochs. Almost there!`);
        console.log(`⚡ Good progress: ${(finalAccuracy*100).toFixed(1)}% accuracy`);
    } else {
        updateStepInfo(`⚠️ Training struggled: ${(finalAccuracy*100).toFixed(1)}% accuracy. Network may need adjustment.`);
        console.log('⚠️ Training had difficulties - may need different approach');
    }
    
    // Final visual update
    drawNetwork();
    
    return { 
        success: finalAccuracy === 1.0, 
        accuracy: finalAccuracy, 
        epochs: epoch,
        simplified: true,
        results: detailedResults 
    };
}

