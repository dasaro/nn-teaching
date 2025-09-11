function startTrainingAnimation() {
    const networkArea = document.querySelector('.network-area');
    const statusElement = document.createElement('div');
    statusElement.className = 'training-status';
    statusElement.innerHTML = `
        <div class="spinner"></div>
        <span>AI Training...</span>
    `;
    
    networkArea.classList.add('training');
    networkArea.appendChild(statusElement);
    
    console.log('🎨 Training animation started');
}

if (typeof window !== 'undefined') window.startTrainingAnimation = startTrainingAnimation;