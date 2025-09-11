function stopMessageLog() {
    messageLogActive = false;
    if (messageLog.length > 0) {
        const currentStep = document.getElementById('currentStep');
        const mode = messageLog[0]?.mode || 'Student';
        const icon = mode === 'Expert' ? '📋' : '🎓';
        const description = mode === 'Expert' ? 'Complete Mathematical Analysis' : 'Complete Learning Adventure';
        const finalMessage = `<div class="message-log-container"><div class="message-log-header">${icon} <strong>${description}</strong> ✅</div><div id="messageLogContent" class="message-log-content">` + 
            messageLog.map(entry => `<div class="message-log-entry ${entry.type}"><span class="log-timestamp">[${entry.timestamp}]</span> ${entry.message}</div>`).join('') + 
            `</div><div class="message-log-footer">${mode === 'Expert' ? '🎓 All mathematical steps preserved above' : '📖 Your complete AI learning story - review at your own pace!'}</div></div>`;
        currentStep.innerHTML = finalMessage;
    }
}

if (typeof window !== 'undefined') window.stopMessageLog = stopMessageLog;