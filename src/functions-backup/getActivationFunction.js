function getActivationFunction(layer) {
    if (layer === 'hidden') {
        switch (expertConfig.hiddenActivation) {
            case 'leaky_relu': return leakyReLU;
            case 'sigmoid': return sigmoid;
            case 'tanh': return tanhActivation;
            default: return leakyReLU;
        }
    } else if (layer === 'output') {
        switch (expertConfig.outputActivation) {
            case 'softmax': return softmax;
            case 'sigmoid': return sigmoid;
            default: return softmax;
        }
    }
}

if (typeof window !== 'undefined') window.getActivationFunction = getActivationFunction;