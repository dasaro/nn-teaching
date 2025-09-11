function t(key, replacements = []) {
    if (typeof window.i18n !== 'undefined') {
        return window.i18n.t(key, replacements);
    }
    // Fallback if i18n is not loaded yet
    return key;
}

if (typeof window !== 'undefined') window.t = t;