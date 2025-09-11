function getActivationDerivative(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
            case 'sigmoid': return sigmoidDerivative;
            case 'tanh': return tanhDerivative;
            default: return (x) => leakyReLUDerivative(x, expertConfig.leakyReLUAlpha);
        }
    }
}

if (typeof window !== 'undefined') window.getActivationDerivative = getActivationDerivative;