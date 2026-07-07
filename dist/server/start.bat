@echo off
REM IFEX Application Startup Script for Windows
REM This script automatically starts the server and opens the frontend in browser

echo ============================================
echo IFEX - Starting Application
echo ============================================

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting IFEX Server...
echo.

REM Set production environment
set NODE_ENV=production

REM Start the server
node server-combined.js

pause
