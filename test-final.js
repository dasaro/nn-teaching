// Final test for Add Layer functionality
// If this doesn't work, we'll disable the button

console.log('🔍 === FINAL ADD LAYER TEST ===');

// Wait for page to load completely
setTimeout(() => {
    console.log('Testing Add Layer functionality...');
    
    // Test 1: Check function availability
    const functionExists = typeof window.addHiddenLayer === 'function';
    console.log('addHiddenLayer function exists:', functionExists);
    
    if (!functionExists) {
        console.error('❌ Function not found - will disable button');
        disableAddLayerButton();
        return;
    }
    
    // Test 2: Check expertConfig
    console.log('expertConfig.hiddenLayers:', expertConfig?.hiddenLayers);
    
    // Test 3: Try calling the function
    try {
        const before = [...(expertConfig?.hiddenLayers || [])];
        console.log('Before adding layer:', before);
        
        window.addHiddenLayer();
        
        const after = [...(expertConfig?.hiddenLayers || [])];
        console.log('After adding layer:', after);
        
        if (after.length === before.length) {
            console.error('❌ Layer was not added - will disable button');
            disableAddLayerButton();
        } else {
            console.log('✅ Add Layer functionality works!');
        }
    } catch (error) {
        console.error('❌ Error calling addHiddenLayer:', error);
        disableAddLayerButton();
    }
}, 2000);

function disableAddLayerButton() {
    console.log('🚫 Disabling Add Layer button...');
    
    // Find and disable the button
    const addButton = document.querySelector('.add-layer-btn') || 
                     document.querySelector('button[onclick*="addHiddenLayer"]');
    
    if (addButton) {
        addButton.disabled = true;
        addButton.style.opacity = '0.5';
        addButton.style.cursor = 'not-allowed';
        addButton.title = 'Add Layer functionality temporarily disabled';
        addButton.textContent = '+ Add Layer (Disabled)';
        console.log('✅ Button disabled');
    } else {
        console.log('⚠️ Button not found to disable');
    }
}

window.disableAddLayerButton = disableAddLayerButton;