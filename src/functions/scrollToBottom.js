function scrollToBottom() {
    if (!autoScrollEnabled) return;
    
    const messageContent = document.getElementById('currentStep');
    if (messageContent) {
        messageContent.scrollTop = messageContent.scrollHeight;
    }
}

if (typeof window !== 'undefined') window.scrollToBottom = scrollToBottom;