
@echo off
echo Storm Platform Backend Startup Script
echo =====================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo Starting Node.js backend server...

REM Navigate to backend directory
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

REM Start the server
echo Starting server on port 5000...
echo Backend will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

REM Set environment variables and start server
set NODE_ENV=development
set PORT=5000
node server.js
