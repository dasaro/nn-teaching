#!/usr/bin/env python3
"""
Create the remaining consolidated modules
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

# Get all remaining functions not yet processed
processed_functions = []
with open('create_consolidated_modules.py', 'r') as f:
    content = f.read()
    # Extract function names from the first script
    import ast
    tree = ast.parse(content)
    # This is a simplified approach - let's manually list what we processed
    
processed = {
    'sigmoid', 'sigmoidDerivative', 'leakyReLU', 'leakyReLUDerivative', 
    'tanhActivation', 'tanhDerivative', 'softmax', 'calculateBinaryAccuracy',
    'calculateDatasetAccuracy', 'calculateFeatureDiversity', 'calculateWeightStats',
    'checkWeightSymmetry', 'forwardPropagationSilent', 'backpropagationSilent',
    'initializeMomentum', 'backpropagationWithMomentum', 'advancedBackpropagation',
    'sleep', 'startDemo', 'startFullDemo', 'resetDemo',
    'animateInputActivation', 'animateForwardPropagation', 'animateOutputComputation', 
    'animateBackpropagation', 'displayResult', 'runForwardPass', 'runBackwardPass',
    'highlightSection',
    'drawNetwork', 'drawConnections', 'drawNeurons', 'drawLabels', 'drawPrediction',
    'updatePrediction', 'updateNeuronColors', 'getActivationColor',
    'highlightSubNetwork', 'clearSubNetworkHighlights', 'createFlowingDots',
    'applyWeightVisualization', 'addWeightTooltip', 'getCurrentWeightForConnection',
    'refreshAllConnectionVisuals', 'updateConnectionAppearance', 'updateConnectionTooltip',
    'toggleExpertPanel', 'openExpertPanel', 'closeExpertPanel', 'initializeExpertPanelUI',
    'updateExpertConfig', 'resetExpertDefaults', 'applyExpertConfig', 'toggleExpertViewMode',
    'updateStepInfoDual', 'startMessageLog', 'stopMessageLog', 'displayMessageLog',
    'formatMatrix', 'formatOperation', 'clearMessageLog', 'toggleAutoScroll', 'scrollToBottom',
    'startTutorial', 'showTutorialStep', 'nextTutorialStep', 'skipTutorial', 'completeTutorial'
}

# Get all function files
all_files = [f for f in os.listdir('src/functions/') if f.endswith('.js')]
all_functions = [f.replace('.js', '') for f in all_files]
remaining = set(all_functions) - processed

print(f"Remaining functions to group: {len(remaining)}")

# Group remaining functions
remaining_modules = {
    'training-engine.js': {
        'description': 'Machine learning training and optimization functions',
        'functions': [f for f in remaining if any(x in f.lower() for x in 
                     ['training', 'learning', 'convergence', 'momentum', 'test', 'accuracy', 'optimal', 'stagnation', 'boost'])]
    },
    
    'image-processor.js': {
        'description': 'Image processing and rendering functions',
        'functions': [f for f in remaining if any(x in f.lower() for x in 
                     ['image', 'pixel', 'dog', 'cat', 'car', 'bird', 'fish', 'tree', 'visual', 'draw', 'color', 'hover', 'click'])]
    },
    
    'utilities.js': {
        'description': 'Utility functions and helpers',
        'functions': [f for f in remaining if f not in 
                     [func for module in [remaining_modules['training-engine.js'], remaining_modules['image-processor.js']] 
                      for func in module['functions']]]
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
    # Create remaining consolidated modules
    total_functions = 0
    
    for module_name, module_info in remaining_modules.items():
        exported_functions = create_module_file(module_name, module_info)
        total_functions += len(exported_functions)
    
    print(f"📊 ADDITIONAL MODULES SUMMARY:")
    print(f"✅ Created {len(remaining_modules)} additional modules")
    print(f"✅ Additional functions consolidated: {total_functions}")

if __name__ == '__main__':
    main()