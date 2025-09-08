# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Application Overview

This is a neural network visualization app designed for educational purposes. It demonstrates how a neural network processes an image (specifically a dog image) through forward propagation, classification, and backpropagation using interactive animations.

## Running the Application

Simply open `index.html` in any modern web browser. No build process, dependencies, or server setup required.

## Architecture

The application consists of three main files:

- **`index.html`**: Main structure with sections for image input, neural network visualization, results, and controls
- **`script.js`**: Core application logic handling network simulation and animations
- **`style.css`**: Visual styling and animation definitions

### Key Components in script.js

**Network Configuration**: Fixed 3-layer architecture (64 input → 8 hidden → 2 output neurons)

**Core Data Structures**:
- `networkConfig`: Defines layer sizes
- `weights`: Stores connection weights between layers
- `activations`: Holds neuron activation values

**Main Functions**:
- `initializeNetwork()`: Sets up DOM structure and initializes random weights
- `createDogImage()`: Generates programmatic 8x8 dog image on canvas
- `startDemo()`: Orchestrates the full animation sequence
- `animateForwardPropagation()`: Shows data flow from input through hidden to output layers
- `animateBackpropagation()`: Simulates weight updates with visual feedback

### Animation System

The app uses a step-by-step animation system controlled by:
- `animationSpeed`: User-controllable speed (1-10 scale)
- `sleep()` function: Creates delays proportional to animation speed
- CSS classes for visual states: `.active`, `.flowing`, `.backprop-animation`

### DOM Structure

The visualization area is divided into three sections:
1. **Input section**: Canvas image + 8x8 pixel grid showing normalized values
2. **Network section**: Three layers with connecting lines showing weights
3. **Result section**: Classification probabilities and final prediction

## Key Features

**Educational Focus**: Simplified neural network representation prioritizing visual clarity over mathematical accuracy

**Interactive Controls**: Start/reset buttons and speed slider for user control

**Progressive Animation**: Five distinct phases showing input loading, forward propagation, classification, result display, and backpropagation

**Visual Feedback**: Neurons change color/size when active, connections animate data flow, weights display current values and updates

## Customization Points

To modify the network architecture, update `networkConfig` object and corresponding DOM creation functions. The pixel grid size and image generation logic in `createDogImage()` may need adjustment for different input dimensions.

Animation timing can be modified through the `sleep()` function and CSS animation durations in `style.css`.