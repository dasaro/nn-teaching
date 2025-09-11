function closeExpertPanel() {
    const modal = document.getElementById('expertPanelModal');
    modal.style.display = 'none';
    expertPanelVisible = false;
}

if (typeof window !== 'undefined') window.closeExpertPanel = closeExpertPanel;