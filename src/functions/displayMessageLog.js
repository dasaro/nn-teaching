function displayMessageLog() {
    const logContent = document.getElementById('messageLogContent');
    if (logContent && messageLog.length > 0) {
        const lastEntry = messageLog[messageLog.length - 1];
        const entryHtml = `<div class="message-log-entry ${lastEntry.type}"><span class="log-timestamp">[${lastEntry.timestamp}]</span> ${lastEntry.message}</div>`;
        logContent.innerHTML += entryHtml;
        // Auto-scroll to bottom
        logContent.scrollTop = logContent.scrollHeight;
    }
}

if (typeof window !== 'undefined') window.displayMessageLog = displayMessageLog;