function formatOperation(operation, inputs, result, description) {
    return `
        <div class="math-operation">
            <div class="op-title">🔢 <strong>${operation}</strong></div>
            <div class="op-description">${description}</div>
            <div class="op-calculation">
                <strong>Input:</strong> ${inputs}<br>
                <strong>Result:</strong> <span class="result-highlight">${result}</span>
            </div>
        </div>
    `;
}

if (typeof window !== 'undefined') window.formatOperation = formatOperation;