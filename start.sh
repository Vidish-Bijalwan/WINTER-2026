#!/bin/bash

# TopoForge Startup Script

echo "🚀 Starting TopoForge System..."

# 1. Setup Backend
echo "🐍 Setting up Python Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt

# Start Backend in background
echo "🔥 Starting FastAPI Server..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# 2. Setup Frontend
cd ..
echo "⚛️  Starting React Frontend..."
npm install --legacy-peer-deps
npm run dev &
FRONTEND_PID=$!

echo "✅ System is running!"
echo "   - Backend: http://localhost:8000"
echo "   - Frontend: http://localhost:8080"
echo "   Press Ctrl+C to stop."

# Wait for user to exit
wait $BACKEND_PID $FRONTEND_PID
