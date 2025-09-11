function sigmoidDerivative(x) {
    const s = sigmoid(x);
    return s * (1 - s);
}

if (typeof window !== 'undefined') window.sigmoidDerivative = sigmoidDerivative;