function stopTrainingAnimation(success = true) {
    const networkArea = document.querySelector('.network-area');
    const statusElement = document.querySelector('.training-status');
    
    if (statusElement) {
        statusElement.innerHTML = `
            <span style="color: ${success ? '#10b981' : '#ef4444'};">${success ? '✅ Complete!' : '⚠️ Stopped'}</span>
        `;
        
        setTimeout(() => {
            networkArea.classList.remove('training');
            if (statusElement && statusElement.parentNode) {
                statusElement.parentNode.removeChild(statusElement);
            }
        }, 2000);
    }
    
    console.log(`🎨 Training animation ${success ? 'completed' : 'stopped'}`);
}

if (typeof window !== 'undefined') window.stopTrainingAnimation = stopTrainingAnimation;