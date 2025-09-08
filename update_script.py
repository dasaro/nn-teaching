#!/usr/bin/env python3
"""
Update script.js to use base64 embedded images
"""

import re

def update_script_js():
    # Read the base64 images
    with open('base64_images.js', 'r') as f:
        base64_content = f.read()
    
    # Read the original script.js
    with open('script.js', 'r') as f:
        script_content = f.read()
    
    # Find and replace the imageUrls object
    # Look for the pattern: const imageUrls = { ... };
    pattern = r'// Local image URLs.*?\nconst imageUrls = \{[^}]*\};'
    replacement = base64_content.strip()
    
    # Replace the imageUrls object
    new_script_content = re.sub(pattern, replacement, script_content, flags=re.DOTALL)
    
    # Write back to script.js
    with open('script.js', 'w') as f:
        f.write(new_script_content)
    
    print("✅ Updated script.js with base64 embedded images")
    print("🎯 Images will now work with file:// protocol (no server needed)")
    print("📦 App is now completely self-contained")

if __name__ == '__main__':
    update_script_js()