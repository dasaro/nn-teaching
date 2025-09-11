function generateSimpleTrainingData() {
    // Generate simple, well-separated training data for better generalization
    const trainingData = [];
    
    // Generate 12 dog examples with clear patterns
    for (let i = 0; i < 12; i++) {
        // Dogs: medium-large, friendly, bark, domestic
        const size = 0.6 + Math.random() * 0.3; // Dogs: medium to large (0.6-0.9)
        const friendliness = 0.8 + Math.random() * 0.2; // Dogs: friendly (0.8-1.0)
        const bark = 0.9 + Math.random() * 0.1; // Dogs: bark a lot (0.9-1.0)
        const domestic = 0.9 + Math.random() * 0.1; // Dogs: highly domestic (0.9-1.0)
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [1, 0],
            label: `Dog${i+1}`,
            isDog: true
        });
    }
    
    // Generate 12 non-dog examples with clear separation
    for (let i = 0; i < 12; i++) {
        let size, friendliness, bark, domestic, label;
        
        if (i < 6) {
            // Cats - clearly different from dogs
            size = 0.2 + Math.random() * 0.2; // Small (0.2-0.4)
            friendliness = 0.4 + Math.random() * 0.3; // Moderate (0.4-0.7)
            bark = 0.0 + Math.random() * 0.1; // Don't bark (0.0-0.1)
            domestic = 0.6 + Math.random() * 0.2; // Somewhat domestic (0.6-0.8)
            label = `Cat${i+1}`;
        } else {
            // Objects - very different from biological entities
            size = Math.random() * 0.6; // Variable size (0.0-0.6)
            friendliness = 0.0 + Math.random() * 0.1; // No friendliness (0.0-0.1)
            bark = 0.0 + Math.random() * 0.1; // No barking (0.0-0.1)
            domestic = 0.0 + Math.random() * 0.1; // No domestication (0.0-0.1)
            label = `Object${i-5}`;
        }
        
        trainingData.push({
            input: [size, friendliness, bark, domestic],
            target: [0, 1],
            label: label,
            isDog: false
        });
    }
    
    // Simple shuffling without normalization for better interpretability
    
    // Shuffle the data
    for (let i = trainingData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trainingData[i], trainingData[j]] = [trainingData[j], trainingData[i]];
    }
    
    return trainingData;
}

if (typeof window !== 'undefined') window.generateSimpleTrainingData = generateSimpleTrainingData;