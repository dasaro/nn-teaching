function createWeightEditingPanel() {
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'weightEditingPanel';
    panel.className = 'weight-editing-panel';
    
    // Panel header
    const header = document.createElement('div');
    header.className = 'weight-panel-header';
    header.innerHTML = `
        <h3>🔧 Weight Explorer</h3>
        <p>Adjust connection weights to see how they affect predictions</p>
    `;
    
    // Content container
    const content = document.createElement('div');
    content.className = 'weight-panel-content';
    
    // Input to Hidden section
    const inputSection = document.createElement('div');
    inputSection.className = 'weight-section';
    inputSection.innerHTML = `<h4>${t('whatIf.inputToHidden')}</h4>`;
    
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        const hiddenGroup = document.createElement('div');
        hiddenGroup.className = 'weight-group';
        hiddenGroup.innerHTML = `<h5>${t('whatIf.toHiddenNeuron', [h + 1])}</h5>`;
        
        for (let i = 0; i < networkConfig.inputSize; i++) {
            const weightControl = createWeightControl('input', i, h, weights.inputToHidden[h][i]);
            hiddenGroup.appendChild(weightControl);
        }
        
        inputSection.appendChild(hiddenGroup);
    }
    
    // Hidden to Output section
    const outputSection = document.createElement('div');
    outputSection.className = 'weight-section';
    outputSection.innerHTML = `<h4>${t('whatIf.hiddenToOutput')}</h4>`;
    
    for (let o = 0; o < networkConfig.outputSize; o++) {
        const outputGroup = document.createElement('div');
        outputGroup.className = 'weight-group';
        outputGroup.innerHTML = `<h5>${o === 0 ? t('whatIf.toDogOutput') : t('whatIf.toNotDogOutput')}</h5>`;
        
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            const weightControl = createWeightControl('hidden', h, o, weights.hiddenToOutput[o][h]);
            outputGroup.appendChild(weightControl);
        }
        
        outputSection.appendChild(outputGroup);
    }
    
    content.appendChild(inputSection);
    content.appendChild(outputSection);
    
    panel.appendChild(header);
    panel.appendChild(content);
    
    // Add panel to the page
    document.body.appendChild(panel);
}

if (typeof window !== 'undefined') window.createWeightEditingPanel = createWeightEditingPanel;