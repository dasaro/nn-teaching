function setVisualFeaturesAndLabel(imageType) {
    // NUANCED feature patterns for better learning: [feature_A, feature_B, feature_C, feature_D]
    // Dogs use mixed HIGH/LOW patterns, Non-dogs use different mixed patterns
    // This gives 8 distinct, learnable combinations for 4 hidden units to distinguish
    
    switch(imageType) {
        case 'dog1':
            updateInputActivations([0.9, 0.9, 0.1, 0.1]); // Dog pattern: HIGH-HIGH-LOW-LOW
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog2':
            updateInputActivations([0.8, 0.7, 0.2, 0.3]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'dog3':
            updateInputActivations([0.7, 0.8, 0.3, 0.2]); // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('dog');
            break;
        case 'cat':
            updateInputActivations([0.1, 0.9, 0.1, 0.9]); // Non-dog pattern: LOW-HIGH-LOW-HIGH
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'bird':
            updateInputActivations([0.2, 0.8, 0.3, 0.7]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'car':
            updateInputActivations([0.3, 0.7, 0.2, 0.8]); // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'tree':
            updateInputActivations([0.9, 0.1, 0.9, 0.1]); // Non-dog pattern: HIGH-LOW-HIGH-LOW
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        case 'fish':
            updateInputActivations([0.8, 0.2, 0.7, 0.3]); // Non-dog pattern: HIGH-LOW-HIGH-LOW (with variation)
            if (!preventAutoLabeling) setTrueLabel('not-dog');
            break;
        default:
            console.error('Unknown image type:', imageType);
            updateInputActivations([0.1, 0.1, 0.1, 0.1]);
            if (!preventAutoLabeling) setTrueLabel('not-dog');
    }
    console.log('🎯 Abstract patterns set for', imageType, '- [Pattern A, Pattern B, Pattern C, Pattern D]:', activations.input);
    console.log('🎯 Pattern type:', imageType.startsWith('dog') ? 'DOG (HIGH-HIGH-LOW-LOW variants)' : 'NON-DOG (alternating patterns)');
}

if (typeof window !== 'undefined') window.setVisualFeaturesAndLabel = setVisualFeaturesAndLabel;