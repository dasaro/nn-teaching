function testSimpleBinaryAccuracy(dataset) {
    let correct = 0;
    dataset.forEach(example => {
        const output = simpleBinaryForward(example.input);
        const predicted = output > 0.5;
        if (predicted === example.isDog) correct++;
    });
    return correct / dataset.length;
}

if (typeof window !== 'undefined') window.testSimpleBinaryAccuracy = testSimpleBinaryAccuracy;