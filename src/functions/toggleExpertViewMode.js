function toggleExpertViewMode() {
    expertViewMode = !expertViewMode;
    const status = expertViewMode ? 'enabled' : 'disabled';
    
    // Update view mode indicator in sidebar
    const indicator = document.getElementById('viewModeIndicator');
    if (indicator) {
        indicator.textContent = expertViewMode ? t('system.viewMode.expert') : t('system.viewMode.student');
        indicator.className = expertViewMode ? 'view-mode-indicator expert' : 'view-mode-indicator';
    }
    
    updateStepInfoDual(
        expertViewMode ? t('viewMode.expertEnabled') : t('viewMode.studentEnabled'),
        expertViewMode ? t('viewMode.expertEnabled') : t('viewMode.studentEnabled')
    );
    console.log(`Expert view mode: ${status}`);
}

if (typeof window !== 'undefined') window.toggleExpertViewMode = toggleExpertViewMode;