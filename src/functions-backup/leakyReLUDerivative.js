function leakyReLUDerivative(x, alpha = 0.1) {
    return x > 0 ? 1 : alpha;
}

if (typeof window !== 'undefined') window.leakyReLUDerivative = leakyReLUDerivative;