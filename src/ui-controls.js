// ============================================================================
// UI-CONTROLS MODULE
// User interface controls and panels
// ============================================================================

function toggleExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    if (expertPanelVisible) {
        closeExpertPanel();
    } else {
        openExpertPanel();
    }
}

function openExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'flex';
    expertPanelVisible = true;
    
    // Initialize UI with current expert config values
    initializeExpertPanelUI();
}

function closeExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'none';
    expertPanelVisible = false;
}

function initializeExpertPanelUI() {
    // Activation functions
    document.getElementById('hiddenActivation').value = expertConfig.hiddenActivation;
    document.getElementById('outputActivation').value = expertConfig.outputActivation;
    
    // Training parameters
    document.getElementById('learningRateSlider').value = expertConfig.learningRate;
    updateElementValue('learningRateValue', expertConfig.learningRate, 3);
    
    document.getElementById('momentumSlider').value = expertConfig.momentum;
    updateElementValue('momentumValue', expertConfig.momentum, 2);
    
    document.getElementById('l2RegSlider').value = expertConfig.l2Regularization;
    updateElementValue('l2RegValue', expertConfig.l2Regularization, 4);
    
    document.getElementById('maxEpochsSlider').value = expertConfig.maxEpochs;
    document.getElementById('maxEpochsValue').textContent = expertConfig.maxEpochs;
    
    // Activation function parameters
    document.getElementById('leakyReLUAlpha').value = expertConfig.leakyReLUAlpha;
    updateElementValue('leakyReLUAlphaValue', expertConfig.leakyReLUAlpha, 2);
    
    // Advanced settings
    document.getElementById('adaptiveLearningRate').checked = expertConfig.adaptiveLearningRate;
    
    document.getElementById('batchSizeSlider').value = expertConfig.batchSize;
    document.getElementById('batchSizeValue').textContent = expertConfig.batchSize;
    
    // Initialize architecture controls (interactive)
    setTimeout(() => {
        if (typeof initializeArchitectureControls === 'function') {
            initializeArchitectureControls();
        }
    }, 100); // Small delay to ensure DOM is ready
}

function updateExpertConfig(parameter, value) {
    expertConfig[parameter] = value;
    
    // Update corresponding display values
    switch (parameter) {
        case 'learningRate':
            updateElementValue('learningRateValue', value, 3);
            break;
        case 'momentum':
            updateElementValue('momentumValue', value, 2);
            break;
        case 'l2Regularization':
            updateElementValue('l2RegValue', value, 4);
            break;
        case 'maxEpochs':
            document.getElementById('maxEpochsValue').textContent = value;
            break;
        case 'leakyReLUAlpha':
            updateElementValue('leakyReLUAlphaValue', value, 2);
            break;
        case 'batchSize':
            document.getElementById('batchSizeValue').textContent = value;
            break;
    }
    
    console.log(`Expert parameter updated: ${parameter} = ${value}`);
}

function resetExpertDefaults() {
    expertConfig.hiddenActivation = 'leaky_relu';
    expertConfig.outputActivation = 'softmax';
    expertConfig.learningRate = 0.1;
    expertConfig.momentum = 0.0;
    expertConfig.l2Regularization = 0.0;
    expertConfig.leakyReLUAlpha = 0.1;
    expertConfig.adaptiveLearningRate = false;
    expertConfig.batchSize = 1;
    expertConfig.maxEpochs = 100;
    
    // Refresh UI
    initializeExpertPanelUI();
    
    console.log('Expert parameters reset to defaults');
}

function applyExpertConfig() {
    console.log('🔧 Applying expert configuration...');
    console.log('Expert Config:', expertConfig);
    
    // Enable expert view mode when expert panel is used
    expertViewMode = true;
    
    // Sync to legacy networkConfig for compatibility
    syncExpertConfigToLegacy();
    
    // Reset and reinitialize network with new parameters
    resetWeights();
    
    // Update step info to reflect new configuration
    updateStepInfoDual(
        `⚙️ <strong>Expert Settings Applied!</strong><br>🔧 The neural network was restarted with ${expertConfig.hiddenActivation.replace('_', ' ')} activation and ${expertConfig.learningRate} learning rate. You're now in expert mode!`,
        `⚙️ <strong>Expert Configuration Applied</strong><br>🔧 Network reinitialized: ${expertConfig.hiddenActivation.replace('_', ' ')} activation, η=${expertConfig.learningRate}. Expert view enabled.`
    );
    
    // Close expert panel
    closeExpertPanel();
    
    console.log('✅ Expert configuration applied successfully');
}

function toggleExpertViewMode() {
    expertViewMode = !expertViewMode;
    const status = expertViewMode ? 'enabled' : 'disabled';
    
    // Update view mode indicator in sidebar
    const indicator = document.getElementById('viewModeIndicator');
    if (indicator) {
        indicator.textContent = expertViewMode ? t('system.viewMode.expert') : t('system.viewMode.student');
        indicator.className = expertViewMode ? 'view-mode-indicator expert' : 'view-mode-indicator';
    }
    
    updateStepInfoDual(
        expertViewMode ? t('viewMode.expertEnabled') : t('viewMode.studentEnabled'),
        expertViewMode ? t('viewMode.expertEnabled') : t('viewMode.studentEnabled')
    );
    console.log(`Expert view mode: ${status}`);
}

function updateStepInfoDual(studentMessage, expertMessage = null) {
    const currentStep = document.getElementById('currentStep');
    if (!currentStep) return;
    
    const messageToShow = expertViewMode && expertMessage ? expertMessage : studentMessage;
    
    // If message logging is active, accumulate messages
    if (messageLogActive) {
        messageLog.push({
            timestamp: new Date().toLocaleTimeString(),
            message: messageToShow,
            type: expertViewMode ? 'expert' : 'student',
            mode: expertViewMode ? 'Expert' : 'Student'
        });
        displayMessageLog();
    } else {
        currentStep.innerHTML = messageToShow;
    }
}

function startMessageLog() {
    messageLog = [];
    messageLogActive = true;
    const currentStep = document.getElementById('currentStep');
    const mode = expertViewMode ? 'Expert' : 'Student';
    const icon = expertViewMode ? '📋' : '🎓';
    const description = expertViewMode ? 'Mathematical Details' : 'Learning Adventure';
    currentStep.innerHTML = `<div class="message-log-container"><div class="message-log-header">${icon} <strong>${mode} ${description}</strong> (Recording...)</div><div id="messageLogContent" class="message-log-content"></div></div>`;
}

function stopMessageLog() {
    messageLogActive = false;
    if (messageLog.length > 0) {
        const currentStep = document.getElementById('currentStep');
        const mode = messageLog[0]?.mode || 'Student';
        const icon = mode === 'Expert' ? '📋' : '🎓';
        const description = mode === 'Expert' ? 'Complete Mathematical Analysis' : 'Complete Learning Adventure';
        const finalMessage = `<div class="message-log-container"><div class="message-log-header">${icon} <strong>${description}</strong> ✅</div><div id="messageLogContent" class="message-log-content">` + 
            messageLog.map(entry => `<div class="message-log-entry ${entry.type}"><span class="log-timestamp">[${entry.timestamp}]</span> ${entry.message}</div>`).join('') + 
            `</div><div class="message-log-footer">${mode === 'Expert' ? '🎓 All mathematical steps preserved above' : '📖 Your complete AI learning story - review at your own pace!'}</div></div>`;
        currentStep.innerHTML = finalMessage;
    }
}

function displayMessageLog() {
    const logContent = document.getElementById('messageLogContent');
    if (logContent && messageLog.length > 0) {
        const lastEntry = messageLog[messageLog.length - 1];
        const entryHtml = `<div class="message-log-entry ${lastEntry.type}"><span class="log-timestamp">[${lastEntry.timestamp}]</span> ${lastEntry.message}</div>`;
        logContent.innerHTML += entryHtml;
        // Auto-scroll to bottom
        logContent.scrollTop = logContent.scrollHeight;
    }
}

function formatMatrix(matrix, name) {
    let html = `<div class="math-matrix"><strong>${name}:</strong><br>`;
    if (Array.isArray(matrix[0])) {
        // 2D matrix
        html += '[';
        matrix.forEach((row, i) => {
            html += '[' + row.map(val => val.toFixed(3)).join(', ') + ']';
            if (i < matrix.length - 1) html += '<br> ';
        });
        html += ']';
    } else {
        // 1D vector
        html += '[' + matrix.map(val => val.toFixed(3)).join(', ') + ']';
    }
    html += '</div>';
    return html;
}

function formatOperation(operation, inputs, result, description) {
    return `
        <div class="math-operation">
            <div class="op-title">🔢 <strong>${operation}</strong></div>
            <div class="op-description">${description}</div>
            <div class="op-calculation">
                <strong>Input:</strong> ${inputs}<br>
                <strong>Result:</strong> <span class="result-highlight">${result}</span>
            </div>
        </div>
    `;
}

function clearMessageLog() {
    const messageContent = document.getElementById('currentStep');
    if (messageContent) {
        const resetMessage = expertViewMode ? 
            '🗑️ <strong>Expert Sidebar Cleared</strong><br>📊 All previous mathematical analysis cleared. Ready for new detailed explanations!' :
            '🗑️ <strong>Student Sidebar Cleared</strong><br>🎓 All previous lessons cleared. Ready for your next learning adventure!';
        messageContent.innerHTML = resetMessage;
    }
    messageLog = [];
    messageLogActive = false;
}

function toggleAutoScroll() {
    autoScrollEnabled = !autoScrollEnabled;
    const button = event.target;
    button.textContent = autoScrollEnabled ? window.i18n.t('system.autoScrollOn') : window.i18n.t('system.autoScrollOff');
    button.title = autoScrollEnabled ? window.i18n.t('system.autoScrollDisable') : window.i18n.t('system.autoScrollEnable');
    
    if (autoScrollEnabled) {
        scrollToBottom();
    }
}

function scrollToBottom() {
    if (!autoScrollEnabled) return;
    
    const messageContent = document.getElementById('currentStep');
    if (messageContent) {
        messageContent.scrollTop = messageContent.scrollHeight;
    }
}

function startTutorial() {
    tutorialActive = true;
    tutorialStep = 0;
    
    // Hide tutorial button, show tutorial step
    document.getElementById('startTutorialBtn').style.display = 'none';
    document.getElementById('tutorialStep').style.display = 'block';
    
    showTutorialStep();
}

function showTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    
    // Update navigation buttons
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (tutorialStep === tutorialSteps.length - 1) {
        nextBtn.textContent = 'Start Learning! 🚀';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

function nextTutorialStep() {
    tutorialStep++;
    
    if (tutorialStep >= tutorialSteps.length) {
        skipTutorial();
    } else {
        showTutorialStep();
    }
}

function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial? It helps you understand how AI learning works!')) {
        completeTutorial();
    }
}

function completeTutorial() {
    tutorialActive = false;
    tutorialStep = 0;
    
    // Hide tutorial, show tutorial button again
    document.getElementById('tutorialStep').style.display = 'none';
    document.getElementById('startTutorialBtn').style.display = 'block';
    document.getElementById('startTutorialBtn').textContent = '🔄 Restart Tutorial';
    
    // Clear highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    // Enable all controls
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true; // Will be enabled after forward pass
    document.getElementById('fullDemoBtn').disabled = false;
    
    updateStepInfo('🎓 Tutorial complete! You can now explore on your own. Try the "Watch AI Think" button to see the magic happen!');
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.toggleExpertPanel = toggleExpertPanel;
if (typeof window !== 'undefined') window.openExpertPanel = openExpertPanel;
if (typeof window !== 'undefined') window.closeExpertPanel = closeExpertPanel;
if (typeof window !== 'undefined') window.initializeExpertPanelUI = initializeExpertPanelUI;
if (typeof window !== 'undefined') window.updateExpertConfig = updateExpertConfig;
if (typeof window !== 'undefined') window.resetExpertDefaults = resetExpertDefaults;
if (typeof window !== 'undefined') window.applyExpertConfig = applyExpertConfig;
if (typeof window !== 'undefined') window.toggleExpertViewMode = toggleExpertViewMode;
if (typeof window !== 'undefined') window.updateStepInfoDual = updateStepInfoDual;
if (typeof window !== 'undefined') window.startMessageLog = startMessageLog;
if (typeof window !== 'undefined') window.stopMessageLog = stopMessageLog;
if (typeof window !== 'undefined') window.displayMessageLog = displayMessageLog;
if (typeof window !== 'undefined') window.formatMatrix = formatMatrix;
if (typeof window !== 'undefined') window.formatOperation = formatOperation;
if (typeof window !== 'undefined') window.clearMessageLog = clearMessageLog;
if (typeof window !== 'undefined') window.toggleAutoScroll = toggleAutoScroll;
if (typeof window !== 'undefined') window.scrollToBottom = scrollToBottom;
if (typeof window !== 'undefined') window.startTutorial = startTutorial;
if (typeof window !== 'undefined') window.showTutorialStep = showTutorialStep;
if (typeof window !== 'undefined') window.nextTutorialStep = nextTutorialStep;
if (typeof window !== 'undefined') window.skipTutorial = skipTutorial;
if (typeof window !== 'undefined') window.completeTutorial = completeTutorial;

// Export architecture control functions
if (typeof window !== 'undefined') window.setArchitecturePreset = setArchitecturePreset;
if (typeof window !== 'undefined') window.addHiddenLayer = addHiddenLayer;
if (typeof window !== 'undefined') window.removeLastHiddenLayer = removeLastHiddenLayer;
if (typeof window !== 'undefined') window.updateHiddenLayerSize = updateHiddenLayerSize;
if (typeof window !== 'undefined') window.removeHiddenLayer = removeHiddenLayer;
if (typeof window !== 'undefined') window.applyArchitectureChanges = applyArchitectureChanges;
if (typeof window !== 'undefined') window.initializeArchitectureControls = initializeArchitectureControls;

// Populate globals-and-config functions if available
if (typeof window !== 'undefined' && window.utilities && window.utilities.updateExpertConfig === null) {
    window.utilities.updateExpertConfig = updateExpertConfig;
}

// ============================================================================
// ARCHITECTURE CONTROL FUNCTIONS
// ============================================================================

// Current architecture state (before applying changes)
let pendingArchitecture = [4]; // Default to current architecture

function setArchitecturePreset(hiddenLayers) {
    pendingArchitecture = [...hiddenLayers];
    
    // Update preset button selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('preset-selected'));
    const presetButtons = document.querySelectorAll('.preset-btn');
    if (hiddenLayers.length === 0) presetButtons[0].classList.add('preset-selected');
    else if (hiddenLayers.length === 1 && hiddenLayers[0] === 4) presetButtons[1].classList.add('preset-selected');
    else if (hiddenLayers.length === 2 && hiddenLayers[0] === 6 && hiddenLayers[1] === 3) presetButtons[2].classList.add('preset-selected');
    else if (hiddenLayers.length === 3 && hiddenLayers[0] === 8) presetButtons[3].classList.add('preset-selected');
    
    updateArchitectureDisplay();
    updateHiddenLayersContainer();
}

function addHiddenLayer() {
    if (pendingArchitecture.length >= 3) {
        alert('Maximum 3 hidden layers allowed');
        return;
    }
    
    // Add a new layer with 4 neurons by default
    pendingArchitecture.push(4);
    updateArchitectureDisplay();
    updateHiddenLayersContainer();
    
    // Clear preset selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('preset-selected'));
}

function removeLastHiddenLayer() {
    if (pendingArchitecture.length === 0) {
        alert('Cannot remove layers - at least direct connection needed');
        return;
    }
    
    pendingArchitecture.pop();
    updateArchitectureDisplay();
    updateHiddenLayersContainer();
    
    // Clear preset selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('preset-selected'));
}

function updateHiddenLayerSize(layerIndex, newSize) {
    const size = parseInt(newSize);
    if (size < 1 || size > 8) {
        alert('Layer size must be between 1 and 8 neurons');
        return;
    }
    
    pendingArchitecture[layerIndex] = size;
    updateArchitectureDisplay();
    
    // Clear preset selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('preset-selected'));
}

function removeHiddenLayer(layerIndex) {
    pendingArchitecture.splice(layerIndex, 1);
    updateArchitectureDisplay();
    updateHiddenLayersContainer();
    
    // Clear preset selection
    document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('preset-selected'));
}

function updateHiddenLayersContainer() {
    const container = document.getElementById('hiddenLayersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    pendingArchitecture.forEach((size, index) => {
        const layerDiv = document.createElement('div');
        layerDiv.className = 'layer-item hidden';
        layerDiv.innerHTML = `
            Hidden ${index + 1}: 
            <input type="number" 
                   class="hidden-layer-input" 
                   value="${size}" 
                   min="1" 
                   max="8"
                   onchange="updateHiddenLayerSize(${index}, this.value)">
            <button class="remove-layer-btn" 
                    onclick="removeHiddenLayer(${index})" 
                    title="Remove this layer">×</button>
        `;
        container.appendChild(layerDiv);
    });
}

function updateArchitectureDisplay() {
    // Update architecture string display
    const archDisplay = document.getElementById('architectureDisplay');
    if (archDisplay) {
        const archString = `4→[${pendingArchitecture.join(',')}]→2`;
        archDisplay.textContent = archString;
    }
    
    // Update stats
    const hiddenLayersCount = document.getElementById('hiddenLayersCount');
    const totalNeuronsDisplay = document.getElementById('totalNeuronsDisplay');
    const totalWeightsDisplay = document.getElementById('totalWeightsDisplay');
    
    if (hiddenLayersCount) {
        hiddenLayersCount.textContent = pendingArchitecture.length;
    }
    
    if (totalNeuronsDisplay) {
        const totalNeurons = 4 + pendingArchitecture.reduce((sum, size) => sum + size, 0) + 2;
        totalNeuronsDisplay.textContent = totalNeurons;
    }
    
    if (totalWeightsDisplay) {
        let totalWeights = 0;
        let prevSize = 4; // Input size
        
        for (const layerSize of pendingArchitecture) {
            totalWeights += prevSize * layerSize;
            prevSize = layerSize;
        }
        
        // Add weights from last hidden (or input if no hidden) to output
        totalWeights += prevSize * 2;
        
        totalWeightsDisplay.textContent = totalWeights;
    }
}

function applyArchitectureChanges() {
    try {
        // Apply the architecture using NetworkAPI
        NetworkAPI.setArchitecture(pendingArchitecture);
        
        // Redraw the network visualization
        drawNetwork();
        
        // Update the current architecture displays throughout the UI
        updateAllArchitectureDisplays();
        
        // Show success message
        alert(`✅ Architecture updated to: 4→[${pendingArchitecture.join(',')}]→2`);
        
        // Close the expert panel
        closeExpertPanel();
        
    } catch (error) {
        alert(`❌ Failed to apply architecture: ${error.message}`);
    }
}

function updateAllArchitectureDisplays() {
    // Update any other architecture displays in the UI
    const displays = document.querySelectorAll('#architectureDisplay');
    displays.forEach(display => {
        display.textContent = `4→[${pendingArchitecture.join(',')}]→2`;
    });
}

// Initialize architecture controls when expert panel opens
function initializeArchitectureControls() {
    // Get current architecture from NetworkAPI
    const currentArch = NetworkAPI.getArchitecture();
    pendingArchitecture = [...currentArch.hiddenLayers];
    
    // Update all displays
    updateArchitectureDisplay();
    updateHiddenLayersContainer();
    
    // Set correct preset selection
    setArchitecturePreset(pendingArchitecture);
}
