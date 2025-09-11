#!/usr/bin/env python3
"""
Script to extract all function declarations from script.js into separate files
while preserving exact function bodies and verifying checksums.
"""

import re
import os
import hashlib

def extract_function_body(content, start_line):
    """Extract complete function body starting from start_line."""
    lines = content.split('\n')
    if start_line >= len(lines):
        return None, None
    
    # Find function start
    func_line = lines[start_line]
    if not func_line.strip().startswith('function '):
        return None, None
    
    # Extract function name
    func_match = re.match(r'^\s*function\s+(\w+)', func_line)
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
    
    # Function declarations found from previous analysis
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
        # Skip initializeNetwork - will go in bootstrap.js
        (1043, 'debugWeightInitialization'),
    ]
    
    checksums = {}
    created_files = []
    
    for line_num, expected_name in functions:
        # Convert to 0-based line number
        func_name, func_body = extract_function_body(content, line_num - 1)
        
        if not func_name or func_name != expected_name:
            print(f"❌ ERROR: Expected {expected_name} at line {line_num}, found {func_name}")
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
            print(f"✅ {func_name}: checksum match")
            checksums[func_name] = {'original': original_checksum, 'new': new_checksum, 'match': True}
            created_files.append(file_path)
        else:
            print(f"❌ {func_name}: checksum MISMATCH!")
            print(f"   Original: {original_checksum}")
            print(f"   New:      {new_checksum}")
            checksums[func_name] = {'original': original_checksum, 'new': new_checksum, 'match': False}
    
    print(f"\n📊 Summary: {len([c for c in checksums.values() if c['match']])} functions extracted successfully")
    print(f"📁 Created {len(created_files)} files in src/functions/")
    
    return checksums, created_files

if __name__ == '__main__':
    main()