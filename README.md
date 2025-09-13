# Neural Network Visualization App 🧠

An educational neural network visualization tool that demonstrates how AI learns to classify images through forward propagation and backpropagation.

## 🌟 **[▶️ RUN DIRECTLY IN BROWSER](https://dasaro.github.io/nn-teaching/)** 

Click the link above to instantly run the app - no download or setup required!

## 🖥️ Interface Overview

```
┌─────────────────────────────────────────────────────────────┐
│  🐶 Image Selection        📊 Neural Network         🎯 AI  │
│  ┌─────────┐              ┌─────────────────┐      ┌─────┐   │
│  │  🐕 Dog │              │ Input → Hidden  │      │ 🐕  │   │
│  │ 🐱 Cat  │   →  🧠  →   │   ↓      ↓      │  →   │72.3%│   │
│  │ 🚗 Car  │              │ Hidden → Output │      │ RED │   │
│  │ 🌳 Tree │              │                 │      └─────┘   │
│  └─────────┘              └─────────────────┘               │
│                                                             │
│  📚 [Learn] 🔄 [Reset]  Speed: ━━━●━━━                    │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Left**: Click images to test different objects  
- **Center**: Watch neurons activate and connections light up
- **Right**: See AI prediction with confidence percentage
- **Bottom**: Control learning and animation speed

## ✨ Features

- **🎓 Dual-Mode Learning**: Student view (simple explanations) + Expert view (detailed mathematical operations)
- **🔬 Expert Panel**: Configure activation functions, learning rates, momentum, regularization
- **⚙️ What If? Mode**: Interactive weight sliders to explore parameter effects
- **🧠 Visual Learning**: Watch the neural network learn in real-time with animated weight updates
- **📊 Mathematical Displays**: See actual matrix operations, equations, and computation times
- **🎮 Pedagogical Design**: Simplified 4-neuron network optimized for educational purposes
- **🌐 Offline Ready**: All images embedded locally - no internet connection required
- **🔧 Weight Visualization**: Dynamic red-gray-green color scheme based on connection strength

## 🚀 Quick Start

### Option 1: Run Online (Recommended)
**[Click here to run instantly](https://dasaro.github.io/nn-teaching/)** - No download needed!

### Option 2: Run Locally  
1. **Clone/Download**: Download this repository
2. **Open**: Simply open `index.html` in any modern web browser
3. **No setup required**: No dependencies, build process, or server needed

## 📁 File Structure

```
NN-visualization-app/
├── index.html          # Main application
├── style.css           # Visual styling
├── i18n.js             # Language support (English/Italian)
├── locales/
│   ├── en.js           # English text
│   └── it.js           # Italian text
├── src/                # Application modules
│   ├── bootstrap.js
│   ├── network-visualizer.js
│   ├── animation-engine.js
│   ├── neural-math.js
│   ├── ui-controls.js
│   └── ... (other modules)
└── README.md
```

## 🧑‍🏫 How It Works

**Simple Concept**: The AI learns to recognize dogs by looking at different features:
- **Size**: How big is the object?
- **Friendliness**: Does it seem friendly?
- **Barking**: Does it make barking sounds?
- **Domestication**: Is it a house pet?

The neural network processes these features and learns patterns to make predictions with confidence levels.

## 🎯 Perfect for Learning

- **Visual Learning**: Watch the AI "think" in real-time
- **Interactive**: Click different images to test the AI
- **No Setup**: Works instantly in any web browser
- **Bilingual**: Available in English and Italian

---

Built with ❤️ for AI education. No frameworks, no dependencies, just pure JavaScript and educational value!