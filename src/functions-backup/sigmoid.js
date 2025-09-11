function sigmoid(x) {
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, x)))); // Prevent overflow
}

if (typeof window !== 'undefined') window.sigmoid = sigmoid;