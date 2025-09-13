// Debug script to test Add Layer button
// Paste this in browser console while Expert Panel is open

console.log('🔧 === DEBUGGING ADD LAYER BUTTON ===');

// Test 1: Check if function is available
console.log('1️⃣ Function availability:');
console.log('- addHiddenLayer function:', typeof addHiddenLayer);
console.log('- window.addHiddenLayer:', typeof window.addHiddenLayer);

// Test 2: Test direct function call
console.log('\n2️⃣ Direct function test:');
console.log('Before call:', expertConfig.hiddenLayers);
try {
    if (typeof addHiddenLayer === 'function') {
        addHiddenLayer();
        console.log('After call:', expertConfig.hiddenLayers);
        console.log('✅ Direct function call worked');
    } else {
        console.error('❌ Function not available');
    }
} catch (error) {
    console.error('❌ Error calling function:', error);
}

// Test 3: Find and test the button
console.log('\n3️⃣ Button inspection:');
const buttons = document.querySelectorAll('button');
const addButton = Array.from(buttons).find(btn => 
    btn.textContent.includes('Add Layer') || 
    btn.textContent.includes('+ Add Layer') ||
    btn.classList.contains('add-layer-btn')
);

console.log('Add Layer button found:', !!addButton);
if (addButton) {
    console.log('- Button text:', addButton.textContent);
    console.log('- Button classes:', addButton.className);
    console.log('- Button onclick:', addButton.onclick);
    console.log('- Button getAttribute onclick:', addButton.getAttribute('onclick'));
    console.log('- Button visible:', addButton.offsetHeight > 0);
    console.log('- Button disabled:', addButton.disabled);
    
    // Test button click
    console.log('\n🖱️ Testing button click:');
    console.log('Before click:', expertConfig.hiddenLayers);
    addButton.click();
    setTimeout(() => {
        console.log('After click:', expertConfig.hiddenLayers);
    }, 100);
}

// Test 4: Check for errors
console.log('\n4️⃣ Error checking:');
window.addEventListener('error', function(e) {
    console.error('🚨 JavaScript error detected:', e.error);
});

console.log('\n✅ Debug complete - watch console for "🚀 addHiddenLayer() called!" message');