# Neural Network Visualization App - Setup Instructions

## Quick Start

Due to ES6 module security restrictions, the app now requires a local HTTP server instead of opening the HTML file directly.

### Method 1: Python Server (Recommended)
```bash
# In the app directory, run:
python3 serve.py

# This will automatically:
# - Start a server at http://localhost:8000
# - Open your browser to the app
# - Handle CORS issues with ES6 modules
```

### Method 2: Node.js Server (Alternative)
```bash
# If you have Node.js installed:
npx http-server -p 8000 -c-1 --cors

# Then open: http://localhost:8000
```

### Method 3: Other Simple Servers
```bash
# Python 3 built-in server:
python3 -m http.server 8000

# PHP built-in server:
php -S localhost:8000

# Then open: http://localhost:8000
```

## What Changed

The app was refactored to use modern ES6 modules for better code organization:
- `script.js` is now modular (6066 lines, down from 6500+)
- New specialized modules in `/modules/` and `/config/`
- Better separation of concerns
- All functionality preserved with backward compatibility

## Architecture Overview

```
/config/
  ├── constants.js       # Centralized configuration
  └── legacy-bridge.js   # Backward compatibility layer

/modules/
  ├── neuralNetwork.js      # Neural network engine
  ├── networkAnimator.js    # SVG animation system
  ├── appStateManager.js    # State management
  ├── expertPanel.js        # Expert configuration UI
  ├── messageSystem.js      # Dual-mode messaging
  ├── uiController.js       # UI controls & tutorial
  ├── demoOrchestrator.js   # Main demo flow
  ├── trainingManager.js    # Training algorithms
  └── imageProcessor.js     # Image processing

/utils/
  ├── math.js          # Mathematical functions
  ├── dom.js          # DOM utilities
  └── animation.js    # Animation utilities

script.js              # Main coordination layer (slim)
index.html            # Main application
style.css            # Styling
```

## Troubleshooting

**CORS Errors**: Always use a local HTTP server, never open `index.html` directly.

**Port 8000 in use**: The Python server will tell you if the port is busy. Either stop the other server or change the PORT in `serve.py`.

**Module not found**: Ensure all files are in the correct directory structure as shown above.