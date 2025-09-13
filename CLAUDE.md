# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

This is a neural network visualization app designed for educational purposes. It demonstrates how a neural network processes an image (specifically a dog image) through forward propagation, classification, and backpropagation using interactive animations.

## Running the Application

Simply open `index.html` in any modern web browser. No build process, dependencies, or server setup required.

## Development Guidelines

### Version Control Best Practices
- **ALWAYS push to git before implementing any major changes**
- Use descriptive commit messages that explain the purpose of changes
- Test functionality after each significant modification
- Consider creating feature branches for experimental changes

### Code Quality Standards
- **Maintain clean, modular implementation** - avoid code duplication across modules
- **Keep modules focused** - each module should have a single, well-defined responsibility
- **Create new modules for new features** - don't add unrelated functionality to existing modules
- **Ensure robust error handling** - check for undefined variables and missing functions

## Modular Architecture

The application is now **highly modular** with each module handling specific functionality. When making changes, **ALWAYS modify the correct module** based on the functionality being addressed:

### Core Application Files
- **`index.html`**: Main HTML structure and UI layout
- **`script.js`**: Legacy monolithic file (being phased out)
- **`style.css`**: All CSS styling and animations

### Modular JavaScript Architecture (`src/` directory)

#### **`src/bootstrap.js`**
**Purpose**: Application initialization and startup sequence
**Responsibilities**:
- Initialize network configuration
- Set up DOM event listeners
- Bootstrap the application on page load
**Modify when**: Changing startup behavior, initialization sequence, or adding new global event listeners

#### **`src/globals-and-config.js`**
**Purpose**: Global variables, constants, and network architecture management
**Responsibilities**:
- Define variable network architecture (0-3 hidden layers, max 8 neurons each)
- Store global state variables and configuration
- Manage network structure initialization and validation
- Provide backward compatibility for legacy architecture patterns
**Modify when**: Adding new global variables, changing network constraints, or updating architecture validation
**Architecture Support**: Now supports flexible architectures from direct input→output to complex 3-layer networks

#### **`src/network-visualizer.js`**
**Purpose**: DOM creation and visual representation of the neural network
**Responsibilities**:
- Generate neuron and connection DOM elements
- Create SVG network visualization
- Handle network layout and positioning
**Modify when**: Changing visual network representation, adding new layer types, or modifying network structure display

#### **`src/animation-engine.js`**
**Purpose**: All animation logic and visual effects
**Responsibilities**:
- Forward propagation animations
- Backpropagation animations
- Neuron activation effects
- Connection flow animations
**Modify when**: Adding new animations, changing timing, or fixing animation sequence issues

#### **`src/neural-math.js`**
**Purpose**: Mathematical computations for variable architecture neural networks
**Responsibilities**:
- Variable layer forward propagation (supports 0-3 hidden layers)
- Dynamic backpropagation for any supported architecture
- Weight initialization using Xavier/Glorot method
- Activation functions (Leaky ReLU, Sigmoid, Softmax)
- NaN protection and gradient clipping
**Modify when**: Adding new activation functions, modifying learning algorithms, or extending architecture support
**Architecture Support**: Handles any configuration from direct input→output to multi-layer networks

#### **`src/image-processor.js`**
**Purpose**: Image handling and processing
**Responsibilities**:
- Load and preprocess images
- Convert images to neural network input format
- Handle image canvas operations
**Modify when**: Adding new image types, changing preprocessing steps, or modifying input format

#### **`src/training-engine.js`**
**Purpose**: Neural network training logic and learning algorithms
**Responsibilities**:
- Training loop management
- Loss calculation
- Weight optimization
- Training state management
**Modify when**: Implementing new training algorithms, changing loss functions, or modifying learning behavior

#### **`src/ui-controls.js`**
**Purpose**: User interface controls and interaction handling
**Responsibilities**:
- Button event handlers
- Form controls
- Speed controls
- User input validation
**Modify when**: Adding new UI controls, changing button behavior, or modifying user interactions

#### **`src/utilities.js`**
**Purpose**: Shared utility functions and helper methods
**Responsibilities**:
- Common helper functions
- DOM manipulation utilities
- State management helpers
- Utility calculations
**Modify when**: Adding reusable functions, creating shared utilities, or implementing common operations

#### **`src/network-api.js`** ⭐ **NEW ABSTRACTION LAYER**
**Purpose**: Clean abstraction layer for network data access
**Responsibilities**:
- Provide stable interfaces for network architecture queries
- Abstract weight and activation access from internal data structures
- Enable safe network operations (forward/backward propagation)
- Validate architecture changes and provide network statistics
**API Methods**:
- `NetworkAPI.getArchitecture()` - Get current network structure
- `NetworkAPI.getWeight(fromLayer, fromIndex, toLayer, toIndex)` - Safe weight access
- `NetworkAPI.setArchitecture(hiddenLayers)` - Change network architecture
- `NetworkAPI.forwardPropagate(input)` - Run forward pass
- `NetworkAPI.backPropagate(target)` - Run backward pass
**Modify when**: Adding new network operations, extending architecture features, or creating new data access patterns

#### **`src/module-interfaces.js`** ⭐ **NEW MODULE SYSTEM**
**Purpose**: Define clean interfaces and contracts for all module types
**Responsibilities**:
- Specify standard interfaces for visualization, animation, and training modules
- Provide dependency injection helpers for clean module architecture
- Offer legacy compatibility layer for gradual migration
- Document expected behavior for each module type
**Module Interfaces**:
- `INetworkReader` - Read-only network access interface
- `INetworkWriter` - Network modification interface  
- `IVisualizationModule` - Standard visualization component interface
- `IAnimationModule` - Animation component interface
- `ITrainingModule` - Training component interface
**Modify when**: Adding new module types, extending interface contracts, or updating module standards

#### **`src/image-data.js`** & **`src/real-image-data.js`**
**Purpose**: CORS-free image loading system with embedded base64 data
**Responsibilities**:
- Provide base64-encoded Creative Commons stock photos
- Generate procedural fallback images with gradients and patterns
- Handle image initialization and module integration
- Avoid CORS restrictions with file:// protocol
**Modify when**: Adding new images, updating image processing, or changing fallback generation

#### **`src/neuron-hover.js`** ⭐ **NEW FEATURE**
**Purpose**: Interactive neuron tooltips showing detailed calculation breakdowns
**Responsibilities**:
- Initialize tooltip system and DOM elements
- Add hover event listeners to neuron SVG elements
- Calculate step-by-step mathematical operations for each neuron
- Generate formatted tooltip content with internationalization support
- Handle tooltip positioning and visibility animations
**Key Features**:
- **Input Neurons**: Show direct input values with explanations
- **Hidden Neurons**: Display weighted sum calculations, input×weight products, and activation function results
- **Output Neurons**: Show complete forward propagation chain from inputs through all layers
- **Multi-language Support**: All text uses i18n system (English/Italian)
- **Smart Positioning**: Tooltips automatically adjust to stay within viewport
**Modify when**: Adding new neuron types, changing calculation displays, or updating tooltip styling

#### **`src/activation-visualizer.js`** ⭐ **NEW EDUCATIONAL FEATURE**
**Purpose**: Interactive activation function visualization with biological intuition
**Responsibilities**:
- Create modal interface for activation function exploration
- Generate interactive x/y plots showing function behavior  
- Implement draggable point for real-time input/output exploration
- Provide biological neuron analogies (inhibitory/excitatory inputs)
- Support multiple activation functions (Leaky ReLU, Sigmoid, Tanh, ReLU)
- Animate visual neuron response based on input strength
**Key Educational Features**:
- **Interactive Graphs**: HTML5 canvas with draggable red point showing input→output transformation
- **Biological Connection**: Visual neuron that changes appearance based on input (inhibited/silent/excited)
- **Function Comparison**: Switch between different activation functions to see behavior differences
- **Real-time Values**: Live display of current input/output values with mathematical explanations
- **Mobile Support**: Touch-friendly interface with responsive design
**Biological Intuition**:
- **Negative Inputs**: Inhibitory signals that suppress neuron firing
- **Zero Inputs**: No connection (baseline state)
- **Positive Inputs**: Excitatory signals that promote neuron firing proportional to strength
**Modify when**: Adding new activation functions, updating biological explanations, or enhancing interactivity

## Variable Neural Network Architecture ⭐ **MAJOR UPDATE**

The application now supports **variable neural network architectures** with the following capabilities:

### Supported Architectures
- **0 Hidden Layers**: Direct input→output connection (4→2 neurons)
- **1 Hidden Layer**: Traditional 3-layer network (4→N→2, where N ≤ 8)
- **2 Hidden Layers**: 4-layer network (4→N→M→2, where N,M ≤ 8)
- **3 Hidden Layers**: 5-layer network (4→N→M→L→2, where N,M,L ≤ 8)

### Architecture Constraints
- **Maximum Hidden Layers**: 3 layers
- **Maximum Neurons per Layer**: 8 neurons
- **Input Layer**: Fixed at 4 neurons (A, B, C, D pixel features)
- **Output Layer**: Fixed at 2 neurons (Dog, Not Dog classification)

### Architecture Management API
```javascript
// Get current architecture
const arch = NetworkAPI.getArchitecture();
// Returns: { inputSize: 4, outputSize: 2, hiddenLayers: [4], totalLayers: 2 }

// Change architecture (validates constraints)
NetworkAPI.setArchitecture([6, 3]); // 2 hidden layers: 6 and 3 neurons

// Validate before changing
const validation = NetworkAPI.validateArchitecture([8, 6, 4]);
if (validation.valid) {
    NetworkAPI.setArchitecture([8, 6, 4]); // 3 hidden layers
}

// Reset to default single hidden layer
NetworkAPI.resetToDefault(); // Sets architecture to [4]
```

### Backward Compatibility
- **Legacy Code Support**: Existing `networkConfig.hiddenSize`, `weights.inputToHidden`, and `weights.hiddenToOutput` continue to work
- **UI Compatibility**: Current visualization works with new architecture system
- **Gradual Migration**: Modules can be updated incrementally using the NetworkAPI abstraction layer

### Internal Implementation
- **Weight Storage**: Internal `weights.layers[]` array with automatic compatibility mapping
- **Activation Storage**: Dynamic `activations.hiddenLayers[]` with legacy `activations.hidden` compatibility
- **Forward Propagation**: Variable layer iteration supporting any valid architecture
- **Backpropagation**: Dynamic gradient computation through variable layer structure

## Module Selection Guidelines

When implementing new features or fixing issues:

1. **Architecture Changes**: Use `src/globals-and-config.js` and `src/neural-math.js`
2. **UI Updates for Variable Architecture**: Use `src/network-visualizer.js` with NetworkAPI
3. **Data Access**: Always use `NetworkAPI` instead of direct global variable access
4. **New Module Creation**: Follow interfaces defined in `src/module-interfaces.js`
5. **Testing**: Verify compatibility across all supported architectures (0-3 hidden layers)

## Key Features

**Educational Focus**: Simplified neural network representation prioritizing visual clarity over mathematical accuracy

**Interactive Controls**: Start/reset buttons and speed slider for user control

**Progressive Animation**: Five distinct phases showing input loading, forward propagation, classification, result display, and backpropagation

**Visual Feedback**: Neurons change color when active, connections animate data flow, weights display current values and updates

**Neuron Hover Tooltips**: Interactive calculation details showing step-by-step mathematical operations when hovering over neurons, with full internationalization support (English/Italian)

**Activation Function Visualizer**: Interactive educational tool with x/y plots, draggable input points, and biological neuron analogies to understand how activation functions transform inputs (inhibitory/excitatory/silent responses)

## 🌐 Internationalization Policy ⭐ **CRITICAL REQUIREMENT**

**NEVER HARDCODE TEXT**: Every single piece of user-visible text MUST be internationalized using the i18n system. When adding any new features, UI elements, tooltips, error messages, or content:

1. **Add strings to BOTH language files**:
   - `locales/en.js` - English text (original/reference)
   - `locales/it.js` - Italian translations

2. **Use the translation function**:
   ```javascript
   const t = (key) => window.i18n && window.i18n.t ? window.i18n.t(key) : key;
   const text = t('your.translation.key');
   ```

3. **Structure keys logically**:
   ```javascript
   "feature.title": "Feature Title",
   "feature.description": "Feature description text",
   "feature.button": "Button Text"
   ```

4. **Test in both languages**: Always verify that both English and Italian work correctly

This ensures the application remains fully accessible to both English and Italian users. Breaking internationalization is a critical bug.

## DOM Structure

The visualization area dynamically adapts to the current network architecture:

1. **Input Section**: Canvas image + 4×4 pixel grid showing normalized values (A, B, C, D)
2. **Network Section**: Variable architecture display
   - **Input Layer**: Always 4 neurons (A, B, C, D)
   - **Hidden Layers**: 0-3 dynamic layers, each with 1-8 neurons (H1, H2, H3, etc.)
   - **Output Layer**: Always 2 neurons (Dog, Not Dog)
   - **Connections**: Dynamic weight visualization between all adjacent layers
3. **Result Section**: Classification probabilities and final prediction

### Dynamic Layout
- **0 Hidden Layers**: Input connects directly to output
- **1+ Hidden Layers**: Traditional layered visualization with appropriate spacing
- **Connection Density**: Automatically adjusts for different neuron counts
- **Responsive Design**: Layout scales appropriately for various architectures

## Modular Code Architecture Benefits ⭐ **NEW SYSTEM**

The codebase now follows **proper modular architecture principles**:

### Decoupling and Abstraction
- **No Direct Global Access**: Modules use `NetworkAPI` instead of accessing `weights.*`, `networkConfig.*`, `activations.*` directly
- **Stable Interfaces**: UI modules won't break when internal data structures change
- **Clean Separation**: Logic, visualization, and animation are completely separated
- **Dependency Injection**: Modules receive dependencies rather than reaching for globals

### Module Independence
- **Testable Components**: Each module can be tested in isolation
- **Version Independence**: NetworkAPI provides stable interface across architecture changes
- **Easy Extensions**: New features can be added without modifying existing modules
- **Clear Responsibilities**: Each module has a single, well-defined purpose

### Migration Strategy
- **Gradual Adoption**: Modules can migrate to NetworkAPI incrementally
- **Legacy Compatibility**: Old patterns continue working during transition
- **Non-Breaking Changes**: All existing functionality preserved
- **Future-Proof**: New architecture features won't break existing UI

## Development Workflow

1. **Before major changes**: Always commit current work to git
2. **Use proper interfaces**: Access network data through `NetworkAPI`, never direct globals
3. **Identify target module**: Determine which module(s) need modification based on module responsibilities
4. **Follow module interfaces**: Use appropriate `INetworkReader`/`INetworkWriter` interfaces
5. **Test across architectures**: Verify functionality with 0, 1, 2, and 3 hidden layer configurations
6. **Maintain backward compatibility**: Ensure existing features continue working
7. **MANDATORY TESTING**: Follow comprehensive testing protocol (see below)
8. **Commit changes**: Push to git with descriptive commit message
9. **Document updates**: Update this CLAUDE.md file if architecture or interfaces change

## 🧪 MANDATORY Testing Protocol ⚠️ **CRITICAL**

**WHENEVER you make ANY JavaScript/HTML changes, you MUST follow this testing protocol:**

### Step 1: Immediate Console Check
```bash
# Open the main application
open index.html

# Check browser console (F12) for:
- ❌ Any red errors
- ⚠️ Any yellow warnings
- 📊 Successful module loading messages
```

### Step 2: Create Comprehensive Test
When making significant changes, create a test file that:

```html
<!-- TEMPLATE: Always include ALL required dependencies -->
<script src="locales/en.js"></script>
<script src="locales/it.js"></script>
<script src="i18n.js"></script>
<script src="src/real-image-data.js"></script>
<script src="src/image-data.js"></script>
<script defer src="src/neural-math.js"></script>
<script defer src="src/animation-engine.js"></script>
<script defer src="src/network-visualizer.js"></script>
<script defer src="src/ui-controls.js"></script>
<script defer src="src/training-engine.js"></script>
<script defer src="src/image-processor.js"></script>
<script defer src="src/utilities.js"></script>
<script defer src="src/globals-and-config.js"></script>
<script defer src="src/network-api.js"></script>
<script defer src="src/module-interfaces.js"></script>
<script defer src="src/bootstrap.js"></script>
```

### Step 3: Console Error Capture
```javascript
// ALWAYS include error tracking in tests:
let errorCount = 0;
window.addEventListener('error', function(e) {
    errorCount++;
    console.error(`JavaScript Error: ${e.message} at ${e.filename}:${e.lineno}`);
});

// Override console to capture output
const originalConsole = { log: console.log, error: console.error, warn: console.warn };
console.error = (...args) => {
    // Log to page AND original console
    logToPage(args.join(' '), 'error');
    originalConsole.error(...args);
};
```

### Step 4: Required Function Validation
```javascript
// ALWAYS test these core functions exist:
const requiredFunctions = [
    'NetworkAPI',
    'updateArchitectureDisplay', 
    'updateConnectionEditor',
    't', // Internationalization
    'selectImage',
    'initializeNetwork',
    'forwardPropagationSilent',
    'backpropagationSilent'
];

requiredFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'undefined') {
        console.error(`❌ CRITICAL: Missing function ${funcName}`);
    }
});
```

### Step 5: Architecture Testing
```javascript
// ALWAYS test all supported architectures:
const testArchitectures = [
    { layers: [], name: "No Hidden Layers" },
    { layers: [4], name: "Single Hidden Layer" },
    { layers: [6, 3], name: "Two Hidden Layers" },
    { layers: [8, 6, 4], name: "Three Hidden Layers" }
];

testArchitectures.forEach(test => {
    try {
        NetworkAPI.setArchitecture(test.layers);
        const arch = NetworkAPI.getArchitecture();
        console.log(`✅ ${test.name}: ${arch.inputSize}→[${arch.hiddenLayers.join(',')}]→${arch.outputSize}`);
    } catch (error) {
        console.error(`❌ ${test.name} failed: ${error.message}`);
    }
});
```

### Step 6: Report and Fix Protocol
1. **Test Results Documentation**: Always document what you tested and the results
2. **Console Output Analysis**: Report any errors, warnings, or unexpected output
3. **Error Resolution**: Fix ALL errors before proceeding - never ignore console errors
4. **Human Validation**: When errors occur, ask the human for verification and assistance
5. **Retest After Fixes**: Always retest after making corrections

### Step 7: Testing Checklist
Before declaring changes complete, verify:
- ✅ No JavaScript errors in console
- ✅ No missing function dependencies  
- ✅ All module interfaces work correctly
- ✅ NetworkAPI functions execute without errors
- ✅ All supported architectures (0-3 hidden layers) work
- ✅ Internationalization functions work
- ✅ HTML elements update correctly
- ✅ No broken functionality from changes

### ⚠️ CRITICAL RULE: Never Assume - Always Verify
- **Never assume** tests pass without running them
- **Never assume** the console is clean without checking
- **Never assume** functions exist without testing
- **Always verify** module loading order is correct
- **Always verify** all dependencies are included
- **Always ask for human help** when encountering errors

### 🚫 BROWSER ACCESS POLICY
**IMPORTANT: Do not open HTML pages in browser unless strictly necessary for development**
- Claude cannot read browser console output or see rendered results
- Opening browsers creates false confidence in untested code
- Only open browsers when specifically requested by the user
- When testing is needed, create test files but ask user to run them and report results
- Always request console output from user rather than assuming functionality works

### Code Quality Checklist
- ✅ Uses `NetworkAPI` instead of direct global access
- ✅ Follows appropriate module interface (`IVisualizationModule`, `IAnimationModule`, etc.)
- ✅ Tested with variable architectures (0-3 hidden layers)
- ✅ Maintains backward compatibility
- ✅ Single responsibility principle followed
- ✅ No cross-module dependencies or tight coupling