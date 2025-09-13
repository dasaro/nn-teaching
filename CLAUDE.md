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
**Purpose**: Global variables, constants, and configuration management
**Responsibilities**:
- Define network architecture parameters
- Store global state variables
- Manage application-wide configuration
**Modify when**: Adding new global variables, changing network architecture, or updating configuration parameters

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
**Purpose**: Mathematical computations for neural network operations
**Responsibilities**:
- Forward pass calculations
- Backpropagation computations
- Weight updates and gradients
- Activation functions
**Modify when**: Changing mathematical algorithms, adding new activation functions, or modifying learning mechanisms

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

## Module Selection Guidelines

When implementing new features or fixing issues:

1. **Identify the primary concern**: What aspect of the application does this change affect?
2. **Select the appropriate module**: Use the module descriptions above to determine which file should be modified
3. **Create new modules if needed**: If functionality doesn't fit existing modules, create a new module in the `src/` directory
4. **Avoid cross-module pollution**: Don't add unrelated functionality to existing modules

## Key Features

**Educational Focus**: Simplified neural network representation prioritizing visual clarity over mathematical accuracy

**Interactive Controls**: Start/reset buttons and speed slider for user control

**Progressive Animation**: Five distinct phases showing input loading, forward propagation, classification, result display, and backpropagation

**Visual Feedback**: Neurons change color/size when active, connections animate data flow, weights display current values and updates

## DOM Structure

The visualization area is divided into three sections:
1. **Input section**: Canvas image + 8x8 pixel grid showing normalized values
2. **Network section**: Three layers with connecting lines showing weights
3. **Result section**: Classification probabilities and final prediction

## Development Workflow

1. **Before major changes**: Always commit current work to git
2. **Identify target module**: Determine which module(s) need modification
3. **Implement changes**: Make focused, clean modifications
4. **Test thoroughly**: Verify functionality works as expected
5. **Commit changes**: Push to git with descriptive commit message
6. **Document updates**: Update this CLAUDE.md file if architecture changes