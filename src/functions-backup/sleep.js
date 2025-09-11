function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * (11 - animationSpeed) / 10));
}

if (typeof window !== 'undefined') window.sleep = sleep;