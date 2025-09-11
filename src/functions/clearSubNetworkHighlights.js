function clearSubNetworkHighlights() {
    document.querySelectorAll('.connection-line').forEach(line => {
        line.classList.remove('active-path', 'computing-path');
    });
    document.querySelectorAll('.neuron').forEach(neuron => {
        neuron.classList.remove('sub-network-highlight');
    });
}

if (typeof window !== 'undefined') window.clearSubNetworkHighlights = clearSubNetworkHighlights;