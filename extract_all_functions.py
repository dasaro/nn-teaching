#!/usr/bin/env python3
"""
Script to extract ALL function declarations from script.js into separate files.
"""

import re
import os
import hashlib

def extract_function_body(content, start_line):
    """Extract complete function body starting from start_line."""
    lines = content.split('\n')
    if start_line >= len(lines):
        return None, None
    
    # Find function start (handle async functions too)
    func_line = lines[start_line]
    if not (func_line.strip().startswith('function ') or func_line.strip().startswith('async function ')):
        return None, None
    
    # Extract function name
    func_match = re.match(r'^\s*(?:async\s+)?function\s+(\w+)', func_line)
    if not func_match:
        return None, None
    
    func_name = func_match.group(1)
    
    # Find function body - count braces
    brace_count = 0
    func_lines = []
    started = False
    
    for i in range(start_line, len(lines)):
        line = lines[i]
        func_lines.append(line)
        
        for char in line:
            if char == '{':
                brace_count += 1
                started = True
            elif char == '}' and started:
                brace_count -= 1
                
        if started and brace_count == 0:
            break
    
    return func_name, '\n'.join(func_lines)

def calculate_checksum(content):
    """Calculate SHA256 checksum of content."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

def main():
    # Read original script.js
    with open('script.js', 'r') as f:
        content = f.read()
    
    # ALL function declarations (regular + async) 
    functions = [
        (83, 't'),
        (150, 'sigmoid'),
        (155, 'sigmoidDerivative'),
        (161, 'leakyReLU'),
        (166, 'leakyReLUDerivative'),
        (171, 'tanhActivation'),
        (176, 'tanhDerivative'),
        (182, 'softmax'),
        (196, 'calculateBinaryAccuracy'),
        (202, 'calculateDatasetAccuracy'),
        (301, 'getActivationFunction'),
        (319, 'getActivationDerivative'),
        (331, 'syncExpertConfigToLegacy'),
        (365, 'toggleExpertPanel'),
        (375, 'openExpertPanel'),
        (385, 'closeExpertPanel'),
        (392, 'initializeExpertPanelUI'),
        (427, 'updateExpertConfig'),
        (456, 'resetExpertDefaults'),
        (474, 'applyExpertConfig'),
        (500, 'toggleExpertViewMode'),
        (525, 'updateStepInfoDual'),
        (546, 'startMessageLog'),
        (557, 'stopMessageLog'),
        (572, 'displayMessageLog'),
        (584, 'formatMatrix'),
        (602, 'formatOperation'),
        (626, 'clearMessageLog'),
        (639, 'toggleAutoScroll'),
        (651, 'scrollToBottom'),
        (744, 'quickAccuracyTest'),
        (837, 'updateDebugConsole'),
        (856, 'displayWeightMatrices'),
        (888, 'displayActivations'),
        (919, 'displayGradients'),
        (949, 'displayPerformanceMetrics'),
        (976, 'updatePerformanceDisplays'),
        (1006, 'setupEventListeners'),
        # SKIP initializeNetwork - goes in bootstrap.js
        (1043, 'debugWeightInitialization'),
        (1083, 'calculateWeightStats'),
        (1099, 'checkWeightSymmetry'),
        (1130, 'setVisualFeaturesAndLabel'),
        (1181, 'createImage'),
        (1253, 'getImageColor'),
        (1262, 'getImageEmoji'),
        (1271, 'drawDog1'),
        (1326, 'drawDog2'),
        (1373, 'drawDog3'),
        (1445, 'drawCat'),
        (1521, 'drawCar'),
        (1563, 'drawBird'),
        (1621, 'drawFish'),
        (1670, 'drawTree'),
        (1703, 'updateInputActivations'),
        (1714, 'selectImage'),
        (1838, 'drawNetwork'),
        (1859, 'drawConnections'),
        (1908, 'drawNeurons'),
        (1948, 'drawLabels'),
        (1965, 'drawPrediction'),
        (2005, 'updatePrediction'),
        (2050, 'highlightSubNetwork'),
        (2108, 'clearSubNetworkHighlights'),
        (2119, 'createFlowingDots'),
        (2213, 'setTrueLabel'),
        (2248, 'runForwardPass'),
        (2383, 'runBackwardPass'),
        (2544, 'startFullDemo'),
        (2589, 'startDemo'),
        (2668, 'animateInputActivation'),
        (2685, 'animateForwardPropagation'),
        (2739, 'animateOutputComputation'),
        (2800, 'displayResult'),
        (2871, 'animateBackpropagation'),
        (3077, 'resetDemo'),
        (3163, 'highlightSection'),
        (3180, 'sleep'),
        (3185, 'updateNeuronColors'),
        (3189, 'getActivationColor'),
        (3220, 'resetWeights'),
        (3273, 'applyWeightVisualization'),
        (3315, 'addWeightTooltip'),
        (3364, 'getCurrentWeightForConnection'),
        (3396, 'refreshAllConnectionVisuals'),
        (3426, 'toggleWeightSliders'),
        (3449, 'showWeightSliders'),
        (3454, 'createWeightEditingPanel'),
        (3518, 'createWeightControl'),
        (3576, 'highlightConnection'),
        (3597, 'updateWeight'),
        (3623, 'updateConnectionTooltip'),
        (3629, 'updateConnectionAppearance'),
        (3640, 'recalculateNetwork'),
        (3680, 'hideWeightSliders'),
        (3692, 'debugFeatureRepresentation'),
        (3719, 'checkValueDuplication'),
        (3725, 'calculateFeatureDiversity'),
        (3740, 'predictActivationPatterns'),
        (3825, 'forwardPropagationSilent'),
        (3921, 'initializeMomentum'),
        (3948, 'backpropagationSilent'),
        (4080, 'debugWeightChanges'),
        (4186, 'enableConvergenceAnalysis'),
        (4198, 'analyzeConvergence'),
        (4229, 'detectConvergenceIssues'),
        (4304, 'checkPredictionDiversity'),
        (4316, 'enableDeepDebugging'),
        (4337, 'updateLastWeights'),
        (4343, 'showWeightChanges'),
        (4371, 'generateSimpleTrainingData'),
        (4431, 'testOptimalLearningSequence'),
        (4508, 'createOptimalLearningSequence'),
        (4548, 'runLearningTest'),
        (4667, 'initializeOptimalWeights'),
        (4688, 'advancedBackpropagation'),
        (4747, 'adaptLearningRate'),
        (4783, 'applyAntiStagnationMeasures'),
        (4807, 'applyConvergenceBoost'),
        (4818, 'startTrainingAnimation'),
        (4833, 'updateTrainingAnimation'),
        (4843, 'stopTrainingAnimation'),
        (4864, 'trainToPerfection'),
        (5044, 'simpleBinaryForward'),
        (5073, 'simpleBinaryBackward'),
        (5101, 'testSimpleBinaryAccuracy'),
        (5112, 'backpropagationWithMomentum'),
        (5157, 'testAccuracy'),
        (5182, 'tuneHyperparameters'),
        (5274, 'quickHyperparamTest'),
        (5374, 'trainWithHyperparams'),
        (5460, 'startTutorial'),
        (5471, 'showTutorialStep'),
        (5485, 'nextTutorialStep'),
        (5495, 'skipTutorial'),
        (5501, 'completeTutorial'),
        (5523, 'skipTutorial'),
        (5531, 'testDeadNeuronPrevention'),
        (5574, 'testGeneralization'),
        (6545, 'debugTraining'),
        (5656, 'testWeightInitialization'),
        (5711, 'runComprehensiveTests'),
        (5757, 'test100PercentAccuracy'),
        (5863, 'testBackAndForthLearning'),
        (5947, 'testSimplifiedNetwork'),
        (6013, 'openPixelViewer'),
        (6026, 'closePixelViewer'),
        (6030, 'drawOriginalImage'),
        (6054, 'addImageHoverEffects'),
        (6076, 'highlightCorrespondingPixel'),
        (6103, 'showImageAreaOverlay'),
        (6125, 'extractPixelValues'),
        (6151, 'drawInteractivePixelGrid'),
        (6212, 'handlePixelClick'),
        (6250, 'handlePixelHover'),
        (6288, 'highlightPixelInGrid'),
        (6308, 'highlightCorrespondingImageArea'),
        (6328, 'updatePixelInfo'),
        (6342, 'clearAllHighlights'),
        (6348, 'drawInputNeuronVisualization'),
        (6379, 'highlightInputNeuron'),
        (6392, 'drawPixelGrid'),
        (6434, 'drawNumberGrid'),
        (6490, 'displayAIInputNumbers'),
        (6632, 'updatePatternValues'),
        (6663, 'highlightPixelRegions'),
        (6715, 'highlightPatternInOriginalImage'),
        (6778, 'clearHighlight'),
        # SKIP initializeModuleExports - goes in bootstrap.js
    ]
    
    checksums = {}
    created_files = []
    errors = []
    
    # Remove t.js since we already created it manually
    if os.path.exists('src/functions/t.js'):
        os.remove('src/functions/t.js')
    
    for line_num, expected_name in functions:
        try:
            # Convert to 0-based line number
            func_name, func_body = extract_function_body(content, line_num - 1)
            
            if not func_name or func_name != expected_name:
                error_msg = f"Expected {expected_name} at line {line_num}, found {func_name}"
                errors.append(error_msg)
                continue
                
            # Calculate original checksum
            original_checksum = calculate_checksum(func_body)
            
            # Create file content with export
            file_content = func_body + '\n\nif (typeof window !== \'undefined\') window.' + func_name + ' = ' + func_name + ';'
            
            # Write file
            file_path = f'src/functions/{func_name}.js'
            with open(file_path, 'w') as f:
                f.write(file_content)
            
            # Verify checksum by reading back just the function body
            with open(file_path, 'r') as f:
                new_content = f.read()
            
            # Extract just the function body (everything before the export line)
            new_func_body = new_content.split('\n\nif (typeof window')[0]
            new_checksum = calculate_checksum(new_func_body)
            
            if original_checksum == new_checksum:
                print(f"✅ {func_name}")
                checksums[func_name] = {'line': line_num, 'original': original_checksum, 'new': new_checksum, 'match': True}
                created_files.append(file_path)
            else:
                error_msg = f"{func_name}: checksum MISMATCH! Orig: {original_checksum}, New: {new_checksum}"
                errors.append(error_msg)
                checksums[func_name] = {'line': line_num, 'original': original_checksum, 'new': new_checksum, 'match': False}
                
        except Exception as e:
            error_msg = f"ERROR processing {expected_name} at line {line_num}: {str(e)}"
            errors.append(error_msg)
    
    print(f"\n📊 SUMMARY:")
    print(f"✅ Functions extracted: {len([c for c in checksums.values() if c['match']])}")
    print(f"❌ Errors: {len(errors)}")
    print(f"📁 Files created: {len(created_files)}")
    
    if errors:
        print(f"\n❌ ERRORS:")
        for error in errors:
            print(f"   {error}")
    
    return checksums, created_files, errors

if __name__ == '__main__':
    main()