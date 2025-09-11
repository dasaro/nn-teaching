function toggleAutoScroll() {
    autoScrollEnabled = !autoScrollEnabled;
    const button = event.target;
    button.textContent = autoScrollEnabled ? '📜 Auto-scroll' : '📜 Manual';
    button.title = autoScrollEnabled ? 'Disable auto-scroll' : 'Enable auto-scroll';
    
    if (autoScrollEnabled) {
        scrollToBottom();
    }
}

if (typeof window !== 'undefined') window.toggleAutoScroll = toggleAutoScroll;