function createOptimalLearningSequence() {
    return [
        // Example 1: Clear Dog - maximally dog-like features
        {
            input: [0.8, 0.9, 1.0, 0.95], // large, very friendly, always barks, highly domestic
            target: [1, 0],
            label: 'PrototypeDog',
            isDog: true,
            description: 'Large, very friendly dog that barks and is highly domesticated'
        },
        
        // Example 2: Clear Non-Dog (Cat) - maximally different from dogs
        {
            input: [0.3, 0.6, 0.05, 0.75], // small, moderately friendly, rarely barks, somewhat domestic
            target: [0, 1],
            label: 'PrototypeCat',
            isDog: false,
            description: 'Small, moderately friendly cat that rarely makes noise'
        },
        
        // Example 3: Another Dog - different but clearly dog
        {
            input: [0.65, 0.85, 0.9, 0.9], // medium-large, friendly, barks often, domestic
            target: [1, 0],
            label: 'FamilyDog',
            isDog: true,
            description: 'Medium family dog that is friendly and barks'
        },
        
        // Example 4: Non-Dog Object - completely non-biological
        {
            input: [0.4, 0.05, 0.0, 0.0], // medium size, no friendliness, no barking, not domestic
            target: [0, 1],
            label: 'Object',
            isDog: false,
            description: 'Inanimate object with no biological properties'
        }
    ];
}

if (typeof window !== 'undefined') window.createOptimalLearningSequence = createOptimalLearningSequence;