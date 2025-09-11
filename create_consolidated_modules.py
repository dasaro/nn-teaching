#!/usr/bin/env python3
"""
Create consolidated modules by grouping related functions
"""

import os
import re

def read_function_file(filename):
    """Read a function file and return the function content and name."""
    path = f'src/functions/{filename}'
    with open(path, 'r') as f:
        content = f.read()
    
    # Extract function name from filename
    func_name = filename.replace('.js', '')
    
    # Extract just the function body (without the window export)
    lines = content.split('\n')
    func_lines = []
    for line in lines:
        if line.startswith('if (typeof window'):
            break
        func_lines.append(line)
    
    func_body = '\n'.join(func_lines).strip()
    return func_name, func_body

# Define consolidated modules
modules = {
    'neural-math.js': {
        'description': 'Neural network mathematical functions and utilities',
        'functions': [
            'sigmoid', 'sigmoidDerivative', 'leakyReLU', 'leakyReLUDerivative', 
            'tanhActivation', 'tanhDerivative', 'softmax', 'calculateBinaryAccuracy',
            'calculateDatasetAccuracy', 'calculateFeatureDiversity', 'calculateWeightStats',
            'checkWeightSymmetry', 'forwardPropagationSilent', 'backpropagationSilent',
            'initializeMomentum', 'backpropagationWithMomentum', 'advancedBackpropagation'
        ]
    },
    
    'animation-engine.js': {
        'description': 'Animation and demo coordination functions',
        'functions': [
            'sleep', 'startDemo', 'startFullDemo', 'resetDemo',
            'animateInputActivation', 'animateForwardPropagation', 'animateOutputComputation', 
            'animateBackpropagation', 'displayResult', 'runForwardPass', 'runBackwardPass',
            'highlightSection'
        ]
    },
    
    'network-visualizer.js': {
        'description': 'Network visualization and drawing functions', 
        'functions': [
            'drawNetwork', 'drawConnections', 'drawNeurons', 'drawLabels', 'drawPrediction',
            'updatePrediction', 'updateNeuronColors', 'getActivationColor',
            'highlightSubNetwork', 'clearSubNetworkHighlights', 'createFlowingDots',
            'applyWeightVisualization', 'addWeightTooltip', 'getCurrentWeightForConnection',
            'refreshAllConnectionVisuals', 'updateConnectionAppearance', 'updateConnectionTooltip'
        ]
    },
    
    'ui-controls.js': {
        'description': 'User interface controls and panels',
        'functions': [
            'toggleExpertPanel', 'openExpertPanel', 'closeExpertPanel', 'initializeExpertPanelUI',
            'updateExpertConfig', 'resetExpertDefaults', 'applyExpertConfig', 'toggleExpertViewMode',
            'updateStepInfoDual', 'startMessageLog', 'stopMessageLog', 'displayMessageLog',
            'formatMatrix', 'formatOperation', 'clearMessageLog', 'toggleAutoScroll', 'scrollToBottom',
            'startTutorial', 'showTutorialStep', 'nextTutorialStep', 'skipTutorial', 'completeTutorial'
        ]
    }
}

def create_module_file(module_name, module_info):
    """Create a consolidated module file."""
    print(f"Creating {module_name}...")
    
    content = f"""// ============================================================================
// {module_name.upper().replace('.JS', '')} MODULE
// {module_info['description']}
// ============================================================================

"""
    
    exports = []
    
    for func_name in module_info['functions']:
        filename = f'{func_name}.js'
        if os.path.exists(f'src/functions/{filename}'):
            try:
                name, body = read_function_file(filename)
                content += f"{body}\n\n"
                exports.append(func_name)
                print(f"  ✅ Added {func_name}")
            except Exception as e:
                print(f"  ❌ Error processing {func_name}: {e}")
        else:
            print(f"  ⚠️  File not found: {filename}")
    
    # Add window exports at the end
    content += f"// ============================================================================\n"
    content += f"// EXPORTS\n"
    content += f"// ============================================================================\n\n"
    
    for func_name in exports:
        content += f"if (typeof window !== 'undefined') window.{func_name} = {func_name};\n"
    
    # Write the module file
    with open(f'src/{module_name}', 'w') as f:
        f.write(content)
    
    print(f"✅ Created {module_name} with {len(exports)} functions\n")
    return exports

def main():
    # Create consolidated modules
    total_functions = 0
    
    for module_name, module_info in modules.items():
        exported_functions = create_module_file(module_name, module_info)
        total_functions += len(exported_functions)
    
    print(f"📊 SUMMARY:")
    print(f"✅ Created {len(modules)} consolidated modules")
    print(f"✅ Total functions consolidated: {total_functions}")
    print(f"✅ Reduction: 166 → {len(modules)} files ({((166-len(modules))/166)*100:.1f}% reduction)")

if __name__ == '__main__':
    main()