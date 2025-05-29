
#!/bin/bash

echo "Storm Platform Backend Startup Script"
echo "====================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Starting Node.js backend server..."

# Navigate to backend directory
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start the server
echo "Starting server on port 5000..."
echo "Backend will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo ""

# Set environment variables and start server
export NODE_ENV=development
export PORT=5000
node server.js
