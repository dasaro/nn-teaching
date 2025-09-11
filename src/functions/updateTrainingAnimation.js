function updateTrainingAnimation(epoch, accuracy) {
    const statusElement = document.querySelector('.training-status');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="spinner"></div>
            <span>Epoch ${epoch} • ${(accuracy * 100).toFixed(1)}%</span>
        `;
    }
}

if (typeof window !== 'undefined') window.updateTrainingAnimation = updateTrainingAnimation;