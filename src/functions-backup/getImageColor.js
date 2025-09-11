function getImageColor(imageType) {
    const colors = {
        dog1: '#8B4513', dog2: '#D2691E', dog3: '#FFFFFF',
        cat: '#696969', bird: '#FFD700', fish: '#1E90FF',
        car: '#FF6B6B', tree: '#228B22'
    };
    return colors[imageType] || '#f0f8ff';
}

if (typeof window !== 'undefined') window.getImageColor = getImageColor;