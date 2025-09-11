function toggleWeightSliders() {
    weightSlidersActive = !weightSlidersActive;
    const btn = document.getElementById('whatIfBtn');
    
    if (weightSlidersActive) {
        btn.textContent = '🔧 Exit What If?';
        btn.classList.add('active');
        showWeightSliders();
        updateStepInfoDual(
            '🔧 <strong>Weight Exploration Mode!</strong><br>🎛️ Drag the sliders to see how different brain connections affect the AI\'s decisions. Watch the magic happen in real-time!',
            '🔧 <strong>Weight Exploration Mode</strong><br>🔊 Interactive weight manipulation enabled. Real-time prediction updates active.'
        );
    } else {
        btn.textContent = '🔧 What If?';
        btn.classList.remove('active');
        hideWeightSliders();
        updateStepInfoDual(
            '🎮 <strong>Ready to Explore!</strong><br>🚀 Pick "Watch AI Think", "Watch AI Learn", or "Full Demo" to see the neural network in action!',
            '🎮 <strong>System Ready</strong><br>📈 Select demonstration mode: Forward propagation, Backpropagation, or Complete cycle.'
        );
    }
}

if (typeof window !== 'undefined') window.toggleWeightSliders = toggleWeightSliders;