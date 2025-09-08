#!/usr/bin/env python3
"""
Generate base64 data URIs for images to embed directly in JavaScript.
This solves CORS issues when opening the HTML file directly.
"""

import os
import base64

def generate_base64_images():
    image_files = {
        'dog1': 'images/dog1.jpg',
        'dog2': 'images/dog2.jpg', 
        'dog3': 'images/dog3.jpg',
        'cat': 'images/cat.jpg',
        'bird': 'images/bird.jpg',
        'fish': 'images/fish.jpg',
        'car': 'images/car.jpg',
        'tree': 'images/tree.jpg'
    }
    
    js_code = "// Base64 embedded images - works with file:// protocol\nconst imageUrls = {\n"
    
    for key, filepath in image_files.items():
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                img_data = f.read()
                b64_data = base64.b64encode(img_data).decode('utf-8')
                data_uri = f'data:image/jpeg;base64,{b64_data}'
                js_code += f"    {key}: '{data_uri}',\n"
                print(f"✅ Processed {key}: {len(b64_data)} characters")
        else:
            print(f"❌ File not found: {filepath}")
    
    js_code = js_code.rstrip(',\n') + '\n};\n'
    
    # Write to a separate file
    with open('base64_images.js', 'w') as f:
        f.write(js_code)
    
    print(f"\n📄 Generated base64_images.js with {len(image_files)} images")
    print("🔧 Replace the imageUrls object in script.js with the contents of base64_images.js")
    return js_code

if __name__ == '__main__':
    generate_base64_images()