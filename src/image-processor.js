// ============================================================================
// IMAGE-PROCESSOR MODULE
// Image processing and rendering functions
// ============================================================================

function checkValueDuplication(values) {
    const uniqueValues = new Set(values.map(v => Math.round(v * 1000) / 1000));
    return 1 - (uniqueValues.size / values.length);
}

function handlePixelHover(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel is being hovered
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) {
            pixelInfo.innerHTML = `
                <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
                Value: ${pixel.value.toFixed(2)}
            `;
        }
        
        // Highlight corresponding area in original image
        highlightCorrespondingImageArea(pixelX, pixelY);
        
        // Highlight current pixel in grid
        highlightPixelInGrid(pixelX, pixelY, false);
    }
}

function selectImage(imageType) {
    currentImage = imageType;
    
    // Update button states
    document.querySelectorAll('.img-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Handle both programmatic calls and user clicks
    if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('selected');
    } else {
        // For programmatic calls, find the button by its onclick attribute
        const buttons = document.querySelectorAll('.img-btn');
        buttons.forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(`'${imageType}'`)) {
                btn.classList.add('selected');
            }
        });
    }
    
    // Create new image with new activations
    createImage(imageType);
    
    // IMPORTANT: Don't reset demo - preserve learned weights!
    // Only reset visual state, not the weights
    isAnimating = false;
    
    // Reset visual states only
    resetNeuronStates();
    
    // Reset activations display for new image (but keep weights!)
    activations.hidden = [0, 0, 0, 0, 0];
    activations.output = [0, 0];
    
    // Update neuron displays
    updateNetworkDisplays();
    
    // Reset probability bars (only if they exist)
    const dogProbBar = document.getElementById('dogProbBar');
    const notDogProbBar = document.getElementById('notDogProbBar');
    const dogProbValue = document.getElementById('dogProbValue');
    const notDogProbValue = document.getElementById('notDogProbValue');
    
    if (dogProbBar) dogProbBar.style.width = '0%';
    if (notDogProbBar) notDogProbBar.style.width = '0%';
    if (dogProbValue) dogProbValue.textContent = '0%';
    if (notDogProbValue) notDogProbValue.textContent = '0%';
    
    // True label is now pre-selected in createImage function, so don't clear it
    
    // Show weights to demonstrate learning persistence
    document.querySelectorAll('.weight-value').forEach(w => w.classList.add('show'));
    
    updateStepInfoDual(
        '🖼️ <strong>New Image Selected!</strong><br>🧠 The AI still remembers its previous lessons! Notice the connection strength numbers didn\'t change - that\'s its "memory" from earlier learning!',
        '🖼️ <strong>Image Changed</strong><br>🧠 Weights preserved from previous training. Network maintains learned parameters.'
    );
    // Button doesn't exist in compact interface
}

function highlightPixelInGrid(gridX, gridY, persistent = false) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    // Redraw the grid first
    drawInteractivePixelGrid();
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Add highlight overlay
    ctx.fillStyle = persistent ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = persistent ? '#3B82F6' : '#FFC107';
    ctx.lineWidth = persistent ? 3 : 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function updatePixelInfo(pixelIndex) {
    if (!pixelData || pixelIndex >= pixelData.length) return;
    
    const pixel = pixelData[pixelIndex];
    const pixelInfo = document.getElementById('pixelInfo');
    if (pixelInfo) {
        pixelInfo.innerHTML = `
            <strong>Selected: Pixel (${pixel.x}, ${pixel.y})</strong><br>
            Value: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#2563eb';
    }
}

function drawCar(ctx) {
    // Car body
    ctx.fillStyle = '#FF4500';
    ctx.fillRect(40, 130, 120, 40);
    
    // Car roof
    ctx.fillStyle = '#FF6347';
    ctx.fillRect(60, 100, 80, 30);
    
    // Windows
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(65, 105, 25, 20);
    ctx.fillRect(110, 105, 25, 20);
    
    // Wheels
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(65, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 15, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wheel centers
    ctx.fillStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.arc(65, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(135, 170, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Headlights
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(35, 145, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(35, 155, 5, 0, 2 * Math.PI);
    ctx.fill();
}

function showImageAreaOverlay(x, y) {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate the pixel area bounds
    const cellSize = 140 / 8;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay
    ctx.fillStyle = 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#FFC107';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function addImageHoverEffects() {
    const canvas = document.getElementById('originalImageCanvas');
    
    canvas.addEventListener('mouseenter', () => {
        canvas.style.filter = 'brightness(1.1)';
    });
    
    canvas.addEventListener('mouseleave', () => {
        canvas.style.filter = 'brightness(1)';
        clearAllHighlights();
    });
    
    // Add mousemove to track position and highlight corresponding pixel
    canvas.addEventListener('mousemove', (event) => {
        highlightCorrespondingPixel(event);
    });
    
    canvas.addEventListener('click', (event) => {
        highlightCorrespondingPixel(event, true); // true for persistent highlight
    });
}

function highlightPatternInOriginalImage(pattern) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8; // 8x8 grid
    
    // Redraw original image first
    drawOriginalImage();
    
    // Define the quadrant boundaries for each pattern
    const quadrantMap = {
        'A': { startX: 0, startY: 0, width: 4, height: 4 },     // Top-left
        'B': { startX: 4, startY: 0, width: 4, height: 4 },     // Top-right
        'C': { startX: 0, startY: 4, width: 4, height: 4 },     // Bottom-left
        'D': { startX: 4, startY: 4, width: 4, height: 4 }      // Bottom-right
    };
    
    const quadrant = quadrantMap[pattern];
    if (!quadrant) return;
    
    // Calculate pixel coordinates for the quadrant
    const startX = quadrant.startX * cellSize;
    const startY = quadrant.startY * cellSize;
    const width = quadrant.width * cellSize;
    const height = quadrant.height * cellSize;
    
    // Get pattern-specific color
    const patternColors = {
        'A': 'rgba(255, 107, 107, 0.4)', // Red (pattern-a color)
        'B': 'rgba(76, 205, 196, 0.4)',  // Teal (pattern-b color)
        'C': 'rgba(69, 183, 209, 0.4)',  // Blue (pattern-c color)
        'D': 'rgba(249, 202, 36, 0.4)'   // Yellow (pattern-d color)
    };
    
    const patternBorders = {
        'A': '#FF6B6B', // Red
        'B': '#4ECDC4', // Teal
        'C': '#45B7D1', // Blue
        'D': '#F9CA24'  // Yellow
    };
    
    // Add highlight overlay
    ctx.fillStyle = patternColors[pattern] || 'rgba(255, 193, 7, 0.4)';
    ctx.fillRect(startX, startY, width, height);
    
    // Add border
    ctx.strokeStyle = patternBorders[pattern] || '#FFC107';
    ctx.lineWidth = 3;
    ctx.strokeRect(startX, startY, width, height);
    
    // Add pattern label overlay
    ctx.fillStyle = patternBorders[pattern] || '#FFC107';
    ctx.font = '14px bold sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        `Pattern ${pattern}`,
        startX + width / 2,
        startY + height / 2
    );
}

function createImage(imageType) {
    const canvas = document.getElementById('inputImage');
    // Optimize canvas for frequent getImageData operations
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with loading state
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 0, 140, 140);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', 70, 70);
    
    // Load stock photo
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = function() {
        console.log(`✅ Successfully loaded image: ${imageType} from ${img.src}`);
        
        // Clear canvas and draw the loaded image
        ctx.clearRect(0, 0, 140, 140);
        ctx.drawImage(img, 0, 0, 140, 140);
        
        // Add a subtle border
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 138, 138);
        
        // Add success indicator
        ctx.fillStyle = '#22c55e';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('✓', 135, 15);
        
        // CRITICAL: Set visual features based on image type!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.onerror = function(error) {
        console.error(`❌ Failed to load image: ${imageType} from ${img.src}`, error);
        console.log(`Current page location: ${window.location.href}`);
        console.log(`Image path: ${img.src}`);
        
        // Fallback to solid color with emoji if image fails to load
        ctx.clearRect(0, 0, 140, 140);
        ctx.fillStyle = getImageColor(imageType);
        ctx.fillRect(0, 0, 140, 140);
        
        // Add error indicator in corner
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('IMG ERR', 5, 12);
        
        // Large emoji fallback
        ctx.fillStyle = '#333';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(getImageEmoji(imageType), 70, 85);
        
        // CRITICAL: Set visual features even on fallback!
        setVisualFeaturesAndLabel(imageType);
    };
    
    img.src = imageUrls[imageType];
    
    // Set the visual features and labels based on image type
    setVisualFeaturesAndLabel(imageType);
}

function highlightCorrespondingImageArea(gridX, gridY) {
    const canvas = document.getElementById('originalImageCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const cellSize = 140 / 8;
    
    // Redraw original image first
    drawOriginalImage();
    
    // Add highlight overlay for the corresponding area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
    
    // Add border
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize);
}

function updatePatternValues() {
    // Get current input activation values
    const patternA = activations.input[0];
    const patternB = activations.input[1];
    const patternC = activations.input[2];
    const patternD = activations.input[3];
    
    // Update the HTML elements if they exist
    const patternAElement = document.getElementById('patternAValue');
    const patternBElement = document.getElementById('patternBValue');
    const patternCElement = document.getElementById('patternCValue');
    const patternDElement = document.getElementById('patternDValue');
    
    if (patternAElement) patternAElement.textContent = patternA.toFixed(2);
    if (patternBElement) patternBElement.textContent = patternB.toFixed(2);
    if (patternCElement) patternCElement.textContent = patternC.toFixed(2);
    if (patternDElement) patternDElement.textContent = patternD.toFixed(2);
    
    // Update pattern calculation descriptions
    const patternACalc = document.getElementById('patternACalc');
    const patternBCalc = document.getElementById('patternBCalc');
    const patternCCalc = document.getElementById('patternCCalc');
    const patternDCalc = document.getElementById('patternDCalc');
    
    if (patternACalc) patternACalc.textContent = `Top-left region → ${patternA.toFixed(2)}`;
    if (patternBCalc) patternBCalc.textContent = `Top-right region → ${patternB.toFixed(2)}`;
    if (patternCCalc) patternCCalc.textContent = `Bottom-left region → ${patternC.toFixed(2)}`;
    if (patternDCalc) patternDCalc.textContent = `Bottom-right region → ${patternD.toFixed(2)}`;
}

function closePixelViewer() {
    document.getElementById('pixelViewerModal').style.display = 'none';
}

function drawDog1(ctx) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(60, 120, 80, 60);
    
    // Head
    ctx.fillStyle = '#D2B48C';
    ctx.beginPath();
    ctx.arc(100, 80, 35, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(80, 60, 15, 25, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(120, 60, 15, 25, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 75, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(100, 90, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, 95, 8, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(70, 180, 10, 20);
    ctx.fillRect(85, 180, 10, 20);
    ctx.fillRect(105, 180, 10, 20);
    ctx.fillRect(120, 180, 10, 20);
    
    // Tail
    ctx.beginPath();
    ctx.arc(150, 140, 15, 0, Math.PI);
    ctx.fill();
}

function drawFish(ctx) {
    // Body - streamlined
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.ellipse(90, 100, 30, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head is part of body (no ears!)
    
    // Eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(75, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(75, 95, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail - prominent
    ctx.fillStyle = '#1E90FF';
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(140, 85);
    ctx.lineTo(140, 115);
    ctx.fill();
    
    // Fins (not legs!)
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.ellipse(85, 115, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(95, 85, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Scales pattern
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(85, 100, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(95, 105, 4, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawTree(ctx) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(80, 100, 16, 60);
    
    // Tree crown - multiple circles
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(70, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(108, 90, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 70, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 105, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    // Leaves details
    ctx.fillStyle = '#32CD32';
    ctx.beginPath();
    ctx.arc(80, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 80, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(89, 95, 6, 0, 2 * Math.PI);
    ctx.fill();
}

function extractPixelValues(imageData) {
    const gridSize = 8;
    const values = [];
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            values.push({
                x, y,
                value: gray,
                color: `rgb(${r}, ${g}, ${b})`,
                brightness: Math.round(gray * 255)
            });
        }
    }
    return values;
}

function drawInteractivePixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    if (!pixelData) return;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Draw pixels with interactive highlighting
    pixelData.forEach((pixel, index) => {
        const x = pixel.x;
        const y = pixel.y;
        
        // Fill with pixel color
        ctx.fillStyle = pixel.color;
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add selection highlight
        if (selectedPixel === index) {
            ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
        
        // Draw grid lines
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add number overlay for brightness
        ctx.fillStyle = pixel.brightness > 127 ? '#000' : '#fff';
        ctx.font = '10px bold monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pixel.value.toFixed(1), 
            offsetX + x * cellSize + cellSize/2, 
            offsetY + y * cellSize + cellSize/2);
    });
    
    // Add click handler
    canvas.onclick = handlePixelClick;
    canvas.style.cursor = 'pointer';
    
    // Add hover effects for pixel grid
    canvas.addEventListener('mousemove', handlePixelHover);
    canvas.addEventListener('mouseleave', () => {
        clearAllHighlights();
        const pixelInfo = document.getElementById('pixelInfo');
        if (pixelInfo) pixelInfo.innerHTML = 'Hover over pixels!';
    });
}

function drawDog2(ctx) {
    // Different dog - more square/bulldog style
    // Body
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(40, 110, 90, 40);
    
    // Head - more square
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(60, 50, 50, 50);
    
    // Ears - smaller, different position (floppy)
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(55, 45, 12, 18);
    ctx.fillRect(103, 45, 12, 18);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(72, 68, 5, 5);
    ctx.fillRect(93, 68, 5, 5);
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.fillRect(82, 85, 6, 3);
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(78, 95);
    ctx.lineTo(85, 98);
    ctx.lineTo(92, 95);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(50, 150, 10, 18);
    ctx.fillRect(68, 150, 10, 18);
    ctx.fillRect(92, 150, 10, 18);
    ctx.fillRect(110, 150, 10, 18);
    
    // Tail
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(135, 120, 12, 0, Math.PI);
    ctx.fill();
}

function drawOriginalImage() {
    const canvas = document.getElementById('originalImageCanvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 140, 140);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 140, 140);
    
    // Get current input image data
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    
    // Scale and draw the current image with smooth scaling to fit perfectly
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(inputCanvas, 0, 0, 140, 140, 0, 0, 140, 140);
    
    // Store pixel data for interactive use
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    pixelData = extractPixelValues(imageData);
}

function drawDog3(ctx) {
    // Spotted dog - dalmatian style
    // Body
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(50, 100, 80, 50);
    
    // Head
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(90, 70, 28, 0, 2 * Math.PI);
    ctx.fill();
    
    // Ears - floppy
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(72, 55, 12, 20, -0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(108, 55, 12, 20, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Spots
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(95, 60, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, 75, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(65, 115, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 120, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(82, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(98, 68, 3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(90, 80, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(90, 85, 6, 0, Math.PI);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(60, 150, 8, 16);
    ctx.fillRect(75, 150, 8, 16);
    ctx.fillRect(95, 150, 8, 16);
    ctx.fillRect(110, 150, 8, 16);
    
    // Tail - wagging upward
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(135, 110, 10, Math.PI, 0, false);
    ctx.fill();
}

function getImageEmoji(imageType) {
    const emojis = {
        dog1: '🐕', dog2: '🐕', dog3: '🐕',
        cat: '🐱', bird: '🐦', fish: '🐟',
        car: '🚗', tree: '🌳'
    };
    return emojis[imageType] || '❓';
}

function drawNumberGrid() {
    const canvas = document.getElementById('numberGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data and convert to normalized values
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel and normalize
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Convert to grayscale and normalize (0-1)
            const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const normalized = gray.toFixed(1);
            
            // Color background based on brightness
            const brightness = gray * 255;
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw the normalized value
            ctx.fillStyle = brightness > 127 ? '#000' : '#fff';
            ctx.fillText(normalized, 
                offsetX + x * cellSize + cellSize/2, 
                offsetY + y * cellSize + cellSize/2);
            
            // Grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

function highlightCorrespondingPixel(event, persistent = false) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Convert mouse position to pixel grid coordinates (8x8)
    const gridX = Math.floor((x / 140) * 8);
    const gridY = Math.floor((y / 140) * 8);
    
    // Ensure coordinates are within bounds
    if (gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 8) {
        const pixelIndex = gridY * 8 + gridX;
        
        if (persistent) {
            selectedPixel = pixelIndex;
            updatePixelInfo(pixelIndex);
        }
        
        // Highlight the corresponding pixel in the grid
        highlightPixelInGrid(gridX, gridY, persistent);
        
        // Show overlay on original image
        showImageAreaOverlay(x, y);
    }
}

function predictActivationPatterns(inputValues) {
    // Predict hidden layer activations
    const predictedHidden = [];
    for (let h = 0; h < networkConfig.hiddenSize; h++) {
        let sum = 0;
        for (let i = 0; i < networkConfig.inputSize; i++) {
            sum += inputValues[i] * weights.inputToHidden[h][i];
        }
        predictedHidden[h] = leakyReLU(sum); // Leaky ReLU
    }
    
    console.log(`  Predicted hidden activations: [${predictedHidden.map(v => v.toFixed(3)).join(', ')}]`);
    
    const hiddenStats = calculateWeightStats(predictedHidden);
    console.log(`  Hidden stats: min=${hiddenStats.min.toFixed(4)}, max=${hiddenStats.max.toFixed(4)}, mean=${hiddenStats.mean.toFixed(4)}`);
    
    // Check for dead neurons
    const deadNeurons = predictedHidden.filter(v => Math.abs(v) < 1e-6).length;
    if (deadNeurons > 0) {
        console.log(`  ⚠️ WARNING: ${deadNeurons} potentially dead neurons detected!`);
    }
    
    // Predict output layer
    const predictedOutputs = [];
    for (let o = 0; o < networkConfig.outputSize; o++) {
        let sum = 0;
        for (let h = 0; h < networkConfig.hiddenSize; h++) {
            sum += predictedHidden[h] * weights.hiddenToOutput[o][h];
        }
        predictedOutputs[o] = sum;
    }
    
    console.log(`  Predicted raw outputs: [${predictedOutputs.map(v => v.toFixed(3)).join(', ')}]`);
    
    // Apply softmax for final prediction
    const softmaxOutputs = softmax(predictedOutputs);
    
    console.log(`  Final probabilities: [${softmaxOutputs.map(v => (v*100).toFixed(1) + '%').join(', ')}]`);
    
    // Convergence warning
    const maxProb = Math.max(...softmaxOutputs);
    const minProb = Math.min(...softmaxOutputs);
    if (maxProb - minProb < 0.1) {
        console.log('  ⚠️ WARNING: Predictions are very close - possible convergence issue!');
    }
}

function getImageColor(imageType) {
    const colors = {
        dog1: '#8B4513', dog2: '#D2691E', dog3: '#FFFFFF',
        cat: '#696969', bird: '#FFD700', fish: '#1E90FF',
        car: '#FF6B6B', tree: '#228B22'
    };
    return colors[imageType] || '#f0f8ff';
}

function highlightPixelRegions(pattern) {
    const canvas = document.getElementById('pixelGridCanvas');
    if (!canvas || !pixelData) return;
    
    const ctx = canvas.getContext('2d');
    
    // Define which pixels belong to each pattern region (8x8 grid)
    const regionMap = {
        'A': [], // Top-left quadrant
        'B': [], // Top-right quadrant  
        'C': [], // Bottom-left quadrant
        'D': []  // Bottom-right quadrant
    };
    
    // Fill region maps based on 8x8 grid quadrants
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const index = y * 8 + x;
            if (x < 4 && y < 4) regionMap['A'].push(index);        // Top-left
            else if (x >= 4 && y < 4) regionMap['B'].push(index);  // Top-right
            else if (x < 4 && y >= 4) regionMap['C'].push(index);  // Bottom-left
            else if (x >= 4 && y >= 4) regionMap['D'].push(index); // Bottom-right
        }
    }
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Highlight the specific pattern region in pixel grid
    const highlightPixels = regionMap[pattern] || [];
    
    highlightPixels.forEach(pixelIndex => {
        const pixel = pixelData[pixelIndex];
        const x = pixel.x;
        const y = pixel.y;
        
        // Add highlight overlay
        ctx.fillStyle = 'rgba(255, 193, 7, 0.6)';
        ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        
        // Add thicker border
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 3;
        ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
    });
    
    // Also highlight corresponding area in original image
    highlightPatternInOriginalImage(pattern);
}

function drawBird(ctx) {
    // Body - oval
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(90, 100, 25, 15, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(90, 70, 18, 0, 2 * Math.PI);
    ctx.fill();
    
    // Beak - pointed (no ears!)
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(75, 70);
    ctx.lineTo(60, 68);
    ctx.lineTo(75, 75);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(85, 65, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Wings
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(95, 95, 15, 8, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    // Tail feathers - small
    ctx.fillStyle = '#FF8C00';
    ctx.beginPath();
    ctx.ellipse(115, 105, 8, 4, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Legs - thin (not four legs!)
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(85, 115);
    ctx.lineTo(85, 130);
    ctx.moveTo(95, 115);
    ctx.lineTo(95, 130);
    ctx.stroke();
    
    // Feet
    ctx.beginPath();
    ctx.moveTo(82, 130);
    ctx.lineTo(88, 130);
    ctx.moveTo(92, 130);
    ctx.lineTo(98, 130);
    ctx.stroke();
}

function handlePixelClick(event) {
    if (!pixelData) return;
    
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridSize = 8;
    const cellSize = 140 / gridSize;
    const offsetX = 0;
    const offsetY = 0;
    
    // Calculate which pixel was clicked
    const pixelX = Math.floor((x - offsetX) / cellSize);
    const pixelY = Math.floor((y - offsetY) / cellSize);
    
    if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        const pixelIndex = pixelY * gridSize + pixelX;
        selectedPixel = pixelIndex;
        
        // Update info display
        const pixel = pixelData[pixelIndex];
        const pixelInfo = document.getElementById('pixelInfo');
        pixelInfo.innerHTML = `
            <strong>Pixel (${pixelX}, ${pixelY})</strong><br>
            Brightness: ${pixel.value.toFixed(2)} → Input #${pixelIndex + 1}
        `;
        pixelInfo.style.color = '#333';
        
        // Redraw grid with highlight
        drawInteractivePixelGrid();
        
        // Highlight corresponding input neuron
        highlightInputNeuron(pixelIndex);
    }
}

function drawPixelGrid() {
    const canvas = document.getElementById('pixelGridCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 160, 160);
    
    // Get current pixel data from input canvas
    const inputCanvas = document.getElementById('inputImage');
    const inputCtx = inputCanvas.getContext('2d');
    const imageData = inputCtx.getImageData(0, 0, 140, 140);
    
    // Draw 8x8 pixel grid with visible boundaries
    const gridSize = 8;
    const cellSize = 140 / gridSize; // 17.5px per cell
    const offsetX = 10;
    const offsetY = 10;
    
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Sample pixel from the scaled region (140x140 -> 8x8)
            const sampleX = Math.floor(x * 140 / gridSize + 70 / gridSize);
            const sampleY = Math.floor(y * 140 / gridSize + 70 / gridSize);
            const pixelIndex = (sampleY * 140 + sampleX) * 4;
            
            const r = imageData.data[pixelIndex];
            const g = imageData.data[pixelIndex + 1];
            const b = imageData.data[pixelIndex + 2];
            
            // Fill the cell with the pixel color
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
            
            // Draw grid lines
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(offsetX + x * cellSize, offsetY + y * cellSize, cellSize, cellSize);
        }
    }
}

function drawCat(ctx) {
    // Body
    ctx.fillStyle = '#696969';
    ctx.fillRect(70, 130, 60, 50);
    
    // Head
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.arc(100, 85, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pointed ears
    ctx.fillStyle = '#808080';
    ctx.beginPath();
    ctx.moveTo(80, 65);
    ctx.lineTo(85, 45);
    ctx.lineTo(95, 60);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(120, 65);
    ctx.lineTo(115, 45);
    ctx.lineTo(105, 60);
    ctx.fill();
    
    // Eyes - cat-like
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.ellipse(90, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(110, 80, 4, 6, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(89, 78, 2, 4);
    ctx.fillRect(109, 78, 2, 4);
    
    // Nose - triangle
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.moveTo(100, 88);
    ctx.lineTo(95, 95);
    ctx.lineTo(105, 95);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 85);
    ctx.lineTo(85, 87);
    ctx.moveTo(70, 90);
    ctx.lineTo(85, 90);
    ctx.moveTo(130, 85);
    ctx.lineTo(115, 87);
    ctx.moveTo(130, 90);
    ctx.lineTo(115, 90);
    ctx.stroke();
    
    // Legs
    ctx.fillStyle = '#696969';
    ctx.fillRect(75, 180, 8, 20);
    ctx.fillRect(90, 180, 8, 20);
    ctx.fillRect(102, 180, 8, 20);
    ctx.fillRect(117, 180, 8, 20);
    
    // Tail - long and curved
    ctx.strokeStyle = '#696969';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(140, 150, 20, Math.PI, 0);
    ctx.stroke();
}

function openPixelViewer() {
    const modal = document.getElementById('pixelViewerModal');
    modal.style.display = 'flex';
    
    // Initialize the pixel viewer with current image
    drawOriginalImage();
    drawInteractivePixelGrid();
    updatePatternValues();
    
    // Add hover effects to original image
    addImageHoverEffects();
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof window !== 'undefined') window.checkValueDuplication = checkValueDuplication;
if (typeof window !== 'undefined') window.handlePixelHover = handlePixelHover;
if (typeof window !== 'undefined') window.selectImage = selectImage;
if (typeof window !== 'undefined') window.highlightPixelInGrid = highlightPixelInGrid;
if (typeof window !== 'undefined') window.updatePixelInfo = updatePixelInfo;
if (typeof window !== 'undefined') window.drawCar = drawCar;
if (typeof window !== 'undefined') window.showImageAreaOverlay = showImageAreaOverlay;
if (typeof window !== 'undefined') window.addImageHoverEffects = addImageHoverEffects;
if (typeof window !== 'undefined') window.highlightPatternInOriginalImage = highlightPatternInOriginalImage;
if (typeof window !== 'undefined') window.createImage = createImage;
if (typeof window !== 'undefined') window.highlightCorrespondingImageArea = highlightCorrespondingImageArea;
if (typeof window !== 'undefined') window.updatePatternValues = updatePatternValues;
if (typeof window !== 'undefined') window.closePixelViewer = closePixelViewer;
if (typeof window !== 'undefined') window.drawDog1 = drawDog1;
if (typeof window !== 'undefined') window.drawFish = drawFish;
if (typeof window !== 'undefined') window.drawTree = drawTree;
if (typeof window !== 'undefined') window.extractPixelValues = extractPixelValues;
if (typeof window !== 'undefined') window.drawInteractivePixelGrid = drawInteractivePixelGrid;
if (typeof window !== 'undefined') window.drawDog2 = drawDog2;
if (typeof window !== 'undefined') window.drawOriginalImage = drawOriginalImage;
if (typeof window !== 'undefined') window.drawDog3 = drawDog3;
if (typeof window !== 'undefined') window.getImageEmoji = getImageEmoji;
if (typeof window !== 'undefined') window.drawNumberGrid = drawNumberGrid;
if (typeof window !== 'undefined') window.highlightCorrespondingPixel = highlightCorrespondingPixel;
if (typeof window !== 'undefined') window.predictActivationPatterns = predictActivationPatterns;
if (typeof window !== 'undefined') window.getImageColor = getImageColor;
if (typeof window !== 'undefined') window.highlightPixelRegions = highlightPixelRegions;
if (typeof window !== 'undefined') window.drawBird = drawBird;
if (typeof window !== 'undefined') window.handlePixelClick = handlePixelClick;
if (typeof window !== 'undefined') window.drawPixelGrid = drawPixelGrid;
if (typeof window !== 'undefined') window.drawCat = drawCat;
if (typeof window !== 'undefined') window.openPixelViewer = openPixelViewer;
