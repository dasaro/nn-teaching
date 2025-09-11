function clearMessageLog() {
    const messageContent = document.getElementById('currentStep');
    if (messageContent) {
        const resetMessage = expertViewMode ? 
            '🗑️ <strong>Expert Sidebar Cleared</strong><br>📊 All previous mathematical analysis cleared. Ready for new detailed explanations!' :
            '🗑️ <strong>Student Sidebar Cleared</strong><br>🎓 All previous lessons cleared. Ready for your next learning adventure!';
        messageContent.innerHTML = resetMessage;
    }
    messageLog = [];
    messageLogActive = false;
}

if (typeof window !== 'undefined') window.clearMessageLog = clearMessageLog;