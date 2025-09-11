function setupEventListeners() {
    document.getElementById('speedSlider').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
    });
}

if (typeof window !== 'undefined') window.setupEventListeners = setupEventListeners;