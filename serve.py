#!/usr/bin/env python3
"""
Simple HTTP server for the Neural Network Visualization App.
Run this to serve the app locally and avoid CORS issues with images.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Set the port  
PORT = 9000

# Change to the script's directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create the server
Handler = http.server.SimpleHTTPServer if sys.version_info < (3, 0) else http.server.SimpleHTTPRequestHandler

class CustomHandler(Handler):
    def end_headers(self):
        # Add CORS headers to allow local file access
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

try:
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"🚀 Neural Network App server starting...")
        print(f"📡 Server running at: http://localhost:{PORT}")
        print(f"🧠 Open this URL in your browser: http://localhost:{PORT}/index.html")
        print(f"🔧 Images will load properly via HTTP protocol")
        print(f"⚡ Press Ctrl+C to stop the server\n")
        
        # Try to open in browser automatically
        try:
            webbrowser.open(f'http://localhost:{PORT}/index.html')
            print("🌐 Browser should open automatically...")
        except:
            print("📝 Please manually open the URL above in your browser")
        
        # Start serving
        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\n👋 Server stopped by user")
except OSError as e:
    if e.errno == 48:  # Address already in use
        print(f"❌ Port {PORT} is already in use. Try a different port or stop the existing server.")
    else:
        print(f"❌ Error starting server: {e}")
except Exception as e:
    print(f"❌ Unexpected error: {e}")