function updateConnectionTooltip(lineElement, weight, connectionLabel) {
    // Update the tooltip data for this connection
    lineElement.setAttribute('data-weight', weight);
    lineElement.setAttribute('data-label', connectionLabel);
}

if (typeof window !== 'undefined') window.updateConnectionTooltip = updateConnectionTooltip;