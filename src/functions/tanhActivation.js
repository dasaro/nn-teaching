function tanhActivation(x) {
    return Math.tanh(x);
}

if (typeof window !== 'undefined') window.tanhActivation = tanhActivation;