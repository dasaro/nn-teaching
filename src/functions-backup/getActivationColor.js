    function getActivationColor(activation) {
        // Light orange (low) to Dark orange (high) gradient
        // Low activation: Light orange rgb(255, 218, 185)
        // High activation: Dark orange rgb(204, 85, 0)
        const t = Math.max(0, Math.min(1, activation)); // Clamp to 0-1
        
        const red = Math.round(255 - t * 51);    // 255 -> 204
        const green = Math.round(218 - t * 133); // 218 -> 85  
        const blue = Math.round(185 - t * 185);  // 185 -> 0
        
        return `rgb(${red}, ${green}, ${blue})`;
    }

if (typeof window !== 'undefined') window.getActivationColor = getActivationColor;