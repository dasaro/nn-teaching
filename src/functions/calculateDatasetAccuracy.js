function calculateDatasetAccuracy(dataset, getOutputFunction) {
    let correct = 0;
    for (const example of dataset) {
        const output = getOutputFunction(example.input);
        const dogProb = Array.isArray(output) ? output[0] : output;
        if (calculateBinaryAccuracy(dogProb, example.isDog)) {
            correct++;
        }
    }
    return correct / dataset.length;
}

if (typeof window !== 'undefined') window.calculateDatasetAccuracy = calculateDatasetAccuracy;