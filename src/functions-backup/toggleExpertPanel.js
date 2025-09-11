function toggleExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    if (expertPanelVisible) {
        closeExpertPanel();
    } else {
        openExpertPanel();
    }
}

if (typeof window !== 'undefined') window.toggleExpertPanel = toggleExpertPanel;