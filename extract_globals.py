#!/usr/bin/env python3
"""
Extract global variables and window assignments from script.js
"""

import re

def main():
    with open('script.js', 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Extract specific sections we need
    global_vars_section = []
    expert_config_section = []
    network_config_section = []
    window_assignments = []
    event_listeners = []
    
    # Key line ranges based on analysis
    # Global variables: lines 60-76, 276-362, 661, 707-733, 794-815, 815-1119, 2243, 3423-3424, 3892-3908
    # Window assignments: lines 115-219, 219-276, 343-362, 672-707, 1789-1836, 2568-2578, 3790-3806
    
    # Extract from line 60 to 76 (basic globals)
    for i in range(59, 77):  # 0-based
        if i < len(lines):
            global_vars_section.append(lines[i])
    
    # Extract expertConfig (line 276 to ~361)
    for i in range(275, 362):
        if i < len(lines):
            expert_config_section.append(lines[i])
    
    # Extract networkConfig and related (line 794 to ~1119)
    for i in range(793, 1119):
        if i < len(lines):
            network_config_section.append(lines[i])
    
    # Extract all window assignments
    for i, line in enumerate(lines):
        if line.strip().startswith('window.') and '=' in line and '{' in line:
            # Multi-line window assignment - extract until matching brace
            window_assignment = [line]
            brace_count = line.count('{') - line.count('}')
            j = i + 1
            while j < len(lines) and brace_count > 0:
                next_line = lines[j]
                window_assignment.append(next_line)
                brace_count += next_line.count('{') - next_line.count('}')
                j += 1
            window_assignments.extend(window_assignment)
        elif line.strip().startswith('window.') and '=' in line:
            # Single line window assignment
            window_assignments.append(line)
    
    # Extract event listeners
    for i, line in enumerate(lines):
        if 'document.addEventListener' in line:
            # Multi-line event listener
            event_listener = [line]
            if '{' in line:
                brace_count = line.count('{') - line.count('}')
                j = i + 1
                while j < len(lines) and brace_count > 0:
                    next_line = lines[j]
                    event_listener.append(next_line)
                    brace_count += next_line.count('{') - next_line.count('}')
                    j += 1
            event_listeners.extend(event_listener)
    
    # Write globals-and-config.js
    with open('src/globals-and-config.js', 'w') as f:
        f.write('// ============================================================================\n')
        f.write('// GLOBAL VARIABLES AND CONFIGURATION\n')
        f.write('// Extracted from script.js - preserving exact content\n')
        f.write('// ============================================================================\n\n')
        
        f.write('// Global state variables\n')
        for line in global_vars_section:
            f.write(line + '\n')
        
        f.write('\n')
        for line in expert_config_section:
            f.write(line + '\n')
        
        f.write('\n')
        for line in network_config_section:
            f.write(line + '\n')
        
        f.write('\n// Window object assignments\n')
        for line in window_assignments:
            f.write(line + '\n')
        
        f.write('\n// Event listeners\n')
        for line in event_listeners:
            f.write(line + '\n')
    
    print(f"✅ Created src/globals-and-config.js")
    print(f"   - Global variables: {len(global_vars_section)} lines")
    print(f"   - Expert config: {len(expert_config_section)} lines") 
    print(f"   - Network config: {len(network_config_section)} lines")
    print(f"   - Window assignments: {len(window_assignments)} lines")
    print(f"   - Event listeners: {len(event_listeners)} lines")

if __name__ == '__main__':
    main()