function startMessageLog() {
    messageLog = [];
    messageLogActive = true;
    const currentStep = document.getElementById('currentStep');
    const mode = expertViewMode ? 'Expert' : 'Student';
    const icon = expertViewMode ? '📋' : '🎓';
    const description = expertViewMode ? 'Mathematical Details' : 'Learning Adventure';
    currentStep.innerHTML = `<div class="message-log-container"><div class="message-log-header">${icon} <strong>${mode} ${description}</strong> (Recording...)</div><div id="messageLogContent" class="message-log-content"></div></div>`;
}

if (typeof window !== 'undefined') window.startMessageLog = startMessageLog;