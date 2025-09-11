function highlightSection(phase) {
    // Remove any existing highlights
    document.querySelectorAll('.layer-highlight').forEach(el => {
        el.classList.remove('layer-highlight');
    });
    
    if (phase === 'forward') {
        // Subtle highlighting for forward pass
        document.body.style.setProperty('--current-phase', '"Forward Pass"');
    } else if (phase === 'backward') {
        // Subtle highlighting for backward pass
        document.body.style.setProperty('--current-phase', '"Backward Pass"');
    } else {
        document.body.style.setProperty('--current-phase', '""');
    }
}

if (typeof window !== 'undefined') window.highlightSection = highlightSection;