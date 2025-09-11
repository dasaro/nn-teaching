function addWeightTooltip(lineElement, initialWeight, connectionLabel) {
    // Store connection info in data attributes for dynamic lookup
    const connectionInfo = connectionLabel.split(' → ');
    const fromPart = connectionInfo[0];
    const toPart = connectionInfo[1];
    
    lineElement.setAttribute('data-connection-label', connectionLabel);
    lineElement.setAttribute('data-from', fromPart);
    lineElement.setAttribute('data-to', toPart);
    
    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('weightTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'weightTooltip';
        tooltip.className = 'weight-tooltip';
        document.body.appendChild(tooltip);
    }
    
    // Add mouse event listeners
    lineElement.addEventListener('mouseenter', (e) => {
        // Get current weight value from the weights object
        const currentWeight = getCurrentWeightForConnection(connectionLabel);
        
        tooltip.innerHTML = `
            <div class="tooltip-connection">${connectionLabel}</div>
            <div class="tooltip-weight">Weight: <strong>${currentWeight.toFixed(2)}</strong></div>
            <div class="tooltip-effect">${currentWeight > 0 ? '✓ Positive influence' : currentWeight < -0.1 ? '✗ Negative influence' : '○ Minimal effect'}</div>
        `;
        tooltip.style.display = 'block';
        
        // Position tooltip near mouse
        const rect = document.getElementById('networkSvg').getBoundingClientRect();
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
    
    lineElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
    
    // Update tooltip position on mouse move
    lineElement.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 10) + 'px';
    });
}

if (typeof window !== 'undefined') window.addWeightTooltip = addWeightTooltip;