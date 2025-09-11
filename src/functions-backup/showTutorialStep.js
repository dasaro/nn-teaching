function showTutorialStep() {
    const step = tutorialSteps[tutorialStep];
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialText').textContent = step.text;
    
    // Update navigation buttons
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (tutorialStep === tutorialSteps.length - 1) {
        nextBtn.textContent = 'Start Learning! 🚀';
    } else {
        nextBtn.textContent = 'Next →';
    }
}

if (typeof window !== 'undefined') window.showTutorialStep = showTutorialStep;