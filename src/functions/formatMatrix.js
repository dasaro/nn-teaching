function formatMatrix(matrix, name) {
    let html = `<div class="math-matrix"><strong>${name}:</strong><br>`;
    if (Array.isArray(matrix[0])) {
        // 2D matrix
        html += '[';
        matrix.forEach((row, i) => {
            html += '[' + row.map(val => val.toFixed(3)).join(', ') + ']';
            if (i < matrix.length - 1) html += '<br> ';
        });
        html += ']';
    } else {
        // 1D vector
        html += '[' + matrix.map(val => val.toFixed(3)).join(', ') + ']';
    }
    html += '</div>';
    return html;
}

if (typeof window !== 'undefined') window.formatMatrix = formatMatrix;