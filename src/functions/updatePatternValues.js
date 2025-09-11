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

if (typeof window !== 'undefined') window.updatePatternValues = updatePatternValues;