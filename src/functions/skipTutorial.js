function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial? It helps you understand how AI learning works!')) {
        completeTutorial();
    }
}

if (typeof window !== 'undefined') window.skipTutorial = skipTutorial;