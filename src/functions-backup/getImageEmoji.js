function getImageEmoji(imageType) {
    const emojis = {
        dog1: '🐕', dog2: '🐕', dog3: '🐕',
        cat: '🐱', bird: '🐦', fish: '🐟',
        car: '🚗', tree: '🌳'
    };
    return emojis[imageType] || '❓';
}

if (typeof window !== 'undefined') window.getImageEmoji = getImageEmoji;