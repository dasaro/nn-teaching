#!/usr/bin/env node
/**
 * Simple HTTP server for the Neural Network Visualization App.
 * Alternative to Python server - run with: node serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function serveFile(filePath, response) {
    const extname = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404, { 'Content-Type': 'text/html' });
                response.end('<h1>404 - File Not Found</h1>', 'utf-8');
            } else {
                response.writeHead(500);
                response.end(`Server Error: ${error.code}`);
            }
        } else {
            response.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            response.end(content, 'utf-8');
        }
    });
}

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    serveFile(filePath, response);
});

server.listen(PORT, () => {
    console.log('🚀 Neural Network App server starting...');
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log(`🧠 Open this URL in your browser: http://localhost:${PORT}/index.html`);
    console.log('🔧 Images will load properly via HTTP protocol');
    console.log('⚡ Press Ctrl+C to stop the server\n');
    
    // Try to open in browser
    const { spawn } = require('child_process');
    const url = `http://localhost:${PORT}/index.html`;
    
    switch (process.platform) {
        case 'darwin': // macOS
            spawn('open', [url]);
            break;
        case 'win32': // Windows
            spawn('start', [url], { shell: true });
            break;
        default: // Linux
            spawn('xdg-open', [url]);
    }
    
    console.log('🌐 Browser should open automatically...');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Try a different port or stop the existing server.`);
    } else {
        console.log(`❌ Server error: ${err}`);
    }
});