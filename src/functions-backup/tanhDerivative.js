function tanhDerivative(x) {
    const t = Math.tanh(x);
    return 1 - t * t;
}

if (typeof window !== 'undefined') window.tanhDerivative = tanhDerivative;