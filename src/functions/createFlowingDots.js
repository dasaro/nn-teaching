function createFlowingDots(fromX, fromY, toX, toY, connectionId, duration = 800, direction = 'forward') {
    const svg = document.getElementById('networkSvg');
    const numDots = 3;
    const dots = [];
    
    // Calculate exact connection line endpoints to match the actual SVG lines
    const startX = fromX + 25;  // Right edge of source neuron
    const startY = fromY;       // Center Y of source neuron
    const endX = toX - 25;      // Left edge of target neuron  
    const endY = toY;           // Center Y of target neuron
    
    // Create an invisible path that matches the connection line exactly
    const pathId = `flow-path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Create path data for straight line
    let pathData;
    if (direction === 'forward') {
        pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
        // Reverse the path for backward movement
        pathData = `M ${endX} ${endY} L ${startX} ${startY}`;
    }
    
    path.setAttribute('d', pathData);
    path.setAttribute('id', pathId);
    path.style.opacity = '0'; // Make path invisible
    svg.appendChild(path);
    
    // Create dots that will animate along the path
    for (let i = 0; i < numDots; i++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('class', 'flow-dot');
        
        // Set color based on direction
        if (direction === 'forward') {
            dot.setAttribute('fill', '#10b981');
            dot.style.filter = 'drop-shadow(0 0 4px #10b981)';
        } else {
            dot.setAttribute('fill', '#ef4444');
            dot.style.filter = 'drop-shadow(0 0 4px #ef4444)';
        }
        
        // Position dot at the start of the path
        dot.setAttribute('cx', direction === 'forward' ? startX : endX);
        dot.setAttribute('cy', direction === 'forward' ? startY : endY);
        
        svg.appendChild(dot);
        dots.push(dot);
        
        // Animate dot along the path with staggered delay
        setTimeout(() => {
            const pathLength = path.getTotalLength();
            const animationDuration = duration;
            const startTime = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                
                // Get point along the path at current progress
                const point = path.getPointAtLength(progress * pathLength);
                
                dot.setAttribute('cx', point.x);
                dot.setAttribute('cy', point.y);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Remove dot when animation completes
                    if (dot.parentNode) {
                        dot.parentNode.removeChild(dot);
                    }
                }
            };
            
            requestAnimationFrame(animate);
        }, i * 120); // Stagger each dot by 120ms
    }
    
    // Clean up path and any remaining dots after total duration
    setTimeout(() => {
        if (path.parentNode) {
            path.parentNode.removeChild(path);
        }
        dots.forEach(dot => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
        });
    }, duration + (numDots * 120) + 200);
}

if (typeof window !== 'undefined') window.createFlowingDots = createFlowingDots;