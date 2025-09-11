function selectImage(imageType) {
    currentImage = imageType;
    
    // Update button states
    document.querySelectorAll('.img-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Handle both programmatic calls and user clicks
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('selected');
    } else {
        // For programmatic calls, find the button by its onclick attribute
        const buttons = document.querySelectorAll('.img-btn');
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(`'${imageType}'`)) {
                btn.classList.add('selected');
            }
        });
    }
    
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
    
    // Reset probability bars (only if they exist)
    const dogProbBar = document.getElementById('dogProbBar');
    const notDogProbBar = document.getElementById('notDogProbBar');
    const dogProbValue = document.getElementById('dogProbValue');
    const notDogProbValue = document.getElementById('notDogProbValue');
    
    if (dogProbBar) dogProbBar.style.width = '0%';
    if (notDogProbBar) notDogProbBar.style.width = '0%';
    if (dogProbValue) dogProbValue.textContent = '0%';
    if (notDogProbValue) notDogProbValue.textContent = '0%';
    
    // True label is now pre-selected in createImage function, so don't clear it
    
    // Show weights to demonstrate learning persistence
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfoDual(
        '🖼️ <strong>New Image Selected!</strong><br>🧠 The AI still remembers its previous lessons! Notice the connection strength numbers didn\'t change - that\'s its "memory" from earlier learning!',
        '🖼️ <strong>Image Changed</strong><br>🧠 Weights preserved from previous training. Network maintains learned parameters.'
    );
    // Button doesn't exist in compact interface
}

if (typeof window !== 'undefined') window.selectImage = selectImage;