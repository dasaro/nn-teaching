function nextTutorialStep() {
    tutorialStep++;
    
    if (tutorialStep >= tutorialSteps.length) {
        skipTutorial();
    } else {
        showTutorialStep();
    }
}

if (typeof window !== 'undefined') window.nextTutorialStep = nextTutorialStep;