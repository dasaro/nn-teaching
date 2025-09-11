function openExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'flex';
    expertPanelVisible = true;
    
    // Initialize UI with current expert config values
    initializeExpertPanelUI();
}

if (typeof window !== 'undefined') window.openExpertPanel = openExpertPanel;