function startTutorial() {
    tutorialActive = true;
    tutorialStep = 0;
    
    // Hide tutorial button, show tutorial step
    document.getElementById('startTutorialBtn').style.display = 'none';
    document.getElementById('tutorialStep').style.display = 'block';
    
    showTutorialStep();
}

if (typeof window !== 'undefined') window.startTutorial = startTutorial;