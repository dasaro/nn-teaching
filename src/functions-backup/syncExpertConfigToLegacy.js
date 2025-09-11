function syncExpertConfigToLegacy() {
    networkConfig.learningRate = expertConfig.learningRate;
    networkConfig.inputSize = expertConfig.inputSize;
    networkConfig.hiddenSize = expertConfig.hiddenSize;
    networkConfig.outputSize = expertConfig.outputSize;
}

if (typeof window !== 'undefined') window.syncExpertConfigToLegacy = syncExpertConfigToLegacy;