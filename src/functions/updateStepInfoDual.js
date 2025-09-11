function updateStepInfoDual(studentMessage, expertMessage = null) {
    const currentStep = document.getElementById('currentStep');
    if (!currentStep) return;
    
    const messageToShow = expertViewMode && expertMessage ? expertMessage : studentMessage;
    
    // If message logging is active, accumulate messages
    if (messageLogActive) {
        messageLog.push({
            timestamp: new Date().toLocaleTimeString(),
            message: messageToShow,
            type: expertViewMode ? 'expert' : 'student',
            mode: expertViewMode ? 'Expert' : 'Student'
        });
        displayMessageLog();
    } else {
        currentStep.innerHTML = messageToShow;
    }
}

if (typeof window !== 'undefined') window.updateStepInfoDual = updateStepInfoDual;