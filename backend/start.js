
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Storm Platform Backend...\n');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found in backend directory');
    process.exit(1);
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies...');
    const installProcess = spawn('npm', ['install'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });
    
    installProcess.on('close', (code) => {
        if (code === 0) {
            console.log('✅ Dependencies installed successfully');
            startServer();
        } else {
            console.error('❌ Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🌟 Starting backend server...');
    console.log('📍 Server will be available at: http://localhost:5000');
    console.log('🔗 Health check: http://localhost:5000/health');
    console.log('📊 API endpoints: http://localhost:5000/pricing/tiers');
    console.log('⏹️  Press Ctrl+C to stop the server\n');
    
    // Set environment variables
    process.env.NODE_ENV = 'development';
    process.env.PORT = '5000';
    
    // Start the server
    const serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });
    
    serverProcess.on('close', (code) => {
        console.log(`\n🛑 Server stopped with code ${code}`);
    });
    
    serverProcess.on('error', (err) => {
        console.error('❌ Failed to start server:', err);
    });
}
