// Simple debug test to run in browser console
function debugAccuracyTest() {
    console.log('🔍 DEBUGGING ACCURACY CALCULATION');
    
    // Test the fixed accuracy function
    const testData = [
        { input: [0.9, 0.8, 0.9, 0.8], isDog: true, label: 'dog1' },
        { input: [0.1, 0.2, 0.1, 0.2], isDog: false, label: 'car' }
    ];
    
    console.log('Testing with simple 2-example dataset:');
    testData.forEach((example, i) => {
        const output = forwardPropagationSilent(example.input);
        const predicted = output[0] > output[1];
        const correct = predicted === example.isDog;
        
        console.log(`${i+1}. ${example.label}: [${output[0].toFixed(3)}, ${output[1].toFixed(3)}]`);
        console.log(`   Predicted: ${predicted ? 'DOG' : 'NOT-DOG'}, Actual: ${example.isDog ? 'DOG' : 'NOT-DOG'}, Correct: ${correct}`);
    });
    
    const accuracy = testAccuracy(testData);
    console.log(`Final accuracy: ${(accuracy * 100).toFixed(1)}%`);
}

// Run this in console
debugAccuracyTest();