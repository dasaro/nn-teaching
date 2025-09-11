function setTrueLabel(label) {
    console.log("setTrueLabel called with:", label);
    trueLabel = label;
    console.log("trueLabel is now:", trueLabel);
    
    // Update UI (with safety checks for DOM elements)
    const labelButtons = document.querySelectorAll('.label-btn');
    if (labelButtons.length > 0) {
        labelButtons.forEach(btn => btn.classList.remove('selected'));
        
        const targetButton = document.getElementById(label === 'dog' ? 'labelDog' : 'labelNotDog');
        if (targetButton) {
            targetButton.classList.add('selected');
        } else {
            console.warn("Target label button not found:", label === 'dog' ? 'labelDog' : 'labelNotDog');
        }
        
        const selectedLabel = document.getElementById('selectedLabel');
        if (selectedLabel) {
            selectedLabel.textContent = label === 'dog' ? 'Correct answer: Dog' : 'Correct answer: Not a Dog';
            selectedLabel.style.color = '#065f46';
        } else {
            console.warn("selectedLabel element not found");
        }
    } else {
        console.warn("Label buttons not found in DOM yet");
    }
}

if (typeof window !== 'undefined') window.setTrueLabel = setTrueLabel;