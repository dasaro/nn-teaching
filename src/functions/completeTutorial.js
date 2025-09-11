function completeTutorial() {
    tutorialActive = false;
    tutorialStep = 0;
    
    // Hide tutorial, show tutorial button again
    document.getElementById('tutorialStep').style.display = 'none';
    document.getElementById('startTutorialBtn').style.display = 'block';
    document.getElementById('startTutorialBtn').textContent = '🔄 Restart Tutorial';
    
    // Clear highlights
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    // Enable all controls
    document.getElementById('forwardBtn').disabled = false;
    document.getElementById('backwardBtn').disabled = true; // Will be enabled after forward pass
    document.getElementById('fullDemoBtn').disabled = false;
    
    updateStepInfo('🎓 Tutorial complete! You can now explore on your own. Try the "Watch AI Think" button to see the magic happen!');
}

if (typeof window !== 'undefined') window.completeTutorial = completeTutorial;