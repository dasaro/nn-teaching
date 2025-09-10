// ============================================================================
// IMAGE GENERATOR MODULE - All image creation and drawing functions
// ============================================================================

import { CANVAS_CONFIG, IMAGE_TYPES, LABELS } from '../config/constants.js';

/**
 * Image Generator - Handles all image creation, drawing, and feature extraction
 */
export class ImageGenerator {
    constructor() {
        this.imageUrls = null;
        this.callbacks = {
            updateInputActivations: null,
            setTrueLabel: null
        };
        console.log('✅ Image Generator: Initialized');
    }

    /**
     * Set image URLs for loading external images
     */
    setImageUrls(imageUrls) {
        this.imageUrls = imageUrls;
    }

    /**
     * Set callback functions for integration with main app
     */
    setCallbacks(updateInputActivations, setTrueLabel) {
        this.callbacks.updateInputActivations = updateInputActivations;
        this.callbacks.setTrueLabel = setTrueLabel;
    }

    /**
     * Set visual features and label for given image type
     * Extracted from script.js setVisualFeaturesAndLabel()
     */
    setVisualFeaturesAndLabel(imageType, preventAutoLabeling = false, activations = null) {
        // NUANCED feature patterns for better learning: [feature_A, feature_B, feature_C, feature_D]
        // Dogs use mixed HIGH/LOW patterns, Non-dogs use different mixed patterns
        // This gives 8 distinct, learnable combinations for 4 hidden units to distinguish
        
        let inputValues;
        let trueLabel;
        
        switch(imageType) {
            case 'dog1':
                inputValues = [0.9, 0.9, 0.1, 0.1]; // Dog pattern: HIGH-HIGH-LOW-LOW
                trueLabel = 'dog';
                break;
            case 'dog2':
                inputValues = [0.8, 0.7, 0.2, 0.3]; // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
                trueLabel = 'dog';
                break;
            case 'dog3':
                inputValues = [0.7, 0.8, 0.3, 0.2]; // Dog pattern: HIGH-HIGH-LOW-LOW (with variation)
                trueLabel = 'dog';
                break;
            case 'cat':
                inputValues = [0.1, 0.9, 0.1, 0.9]; // Non-dog pattern: LOW-HIGH-LOW-HIGH
                trueLabel = 'not-dog';
                break;
            case 'bird':
                inputValues = [0.2, 0.8, 0.3, 0.7]; // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
                trueLabel = 'not-dog';
                break;
            case 'car':
                inputValues = [0.3, 0.7, 0.2, 0.8]; // Non-dog pattern: LOW-HIGH-LOW-HIGH (with variation)
                trueLabel = 'not-dog';
                break;
            case 'tree':
                inputValues = [0.9, 0.1, 0.9, 0.1]; // Non-dog pattern: HIGH-LOW-HIGH-LOW
                trueLabel = 'not-dog';
                break;
            case 'fish':
                inputValues = [0.8, 0.2, 0.7, 0.3]; // Non-dog pattern: HIGH-LOW-HIGH-LOW (with variation)
                trueLabel = 'not-dog';
                break;
            default:
                console.error('Unknown image type:', imageType);
                inputValues = [0.1, 0.1, 0.1, 0.1];
                trueLabel = 'not-dog';
        }
        
        // Update activations through callback
        if (this.callbacks.updateInputActivations) {
            this.callbacks.updateInputActivations(inputValues);
        } else if (activations) {
            activations.input = inputValues;
        }
        
        // Set true label through callback if not prevented
        if (!preventAutoLabeling && this.callbacks.setTrueLabel) {
            this.callbacks.setTrueLabel(trueLabel);
        }
        
        console.log('🎯 Abstract patterns set for', imageType, '- [Pattern A, Pattern B, Pattern C, Pattern D]:', inputValues);
        console.log('🎯 Pattern type:', imageType.startsWith('dog') ? 'DOG (HIGH-HIGH-LOW-LOW variants)' : 'NON-DOG (alternating patterns)');
        
        return { inputValues, trueLabel };
    }

    /**
     * Create image on canvas
     * Extracted from script.js createImage()
     */
    createImage(imageType) {
        const canvas = document.getElementById('inputImage');
        if (!canvas) {
            console.error('Canvas element inputImage not found');
            return;
        }
        
        // Optimize canvas for frequent getImageData operations
        const ctx = canvas.getContext('2d', CANVAS_CONFIG.CONTEXT_OPTIONS);
        
        // Clear canvas
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
        
        // Draw specific image type
        switch(imageType) {
            case 'dog1':
                this.drawDog1(ctx);
                break;
            case 'dog2':
                this.drawDog2(ctx);
                break;
            case 'dog3':
                this.drawDog3(ctx);
                break;
            case 'cat':
                this.drawCat(ctx);
                break;
            case 'car':
                this.drawCar(ctx);
                break;
            case 'bird':
                this.drawBird(ctx);
                break;
            case 'fish':
                this.drawFish(ctx);
                break;
            case 'tree':
                this.drawTree(ctx);
                break;
            default:
                console.error('Unknown image type:', imageType);
        }
    }

    /**
     * Get image color for UI styling
     */
    getImageColor(imageType) {
        const colors = {
            'dog1': '#8B4513',
            'dog2': '#D2B48C', 
            'dog3': '#654321',
            'cat': '#808080',
            'bird': '#87CEEB',
            'fish': '#4682B4',
            'car': '#FF4500',
            'tree': '#228B22'
        };
        return colors[imageType] || '#666666';
    }

    /**
     * Get image emoji for UI display
     */
    getImageEmoji(imageType) {
        const emojis = {
            'dog1': '🐕',
            'dog2': '🐶', 
            'dog3': '🦮',
            'cat': '🐱',
            'bird': '🐦',
            'fish': '🐟',
            'car': '🚗',
            'tree': '🌳'
        };
        return emojis[imageType] || '❓';
    }

    // ============================================================================
    // DRAWING FUNCTIONS - Individual image creators
    // ============================================================================

    /**
     * Draw Dog 1 - Classic sitting dog silhouette
     */
    drawDog1(ctx) {
        ctx.fillStyle = '#8B4513';
        
        // Head (circle)
        ctx.beginPath();
        ctx.arc(70, 45, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears (triangles)
        ctx.beginPath();
        ctx.moveTo(50, 35);
        ctx.lineTo(60, 20);
        ctx.lineTo(65, 40);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(90, 35);
        ctx.lineTo(80, 20);
        ctx.lineTo(75, 40);
        ctx.fill();
        
        // Body (oval)
        ctx.beginPath();
        ctx.ellipse(70, 85, 30, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (rectangles)
        ctx.fillRect(50, 115, 8, 25);
        ctx.fillRect(65, 115, 8, 25);
        ctx.fillRect(77, 115, 8, 25);
        ctx.fillRect(92, 115, 8, 25);
        
        // Tail (curved)
        ctx.beginPath();
        ctx.arc(95, 75, 15, 0, Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#8B4513';
        ctx.stroke();
        
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(63, 40, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(77, 40, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.beginPath();
        ctx.arc(70, 50, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw Dog 2 - Playful dog with different pose
     */
    drawDog2(ctx) {
        ctx.fillStyle = '#D2B48C';
        
        // Head (slightly oval)
        ctx.beginPath();
        ctx.ellipse(70, 50, 22, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Floppy ears
        ctx.beginPath();
        ctx.ellipse(55, 45, 12, 20, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(85, 45, 12, 20, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Body (larger, rounder)
        ctx.beginPath();
        ctx.ellipse(70, 95, 35, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (thicker)
        ctx.fillRect(45, 115, 12, 25);
        ctx.fillRect(63, 115, 12, 25);
        ctx.fillRect(77, 115, 12, 25);
        ctx.fillRect(95, 115, 12, 25);
        
        // Wagging tail (more curved)
        ctx.beginPath();
        ctx.arc(100, 80, 18, -Math.PI/3, Math.PI/2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = '#D2B48C';
        ctx.stroke();
        
        // Eyes (larger, friendlier)
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(62, 45, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(78, 45, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose (pink)
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.arc(70, 55, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Tongue
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.ellipse(70, 62, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw Dog 3 - Alert standing dog
     */
    drawDog3(ctx) {
        ctx.fillStyle = '#654321';
        
        // Head (more angular)
        ctx.beginPath();
        ctx.ellipse(70, 40, 20, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pointed ears (alert)
        ctx.beginPath();
        ctx.moveTo(55, 25);
        ctx.lineTo(60, 10);
        ctx.lineTo(68, 30);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(85, 25);
        ctx.lineTo(80, 10);
        ctx.lineTo(72, 30);
        ctx.fill();
        
        // Neck
        ctx.fillRect(63, 55, 14, 15);
        
        // Body (more rectangular, standing)
        ctx.beginPath();
        ctx.ellipse(70, 90, 28, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (straighter, alert stance)
        ctx.fillRect(50, 110, 10, 30);
        ctx.fillRect(66, 110, 10, 30);
        ctx.fillRect(76, 110, 10, 30);
        ctx.fillRect(90, 110, 10, 30);
        
        // Upright tail
        ctx.beginPath();
        ctx.moveTo(95, 75);
        ctx.lineTo(105, 50);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#654321';
        ctx.stroke();
        
        // Alert eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(64, 38, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(76, 38, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.beginPath();
        ctx.arc(70, 48, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw Cat - Sitting cat silhouette
     */
    drawCat(ctx) {
        ctx.fillStyle = '#808080';
        
        // Head (rounder than dog)
        ctx.beginPath();
        ctx.arc(70, 45, 23, 0, Math.PI * 2);
        ctx.fill();
        
        // Pointed ears
        ctx.beginPath();
        ctx.moveTo(52, 30);
        ctx.lineTo(58, 15);
        ctx.lineTo(65, 32);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(88, 30);
        ctx.lineTo(82, 15);
        ctx.lineTo(75, 32);
        ctx.fill();
        
        // Body (more compact, cat-like sitting)
        ctx.beginPath();
        ctx.ellipse(70, 85, 25, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Front legs (only two visible when sitting)
        ctx.fillRect(55, 110, 8, 20);
        ctx.fillRect(77, 110, 8, 20);
        
        // Long curved tail
        ctx.beginPath();
        ctx.arc(45, 90, 25, -Math.PI/6, Math.PI/2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#808080';
        ctx.stroke();
        
        // Cat eyes (more almond-shaped)
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.ellipse(64, 42, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(76, 42, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(64, 42, 1, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(76, 42, 1, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose (pink triangle)
        ctx.fillStyle = '#FFB6C1';
        ctx.beginPath();
        ctx.moveTo(70, 50);
        ctx.lineTo(67, 47);
        ctx.lineTo(73, 47);
        ctx.fill();
        
        // Whiskers
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Left whiskers
        ctx.moveTo(45, 48);
        ctx.lineTo(65, 50);
        ctx.moveTo(45, 52);
        ctx.lineTo(65, 52);
        // Right whiskers
        ctx.moveTo(75, 50);
        ctx.lineTo(95, 48);
        ctx.moveTo(75, 52);
        ctx.lineTo(95, 52);
        ctx.stroke();
    }

    /**
     * Draw Car - Simple car silhouette
     */
    drawCar(ctx) {
        ctx.fillStyle = '#FF4500';
        
        // Main body
        ctx.fillRect(30, 80, 80, 30);
        
        // Hood/front
        ctx.fillRect(20, 85, 15, 20);
        
        // Roof
        ctx.fillRect(45, 60, 50, 20);
        
        // Wheels
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(45, 115, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 115, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Wheel rims
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.arc(45, 115, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 115, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(48, 63, 20, 15);
        ctx.fillRect(72, 63, 20, 15);
        
        // Headlights
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(22, 92, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(22, 102, 4, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Draw Bird - Flying bird silhouette
     */
    drawBird(ctx) {
        ctx.fillStyle = '#87CEEB';
        
        // Body (oval)
        ctx.beginPath();
        ctx.ellipse(70, 70, 15, 25, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.beginPath();
        ctx.arc(70, 45, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings (spread for flying)
        ctx.beginPath();
        ctx.ellipse(45, 65, 20, 8, -0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(95, 65, 20, 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail feathers
        ctx.beginPath();
        ctx.ellipse(70, 95, 8, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(70, 40);
        ctx.lineTo(75, 35);
        ctx.lineTo(70, 38);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(73, 43, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(67, 85);
        ctx.lineTo(65, 95);
        ctx.moveTo(73, 85);
        ctx.lineTo(75, 95);
        ctx.stroke();
    }

    /**
     * Draw Fish - Side view fish
     */
    drawFish(ctx) {
        ctx.fillStyle = '#4682B4';
        
        // Body (oval)
        ctx.beginPath();
        ctx.ellipse(70, 70, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail fin
        ctx.beginPath();
        ctx.moveTo(40, 70);
        ctx.lineTo(25, 55);
        ctx.lineTo(25, 85);
        ctx.fill();
        
        // Top fin
        ctx.beginPath();
        ctx.ellipse(70, 45, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom fin
        ctx.beginPath();
        ctx.ellipse(75, 85, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(85, 65, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(87, 65, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Gills
        ctx.strokeStyle = '#20426b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(90, 70, 8, Math.PI, 0);
        ctx.stroke();
        
        // Scales pattern
        ctx.strokeStyle = '#20426b';
        ctx.lineWidth = 1;
        for (let x = 60; x < 95; x += 8) {
            for (let y = 60; y < 80; y += 6) {
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    /**
     * Draw Tree - Simple tree silhouette
     */
    drawTree(ctx) {
        // Trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(62, 85, 16, 40);
        
        // Foliage (multiple circles for full look)
        ctx.fillStyle = '#228B22';
        
        // Bottom layer
        ctx.beginPath();
        ctx.arc(70, 85, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle layer
        ctx.beginPath();
        ctx.arc(70, 70, 22, 0, Math.PI * 2);
        ctx.fill();
        
        // Top layer
        ctx.beginPath();
        ctx.arc(70, 55, 18, 0, Math.PI * 2);
        ctx.fill();
        
        // Additional foliage clusters for fullness
        ctx.beginPath();
        ctx.arc(55, 75, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(85, 75, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Trunk texture lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(65, 90);
        ctx.lineTo(75, 90);
        ctx.moveTo(65, 100);
        ctx.lineTo(75, 100);
        ctx.moveTo(65, 110);
        ctx.lineTo(75, 110);
        ctx.stroke();
    }
}

// ============================================================================
// GLOBAL INSTANCE AND LEGACY BRIDGE SUPPORT
// ============================================================================

// Create global instance for use by legacy code
export const globalImageGenerator = new ImageGenerator();

// Legacy function bridges for backward compatibility
export function setVisualFeaturesAndLabel(imageType) {
    // Access global variables through window for legacy compatibility
    const preventAutoLabeling = typeof window !== 'undefined' ? window.preventAutoLabeling : false;
    const activations = typeof window !== 'undefined' ? window.activations : null;
    return globalImageGenerator.setVisualFeaturesAndLabel(imageType, preventAutoLabeling, activations);
}

export function createImage(imageType) {
    return globalImageGenerator.createImage(imageType);
}

export function getImageColor(imageType) {
    return globalImageGenerator.getImageColor(imageType);
}

export function getImageEmoji(imageType) {
    return globalImageGenerator.getImageEmoji(imageType);
}

// ============================================================================
// MODULE INITIALIZATION
// ============================================================================

console.log('📦 Image Generator module loaded');