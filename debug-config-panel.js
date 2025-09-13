// Debug script for Config Panel issues
// Run in browser console: fetch('/debug-config-panel.js').then(r=>r.text()).then(eval)

console.log('🔍 === DEBUGGING CONFIG PANEL ===');

// Test 1: Check if functions exist
console.log('\n1️⃣ Function availability:');
console.log('addHiddenLayer:', typeof addHiddenLayer);
console.log('removeHiddenLayer:', typeof removeHiddenLayer);
console.log('updateHiddenLayer:', typeof updateHiddenLayer);
console.log('buildHiddenLayersUI:', typeof buildHiddenLayersUI);

// Test 2: Check current state
console.log('\n2️⃣ Current state:');
console.log('expertConfig.hiddenLayers:', expertConfig.hiddenLayers);
console.log('networkStructure.layers:', networkStructure.layers);

// Test 3: Check DOM elements
console.log('\n3️⃣ DOM elements:');
const container = document.getElementById('hiddenLayersContainer');
console.log('hiddenLayersContainer found:', !!container);
if (container) {
    console.log('Current HTML:', container.innerHTML);
}

const addButton = document.querySelector('button[onclick="addHiddenLayer()"]');
console.log('Add Layer button found:', !!addButton);
if (addButton) {
    console.log('Button text:', addButton.textContent);
    console.log('Button visible:', addButton.offsetHeight > 0);
    console.log('Button disabled:', addButton.disabled);
}

// Test 4: Try manual function calls
console.log('\n4️⃣ Testing manual function calls:');
console.log('Current layers before test:', expertConfig.hiddenLayers);

try {
    if (typeof addHiddenLayer === 'function') {
        console.log('Calling addHiddenLayer()...');
        addHiddenLayer();
        console.log('After addHiddenLayer:', expertConfig.hiddenLayers);
    }
} catch (error) {
    console.error('Error calling addHiddenLayer:', error);
}

// Test 5: Check expert panel visibility
console.log('\n5️⃣ Expert panel state:');
const modal = document.getElementById('expertPanelModal');
console.log('Expert panel modal found:', !!modal);
if (modal) {
    console.log('Modal display style:', modal.style.display);
    console.log('expertPanelVisible:', expertPanelVisible);
}

// Test 6: Manual DOM check
console.log('\n6️⃣ Manual button click test:');
if (addButton) {
    console.log('Attempting to click Add Layer button...');
    addButton.click();
    setTimeout(() => {
        console.log('After button click, layers:', expertConfig.hiddenLayers);
        if (container) {
            console.log('Container HTML after click:', container.innerHTML);
        }
    }, 100);
}

console.log('\n✅ Debug complete - check results above');