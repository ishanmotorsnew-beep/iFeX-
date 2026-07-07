#!/bin/bash

# IFEX Application Startup Script for Linux/Mac
# This script automatically starts the server

echo "============================================"
echo "IFEX - Starting Application"
echo "============================================"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Display Node version
echo "Node.js version: $(node --version)"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "Starting IFEX Server..."
echo ""

# Set production environment
export NODE_ENV=production

# Start the server
node server-combined.js
