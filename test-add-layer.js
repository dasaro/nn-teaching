// Quick test for Add Layer functionality
// Run in browser console after opening the Expert Panel

console.log('🧪 === TESTING ADD LAYER BUTTON ===');

// Step 1: Check initial state
console.log('Initial state:');
console.log('- hiddenLayers:', expertConfig.hiddenLayers);
console.log('- Network layers:', networkStructure.layers?.length || 'undefined');

// Step 2: Find and test the Add Layer button
const addButton = document.querySelector('button[onclick="addHiddenLayer()"]') || 
                  document.querySelector('.add-layer-btn') ||
                  Array.from(document.querySelectorAll('button')).find(btn => 
                    btn.textContent.includes('Add Layer') || btn.textContent.includes('+ Add Layer'));

console.log('Add Layer button found:', !!addButton);
if (addButton) {
    console.log('Button text:', addButton.textContent);
    console.log('Button visible:', addButton.offsetWidth > 0 && addButton.offsetHeight > 0);
    console.log('Button parent:', addButton.parentElement?.tagName);
}

// Step 3: Test adding a layer programmatically
console.log('\n🔧 Testing addHiddenLayer() function:');
if (typeof addHiddenLayer === 'function') {
    try {
        console.log('Before:', expertConfig.hiddenLayers);
        addHiddenLayer();
        console.log('After:', expertConfig.hiddenLayers);
        console.log('✅ addHiddenLayer() worked!');
        
        // Check if UI was updated
        const container = document.getElementById('hiddenLayersContainer');
        if (container) {
            const layerControls = container.querySelectorAll('.hidden-layer-control');
            console.log(`UI updated: ${layerControls.length} layer controls found`);
        }
        
    } catch (error) {
        console.error('❌ addHiddenLayer() failed:', error);
    }
} else {
    console.error('❌ addHiddenLayer function not available');
}

// Step 4: Test clicking the button if it exists
if (addButton) {
    console.log('\n🖱️ Testing button click:');
    console.log('Before click:', expertConfig.hiddenLayers);
    addButton.click();
    setTimeout(() => {
        console.log('After click:', expertConfig.hiddenLayers);
        console.log('✅ Button click test complete');
    }, 100);
}

// Instructions for manual testing
console.log('\n📋 MANUAL TESTING INSTRUCTIONS:');
console.log('1. Open the Expert Panel (⚙️ Config button)');
console.log('2. Look for the "+ Add Layer" button below the hidden layers');
console.log('3. Click it to add more hidden layers');
console.log('4. Use sliders to adjust layer sizes');
console.log('5. Click "Apply" to see the new architecture in action');

console.log('\n✅ Test complete - check results above');