function updateExpertConfig(parameter, value) {
    expertConfig[parameter] = value;
    
    // Update corresponding display values
    switch (parameter) {
        case 'learningRate':
            document.getElementById('learningRateValue').textContent = value.toFixed(3);
            break;
        case 'momentum':
            document.getElementById('momentumValue').textContent = value.toFixed(2);
            break;
        case 'l2Regularization':
            document.getElementById('l2RegValue').textContent = value.toFixed(4);
            break;
        case 'maxEpochs':
            document.getElementById('maxEpochsValue').textContent = value;
            break;
        case 'leakyReLUAlpha':
            document.getElementById('leakyReLUAlphaValue').textContent = value.toFixed(2);
            break;
        case 'batchSize':
            document.getElementById('batchSizeValue').textContent = value;
            break;
    }
    
    console.log(`Expert parameter updated: ${parameter} = ${value}`);
}

if (typeof window !== 'undefined') window.updateExpertConfig = updateExpertConfig;