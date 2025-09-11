#!/usr/bin/env python3
"""
Create the remaining consolidated modules
"""

import os

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

def create_module_file(module_name, description, function_list):
    """Create a consolidated module file."""
    print(f"Creating {module_name}...")
    
    content = f"""// ============================================================================
// {module_name.upper().replace('.JS', '')} MODULE
// {description}
// ============================================================================

"""
    
    exports = []
    
    for func_name in function_list:
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
    # Get all remaining function files
    all_files = [f for f in os.listdir('src/functions/') if f.endswith('.js')]
    all_functions = [f.replace('.js', '') for f in all_files]
    
    # Functions already processed in first batch
    processed = {
        'sigmoid', 'sigmoidDerivative', 'leakyReLU', 'leakyReLUDerivative', 
        'tanhActivation', 'tanhDerivative', 'softmax', 'calculateBinaryAccuracy',
        'calculateDatasetAccuracy', 'calculateFeatureDiversity', 'calculateWeightStats',
        'checkWeightSymmetry', 'forwardPropagationSilent', 'backpropagationSilent',
        'initializeMomentum', 'backpropagationWithMomentum', 'advancedBackpropagation',
        'sleep', 'startDemo', 'startFullDemo', 'resetDemo',
        'animateInputActivation', 'animateForwardPropagation', 'animateOutputComputation', 
        'animateBackpropagation', 'displayResult', 'runForwardPass', 'runBackwardPass',
        'highlightSection', 'drawNetwork', 'drawConnections', 'drawNeurons', 'drawLabels', 
        'drawPrediction', 'updatePrediction', 'updateNeuronColors', 'getActivationColor',
        'highlightSubNetwork', 'clearSubNetworkHighlights', 'createFlowingDots',
        'applyWeightVisualization', 'addWeightTooltip', 'getCurrentWeightForConnection',
        'refreshAllConnectionVisuals', 'updateConnectionAppearance', 'updateConnectionTooltip',
        'toggleExpertPanel', 'openExpertPanel', 'closeExpertPanel', 'initializeExpertPanelUI',
        'updateExpertConfig', 'resetExpertDefaults', 'applyExpertConfig', 'toggleExpertViewMode',
        'updateStepInfoDual', 'startMessageLog', 'stopMessageLog', 'displayMessageLog',
        'formatMatrix', 'formatOperation', 'clearMessageLog', 'toggleAutoScroll', 
        'scrollToBottom', 'startTutorial', 'showTutorialStep', 'nextTutorialStep', 
        'skipTutorial', 'completeTutorial'
    }
    
    remaining = [f for f in all_functions if f not in processed]
    print(f"Remaining functions to consolidate: {len(remaining)}")
    
    # Training/ML functions
    training_functions = [f for f in remaining if any(x in f.lower() for x in 
                         ['training', 'learning', 'convergence', 'test', 'accuracy', 'optimal', 
                          'stagnation', 'boost', 'momentum', 'hyperparameter', 'tuning',
                          'comprehensive', 'generalization', 'binary', 'simplified'])]
    
    # Image processing functions  
    image_functions = [f for f in remaining if any(x in f.lower() for x in 
                      ['dog', 'cat', 'car', 'bird', 'fish', 'tree', 'image', 'pixel', 
                       'viewer', 'hover', 'click', 'grid', 'pattern', 'color', 'emoji'])]
    
    # Everything else goes to utilities
    utility_functions = [f for f in remaining if f not in training_functions and f not in image_functions]
    
    # Create modules
    total = 0
    total += len(create_module_file('training-engine.js', 
                                   'Machine learning training and optimization functions', 
                                   training_functions))
    
    total += len(create_module_file('image-processor.js', 
                                   'Image processing and rendering functions', 
                                   image_functions))
    
    total += len(create_module_file('utilities.js', 
                                   'Utility functions and helpers', 
                                   utility_functions))
    
    print(f"📊 FINAL SUMMARY:")
    print(f"✅ Consolidated {total} additional functions into 3 modules")
    print(f"📁 Total module files created: 7 (from original 166 individual files)")

if __name__ == '__main__':
    main()