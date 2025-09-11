function checkValueDuplication(values) {
    const uniqueValues = new Set(values.map(v => Math.round(v * 1000) / 1000));
    return 1 - (uniqueValues.size / values.length);
}

if (typeof window !== 'undefined') window.checkValueDuplication = checkValueDuplication;