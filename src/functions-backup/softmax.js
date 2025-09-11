function softmax(values) {
    const maxVal = Math.max(...values);
    const expVals = values.map(val => Math.exp(Math.min(val - maxVal, 700))); // Prevent overflow
    const sumExp = expVals.reduce((sum, val) => sum + val, 0);
    return expVals.map(val => val / sumExp);
}

if (typeof window !== 'undefined') window.softmax = softmax;