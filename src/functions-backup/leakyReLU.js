function leakyReLU(x, alpha = 0.1) {
    return x > 0 ? x : alpha * x;
}

if (typeof window !== 'undefined') window.leakyReLU = leakyReLU;