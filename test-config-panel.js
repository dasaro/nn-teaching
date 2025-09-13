// Test script for Config Panel Multi-layer functionality
// Run this in browser console after opening http://localhost:8080

console.log('🧪 === CONFIG PANEL MULTI-LAYER TEST ===');

// Function to test adding hidden layers
function testAddLayers() {
    console.log('\n🧪 Testing Adding Hidden Layers...');
    
    // Check initial state
    console.log('Initial hiddenLayers:', expertConfig.hiddenLayers);
    
    // Test adding a layer
    if (typeof addHiddenLayer === 'function') {
        console.log('Adding hidden layer...');
        addHiddenLayer();
        console.log('After adding:', expertConfig.hiddenLayers);
        
        // Add another
        addHiddenLayer();
        console.log('After adding second:', expertConfig.hiddenLayers);
    } else {
        console.error('❌ addHiddenLayer function not found');
    }
}

// Function to test updating layer sizes
function testUpdateLayerSizes() {
    console.log('\n🧪 Testing Updating Layer Sizes...');
    
    if (typeof updateHiddenLayer === 'function') {
        // Test updating different layers
        updateHiddenLayer(0, 6);
        console.log('After updating layer 0 to 6:', expertConfig.hiddenLayers);
        
        if (expertConfig.hiddenLayers.length > 1) {
            updateHiddenLayer(1, 8);
            console.log('After updating layer 1 to 8:', expertConfig.hiddenLayers);
        }
    } else {
        console.error('❌ updateHiddenLayer function not found');
    }
}

// Function to test removing layers
function testRemoveLayers() {
    console.log('\n🧪 Testing Removing Hidden Layers...');
    
    if (typeof removeHiddenLayer === 'function') {
        console.log('Before removal:', expertConfig.hiddenLayers);
        
        // Remove the last layer
        if (expertConfig.hiddenLayers.length > 1) {
            removeHiddenLayer(expertConfig.hiddenLayers.length - 1);
            console.log('After removing last layer:', expertConfig.hiddenLayers);
        }
    } else {
        console.error('❌ removeHiddenLayer function not found');
    }
}

// Function to test network visualization update
function testVisualizationUpdate() {
    console.log('\n🧪 Testing Network Visualization Update...');
    
    // Check if network structure reflects the config
    console.log('Network structure layers:', networkStructure.layers);
    console.log('Expert config hiddenLayers:', expertConfig.hiddenLayers);
    
    // Check if SVG has correct number of neuron groups
    const svg = document.getElementById('networkSvg');
    if (svg) {
        const neuronGroups = svg.querySelectorAll('.layer-group');
        console.log(`Found ${neuronGroups.length} layer groups in SVG`);
        
        neuronGroups.forEach((group, index) => {
            const neurons = group.querySelectorAll('circle');
            console.log(`Layer ${index}: ${neurons.length} neurons`);
        });
    }
}

// Function to test forward propagation with multiple layers
function testMultiLayerPropagation() {
    console.log('\n🧪 Testing Multi-layer Forward Propagation...');
    
    if (typeof animateForwardPropagation === 'function') {
        // Set some test input
        if (networkStructure.activations && networkStructure.activations[0]) {
            networkStructure.activations[0] = [0.8, 0.6, 0.4, 0.2];
            console.log('Set test input:', networkStructure.activations[0]);
            
            // Run forward propagation
            try {
                animateForwardPropagation();
                
                // Check if all layers got activated
                setTimeout(() => {
                    console.log('All layer activations after forward prop:');
                    networkStructure.activations.forEach((layer, index) => {
                        console.log(`Layer ${index}:`, layer);
                    });
                }, 1000);
                
            } catch (error) {
                console.error('❌ Error in forward propagation:', error);
            }
        }
    }
}

// Main test function
function runConfigPanelTests() {
    console.log('🚀 Starting Config Panel Tests...');
    
    // Check if all required functions exist
    const requiredFunctions = [
        'addHiddenLayer', 
        'removeHiddenLayer', 
        'updateHiddenLayer',
        'updateNetworkArchitecture',
        'buildHiddenLayersUI',
        'updateArchitectureInfo'
    ];
    
    console.log('\n🔍 Checking function availability:');
    requiredFunctions.forEach(funcName => {
        const exists = typeof window[funcName] === 'function';
        console.log(`  ${funcName}: ${exists ? '✅' : '❌'}`);
    });
    
    // Run tests step by step
    setTimeout(() => testAddLayers(), 500);
    setTimeout(() => testUpdateLayerSizes(), 1500);
    setTimeout(() => testVisualizationUpdate(), 2500);
    setTimeout(() => testMultiLayerPropagation(), 3500);
    setTimeout(() => testRemoveLayers(), 5500);
    
    console.log('\n⏱️ Tests scheduled - watch console for results...');
}

// Export test function
window.runConfigPanelTests = runConfigPanelTests;
window.testAddLayers = testAddLayers;
window.testUpdateLayerSizes = testUpdateLayerSizes;
window.testRemoveLayers = testRemoveLayers;
window.testVisualizationUpdate = testVisualizationUpdate;
window.testMultiLayerPropagation = testMultiLayerPropagation;

console.log('✅ Test functions loaded. Run runConfigPanelTests() to start testing.');