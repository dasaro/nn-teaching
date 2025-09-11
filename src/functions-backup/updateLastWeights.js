function updateLastWeights() {
    weightChanges.lastWeights.inputToHidden = JSON.parse(JSON.stringify(weights.inputToHidden));
    weightChanges.lastWeights.hiddenToOutput = JSON.parse(JSON.stringify(weights.hiddenToOutput));
}

if (typeof window !== 'undefined') window.updateLastWeights = updateLastWeights;