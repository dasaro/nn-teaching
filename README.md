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
├── script.js           # Neural network logic and animations
├── style.css           # Visual styling
├── images/             # Local image assets (8 images)
│   ├── dog1.jpg
│   ├── dog2.jpg
│   ├── dog3.jpg
│   ├── cat.jpg
│   ├── bird.jpg
│   ├── fish.jpg
│   ├── car.jpg
│   └── tree.jpg
├── test_images.html    # Test page to verify images load
└── README.md           # This file
```

## 🎯 Optimal Learning Sequence

The app includes a carefully designed 4-example learning sequence for optimal pedagogical results:

1. **PrototypeDog**: [0.8, 0.9, 1.0, 0.95] - Large, very friendly, always barks, highly domestic
2. **PrototypeCat**: [0.3, 0.6, 0.05, 0.75] - Small, moderate friendly, rarely barks, somewhat domestic  
3. **FamilyDog**: [0.65, 0.85, 0.9, 0.9] - Medium family dog that barks
4. **Object**: [0.4, 0.05, 0.0, 0.0] - Inanimate object with no biological properties

## 🧪 Testing Functions

Open the browser console and try these functions:

```javascript
// Test the simplified 4-neuron network
testSimplifiedNetwork()

// Test the optimal learning sequence
testOptimalLearningSequence()

// Test back-and-forth learning stability
testBackAndForthLearning()

// Show weight changes after training
showWeightChanges()

// Get the optimal examples
createOptimalLearningSequence()

// Run comprehensive tests
runComprehensiveTests()
```

## 🔧 Network Architecture

- **Input Layer**: 4 neurons (size, friendliness, bark, domestic)
- **Hidden Layer**: 4 neurons with Leaky ReLU activation
- **Output Layer**: 2 neurons (dog probability, non-dog probability)
- **Learning**: Momentum-based SGD with L2 regularization

## 🎨 Key Improvements

- **Dead Neuron Prevention**: Leaky ReLU activation prevents neurons from dying
- **Better Generalization**: Reduced momentum (0.5), conservative learning rate (0.1)
- **Weight Change Visualization**: Shows learning progress with color-coded changes
- **Offline Images**: All images downloaded and embedded locally
- **Stable Learning**: Optimized for educational back-and-forth training

## 📊 Expected Performance

- ✅ **4 neurons achieve 90%+ accuracy** on the optimal sequence
- ✅ **Stable back-and-forth learning** (75%+ retention)
- ✅ **Fast convergence** in 20-30 epochs
- ✅ **No dead neurons** with Leaky ReLU
- ✅ **Clear weight visualization** showing learning progress

## 🌐 Offline Usage

The app is now completely self-contained:
- All images are stored locally in the `images/` directory
- No external API calls or internet dependencies
- Works in any environment without network access
- Perfect for educational settings with limited connectivity

## 🧑‍🏫 Educational Use

This app is designed specifically for teaching neural network concepts:
- Visual weight changes show how learning occurs
- Simple 4-neuron architecture is easy to understand
- Clear separation between dog and non-dog features
- Interactive controls let students explore at their own pace

## 🔍 Troubleshooting

If images don't load:
1. Open `test_images.html` to verify image loading
2. Check that all files in `images/` directory exist
3. Ensure proper file permissions
4. Try refreshing the browser cache

---

## ⚠️ Disclaimer

Since this project was mostly "vibe coded" for educational purposes, it may contain errors or inconsistencies. While the core neural network concepts are sound, some implementation details may not follow strict mathematical precision in favor of visual clarity and pedagogical effectiveness.

---

Built with ❤️ for AI education. No frameworks, no dependencies, just pure JavaScript and educational value!